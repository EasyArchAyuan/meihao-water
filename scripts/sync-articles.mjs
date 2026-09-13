#!/usr/bin/env node
/**
 * 从文章接口拉取数据，写入本地快照 `content/snapshot.json`。
 *
 * 用途：
 * 1. CI 里在 build 之前跑一次，构建只读本地文件（构建不依赖外网，稳）；
 * 2. 接口挂掉时，用上一次的快照兜底，站点照常构建。
 *
 * 用法：
 *   ARTICLES_API_URL=https://xxx node scripts/sync-articles.mjs
 *
 * 接口返回形如：
 *   [{ slug, title, excerpt, date, tags, pillar, cover, content }]
 * 或 { data: [...] }
 */

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SNAPSHOT = join(process.cwd(), "content", "snapshot.json");
const url = process.env.ARTICLES_API_URL;

if (!url) {
  console.error("[sync] 缺少环境变量 ARTICLES_API_URL");
  process.exit(1);
}

const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
if (!res.ok) {
  console.error(`[sync] 接口返回 ${res.status}`);
  process.exit(1);
}

const json = await res.json();
const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : null;
if (!list) {
  console.error("[sync] 接口返回格式不是数组");
  process.exit(1);
}

const articles = list
  .filter((a) => a && typeof a.slug === "string" && a.slug)
  .map((a) => ({
    slug: String(a.slug),
    title: String(a.title ?? a.slug),
    excerpt: String(a.excerpt ?? ""),
    date: String(a.date ?? "1970-01-01").slice(0, 10),
    tags: Array.isArray(a.tags) ? a.tags.map(String) : [],
    pillar: typeof a.pillar === "string" ? a.pillar : undefined,
    cover: typeof a.cover === "string" && a.cover ? a.cover : null,
    content: String(a.content ?? ""),
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

if (articles.length === 0) {
  console.error("[sync] 接口返回 0 篇文章，拒绝覆盖已有快照（防止误清空线上文章）");
  process.exit(1);
}

// 与上一版对比，篇数变少时给出提示（仍写入，但让人看得见）
if (existsSync(SNAPSHOT)) {
  const prev = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  const prevCount = Array.isArray(prev?.articles) ? prev.articles.length : 0;
  if (prevCount > articles.length) {
    console.warn(`[sync] 警告：文章数由 ${prevCount} 降为 ${articles.length}`);
  }
}

writeFileSync(
  SNAPSHOT,
  `${JSON.stringify({ syncedAt: new Date().toISOString(), articles }, null, 2)}\n`,
  "utf8",
);
console.log(`[sync] 已写入快照：${articles.length} 篇 -> content/snapshot.json`);
