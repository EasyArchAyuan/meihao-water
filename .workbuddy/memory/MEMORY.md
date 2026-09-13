# 美好水业官网 2.0 · 项目长期记忆

## 仓库与分支
- 远程：https://github.com/EasyArchAyuan/meihao-water （public）
- **默认 / 部署分支：`main`**。2026-09-12 起，本地分支已由历史误名 `maain` 改名对齐为 `main`；服务器 clone 的一直是 `main`。
- 推送：`git push origin main`。
- 远程旧分支 `maain` 已于 2026-09-12 删除；远程只剩 `main` 与 `dist`（构建产物分支，force push 保持单 commit）。

## 部署（腾讯云 Lighthouse）
- 实例 `lhins-jrsby4oa`（ap-beijing，公网 `49.233.87.42`，Ubuntu 24.04）；Caddy 服务静态导出产物 `/var/www/mhsy/out`。
- **更新流程（v1.0.12 起）：`git push origin main` → GitHub Actions 自动 lint/build → semantic-release 定版本+tag+Release → 产物推 `dist` 分支 → 服务器 cron（每 10 分钟）从 `raw.githubusercontent.com` 拉取并原子切换。**
  服务器**不再需要 git / Node**；旧的 `git pull + npm run build` 已废弃。
- **默认部署模式：服务器主动拉**（实测 GitHub Runner 到服务器 22 端口 TCP UNREACHABLE）。SSH 直推保留为开关：设 Variables `DEPLOY_MODE=ssh` 才启用。拉取脚本 `infra/mhsy-pull.sh` → `/usr/local/bin/mhsy-pull.sh`，cron `*/10 * * * * flock -n /tmp/mhsy-pull.lock ...`，日志 `/var/log/mhsy-pull.log`。
- 主机名（同一 SAN 证书）：`廊坊美好水业.online`（Punycode `xn--vhqu7tjwbb1iwpthm1a.online`）、`www.` 同上、`meihaowater.site`、`www.meihaowater.site`。
- Caddyfile 落盘（兜底）：`printf '<b64>' | base64 -d | dd of=/etc/caddy/Caddyfile` → `caddy validate` → `systemctl reload caddy`（**硬约束：整条命令 ≤2048 字符**；base64 建议 ≤1900，实测 1840 可用）。生成命令用技能 `water-site-factory` 的 `scripts/caddy_b64.py`。**不要手工转录 base64**（曾因多一个空格导致脚本错乱）。
- **服务器 github.com:443 常不可达**（`git pull` 失败），但 `raw.githubusercontent.com` 可达 —— 这正是改用 CI 推送产物的原因。

## CI/CD 与自动发版（v1.0.12 起）
- Workflows：`.github/workflows/ci-cd.yml`（build/release/deploy/caddy）、`rollback.yml`（手动回滚）、`backfill.yml`（补历史 tag/Release）。
- 共享 composite actions：`.github/actions/ssh-setup`（写私钥+known_hosts）、`.github/actions/deploy-site`（rsync + `sudo mv` 原子切换，旧版留 `out.prev`）。
- **semantic-release**（`.releaserc.json`）：`feat`→minor、`fix`/`perf`/`refactor`/`infra`→patch、`docs`/`chore`/`ci`/`test`/`style`→**不发版**。
  ⚠️ **不要再手改 `package.json` 的 version**；**commit message 不要写 `(vX.Y.Z)` 后缀**；`CHANGELOG.md` 由 `@semantic-release/changelog` 维护（历史手写条目保留）。
- Secrets：`SSH_PRIVATE_KEY`。（`SSH_KNOWN_HOSTS` 已废弃 —— ssh-setup 改用 `StrictHostKeyChecking=accept-new`）
- Variables：`SSH_HOST`(49.233.87.42)、`SSH_USER`(ubuntu)、`SSH_PORT`(22)、`DEPLOY_MODE`（不设=服务器拉取；`ssh`=Runner 直推）。
- 服务器权限（已确认）：ubuntu **免密 sudo**；`/var/www/mhsy/out` 属主 root，部署走 `~/deploy-incoming` + `sudo mv`，**无需 chown**。`authorized_keys` 内为 Lighthouse 密钥对 "Kirin"（`skey-i1ohtcu1`）。
- 回滚：Actions → Rollback → `target=previous`（秒级 `out`↔`out.prev`）/ `target=build` + run_id（重放 artifact）。
- 历史 tag 已于 2026-09-12 补齐（`v1.0.6`–`v1.0.11`）。**补 tag 必须在启用 release job 之前完成**，否则版本基线算错。
- 2026-09-12 首次自动发版成功：`v1.1.0`（tag + CHANGELOG 中文分区 + GitHub Release）。
- ⚠️ **release 曾失败的真因是版本不兼容，不是 token 权限**：`conventional-changelog-conventionalcommits@10` 需 `conventional-changelog-writer@9+`，而 `@semantic-release/release-notes-generator` 带的是 writer@8 → 已降到 `^8`。`/repos/...` 返回的 `push:false` 对 App token 是**误导字段**，不能据此判断推送权。

## 内容约定
- 对外品牌名「美好水业」；法律实体「廊坊市美好商贸有限公司」（footer / JSON-LD），2026-09-11 由「廊坊美好水业有限公司」变更。
- 联系方式主号：手机 `13393067179`（2026-09-12 起为全站主号）；另有 `2805599` / `2232111`。
- 微信公众号：「廊坊桶装水」（2026-09-12 更名，原「水邻居饮用水」）。
- **单一数据源 `src/data/company.ts`**（`company.phones` / `wechatPublicName` / `primaryPhone`），改一处全站生效 —— 改联系方式优先改这里。

## 图片资产与占位约定
- **单一数据源 `src/data/media.ts`**：`{ id, src, alt, ratio, note, todo }`。`src:null` → `<Figure>` 渲染中性占位块并打上 `data-placeholder`；替换只改 `src` + `todo:false`，组件无需动。
- **首页图片资产（2026-09-12 就位，Miora 生成，共 2.4MB）**：
  - `public/hero/`：`city-water.jpg`（Hero 主图）、`years-01~03.jpg`（20 年三图）
  - `public/home/`：`whatwedo-01~04.jpg`、`home-life.jpg`、`office-space.jpg`、`disposable-hero.jpg`、`shuineighbor.jpg`
- 仍为占位（`src:null`）：`map-placeholder`（/contact 地图）、`wechat-qr`（二维码，用户自行替换）、`city-line-art`（首页实际用 inline SVG，未被引用）。
- ⚠️ **`YearsSection` / `WhatWeDo` 原先各自硬编码了占位块，不读 `media.ts`** —— 2026-09-12 已改造为 `<Figure>`。以后新增图片务必先确认组件是否走 `Figure`。
- 视觉基调：Apple 式极简、soft natural light、深海蓝 `#0d47a1` + 暖米色；水邻居段用低饱和蓝绿 `#63c9c1`。

## Caddy 缓存策略（v1.0.10 起）
- HTML / RSC 等：`Cache-Control: no-cache`（带 ETag 重验证，内容更新即时生效）
- `/_next/static/*`（文件名含 hash）：`public, max-age=31536000, immutable`
- `/sitemap.xml`、`/robots.txt`：1h；`/brand/*`：30d
- **Caddy 陷阱**：无 matcher 的 `header { … }` 块会**覆盖**带 matcher 的 `header @x …` 同名 header。所以 `Cache-Control` 必须全部用带 matcher 的形式表达（默认值用 `@plain not path /_next/static/* /sitemap.xml /robots.txt /brand/*`）。

## 仓库卫生 / .gitignore 约定（2026-09-12 整理）
- 原则：**只提交源码 + 必要静态资源 + 文档 + 项目记忆**；构建产物、依赖、密钥、本地临时文件一律不进 git。
- 已忽略：`node_modules`、`.next/`、`out/`、`coverage`、`build`、`.turbo`、`site.tar.gz` / `site.sha256`（本地部署产物）、`.env*` / `*.pem` / `*.key` / `*.p12`、`*.log` / `*.tmp`、`next-env.d.ts`、`*.tsbuildinfo`、`.vercel`、OS/编辑器垃圾、`.workbuddy/*`（仅放行 `memory/` 与 `skills/`）、`.wbapp_*.genie`。
- ⚠️ **`.gitignore` 不支持行尾注释**（`#` 只在行首生效）——写 `next-env.d.ts  # 注释` 会让该规则整个失效。注释必须单独一行。
- 改完 `.gitignore` 应自检：`git ls-files -i -c --exclude-standard`（列出被忽略规则误伤的已跟踪文件，应为空）+ `git check-ignore <path>` 抽查关键路径。
- 体积参考：仓库内容很小（`src`≈0.1MB、`public`≈4.0MB）；本地大块是被忽略的 `node_modules`（≈717MB）与 `.next`（≈303MB），均可重建。用户已确认**暂不清理**这两者（保留以便随时构建）。
- `dist` 分支含约 2MB 构建产物，`git clone` 默认会拉它；只要源码时用 `git clone --single-branch --branch main <url>`。

## 已修复
- ~~HTML 被标一年 `immutable`~~ → v1.0.10 已修（改 `no-cache`）。
- ~~JSON-LD `LocalBusiness.telephone` 带 `tel:` 前缀~~ → v1.0.10 已修（现为 `+8613393067179`）。

## 复用技能
- **`water-site-factory`**（用户级技能，`~/.workbuddy/skills/water-site-factory/`）：把本项目的全部经验沉淀为可复用技能，用于**制作水邻居官网**或任何同类品牌站。
  含：站点骨架与数据源约定、Lighthouse+Caddy 部署、CI/自动发版、服务器拉取、踩坑总表、可复制模板、4 个校验脚本。
  **再做一个同类站点时先加载它**，按 SKILL.md 的「复用现成站点（最快路径）」走。

## 内容营销线（小红书 / 轮播图文）
- **资料库云端文档 `FEhWWjYOY8Gqcp7x1thsAb`**（title「轮播图文内容营销策略」，space `6L6KJTYsyLvQaipml8oYM4`，个人空间）是这条线的**唯一权威版本**；用户明确「之后的改动直接在该云端版本更新」，不要改本地文件。
- 其可视化子页节点 `OsQW6dMrsJ9cF92w0Imqa4`（未发布）。文档大改后该页会过时，需要时重新跑 library §md→html 分支刷新。
- **小红书账号「廊坊水厂少东家」**（小红书号 `xiaojiaGuzheng`，IP 河北）——2026-09 起定位由「懂水的老邻居」升级为「厂二代少东家」，打法改为**人设驱动**：P1 接班日常 35% / P2 水知识避坑 25% / P3 价格与行业内幕 20% / P4 服务转化 20%；六页弧 = 钩子→问题→放大→解法→卖点→私信关键词。
- **合规红线（必须遵守）**：不点名竞品品牌、不用「最便宜/第一/全网最低」、不做「原价→现价」对比图、图上只留 1 个本地热线、站内转化走私信关键词而非直接导流微信。
- 联系口径沿用官网：主号 `13393067179`，另有 `2805599` / `2232111`；公众号「廊坊桶装水」。

### 资料库 doc 写入模式（易踩坑）
- **纯追加/新增块** → `submit_doc_edit.py`，直接落正文；文末追加用 `insert_after` 且 `id` 传空串。
- **改/删已有块** → 必须 `submit_review_edit.py`（审阅式），`new_content` 必须带 `<Mark ar="delete">旧</Mark><Mark ar="insert">新</Mark>`，否则后端报 `code=11607`（本地 dry-run 通不过也照样拦）。审阅建议需作者在审阅栏接受后才落正文。
- `content` 契约要点：禁止手写 `id`、直接编辑禁 `<Mark ar>`、正文禁止花括号、顶层必须全是组件块且块间空行分隔。
- doc 回读正文是 WorkBuddy 块格式、**无统一根节点**（顶层多元素 + `readonly`/`rowHeader` 裸属性）→ Python ET 解析前补 `=""` 并外套 `<ROOT>`。
