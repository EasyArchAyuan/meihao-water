/**
 * 文章只读接口（CloudBase HTTP 云函数）。
 *
 * GET /articles-api          返回全部已发布文章
 * GET /articles-api?slug=xxx 返回单篇（数组形式）
 *
 * 只暴露 status = 'published' 的文章，草稿不会外泄。
 * 返回结构：{ data: [...], count } （兼容直接数组）
 */
const cloudbase = require("@cloudbase/node-sdk");

// 云函数内 SDK 自动读取环境信息（TCB_ENV / SCF_NAMESPACE），不要显式传 env，
// 否则会被 rdb() 误当成 schema。
const app = cloudbase.init();

const FIELDS = "slug,title,excerpt,date,tags,pillar,cover,content";

exports.main = async (event) => {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    // 构建机与浏览器都可能读，放行跨域
    "access-control-allow-origin": "*",
    "cache-control": "public, max-age=60",
  };

  try {
    const query =
      (event && (event.queryStringParameters || event.queryString || event.query)) || {};
    const slug = typeof query.slug === "string" ? query.slug : "";

    let builder = app
      .rdb({ schema: "public" })
      .from("articles")
      .select(FIELDS)
      .eq("status", "published")
      .order("date", { ascending: false });

    if (slug) builder = builder.eq("slug", slug);

    const { data, error } = await builder;
    if (error) throw error;

    const list = (data || []).map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || "",
      date: String(a.date || "").slice(0, 10),
      tags: Array.isArray(a.tags) ? a.tags : [],
      pillar: a.pillar || undefined,
      cover: a.cover || null,
      content: a.content || "",
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: list, count: list.length }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: [],
        count: 0,
        error: String((err && err.message) || err),
      }),
    };
  }
};
