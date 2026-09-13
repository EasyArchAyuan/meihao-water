/**
 * 文章数据源。三个来源**合并去重**（同 slug 时优先级高的覆盖低的）：
 *
 *   1. HTTP 接口（CloudBase 云函数，环境变量 `ARTICLES_API_URL`）—— 最高
 *   2. 本地快照 `content/snapshot.json`（`npm run sync:content` 生成）
 *   3. `content/news/*.md`（定时任务 / 人工新增文章走这里）—— 最低
 *
 * ⚠️ 必须「合并」而不是「短路降级」：定时任务是把新文章写成 .md 后提交，
 * 若用 `??` 短路，只要 snapshot.json 存在就永远读不到 .md，新文章会静默不上线。
 * 同 slug 冲突时以 DB/接口 为准（后台终审版本优先于仓库里的 md 草稿）。
 *
 * 为什么是「构建期取数」而不是浏览器端 fetch：
 * 站点是 `output: "export"` 静态导出，正文必须在静态 HTML 里；
 * 若改成前端 fetch 渲染，豆包 / 搜索引擎抓不到正文，GEO 直接失效。
 *
 * 未确认字段一律留空渲染，不编造。
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { mdToHtml } from "@/lib/markdown";

const NEWS_DIR = join(process.cwd(), "content", "news");
const SNAPSHOT = join(process.cwd(), "content", "snapshot.json");
/** 构建期取数超时（毫秒）：超时即降级，绝不让 CI 卡死 */
const FETCH_TIMEOUT = 8000;

export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 日期，形如 2026-09-14 */
  date: string;
  tags: string[];
  pillar?: string;
  cover: string | null;
};

export type Article = ArticleMeta & {
  /** 已渲染的正文 HTML */
  html: string;
  /** 正文字数 */
  wordCount: number;
};

/** 接口 / 快照 / Markdown 的统一中间结构 */
export type RawArticle = ArticleMeta & { content: string };

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function toArticle(raw: RawArticle): Article {
  return {
    ...raw,
    cover: raw.cover ?? null,
    html: mdToHtml(raw.content ?? ""),
    wordCount: (raw.content ?? "").replace(/\s/g, "").length,
  };
}

/** 1. 从 HTTP 接口取数 */
async function fetchFromApi(): Promise<RawArticle[] | null> {
  const url = process.env.ARTICLES_API_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as unknown;
    const list = Array.isArray(json)
      ? json
      : typeof json === "object" && json !== null && Array.isArray((json as { data?: unknown[] }).data)
        ? (json as { data: unknown[] }).data
        : null;
    if (!list) throw new Error("接口返回格式不是数组");
    const out = list
      .map((it): RawArticle | null => {
        const o = it as Record<string, unknown>;
        const slug = str(o.slug);
        if (!slug) return null;
        return {
          slug,
          title: str(o.title, slug),
          excerpt: str(o.excerpt),
          date: str(o.date, "1970-01-01").slice(0, 10),
          tags: strArr(o.tags),
          pillar: typeof o.pillar === "string" ? o.pillar : undefined,
          cover: typeof o.cover === "string" && o.cover ? o.cover : null,
          content: str(o.content),
        };
      })
      .filter((a): a is RawArticle => a !== null);
    console.log(`[content] 接口取数成功：${out.length} 篇`);
    return out;
  } catch (err) {
    console.warn(`[content] 接口取数失败，降级：${String(err)}`);
    return null;
  }
}

/** 2. 本地快照 */
function loadSnapshot(): RawArticle[] | null {
  if (!existsSync(SNAPSHOT)) return null;
  try {
    const raw = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as unknown;
    const list = Array.isArray(raw)
      ? raw
      : typeof raw === "object" && raw !== null && Array.isArray((raw as { articles?: unknown[] }).articles)
        ? (raw as { articles: unknown[] }).articles
        : [];
    const out = list.map((it) => it as RawArticle).filter((a) => Boolean(a?.slug));
    if (out.length === 0) return null;
    console.warn(`[content] 使用本地快照：${out.length} 篇`);
    return out;
  } catch {
    return null;
  }
}

/** 3. Markdown 兜底（迁移期） */
function loadMarkdown(): RawArticle[] {
  if (!existsSync(NEWS_DIR)) return [];
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const out = readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f): RawArticle => {
      const raw = readFileSync(join(NEWS_DIR, f), "utf8");
      const m = fm.exec(raw);
      const data: Record<string, string> = {};
      if (m) {
        for (const line of m[1].split(/\r?\n/)) {
          const i = line.indexOf(":");
          if (i > -1) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
        }
      }
      return {
        slug: data.slug || f.replace(/\.md$/, ""),
        title: data.title || data.slug || f.replace(/\.md$/, ""),
        excerpt: data.excerpt ?? "",
        date: data.date ?? "1970-01-01",
        tags: data.tags
          ? data.tags.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        pillar: data.pillar,
        cover: data.cover && data.cover !== "null" ? data.cover : null,
        content: m ? raw.slice(m[0].length) : raw,
      };
    });
  if (out.length > 0) console.warn(`[content] 使用 Markdown 兜底：${out.length} 篇`);
  return out;
}

let cache: Promise<Article[]> | null = null;

/**
 * 合并多来源，同 slug 时**后面的覆盖前面的**。
 * 调用顺序决定优先级：Markdown（低） → 快照（中） → 接口（高）。
 */
function mergeSources(...lists: RawArticle[][]): RawArticle[] {
  const bySlug = new Map<string, RawArticle>();
  for (const list of lists) {
    for (const a of list) {
      if (!a?.slug) continue;
      bySlug.set(a.slug, a);
    }
  }
  return [...bySlug.values()];
}

/** 全部文章（按日期倒序）。构建期调用，同一进程内缓存。 */
export function loadArticles(): Promise<Article[]> {
  cache ??= (async () => {
    const fromApi = (await fetchFromApi()) ?? [];
    const raw = mergeSources(loadMarkdown(), loadSnapshot() ?? [], fromApi);
    return raw
      .map(toArticle)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  })();
  return cache;
}

export async function listArticles(): Promise<Article[]> {
  return loadArticles();
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const all = await loadArticles();
  return all.find((a) => a.slug === slug);
}

/** 相关文章：同 tag 优先，不足则按日期补齐 */
export async function relatedArticles(slug: string, limit = 3): Promise<Article[]> {
  const all = await loadArticles();
  const current = all.find((a) => a.slug === slug);
  if (!current) return all.slice(0, limit);
  return all
    .filter((a) => a.slug !== slug)
    .map((a) => ({ a, score: a.tags.filter((t) => current.tags.includes(t)).length }))
    .sort((x, y) => y.score - x.score || (x.a.date < y.a.date ? 1 : -1))
    .slice(0, limit)
    .map((s) => s.a);
}
