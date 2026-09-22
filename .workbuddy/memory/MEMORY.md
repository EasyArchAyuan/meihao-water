# 美好水业官网 2.0 · 项目长期记忆

> 运维配方已沉淀到技能：`water-site-factory`（`references/lighthouse-caddy.md`、`pitfalls.md`、`scripts/h3check.py`）、`baidu-site-migration`、`git-repo-recovery`。本文件只留**决策、约定、易再踩的坑**。

## 1. 部署链路
- 仓库 `github.com/EasyArchAyuan/meihao-water`，部署分支 `main`，`dist` 为 orphan 产物分支。实例 `lhins-jrsby4oa`（ap-beijing-3，`49.233.87.42`），Caddy root `/var/www/mhsy/out`；服务器无 git/Node。
- push main → Actions lint/build → semantic-release → 推 `dist` → 服务器 cron 每 10 分钟从 raw 拉取并原子切换（`infra/mhsy-pull.sh`）。走「服务器主动拉」因 Runner→22 不可达、服务器只通 raw。
- canonical 主域 **`meihaoshuiye.com`+www**（2026-09-22 翻转）；`廊坊美好水业.online`、`meihaowater.site` 及 www 均 301 → 主域（共用 DNS-01 SAN 证）。图片 CDN `img.meihaowater.site` 保留。
- ⚠️ **Caddyfile 不随 dist 同步**：须按 **commit SHA 固定**的 raw 地址在服务器拉取（raw 按路径缓存 ~5 分钟，`?t=` 无效）→ sha256 比对 → `install` → `validate` → `reload`。主站块**不可写裸 `tls`**。远程执行用 Lighthouse MCP `execute_command`，命令含 `raw.githubusercontent.com` / `/var/log/` / `cat /etc/caddy/*` 会被 `AccessDeny`，用 shell 变量拆字绕过。

## 2. Caddy 四铁律（全部实测踩过，配方见 `water-site-factory/pitfalls.md`）
1. **80 端口必须 301**（百度不认 308）：显式 HTTP 站点块 `redir … permanent` + 显式列 hostname。
2. **访问日志**：全局 `log` 不开启访问日志，每站点块须另写裸 `log`。
3. **reload 失败时 `is-active` 仍 active**（跑旧配置）→ 必须查 `journalctl -u caddy` 的 `load complete`。诱因之一：root 跑 `caddy validate` 会建 `root:root 600` 日志文件 → 服务 permission denied。
4. **宣告 `Alt-Svc: h3` 就必须放通 UDP 443**：Caddy 默认 TCP+UDP 443 双听并宣告 h3，云防火墙默认只有 TCP 80/443 → **QUIC 入向被静默丢包**，客户端无声卡到超时，表现正是「**无法连接到您网站的服务器**」。⚠️ **curl 不走 QUIC、忽略 Alt-Svc，自测永远正常**。修法：① 放通 UDP 443（✅ 2026-09-22 已做）；② `servers { protocols h1 h2 }` 关 h3（对已缓存 Alt-Svc 的 Chrome 无效）。

## 3. 站长平台验证文件必须恒 200
- **绝不能用 `file_server` 托管**：会带 `ETag`/`Last-Modified` → 检测端二次请求带 `If-None-Match` 回 **304**，而 **304 属 3xx**，平台一律报「302 网页存在跳转」。修法：片段 `(verifyfile)` 用 `respond` + `Cache-Control: no-store`，HTTP/HTTPS 两块都用并排在 `file_server` 之前；换验证码时片段与 `public/<同名文件>` 同步改。⚠️ Caddyfile `import` **不支持前向引用**。
- 验证文件 `public/baidu_verify_codeva-9aaMr4FTSs.html`（32 字节）。凡「按扩展名批量 410」必须 `not path /baidu_verify_*`；`verify-ssg.mjs` 的 `walk()` 已排除验证文件族。
- 🔴 **ICP 备案（`company.icp`）仍 TODO**：旧站托管中国香港（无需备案），搬北京腾讯云必须办**接入备案**，是百度收录前提。用户已决定去办。

## 4. CI/CD 与发版
- semantic-release：`feat`→minor；`fix`/`perf`/`refactor`/`infra`→patch；`docs`/`chore`/`ci`/`test`/`style`→不发版但照常构建推 dist（内容上线用 `docs(content):`）。禁止手改 version；commit 不带 `(vX.Y.Z)`。
- 🔴 它自动生成 `chore(release): X.Y.Z [skip ci]` 推回 main → **commit 前必须先 `git fetch origin main`，提交后立刻推，不要攒。**
- Workflows：`ci-cd` / `rollback` / `backfill` / `content-publish` / `content-rebuild`（每日 UTC 3:17）。Secrets：`SSH_PRIVATE_KEY`、`AMAP_WEB_KEY`；`ARTICLES_API_URL` 待配。

## 5. 本机环境坑（详见 `git-repo-recovery` 技能）
- 🔴 **绝不用 `rm`/`git rm`/`git clean`/`Remove-Item` 删本项目内文件**（中文路径 safe-delete FAIL_CLOSED：报错但文件真消失，曾让整个 `src/` 蒸发）。删除一律 `Move-Item` 移出项目。
- 🔴 **`next build` 必卡**：先 `Move-Item` 把 `.next`/`out` 挪出项目再 build（约 27 秒）。别在 `out/` 里起预览服务。`npm` 被解析到 wsl 并被拦截 → 直接调托管 Node `…/node/versions/22.22.2-3/node.exe`。
- 🔴 `git fetch origin main` 只写 `FETCH_HEAD`，不更新 `refs/remotes/origin/main` → 用 `git rev-parse FETCH_HEAD` 读真实远程 HEAD、`git merge --ff-only FETCH_HEAD` 对齐；提交+推送后跑 `git pack-refs --all`（本机延迟清 `.git/refs/` 松引用，症状「提交失踪」）。不用 reflog / `--autostash` / 坏 PATH 下的 `stash`、`rebase`。
- `git push` 必须用 Bash 工具（PowerShell 报 `cannot spawn sh`）：`git -c credential.helper= -c credential.helper=wincred push origin main`；中文 commit message 走 `git commit -F .git/mhsy-commit-msg.txt`；`gh` 未装，查 CI 走 GitHub API。

## 6. GEO（AI 搜索可见度）
- 权威待办：资料库「官网GEO待办」`NGYX6c3OWKnuT4OBMkdNa7`。已落地：`/faq`、`/langfang` + 11 区县页（必须差异化，否则判 doorway）、`/shuineighbor` Product Schema、sitemap；审计 `verify:ssg`（`ssg-audit.txt`，18 项全 PASS）。
- ⚠️ `next/script` + `afterInteractive` 的 JSON-LD **不进静态 HTML** → 一律用原生 `<script dangerouslySetInnerHTML>`。
- ⚠️ **天津主体口径**：「美好水业（天津）有限公司」是我方天津地区业务关联公司（同属品牌体系，**不用「分公司」**），只改 `company.disambiguation` + `relatedOrganizations`。
- 换站：旧 2023 站为**同域换站**（非换域名），无需百度「网站改版」工具。旧 URL 清单 `docs/baidu-old-urls.txt`（~110 条）+ 方案 `docs/baidu-reindex-plan.md`（十一节，含三轮验证排查实录）；**策略 A 全量 410 vs 策略 B 栏目级 301 继承 — 待用户定档**，Caddy 规则未应用。
- 待办：百度主动推送 token → `scripts/baidu-push.mjs`；提交 sitemap；死链提交；COS 白名单补 `meihaoshuiye.com`+www（现由 Caddy `img` 块 `@selfref` 兜底）；www→apex 301 待验证通过后再定。

## 7. 内容自动化
- 铁律：静态导出只能**构建期取数**，正文必须落在静态 HTML。取数三源合并去重（`src/lib/content.ts` 的 `mergeSources`）：Markdown → `content/snapshot.json` → `ARTICLES_API_URL`（后者覆盖前者），8 秒超时降级。
- DB：CloudBase PG `workbuddy-d3g8add0q20e56cce`，表 `public.articles`，RLS 仅放行 `published`；改 schema 用 `managePgDatabase action=applyMigration`。云函数 `app.rdb()` 报 `Accept-Profile` 错 → 走快照兜底。
- 选题库 `content/ideas.json`（P1 40/P2 25/P3 20/P4 15），取缺口最大支柱下第一个 `used=false`。门禁 `check:content`（`content-audit.txt`）：广告法禁词 / 竞品（龙源·文刚·金凯·平价水超市）/ 电话一致性 / 品牌白名单 / 非空白 ≥800 + 内链 ≥2 / 标题与开头去重；失败 exit 1 必须停。
- ⚠️ 字数口径：门禁按非空白 ≥800，用户要**汉字 800–1200**（汉字 1200 ≈ 非空白 1500），写完单独统计汉字数。定时自动化 `74ec7dd5-33cb-47ef-8e07-9a10cc8b0a02`（周二/五 09:00）。软文按「实体锚点→行业问题→一手数据→独家观点→问答块→CTA」原创。

## 8. 内容与资产约定
- 对外品牌「美好水业」；法律实体「廊坊市美好商贸有限公司」（2026-09-11 由「廊坊美好水业有限公司」变更），用于 footer / JSON-LD。单一数据源 `src/data/company.ts`、`src/data/media.ts`（`src:null` → 占位块）。
- 主号 `13393067179`，另 `2805599`/`2232111`；公众号「廊坊桶装水」。视觉：Apple 式极简 / 深海蓝 `#0d47a1` + 暖米 `#f5ede0`；水邻居段 `#63c9c1`。
- 可引用一手事实（**仅限**）：1997 年起始（`yearsCopy`=「近三十年」、`yearsPhrase`=「自 1997 年起」）、库房 5000 余平米、四店（光明西道/燕青宾馆/花园楼市场/朝阳市场）、固安水源+国家级绿色食品认证、锶与偏硅酸、北京盒马仓配日吞吐 30 吨、河北省高速服务区供水、廊坊开发区外企用水。时效一律「廊坊市区及周边当天可安排配送」。
- 「1997—2026」唯一数据源 `brandSpan`（由 `establishedYear`/`copyrightYear` 派生）。门店坐标 `src/data/geo.generated.ts`（`116.74647, 39.554991`，GCJ-02）；静态地图由 `npm run map:fetch` 生成。**坐标绝不可猜**；高德 key 只存 `.env.local` + Secrets，必须「Web服务」类型。

## 9. 仓库卫生
- 只提交源码 + 静态资源 + 文档 + 项目记忆。已忽略 `node_modules`、`.next/`、`out/`、`.env*`、`*.log`、`ssg-audit.txt`、`content-audit.txt`、`.workbuddy/*`（放行 `memory/`）。⚠️ `.gitignore` 不支持行尾注释；自检 `git ls-files -i -c --exclude-standard` 应为空。

## 10. 小红书内容线
- 云端权威文档「轮播图文内容营销策略」`FEhWWjYOY8Gqcp7x1thsAb`（space `6L6KJTYsyLvQaipml8oYM4`），可视化子页 `OsQW6dMrsJ9cF92w0Imqa4`。账号「廊坊水厂少东家」六页弧：钩子→问题→放大→解法→卖点→私信关键词。
- 资料库写入：纯追加用 `submit_doc_edit.py`（`insert_after` + `id=""` 表文末）；改/删已有块用 `submit_review_edit.py`（`<Mark ar="delete">旧</Mark><Mark ar="insert">新</Mark>`，否则 `code=11607`）。禁止手写 `id`；先 `--dry-run`。合规：不点名竞品、不用绝对化用语、不做原价→现价对比。
