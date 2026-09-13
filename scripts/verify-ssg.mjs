#!/usr/bin/env node
/**
 * SSG 产物结构化数据审计（GEO 待办 P2-9）。
 *
 * 用法：node scripts/verify-ssg.mjs
 *
 * 检查项：
 * 1. out/**\/*.html 中所有 ld+json 能被 JSON.parse；
 * 2. 每页必须含 Organization，且 legalName 正确、name 为品牌名；
 * 3. /faq 含 FAQPage；/shuineighbor 含 Product；
 * 4. JSON-LD 中不得出现未替换的 TODO 占位值；
 * 5. 全站 HTML 不得出现旧主体名 / 旧电话（GEO 名称与电话漂移）。
 *
 * 任一失败 → exit 1。
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const BRAND = "美好水业";
const LEGAL = "廊坊市美好商贸有限公司";
/** 需要被替换掉的旧信号（只扫可见文本） */
const STALE = ["廊坊美好水业有限公司", "2235556"];

const results = [];
let failed = 0;

function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  if (!ok) failed += 1;
}

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".html")) out.push(p);
  }
  return out;
}

/** 提取页面内所有 ld+json 块 */
function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let txt = m[1].trim();
    // Next.js 会对部分字符做 HTML 转义
    txt = txt.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
    try {
      blocks.push(JSON.parse(txt));
    } catch {
      blocks.push({ __parseError: true, raw: txt.slice(0, 120) });
    }
  }
  return blocks;
}

function typesOf(block) {
  const t = block["@type"];
  return Array.isArray(t) ? t : [t];
}

function findTodo(node, path = "$") {
  if (typeof node === "string") return node.includes("TODO:") ? path : null;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) {
      const r = findTodo(node[i], `${path}[${i}]`);
      if (r) return r;
    }
    return null;
  }
  if (node && typeof node === "object") {
    for (const k of Object.keys(node)) {
      const r = findTodo(node[k], `${path}.${k}`);
      if (r) return r;
    }
  }
  return null;
}

const pages = walk(OUT);
check(`SSG 产物存在（out/*.html，共 ${pages.length} 个）`, pages.length > 0);
if (pages.length === 0) {
  console.table(results);
  process.exit(1);
}

const byRoute = new Map();
for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const blocks = extractJsonLd(html);
  const raw = file.replace(/\\/g, "/").replace(/^out/, "").replace(/\.html$/, "");
  // out/faq/index.html -> /faq ；out/index.html -> /
  const route = raw.replace(/\/index$/, "") || "/";
  // 可见文本（去掉 script / style）：用于「旧主体名 / 旧电话」扫描，
  // JSON-LD 里的 alternateName 是刻意保留的旧名（帮助与旧站归并），不算缺陷。
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ");
  byRoute.set(route, { file, html, blocks, visibleText });
}

// 1 + 2：JSON 可解析 & 每页 Organization 正确
let parseErrors = 0;
let orgMissing = 0;
let orgWrongName = 0;
for (const [route, { blocks }] of byRoute) {
  for (const b of blocks) {
    if (b.__parseError) {
      parseErrors += 1;
      check(`${route} · ld+json 可解析`, false, String(b.raw));
      continue;
    }
    const todo = findTodo(b);
    if (todo) check(`${route} · JSON-LD 无 TODO 占位`, false, todo);
  }
  const org = blocks.find((b) => !b.__parseError && typesOf(b).includes("Organization"));
  if (!org) {
    orgMissing += 1;
    check(`${route} · 含 Organization`, false);
    continue;
  }
  if (org.legalName !== LEGAL || org.name !== BRAND) {
    orgWrongName += 1;
    check(`${route} · Organization 名称正确`, false, `name=${org.name} legalName=${org.legalName}`);
  }
}
check(`所有 ld+json 均可解析（${pages.length} 页）`, parseErrors === 0);
check(`每页含 Organization（缺 ${orgMissing} 页）`, orgMissing === 0);
check(`Organization 名称正确（错 ${orgWrongName} 页）`, orgWrongName === 0);
check("JSON-LD 无 TODO 占位值", !results.some((r) => r.name.includes("TODO 占位") && !r.ok));

// 3：页面级 Schema
const faq = byRoute.get("/faq");
check(
  "/faq 含 FAQPage",
  !!faq && faq.blocks.some((b) => !b.__parseError && typesOf(b).includes("FAQPage")),
);
const sn = byRoute.get("/shuineighbor");
check(
  "/shuineighbor 含 Product",
  !!sn && sn.blocks.some((b) => !b.__parseError && typesOf(b).includes("Product")),
);

// 3b：资讯文章页 —— 已生成 + 每篇含 BlogPosting
const newsRoutes = [...byRoute.keys()].filter((r) => r.startsWith("/news/") && r !== "/news");
check(`资讯文章页已生成（${newsRoutes.length} 篇）`, newsRoutes.length > 0);
let blogMissing = 0;
for (const r of newsRoutes) {
  const has = byRoute
    .get(r)
    .blocks.some((b) => !b.__parseError && typesOf(b).includes("BlogPosting"));
  if (!has) blogMissing += 1;
}
check(`每篇文章含 BlogPosting（缺 ${blogMissing} 篇）`, blogMissing === 0);

// 3c：区县落地页矩阵 —— 数据源里的每个 slug 都要生成出来
const districtSrc = existsSync("src/data/districts.ts")
  ? readFileSync("src/data/districts.ts", "utf8")
  : "";
const districtSlugs = [...districtSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const districtMissing = districtSlugs.filter((s) => !byRoute.has(`/langfang/${s}`));
check(
  `区县落地页已生成（${districtSlugs.length - districtMissing.length}/${districtSlugs.length}）`,
  districtSlugs.length > 0 && districtMissing.length === 0,
  districtMissing.join(", "),
);

// 3d：面包屑
const crumbRoutes = [...newsRoutes, ...districtSlugs.map((s) => `/langfang/${s}`)];
let crumbMissing = 0;
for (const r of crumbRoutes) {
  const has = byRoute
    .get(r)
    ?.blocks.some((b) => !b.__parseError && typesOf(b).includes("BreadcrumbList"));
  if (!has) crumbMissing += 1;
}
check(`文章与区县页含 BreadcrumbList（缺 ${crumbMissing}）`, crumbMissing === 0);

// 3e：关联主体归属（分公司等）—— 正文与结构化数据都要声明，
//     口径从 src/data/company.ts 的 relatedOrganizations 派生，不硬编码主体名。
const companySrc = existsSync("src/data/company.ts")
  ? readFileSync("src/data/company.ts", "utf8")
  : "";
const related = [...companySrc.matchAll(/name:\s*"([^"]+)",\s*relation:\s*"([^"]+)"/g)].map(
  (m) => ({ name: m[1], relation: m[2] }),
);
if (related.length > 0) {
  const about = byRoute.get("/about");
  const textMissing = related.filter((r) => !(about?.visibleText ?? "").includes(r.name));
  check(
    `/about 声明关联主体（缺 ${textMissing.length}/${related.length}）`,
    textMissing.length === 0,
    textMissing.map((r) => r.name).join(", "),
  );

  const subMissing = related.filter(
    (r) =>
      ![...byRoute.values()].some((v) =>
        v.blocks.some(
          (b) =>
            !b.__parseError &&
            Array.isArray(b.subOrganization) &&
            b.subOrganization.some((s) => s && typeof s === "object" && s.name === r.name),
        ),
      ),
  );
  check(
    `Organization.subOrganization 声明关联主体（${related.length - subMissing.length}/${related.length}）`,
    subMissing.length === 0,
    subMissing.map((r) => r.name).join(", "),
  );
}

// 4：新增路由已生成
for (const route of ["/faq", "/langfang", "/news"]) {
  check(`路由 ${route} 已静态生成`, byRoute.has(route));
}

// 5：旧信号（只看可见文本，JSON-LD 内刻意保留的旧名不计入）
const staleHits = [];
for (const [route, { visibleText }] of byRoute) {
  for (const s of STALE) if (visibleText.includes(s)) staleHits.push(`${route}: ${s}`);
}
check(`无旧主体名 / 旧电话（命中 ${staleHits.length}）`, staleHits.length === 0, staleHits.join("; "));

// 6：法律主体名出现在产物中（GEO 验收口径）
const legalHit = [...byRoute.values()].filter((v) => v.html.includes(LEGAL)).length;
check(`legalName 出现在 SSG 产物（${legalHit} 页）`, legalHit > 0);

// 报告同时落盘为 UTF-8 文件（Windows 控制台编码不稳，避免中文表头乱码）
const lines = results.map(
  (r) => `${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  ->  ${r.detail}` : ""}`,
);
writeFileSync(
  "ssg-audit.txt",
  `${lines.join("\n")}\n\n${
    failed === 0
      ? `[OK] 全部通过（${results.length} 项）`
      : `[NG] ${failed}/${results.length} 项未通过`
  }\n`,
  "utf8",
);
// 控制台只输出 ASCII，保证任何终端都能看懂结论
console.log(lines.map((l) => l.replace(/[^\x00-\x7F]/g, "?")).join("\n"));
console.log(
  failed === 0
    ? `\n[OK] all ${results.length} checks passed -> ssg-audit.txt`
    : `\n[NG] ${failed}/${results.length} checks failed -> ssg-audit.txt`,
);
process.exit(failed === 0 ? 0 : 1);
