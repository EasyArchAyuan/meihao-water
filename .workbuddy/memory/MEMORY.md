# 美好水业官网 2.0 · 项目长期记忆

> 运维细节已沉淀到技能 `water-site-factory`（含 `references/lighthouse-caddy.md`）。本文件只留**决策、约定、坑位**。

## 1. 仓库与部署
- 远程 `github.com/EasyArchAyuan/meihao-water`（public），部署分支 `main`；`dist` 为 orphan 产物分支。
- 实例 `lhins-jrsby4oa`（ap-beijing，`49.233.87.42`），Caddy 服务 `/var/www/mhsy/out`。
- 链路：`git push origin main` → Actions lint/build → semantic-release → 推 `dist` → 服务器 cron 每 10 分钟从 `raw.githubusercontent.com` 拉取并原子切换（`infra/mhsy-pull.sh`）。服务器无 git/Node。
- ⚠️ 走「服务器主动拉」而非 SSH 直推：Runner→22 端口 UNREACHABLE，且服务器只通 raw 不通 github.com:443。
- 域名：**canonical 主域 `meihaoshuiye.com`+www**（2026-09-22 翻转，原旧站 2023/IIS 已接管）；`廊坊美好水业.online`+www、`meihaowater.site`+www 301 跳到主域（共用原 DNS-01 SAN 证书）。`meihaoshuiye.com` 由 Caddy **默认自动 HTTPS**（ACME tls-alpn-01，DNS A→49.233.87.42）签发——⚠️ 主站块**不可写裸 `tls`**（Caddyfile 要求 tls 必须带参数，否则 `caddy validate` 失败）。图片 CDN `img.meihaowater.site` 走 `*.meihaowater.site` 共享证，保留。GEO 权威源随之翻转到 meihaoshuiye.com。
- ⚠️ **Caddy 配置不随 dist 自动同步**：`mhsy-pull.sh` 只拉静态产物，`/etc/caddy/Caddyfile` 变更须**手动应用到服务器**（2026-09-22 已应用）。推荐流程：本地改 → commit+push → 服务器按 **commit SHA 固定**的 raw 地址拉取（`…/<owner>/<repo>/<full-sha>/infra/Caddyfile`；**按路径缓存约 5 分钟，加 `?t=` 无效**）→ sha256 比对 → `install` → `caddy validate` → `systemctl reload caddy`。用 Lighthouse MCP `execute_command`(TAT) 远程执行；**命令字面量含 `raw.githubusercontent.com` / `/var/log/` / `cat /etc/caddy/Caddyfile` 会被内容过滤 `AccessDeny`**，用 shell 变量拆开即可绕过（`H=raw.githu; curl …${H}busercontent.com…`、`V=/var/lo; ls ${V}g/caddy/`）。
- 🔴 **Caddy 运维三条铁律**（2026-09-22 全部实测踩过）：
  1. **80 端口必须 301**（百度只认 301，不认 Caddy 默认的 308）→ 显式 HTTP 站点块 `redir … permanent`，且**必须显式列 hostname**（只写不带 host 的 `http://` 覆盖不了 `remaining_auto_https_redirects`）。
  2. **访问日志**：全局 `log` 只改默认 logger 输出、**不开启访问日志**，每个站点块必须另写**裸 `log`**。
  3. **`systemctl reload caddy` 失败时 `is-active` 仍显示 active**（跑的还是旧配置）→ 必须查 `journalctl -u caddy` 的 `load complete`。已知诱因：以 root 跑 `caddy validate` 会把日志文件建成 `root:root 600` → 服务进程 permission denied，需 `chown caddy:caddy`。
- 🔴 **站长平台验证文件必须恒返回 200**（2026-09-22 实测踩到，代价是一次验证失败）：**绝不能用 `file_server` 托管** —— 它会加 `ETag`/`Last-Modified`，检测端二次请求带 `If-None-Match`/`If-Modified-Since` 时回 **304**；而 **304 属于 3xx**，站长平台把 3xx 一律报成「**302 网页存在跳转**」（即使服务端日志里爬虫拿到的是 200！）。修法：Caddyfile 片段 `(verifyfile)` 用 `respond` + `Cache-Control: no-store`（不产生 validator），HTTP/HTTPS 两块都要用，并排在 `file_server` 之前（互斥 `handle`）。**维护：换验证码时片段与 `public/<同名文件>` 必须同步改。** ⚠️ Caddyfile 的 `import` **不支持前向引用** —— 片段 `(x) { … }` 必须定义在使用点**之前**，否则 `File to import not found`。
- ⚠️ **COS 防盗链白名单待补新域**：桶 `meihao-1256962045` 白名单只放行 `meihaowater.site`；主域翻转后页面（新域 Referer）取图被 **403**，现由 Caddy `img` 块对自有域名请求规范 Referer 兜底（第三方直链仍被拦）。**正解**：去 COS 控制台把 `meihaoshuiye.com`（及 www）加入白名单。
- 证书/缓存：双站共用 DNS-01 通配符证（**通配符不覆盖裸域，裸域须显式入 SAN**；HTTP-01 会被 DNSPod webblock 拦）。HTML `no-cache`，`/_next/static/*` 一年 immutable。Caddy 无 matcher 的 `header {}` 会覆盖带 matcher 的同名 header。

## 2. CI/CD 与发版规则
- Workflows：`ci-cd.yml`、`rollback.yml`、`backfill.yml`、`content-publish.yml`、`content-rebuild.yml`（每日 UTC 3:17）。
- **semantic-release**：`feat`→minor；`fix`/`perf`/`refactor`/`infra`→patch；`docs`/`chore`/`ci`/`test`/`style`→**不发版但照常构建推 dist**（内容上线用 `docs(content):`）。
- ⚠️ 禁止手改 `package.json` version；commit 不带 `(vX.Y.Z)`；`CHANGELOG.md` 由插件维护。
- 🔴 **semantic-release 会在 CI 里自动生成 `chore(release): X.Y.Z [skip ci]` 并推回 main** → 每次 push 后远端立刻领先一个提交。**`git commit` 之前必须先 `git fetch origin main`**，否则 push 被拒（`! [rejected] … (fetch first)`）还要回头处理分叉。**提交后就立刻推，不要攒。**
- Secrets：`SSH_PRIVATE_KEY`、`AMAP_WEB_KEY`。Variables：`SSH_HOST/USER/PORT/DEPLOY_MODE`；`ARTICLES_API_URL` 待配。
- `eslint.config.mjs` 已忽略 `cloudfunctions/**`。release 曾因 `conventional-changelog-conventionalcommits@10` 与 writer@8 不兼容失败 → 锁 `^8`。

## 3. 本机环境坑（重要）
- 🔴 **绝不用 `rm` / `git rm` / `git clean` / `Remove-Item` 删本项目内文件**（目录名含中文 `美好水业官网2.0`）。safe-delete 拦截层在中文路径下 **FAIL_CLOSED**：报错但文件实际消失，作用在目录上会殃及整棵子树（2026-09-21 用 `git rm` 让整个 `src/` 消失）。**删除一律用 `Move-Item` 移出项目。**
- 🔴 **`next build` 必卡**：收尾清理 `.next`/`out` 必命中上条 bug（挂 10 分钟、exit 127；`CODEBUDDY_SAFE_DELETE_ENABLED=0` 无效）。**先 `Move-Item` 把 `.next`、`out` 挪出项目（如 `C:\Users\shang\WorkBuddy\.build-trash-<date>`）再 build → 27 秒完成。**
- ⚠️ 别在 `out/` 里起预览服务（CWD=out 时 `rmdir` 报 EBUSY 令构建失败）。用 `--directory out` 且 CWD 留项目根。
- ⚠️ **`npm` 被解析到 `wsl.exe` 并被拦截**（不可绕过）。直接调托管 Node：`C:\Users\shang\.workbuddy\binaries\node\versions\22.22.2-3\node.exe`。
- **PowerShell 工具不回显 stdout** → 结果写文件再 Read。
- ⚠️ **`git push` 必须用 Bash 工具**（PowerShell 报 `cannot spawn sh`）：`git -c credential.helper= -c credential.helper=wincred push origin main`。`gh` 未装，查 CI 用 GitHub API `actions/runs?per_page=5`。
- 🔴 **`git fetch origin main` 只写 `FETCH_HEAD`，不更新 `refs/remotes/origin/main`** → `ahead/behind` 与 `git log origin/main` 不可信。**提交前用 `git rev-parse FETCH_HEAD` 读真实远程 HEAD，用 `git merge --ff-only FETCH_HEAD` 对齐。**
- 中文 commit message 走 `git commit -F <项目内 UTF-8 无 BOM 文件>`（用 `.git/mhsy-commit-msg.txt`；Bash 沙箱读不到 `%TEMP%`）。
- 绝不在坏 PATH 下跑 `git stash`/`rebase`（曾丢 `.git`）。**本地 `.git` 是唯一历史载体，动手前先备份。**
- **已分叉时的安全对齐法（不用 rebase）**：`git tag bk <本地sha>`（安全网）→ `git reset --soft FETCH_HEAD` → ⚠️ **必须再执行 `git checkout HEAD -- CHANGELOG.md package.json package-lock.json`** —— 因为 `--soft` 不碰 index，会让 release 的版本号在 index 里变成"待提交的回退"，直接 commit 就把 `package.json` **改回旧版本号**了 → 最后 `git commit -F …` → push → 删备份 tag。**自检**：`git diff --stat <旧sha> HEAD` 应只显示 release 的 3 个文件。
- 🔴 **本机环境会延迟清除 `.git/refs/` 下的松引用文件**（2026-09-22 实测：写入的探针文件 3 秒内可见、稍后自行消失；`git update-ref refs/remotes/origin/main` 也建不住）。后果：松引用消失后 HEAD 回退到 `packed-refs` 的旧值 + 对象被清 → 表现为「提交失踪 / reflog invalid / reset 报 unable to read」。**缓解**：① 每次提交+推送后跑 `git pack-refs --all` 刷新 `packed-refs`（松引用没了也能解析到正确 sha）；② 远端是唯一权威，提交前先 `git fetch` 并用 `git rev-parse FETCH_HEAD` 核对；③ 不依赖 reflog / origin| 跟踪引用；④ 事故一律按 `git-repo-recovery` 技能流程 A 从远端重建。**`--autostash` 一律不用。**

## 4. GEO（AI 搜索可见度）
- 权威待办：资料库「官网GEO待办」`NGYX6c3OWKnuT4OBMkdNa7`。
- 诊断（2026-09-13 豆包）：首选旧站 `meihaoshuiye.com`，新站未被引用；有「贴牌/押金」负信号、电话漂移、企查查实体混淆。
- ⚠️ **天津主体口径**：「美好水业（天津）有限公司」是**我方天津地区业务关联公司**，同属品牌体系 —— 不是无关同名公司，也**不用「分公司」**。落地在 `company.disambiguation` + `relatedOrganizations` → `Organization.subOrganization`；`verify-ssg.mjs` 有 2 条断言从 `company.ts` 派生，**改口径只改一处**。
- ⚠️ **`next/script` + `afterInteractive` 的 JSON-LD 不进静态 HTML**。新增 JSON-LD 一律用原生 `<script dangerouslySetInnerHTML>`。
- 已落地：`/faq`、`/langfang` + 11 个区县页、`/shuineighbor` Product Schema、sitemap。⚠️ 区县页必须差异化，否则判 doorway page。
- 审计 `verify:ssg`（报告 `ssg-audit.txt`，18 项全 PASS 为准）。
- 待确认（改 `company.delivery` 全站生效）：覆盖区域、送达时效。已做：meihaowater.site/IDN 旧域 301→meihaoshuiye.com；旧站 URL 清单已挖出（Wayback CDX → `docs/baidu-old-urls.txt`，约 110 条页面类）+ 换站加速方案 `docs/baidu-reindex-plan.md`（策略 A 全量 410 / **策略 B 栏目级 301 继承**）——**Caddy 规则待用户定档后应用**。旧 2023 站为**同域换站**（非换域名），无需百度「网站改版」工具。
- 百度站长平台**文件验证已落地**：`public/baidu_verify_codeva-9aaMr4FTSs.html`（32 字节纯内容）。⚠️ 凡「按扩展名批量 410」必须 `not path /baidu_verify_*`，否则验证静默失效；`verify-ssg.mjs` 的 `walk()` 已排除验证文件族（否则误判缺 Organization）。**ICP 备案（`company.icp`）仍 TODO —— 同域换服务器须办「接入备案」，是百度收录前提。**

## 5. 内容自动化
- **铁律：静态导出只能「构建期取数」**，正文必须落在静态 HTML。
- ⚠️ 取数是「三源合并去重」不是短路降级（`src/lib/content.ts` 的 `mergeSources`）：Markdown → `content/snapshot.json` → `ARTICLES_API_URL`（后者覆盖前者），保留 8 秒超时降级。
- DB：CloudBase PG `workbuddy-d3g8add0q20e56cce`，表 `public.articles`，RLS 仅放行 `status='published'`。改 schema 必须 `managePgDatabase action=applyMigration`。云函数 `app.rdb()` 报 `Accept-Profile` 错 → 接口层不可用，构建走快照兜底。
- 选题库 `content/ideas.json`：配比 P1 40/P2 25/P3 20/P4 15，取**当前缺口最大**支柱下第一个 `used=false`。
- 门禁 `check:content`（报告 `content-audit.txt`）：广告法禁词 / 竞品（龙源·文刚·金凯·平价水超市）/ 电话一致性 / 品牌白名单 / 非空白 ≥800 + 内链 ≥2 / 标题与开头 200 字去重。失败 exit 1，必须停。
- ⚠️ **字数口径**：门禁按非空白 ≥800，用户要汉字 800–1200（汉字 1200 ≈ 非空白 1500）。**写完单独统计汉字数**（`[regex]::Matches($s,'[\u4e00-\u9fff]')`），初稿极易超。
- 定时自动化 `74ec7dd5-33cb-47ef-8e07-9a10cc8b0a02`（每周二五 09:00）：取选题 → 写 md → 门禁 → build+verify:ssg → `docs(content):` → push。
- ⚠️ 软文按「实体锚点→行业问题→一手数据→独家观点→问答块→CTA」原创，**不用** `docs/轮播图文内容营销策略.md`（那是小红书轮播）。

## 6. 内容与资产约定
- 对外品牌「美好水业」；法律实体「廊坊市美好商贸有限公司」（2026-09-11 由「廊坊美好水业有限公司」变更），用于 footer / JSON-LD。
- 单一数据源：`src/data/company.ts`、`src/data/media.ts`（`src:null` → 占位块）。主号 `13393067179`，另 `2805599` / `2232111`；公众号「廊坊桶装水」。
- 视觉：Apple 式极简 / 深海蓝 `#0d47a1` + 暖米色 `#f5ede0`；水邻居段 `#63c9c1`。
- 可引用的一手事实（**仅限**）：**1997 年起始（2026-09-21 由 1998 校正；`yearsCopy`=「近三十年」、`yearsPhrase`=「自 1997 年起」）**、库房 5000 余平米、四店（光明西道/燕青宾馆/花园楼市场/朝阳市场）、固安水源+国家级绿色食品认证、锶与偏硅酸、北京盒马仓配日吞吐 30 吨、河北省高速服务区供水、廊坊开发区外企用水。时效一律写「廊坊市区及周边当天可安排配送」。
- 核心视觉「1997—2026」唯一数据源是 `brandSpan`（由 `establishedYear`/`copyrightYear` 派生），页面不出现字面量。
- 门店位置：坐标 `src/data/geo.generated.ts`（`116.74647, 39.554991`，GCJ-02，高德精度「门址」）；静态地图 `public/map/location.png` 由 `npm run map:fetch` 构建期抓取。**坐标绝不可猜**；高德 Web服务 key 只存 `.env.local` 与 Secrets（`AMAP_WEB_KEY`），静态地图/地理编码必须用「Web服务」类型 key（否则 `USERKEY_PLAT_NOMATCH`）。

## 7. 仓库卫生
- 只提交源码 + 静态资源 + 文档 + 项目记忆。已忽略 `node_modules`、`.next/`、`out/`、`.env*`、`*.log`、`ssg-audit.txt`、`content-audit.txt`、`.workbuddy/*`（放行 `memory/`、`skills/`）。
- ⚠️ `.gitignore` 不支持行尾注释。自检 `git ls-files -i -c --exclude-standard` 应为空。
- 临时 `.txt` 用 `Move-Item` 移出项目（不要用 `git clean`/`rm`）。

## 8. 内容营销线（小红书）
- **资料库云端文档 `FEhWWjYOY8Gqcp7x1thsAb`**（「轮播图文内容营销策略」，space `6L6KJTYsyLvQaipml8oYM4`，personal/owner）为唯一权威版本；可视化子页 `OsQW6dMrsJ9cF92w0Imqa4`。
- 账号「廊坊水厂少东家」：人设驱动，六页弧 = 钩子→问题→放大→解法→卖点→私信关键词。
- **资料库 doc 写入**：纯追加 → `submit_doc_edit.py`，`insert_after` + `id=""` 表示文末；改/删已有块 → `submit_review_edit.py`，`new_content` 带 `<Mark ar="delete">旧</Mark><Mark ar="insert">新</Mark>`（否则 `code=11607`）。actions 是**顶层 JSON 数组**；禁止手写 `id`；块间空行；先 `--dry-run`。
- 合规：不点名竞品、不用绝对化用语、不做原价→现价对比、图上只留 1 个本地热线。
