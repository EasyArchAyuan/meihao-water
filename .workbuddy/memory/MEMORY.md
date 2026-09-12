# 美好水业官网 2.0 · 项目长期记忆

## 仓库与分支
- 远程：https://github.com/EasyArchAyuan/meihao-water （public）
- **默认 / 部署分支：`main`**。2026-09-12 起，本地分支已由历史误名 `maain` 改名对齐为 `main`；服务器 clone 的一直是 `main`。
- 推送：`git push origin main`。
- 远程可能残留旧分支 `maain`（内容等价于某历史 main），确认无引用后可删除。

## 部署（腾讯云 Lighthouse）
- 实例 `lhins-jrsby4oa`（ap-beijing，公网 `49.233.87.42`，Ubuntu 24.04）；Caddy 服务静态导出产物 `/var/www/mhsy/out`。
- 更新流程：`cd /var/www/mhsy && git pull origin main && npm run build`。
- 主机名（同一 SAN 证书）：`廊坊美好水业.online`（Punycode `xn--vhqu7tjwbb1iwpthm1a.online`）、`www.` 同上、`meihaowater.site`、`www.meihaowater.site`。
- Caddyfile 落盘：`printf '<b64>' | base64 -d | dd of=/etc/caddy/Caddyfile` → `caddy validate` → `systemctl reload caddy`（base64 单段 ≤1.7KB，命令 ≤2048 字符）。
- **服务器 github.com:443 常不可达**（`git pull` 失败），但 `raw.githubusercontent.com` 可达；临时部署绕行见 daily log（拉取受影响源文件 → `npm run build` → `git checkout` 还原保持工作树干净）。

## 内容约定
- 对外品牌名「美好水业」；法律实体「廊坊市美好商贸有限公司」（footer / JSON-LD），2026-09-11 由「廊坊美好水业有限公司」变更。
- 联系方式主号：手机 `13393067179`（2026-09-12 起为全站主号）；另有 `2805599` / `2232111`。
- 微信公众号：「廊坊桶装水」（2026-09-12 更名，原「水邻居饮用水」）。
- **单一数据源 `src/data/company.ts`**（`company.phones` / `wechatPublicName` / `primaryPhone`），改一处全站生效 —— 改联系方式优先改这里。

## Caddy 缓存策略（v1.0.10 起）
- HTML / RSC 等：`Cache-Control: no-cache`（带 ETag 重验证，内容更新即时生效）
- `/_next/static/*`（文件名含 hash）：`public, max-age=31536000, immutable`
- `/sitemap.xml`、`/robots.txt`：1h；`/brand/*`：30d
- **Caddy 陷阱**：无 matcher 的 `header { … }` 块会**覆盖**带 matcher 的 `header @x …` 同名 header。所以 `Cache-Control` 必须全部用带 matcher 的形式表达（默认值用 `@plain not path /_next/static/* /sitemap.xml /robots.txt /brand/*`）。

## 已修复
- ~~HTML 被标一年 `immutable`~~ → v1.0.10 已修（改 `no-cache`）。
- ~~JSON-LD `LocalBusiness.telephone` 带 `tel:` 前缀~~ → v1.0.10 已修（现为 `+8613393067179`）。
