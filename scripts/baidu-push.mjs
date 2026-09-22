#!/usr/bin/env node
/**
 * 百度「主动推送」（普通收录 API）——让百度在分钟级抓取新页面。
 *
 * 用法：
 *   BAIDU_PUSH_TOKEN=你的token node scripts/baidu-push.mjs            # 自动从线上 sitemap 取 URL
 *   BAIDU_PUSH_TOKEN=你的token node scripts/baidu-push.mjs urls.txt   # 从文件取（每行一个 URL）
 *   BAIDU_PUSH_TOKEN=你的token node scripts/baidu-push.mjs --dry-run  # 只打印将推送的 URL，不发请求
 *
 * 可选环境变量：
 *   BAIDU_SITE      默认 meihaoshuiye.com（不带协议与斜杠，必须与站长平台站点一致）
 *   SITEMAP_URL     默认 https://<BAIDU_SITE>/sitemap.xml
 *
 * 说明：
 * - token 在百度站长平台 → 普通收录 → 主动推送 里获取。
 * - 普通站点日配额通常 10~100 条，新站更低；超配额会返回 error，请勿反复重试。
 * - 百度对该接口有调用频率限制，脚本一次提交全部 URL（换行分隔），不做拆分。
 */

import { readFileSync } from "node:fs";

const SITE = process.env.BAIDU_SITE || "meihaoshuiye.com";
const TOKEN = process.env.BAIDU_PUSH_TOKEN;
const SITEMAP_URL = process.env.SITEMAP_URL || `https://${SITE}/sitemap.xml`;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const fileArg = args.find((a) => !a.startsWith("--"));

async function collectUrls() {
  if (fileArg) {
    const raw = readFileSync(fileArg, "utf8");
    return raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && /^https?:\/\//i.test(l));
  }
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`拉取 sitemap 失败：HTTP ${res.status} ${SITEMAP_URL}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

function report(json) {
  // 成功：{ remain, success, ... }；失败：{ error, message }
  if (json.error) {
    console.error(`✗ 推送失败  error=${json.error}  message=${json.message ?? ""}`);
    if (json.error === 401) console.error("  → token 无效或与站点不匹配，请到站长平台重新获取。");
    if (json.error === 403) console.error("  → 站点未验证 / 无推送权限。");
    if (json.error === 400) console.error("  → 部分 URL 不属于该站点（not_same_site）。");
    if (json.error === 429) console.error("  → 超出当日配额，明天再试，勿重试。");
    process.exitCode = 1;
    return;
  }
  console.log(`✓ 推送成功  success=${json.success ?? "?"}  remain=${json.remain ?? "?"}`);
  if (json.not_same_site?.length) console.log(`  not_same_site: ${json.not_same_site.length} 条`);
  if (json.not_valid?.length) console.log(`  not_valid: ${json.not_valid.length} 条`);
}

(async () => {
  const urls = await collectUrls();
  if (!urls.length) {
    console.error("没有可推送的 URL。");
    process.exit(1);
  }
  console.log(`站点：${SITE}`);
  console.log(`待推送：${urls.length} 条`);
  urls.forEach((u) => console.log("  " + u));

  if (dryRun) {
    console.log("\n--dry-run：未发送请求。");
    return;
  }
  if (!TOKEN) {
    console.error("\n缺少 BAIDU_PUSH_TOKEN。示例：BAIDU_PUSH_TOKEN=xxxx node scripts/baidu-push.mjs");
    process.exit(1);
  }

  const endpoint = `http://data.zz.baidu.com/urls?site=${encodeURIComponent(SITE)}&token=${encodeURIComponent(TOKEN)}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: urls.join("\n"),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error(`✗ 返回非 JSON（HTTP ${res.status}）：${text.slice(0, 300)}`);
    process.exit(1);
  }
  report(json);
})().catch((e) => {
  console.error(`✗ ${e.message}`);
  process.exit(1);
});
