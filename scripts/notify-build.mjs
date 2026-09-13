#!/usr/bin/env node
/**
 * 通知 GitHub 立即重建并发布站点（即时 webhook 的「触发端」）。
 *
 * 作用：调用 GitHub repository_dispatch，触发 content-publish.yml：
 *   拉接口 → 写快照 → build + verify → 推 dist → 服务器 cron 拉取上线
 *
 * 用法：
 *   GITHUB_TOKEN=xxx node scripts/notify-build.mjs
 *   （可选）node scripts/notify-build.mjs "发布新文章：xxx"
 *
 * 需要 GITHUB_TOKEN 具备 repo 权限（经典 token 勾 repo，或 fine-grained 勾 Contents: RW + Actions: RW）。
 */

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY ?? "EasyArchAyuan/meihao-water";
const clientPayloadReason = process.argv[2] ?? "content updated";

if (!token) {
  console.error("[notify] 缺少环境变量 GITHUB_TOKEN");
  process.exit(1);
}

const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
  method: "POST",
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "meihao-water-content-sync",
  },
  body: JSON.stringify({ event_type: "content-publish", client_payload: { reason: clientPayloadReason } }),
});

if (!res.ok) {
  console.error(`[notify] 触发失败：${res.status} ${await res.text()}`);
  process.exit(1);
}

console.log(`[notify] 已触发重建：${repo}（${clientPayloadReason}）`);
console.log("[notify] 预计 3–5 分钟后 CI 完成，服务器 cron 5–10 分钟内拉取上线");
