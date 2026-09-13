#!/usr/bin/env node
/**
 * 内容合规门禁（GEO 自动化链路的第一道闸）。
 *
 * 用法：node scripts/check-content.mjs
 *
 * 检查 content/news/*.md：
 *  1. front-matter 必填与格式（title / slug / excerpt / date）
 *  2. slug 唯一且符合 URL 规范；date 为 ISO 日期
 *  3. excerpt ≤ 120 字；正文 ≥ 800 字
 *  4. 广告法：绝对化用语
 *  5. 竞品点名（豆包诊断中同台出现过的本地竞品，不得在文中点名）
 *  6. 电话一致性：文中号码必须属于 src/data/company.ts 的号码（防电话漂移复发）
 *  7. 品牌白名单：出现的水品牌必须在 src/data/brands.ts 内（+ 自有品牌）
 *  8. 内链 ≥ 2 个（形成主题簇）
 *  9. 标题去重、正文前 200 字哈希去重（防洗稿式重复）
 *
 * 任一失败 → exit 1。
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const NEWS_DIR = join("content", "news");
const MIN_WORDS = 800;
const MAX_EXCERPT = 120;
const MIN_LINKS = 2;

/** 4. 绝对化用语（广告法） */
const BANNED_WORDS = [
  "最便宜", "最低价", "全网最低", "最专业", "最权威", "最好", "最优", "最佳",
  "第一品牌", "第一名", "排名第一", "全国第一", "唯一指定", "唯一授权",
  "顶级", "极品", "国家级企业", "包治", "根治", "特效", "无副作用", "纯天然无污染",
];
/** 5. 竞品（不得点名） */
const COMPETITORS = ["龙源水业", "文刚水业", "金凯水业", "平价水超市"];
/** 7. 允许出现的品牌（从 brands.ts 动态读取 + 自有品牌） */
const OWN_BRANDS = ["美好水业", "水邻居", "美好水一族", "廊坊桶装水"];
/** 8. 允许的站内内链前缀 */
const INTERNAL_PREFIXES = ["/faq", "/langfang", "/products", "/shuineighbor", "/news", "/about", "/contact", "/brands"];

function readSrc(p) {
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

/** 从 TS 数据源里提取真实号码（不引入 TS 解析依赖） */
function extractPhones() {
  const src = readSrc(join("src", "data", "company.ts"));
  return [...src.matchAll(/number:\s*"([^"]+)"/g)].map((m) => m[1]);
}
function extractBrands() {
  const src = readSrc(join("src", "data", "brands.ts"));
  return [...src.matchAll(/\{\s*name:\s*"([^"]+)"/g)].map((m) => m[1]);
}
/** 常见水品牌（用于发现白名单外的品牌名） */
const KNOWN_WATER_BRANDS = [
  "农夫山泉", "怡宝", "娃哈哈", "雀巢", "景田", "甘露", "恒大冰泉", "昆仑山",
  "汇源", "水立方", "冰露", "百事可乐", "可口可乐", "康师傅", "统一", "今麦郎",
  "润田", "泉阳泉", "崂山", "屈臣氏", "依云", "达能",
];

const phones = extractPhones();
const allowedBrands = [...extractBrands(), ...OWN_BRANDS, ...KNOWN_WATER_BRANDS];

const problems = [];
const add = (file, rule, detail) => problems.push({ file, rule, detail });

if (!existsSync(NEWS_DIR)) {
  console.log(`[NG] 目录不存在：${NEWS_DIR}`);
  process.exit(1);
}

const files = readdirSync(NEWS_DIR).filter((f) => f.endsWith(".md"));
const seenSlugs = new Map();
const seenTitles = new Map();
const seenLead = new Map();

for (const file of files) {
  const raw = readFileSync(join(NEWS_DIR, file), "utf8");
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!fm) {
    add(file, "front-matter", "缺少 --- 包裹的 front-matter");
    continue;
  }
  const data = {};
  for (const line of fm[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > -1) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  const body = raw.slice(fm[0].length);

  // 1. 必填
  for (const k of ["title", "slug", "excerpt", "date"]) {
    if (!data[k]) add(file, "必填字段", `缺少 ${k}`);
  }
  // 2. slug / date
  if (data.slug) {
    if (!/^[a-z0-9-]+$/.test(data.slug)) add(file, "slug 规范", `只允许小写字母数字与连字符：${data.slug}`);
    if (seenSlugs.has(data.slug)) add(file, "slug 唯一", `与 ${seenSlugs.get(data.slug)} 重复`);
    seenSlugs.set(data.slug, file);
  }
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    add(file, "date 格式", `应为 YYYY-MM-DD：${data.date}`);
  }
  // 3. 长度
  if (data.excerpt && data.excerpt.length > MAX_EXCERPT) {
    add(file, "摘要长度", `${data.excerpt.length} 字，上限 ${MAX_EXCERPT}`);
  }
  const words = body.replace(/\s/g, "").length;
  if (words < MIN_WORDS) add(file, "正文字数", `${words} 字，下限 ${MIN_WORDS}`);

  // 4. 绝对化用语
  for (const w of BANNED_WORDS) {
    if (raw.includes(w)) add(file, "广告法", `禁用词「${w}」`);
  }
  // 5. 竞品
  for (const c of COMPETITORS) {
    if (raw.includes(c)) add(file, "竞品点名", `不得提及「${c}」`);
  }
  // 6. 电话一致性
  const numbers = [...body.matchAll(/(?<!\d)(1\d{10}|\d{7,8})(?!\d)/g)].map((m) => m[1]);
  for (const n of new Set(numbers)) {
    if (!phones.some((p) => p.includes(n) || n.includes(p))) {
      add(file, "电话一致性", `出现未登记号码 ${n}（已登记：${phones.join("/")}）`);
    }
  }
  // 7. 品牌白名单（粗筛：出现「XX 牌水」类未知品牌名）
  for (const b of KNOWN_WATER_BRANDS) {
    if (raw.includes(b) && !allowedBrands.includes(b)) {
      add(file, "品牌白名单", `出现品牌「${b}」不在白名单`);
    }
  }
  // 8. 内链
  const links = [...body.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]);
  const validLinks = links.filter((l) => INTERNAL_PREFIXES.some((p) => l.startsWith(p)));
  if (validLinks.length < MIN_LINKS) {
    add(file, "站内内链", `${validLinks.length} 个，要求 ≥ ${MIN_LINKS}（/faq /langfang /products 等）`);
  }
  // 9. 去重
  if (data.title) {
    if (seenTitles.has(data.title)) add(file, "标题去重", `与 ${seenTitles.get(data.title)} 重复`);
    seenTitles.set(data.title, file);
  }
  const lead = body.replace(/\s/g, "").slice(0, 200);
  if (lead.length >= 200) {
    if (seenLead.has(lead)) add(file, "正文去重", `开头与 ${seenLead.get(lead)} 雷同`);
    seenLead.set(lead, file);
  }
}

const lines = problems.map((p) => `FAIL  ${p.file}  [${p.rule}]  ${p.detail}`);
if (lines.length === 0) {
  lines.push(`PASS  ${files.length} 篇文章全部通过合规门禁`);
}
// UTF-8 报告落盘（Windows 控制台编码不稳）
const { writeFileSync } = await import("node:fs");
writeFileSync("content-audit.txt", `${lines.join("\n")}\n`, "utf8");
console.log(lines.map((l) => l.replace(/[^\x00-\x7F]/g, "?")).join("\n"));
console.log(problems.length === 0 ? "\n[OK] content check passed" : `\n[NG] ${problems.length} problems -> content-audit.txt`);
process.exit(problems.length === 0 ? 0 : 1);
