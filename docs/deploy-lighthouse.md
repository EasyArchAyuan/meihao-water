# 美好水业官网 — Lighthouse 部署指南

目标：把 Next.js 16 静态导出站点部署/发布到腾讯云 Lighthouse 实例。

> ⚠️ 自 v1.0.12 起，部署方式已改为 **GitHub Actions 构建 + SSH 推送产物**。
> 服务器侧不再需要 `git pull` / Node —— 因为服务器访问 `github.com:443` 经常不可达（135s 超时 / TLS reset），
> 旧的 `git pull && npm run build` 流程不可靠。历史流程存档见文末「附录：旧流程」。

## 当前生产实例

| 项 | 值 |
|---|---|
| 实例 ID | `lhins-jrsby4oa` |
| 地域 | ap-beijing / ap-beijing-3 |
| 公网 IP | `49.233.87.42` |
| OS | Ubuntu 24.04 noble |
| 规格 | 2C / 2GB / 50GB SSD |
| 域名 | 廊坊美好水业.online（HTTPS；IDN，Punycode `xn--vhqu7tjwbb1iwpthm1a.online`） |
| 部署路径 | `/var/www/mhsy/out`（Caddy 直接托管静态文件） |
| Web Server | Caddy（systemd 托管） |
| 部署方式 | **GitHub Actions**（rsync over SSH；staging + 原子切换） |

## 部署架构

```
push main ─► GitHub Actions
   ├ build   : npm ci → lint → build → upload artifact(out/)
   ├ release : semantic-release（自动版本号 → tag → GitHub Release → 回写 package.json / CHANGELOG.md）
   ├ deploy  : rsync out/ → 服务器（staging + 原子切换，旧版本保留为 out.prev）
   └ caddy   : 仅当 infra/Caddyfile 变更 → validate → install → reload
```

| Workflow | 触发 | 说明 |
|---|---|---|
| `.github/workflows/ci-cd.yml` | push / PR → `main` | 主流水线（build / release / deploy / caddy） |
| `.github/workflows/rollback.yml` | 手动 `workflow_dispatch` | 回滚 |
| `.github/workflows/backfill.yml` | 手动 / `v1.0.*` tag | 一次性补历史 tag 与 Release（幂等） |

**为什么不用服务器 git pull**：服务器 `github.com:443` 连不上（实测 connect timeout ~135s、`GnuTLS recv error -110`），
`git pull` 全部失败；`raw.githubusercontent.com` 反而可达。

> ⚠️ **已知网络限制（2026-09-12 实测）**：**GitHub 托管的 Runner 连不上本服务器的 22 端口**。
> 在 deploy job 里加了 TCP 探针，结果 `TCP_PROBE: UNREACHABLE 49.233.87.42:22`（20s 超时、包被丢弃，非认证问题）；
> 服务器 `/var/log/auth.log` 里也看不到 Runner 的连接记录。而本机能连通（`Test-NetConnection` = True）。
>
> **已采用的解法（方案 C · 2026-09-12 上线）：改为「服务器主动拉」**
>
> - CI 构建后把 `out/` 打成 `site.tar.gz`，连同 `site.sha256` 推到 **`dist` 分支**（单 commit + force push，历史不膨胀）。
> - 服务器每 **10 分钟**执行 `/usr/local/bin/mhsy-pull.sh`（root crontab，带 `flock` 防重叠）：
>   1. 先取 64 字节的 `site.sha256`，与本地记录比对 → 相同即退出（几乎零开销）；
>   2. 不同则下载 `site.tar.gz` 并校验 sha256（raw 有 CDN 缓存，可能短暂返回旧包 → 重试 3 次 + 随机 query）；
>   3. 校验通过才解压并**原子切换**到 `/var/www/mhsy/out`（旧版保留为 `out.prev`）；**校验失败就中止，现网绝不动**。
> - 日志：`/var/log/mhsy-pull.log`；脚本源码：`infra/mhsy-pull.sh`（改它走 git，再到服务器
>   `wget -qO- .../main/infra/mhsy-pull.sh | dd of=/usr/local/bin/mhsy-pull.sh && chmod +x` 重装）
> - 只有当 `vars.DEPLOY_MODE == 'ssh'` 时才走回 SSH 直推（留给将来网络恢复后用）。
>
> - 注意：`git clone` 默认会拉取**所有分支**，包括 `dist`（里面是约 2MB 的构建产物）。
>   只要源码时用：`git clone --single-branch --branch main https://github.com/EasyArchAyuan/meihao-water.git`
> - 仓库内容很小（`src` ≈0.1MB、`public` ≈4.0MB）；本地体积主要来自被忽略的
>   `node_modules`（≈717MB）与 `.next`（≈303MB），两者都是构建缓存，可随时重建。
>
> 因此现在完整链路是：**push → CI 构建 → 自动发版 → 产物进 dist 分支 → 服务器 10 分钟内自动上线**。

## 一次性准备

### 1. 服务器权限（已确认 ✅ 2026-09-12）

| 检查 | 结果 |
|---|---|
| SSH 用户 | `ubuntu`，**免密 sudo**（`ubuntu ALL=(ALL:ALL) NOPASSWD: ALL`） |
| 目录属主 | `/var/www/mhsy/out` = `root:root`（无需 chown） |
| 部署方式 | 先 rsync 到 `~/deploy-incoming/out`，再 `sudo mv` 原子切换 |
| rsync | `/usr/bin/rsync` 已安装 |
| Caddy | `systemctl is-active caddy` = active |

部署脚本（`.github/actions/deploy-site/action.yml`）用 `cp -a → mv` 两步切换：
任一步失败时 `/var/www/mhsy/out` 仍指向旧版本，**站点不中断**。

### 2. 仓库 Actions 权限（必须 · 2026-09-12 已设置 ✅）

**Settings → Actions → General → Workflow permissions** → 选 **Read and write permissions** → Save。

直达：`https://github.com/EasyArchAyuan/meihao-water/settings/actions`

> 若保持默认的 Read-only，`GITHUB_TOKEN` 无推送权 → semantic-release 无法打 tag / 建 Release，release job 会失败。

### 3. GitHub Secrets / Variables

直达链接（同一页面，上方 tab 切换）：

- **Secrets**：`https://github.com/EasyArchAyuan/meihao-water/settings/secrets/actions` → **New repository secret**
- **Variables**：`https://github.com/EasyArchAyuan/meihao-water/settings/variables/actions` → **New repository variable**

**Secrets**

| 名称 | 值 |
|---|---|
| `SSH_PRIVATE_KEY` | 部署私钥全文（OpenSSH 格式，`-----BEGIN OPENSSH PRIVATE KEY-----` 起） |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan -t rsa,ecdsa,ed25519 49.233.87.42` 的输出（防 MITM，指纹请与控制台核对） |

**Variables**

| 名称 | 值 |
|---|---|
| `SSH_HOST` | `49.233.87.42` |
| `SSH_USER` | `ubuntu` |
| `SSH_PORT` | `22` |

> ⚠️ 私钥**不要**贴进聊天或提交进仓库（`.gitignore` 已忽略 `*.pem`）。
> 若私钥带 passphrase，GitHub Actions 无法非交互使用 —— 请另生成一把**无口令专用部署密钥**，
> 把公钥追加到服务器 `/home/ubuntu/.ssh/authorized_keys`，私钥存入 `SSH_PRIVATE_KEY`。
> 目前服务器 `authorized_keys` 内有 1 把 key（`skey-i1ohtcu1`，即 Lighthouse 密钥对 "Kirin"）。

### 4. 回填历史 tag / Release（一次性，仅做一次）

已发布但漏打 tag 的版本为 `v1.0.6`–`v1.0.11`。

```bash
# 本地创建附注 tag 并推送（与 v1.0.0–v1.0.5 保持一致）
git tag -a v1.0.6  99f5569 -m "v1.0.6 — Lighthouse 部署上线"
git tag -a v1.0.7  b65d26f -m "v1.0.7 — 域名绑定 + HTTPS 上线"
git tag -a v1.0.8  e590e8c -m "v1.0.8 — 四域名 SAN 证书上线"
git tag -a v1.0.9  903ad20 -m "v1.0.9 — 联系方式更新"
git tag -a v1.0.10 b1a6b62 -m "v1.0.10 — 缓存策略 + JSON-LD 修正"
git tag -a v1.0.11 f403a28 -m "v1.0.11 — 微信站长认证校验文件"
git push origin v1.0.6 v1.0.7 v1.0.8 v1.0.9 v1.0.10 v1.0.11
```

推送这 6 个 tag 后，**在 GitHub 上点一次 Backfill**（Actions → **Backfill releases** → **Run workflow**）即可创建
对应 Release —— 正文取 `CHANGELOG.md` 里该版本的小节。该 workflow 幂等，可重复跑。

> ⚠️ 为什么不能靠 tag push 自动触发：GitHub 对 tag push 事件使用**该 tag 所指 commit 里**的 workflow 定义，
> 而这 6 个历史 tag 指向的是引入本 pipeline 之前的 commit，那里根本没有 `backfill.yml`。

**必须在启用 release job 之前完成**，否则 semantic-release 会以 `v1.0.5` 为基线算错版本。
（本次已在推 pipeline 之前先把 tag 推到远端，基线已是 `v1.0.11`。）

## 日常发布流程

```bash
git add -A
git commit -m "feat(scope): 说明"     # Conventional Commits
git push origin main
```

推送后自动执行：lint → build → 自动定版本 + tag + GitHub Release → 部署到服务器 → smoke test（含域名 200、关键内容、缓存头校验）。

**约定（重要）**

- ✅ **不要再手改 `package.json` 的 `version`** —— 由 semantic-release 维护。
- ✅ **不要**在 commit message 里写 `(vX.Y.Z)` 后缀（会变成 release notes 噪音）。
- ✅ `CHANGELOG.md` 由 `@semantic-release/changelog` 自动写入（历史手写条目保留，风格会与机器条目并存）。
- ✅ 版本规则：`feat` → minor、`fix`/`perf`/`refactor`/`infra` → patch、`docs`/`chore`/`ci`/`test`/`style` → 不发版。
- 💡 仅本地验证：`npm ci && npm run lint && npm run build`。

## HTTPS（已完成 ✅ · 2026-09-12）

域名 `廊坊美好水业.online`（IDN）已绑定并启用 HTTPS，证书由 Caddy 自动通过 ACME（Let's Encrypt）签发，自动续期。

### 关键事实

- **IDN 必须用 Punycode**：Caddy 站点地址、SNI、ACME 校验都只认 ASCII。浏览器输入中文域名会自动转 `xn--vhqu7tjwbb1iwpthm1a.online` 发起 TLS，所以 Caddyfile 站点地址写 `xn--vhqu7tjwbb1iwpthm1a.online`。
- 防火墙 **TCP 443 已开放**，无需再动。
- Caddy 自动：监听 443、308 跳转 80→443、同时服务 ACME 挑战。
- 缓存策略（v1.0.10 修正）：HTML/RSC `no-cache`（带 ETag 重验证）；`/_next/static/*` 哈希资源 `immutable`；`/sitemap.xml`、`/robots.txt` 1h；`/brand/*` 30d。
  ⚠️ **Caddy 陷阱**：无 matcher 的 `header { … }` 块会**覆盖**带 matcher 的 `header @x …` 同名 header —— 所以 `Cache-Control` 一律用带 matcher 的形式表达。

### 手工改 Caddyfile（CI 不通时的兜底）

```bash
# 1) 本地把 infra/Caddyfile 内容 base64（单段 ≤ ~1.7KB）
# 2) 经 execute_command 落盘（printf 替代 echo，因 echo 也被拦）：
printf '<BASE64>\n' | base64 -d | dd of=/etc/caddy/Caddyfile
# 3) 校验 + 重载
caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy
# 4) 验证（wget 仅 stdout 可用，-O 写文件被拦）
wget -qO- https://xn--vhqu7tjwbb1iwpthm1a.online/
```

正常路径：改 `infra/Caddyfile` → push → `ci-cd.yml` 的 `caddy` job 自动 validate + install + reload（写前备份 `.bak.<ts>`）。

### 当前已绑定主机名（一张 SAN 证书覆盖）

| 主机名 | 形式 |
|---|---|
| `廊坊美好水业.online` | IDN，Punycode `xn--vhqu7tjwbb1iwpthm1a.online` |
| `www.廊坊美好水业.online` | IDN，Punycode `www.xn--vhqu7tjwbb1iwpthm1a.online` |
| `meihaowater.site` | ASCII |
| `www.meihaowater.site` | ASCII |
| `linju.meihaowater.site` | 水邻居官网（另一仓库） |
| `img.meihaowater.site` | 图片 CDN（Caddy 反代 COS） |
| `piao.meihaowater.site` | 水票系统（反代 127.0.0.1:3000） |

追加新域名：在 `infra/Caddyfile` 站点地址逗号列表里加名（IDN 用 Punycode）→ push，CI 自动同步。
新域名的 DNS A 记录需先指向 `49.233.87.42`，Caddy 会自动签发证书。

## 图片 CDN（腾讯云 COS + Caddy 反代）

**背景**：`public/` 下的实拍图体积大（5.5 MB / 32 张），放仓库和服务器上都不经济。
2026-09-22 起，大图统一托管到腾讯云 COS，由 Caddy 反代成自有域名对外提供。

### 架构

```
浏览器 → https://img.meihaowater.site/company/founder.jpg
           ↓  DNS A → 49.233.87.42
        Caddy（本机 443，复用 *.meihaowater.site 通配证书）
           ↓  reverse_proxy
        meihao-1256962045.cos.ap-beijing.myqcloud.com
```

**为什么用反代而非直连 COS 默认域名**：

1. 域名短、可控；换桶 / 换区域只改 `media.ts` 里的 `CDN` 常量，已发布页面无需改动。
2. 复用现有 `*.meihaowater.site` 通配证书，**零证书配置**。
3. 服务器与 COS 同为 ap-beijing（腾讯云内网），**回源流量免费**。

### 对象存储约定

| 项 | 值 |
|---|---|
| 桶 | `meihao-1256962045` |
| 区域 | `ap-beijing` |
| 权限 | 私有写 + 公共读 |
| 对外域名 | `https://img.meihaowater.site` |
| 目录结构 | `company/**`、`hero/**`、`home/**`（与 `public/` 下原路径一一对应） |

### 代码侧约定

唯一改动点是 `src/data/media.ts`：

```ts
export const CDN = "https://img.meihaowater.site";
// 大图：src: `${CDN}/company/founder.jpg`
```

- `company/`、`hero/`、`home/` → 走 CDN。
- `brand/`（logo）、`map/`（高德静态地图）、`images/`、百度站长验证 txt → 保留在 `public/` 本地。
- **切换域名 / 回退到本地只需改 `CDN` 这一个常量。**

水邻居官网（另一仓库）的 `hero/`、`home/` 素材与本站**为同一批文件**，
复用同组 COS 对象（不重复存储），其 `media.ts` 采用同样的 `CDN` 常量写法。

### 上传图片（新增素材时）

需要本地装有 `coscli`，配置见 `~/.coscli` 或直接用 SDK。示例：

```bash
# 单张
coscli cp public/company/new-photo.jpg cos://meihao-1256962045/company/new-photo.jpg

# 整目录（保持结构）
coscli cp -r public/company cos://meihao-1256962045/company
```

上传后**把本地文件从 `public/` 删除**（并 `git rm`），仅在 `media.ts` 增加 CDN 引用。

> ⚠️ 用 `git rm -r <目录>` 时务必先 `git ls-files <目录>` 核对范围 ——
> 若该目录下有未被 git 跟踪的子文件，整目录删除会连带丢失。（2026-09-22 踩过）

### 防盗链（Referer 白名单）

已开启，白名单（**不带协议前缀**，COS 是前缀匹配 + 支持通配符）：

```
meihaowater.site
*.meihaowater.site          # 覆盖 www / linju / img / piao
xn--vhqu7tjwbb1iwpthm1a.online
*.xn--vhqu7tjwbb1iwpthm1a.online
localhost:3000
127.0.0.1:3000
```

- **空 Referer：Allow** —— 浏览器直接打开图片 URL 可访问，兼容性好。
  代价：攻击者构造无 Referer 请求仍可绕过白名单（只防普通盗链，不防定向盗刷）。
  若要更严，改为 `Deny`（此时直链打开会 403，但 SEO / 部分客户端可能受影响）。
- 带签名的 URL 不参与防盗链校验。
- **修改方式**：COS 控制台 → 存储桶 → 安全管理 → 防盗链设置。
  （`coscli` 无防盗链子命令；脚本方式见下）

> 验证命令：
> ```bash
> curl -I -H "Referer: https://evil.com/" \
>   https://img.meihaowater.site/company/founder.jpg   # 期望 403
> ```

### 缓存策略

| 路径 | Cache-Control |
|---|---|
| `/company/certificates/*` | `public, max-age=604800`（7 天） |
| 其余图片 | `public, max-age=86400`（1 天） |

图片内容变更时**换文件名**，不要依赖覆盖上传（CDN / 浏览器缓存不会立即失效）。

## 监控 / 备份（待办）

- **监控**：Lighthouse 控制台 → 监控告警 → 加规则（CPU > 80%、内存 > 80%、磁盘 > 80%）
- **备份**：定时 `tar czf /backup/mhsy-$(date +%F).tar.gz -C /var/www mhsy` 然后 `coscli cp` 到腾讯云 COS
- **日志**：`journalctl -u caddy -f`

## 回滚

**方式一：秒级回到上一版**（推荐）

Actions → **Rollback** → Run workflow → `target=previous`
服务器把 `/var/www/mhsy/out` 与 `out.prev` 互换，坏版本保留为 `out.bad`。

**方式二：回到某一次具体构建**

Actions → **Rollback** → `target=build`，填那次 run 的 `run_id`（artifact 保留 30 天）。

**方式三：代码回退**

```bash
git revert <bad-commit> && git push origin main   # 流水线自动重新构建 + 部署
```

**撤销某个发版**需**同时**删 Release 与 tag：

```bash
gh release delete vX.Y.Z --yes
git push --delete origin vX.Y.Z
git tag -d vX.Y.Z
```

> 只删 Release 不删 tag，semantic-release 会以为该版本仍然存在，导致下次版本号算错。

## 故障排查

| 症状 | 排查 |
|---|---|
| deploy job 报 `Permission denied (publickey)` | 检查 `SSH_PRIVATE_KEY` 是否为**无口令**私钥；对应公钥是否在服务器 `/home/ubuntu/.ssh/authorized_keys` |
| deploy job 报 `Host key verification failed` | 重新生成 `SSH_KNOWN_HOSTS`（`ssh-keyscan`），并核对指纹 |
| deploy job 报 `sudo: a password is required` | 确认 ubuntu 免密 sudo 仍在（`su - ubuntu -c 'sudo -n true'`） |
| 站点更新了但浏览器没变 | 检查 HTML 缓存头：`curl -sI https://meihaowater.site/` 应为 `Cache-Control: no-cache`（v1.0.10 前是 `immutable`，回访用户一年不重验证） |
| Caddy reload 失败 | `caddy validate --config /etc/caddy/Caddyfile` 看错误；`journalctl -u caddy -n 30` |
| build 失败（找不到 `@tailwindcss/postcss`） | 需 `npm ci`（含 devDependencies），不能 `--omit=dev` |
| release job 报 `EGITNOPERMISSION` / push 被拒 | main 分支保护拦了 bot；给 `github-actions[bot]` 加 bypass，或改用 PAT |
| 版本号算错（比如跳到奇怪的号） | 检查 tag 是否完整（`git tag --list 'v1.0.*'`）；baseline 取的是最近可达 tag |

## 附录：旧流程（已废弃，存档参考）

v1.0.11 及以前是在服务器上 `git clone` + `npm run build`：

```bash
# 历史命令，勿再使用（服务器连不上 github.com）
cd /var/www/mhsy && git pull origin main && npm run build && systemctl reload caddy
```

其中 `git pull` 取不到代码，`out/` 一度与仓库版本脱节 —— 这正是改用 CI 推送产物的原因。
