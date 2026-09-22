# meihaoshuiye.com 上线操作手册（canonical 主域）

> 决策：meihaoshuiye.com 作为官网 2.0 的 **canonical 主域**，其余 4 个旧域名 301 永久跳转到它。
> 范围：本次仅上线域名。**旧 2023 站（103.66.92.229）即将到期，用户明确放弃，不再做旧 URL 继承。**
> 为什么是我写、你执行：本机连不上你的 DNSPod 与服务器 22 端口（与现有「服务器主动拉」部署模型一致），DNS 改解析与 Caddy reload 需你在对应控制台/服务器上完成。
>
> **状态（2026-09-22 更新）**：✅ 步骤 1（DNSPod 改解析）已完成并由我验证 `meihaoshuiye.com`/`www` 均解析到 `49.233.87.42`；✅ 步骤 2（等解析生效）已完成；⏳ 仅剩**步骤 3（服务器应用 Caddyfile）**需你执行。

## 仓库侧已完成的改动（已 commit 前请 review）
- `src/data/site.ts`：`domain` / `url` → `meihaoshuiye.com` / `https://meihaoshuiye.com`（canonical 全站自动传导：seo/sitemap/robots/JSON-LD 均读 `site.url`）。
- `infra/Caddyfile`：
  - 新增主站块 `meihaoshuiye.com, www.meihaoshuiye.com` → 静态根 `/var/www/mhsy/out`，`tls` 自动签发。
  - 旧 4 域名块改为 `redir https://meihaoshuiye.com{uri} permanent`（共用原共享证书）。
- 未动：`src/data/media.ts` 的 `img.meihaowater.site`（图片 CDN，独立子域、走 `*.meihaowater.site` 共享证书，保留）。

## 执行顺序（重要：先切 DNS，再 reload Caddy）
证书走 ACME `tls-alpn-01`，**校验时 CA 会解析 DNS 到 49.233.87.42 做 443 挑战**。
若先 reload Caddy 而 DNS 还指向旧 IP，证书签发会失败。故顺序固定为：

### 步骤 1 · DNSPod 改解析（腾讯云控制台） ✅ 已完成
已把 `meihaoshuiye.com` / `www` 的 A 记录改为 `49.233.87.42`（原 103.66.92.229 记录已替换，旧 IIS 站随之离线）。

### 步骤 2 · 等解析生效 ✅ 已完成
已由我验证：
```text
nslookup -type=A meihaoshuiye.com      → 49.233.87.42
nslookup -type=A www.meihaoshuiye.com  → 49.233.87.42
```
> 线上 HTTPS 当前握手失败，是因为 `49.233.87.42` 仍跑**旧 Caddyfile**（无 meihaoshuiye.com 块），属预期——步骤 3 执行后即恢复。

### 步骤 3 · 服务器应用新 Caddyfile（49.233.87.42） ⏳ 待你执行
SSH 登录服务器后执行（服务器可直连 `raw.githubusercontent.com`，故直接拉最新 Caddyfile，免 scp/手贴）：
```bash
# 0) 先备份
cp /etc/caddy/Caddyfile /tmp/Caddyfile.bak-$(date +%s)

# 1) 从仓库 main 分支拉最新 Caddyfile（已含 meihaoshuiye.com 主站块 + 旧域 301）
wget -q -O /etc/caddy/Caddyfile "https://raw.githubusercontent.com/EasyArchAyuan/meihao-water/main/infra/Caddyfile"

# 2) 校验语法（必须 0 错误）
caddy validate --config /etc/caddy/Caddyfile

# 3) 热加载（不中断现网；Caddy 自动向 CA 申请 meihaoshuiye.com 证书并 301 旧域）
systemctl reload caddy
```
> 若 `caddy validate` 报证书相关错误，通常是 DNS 未完全生效或 CA 挑战未过，等几分钟再 reload；不要强行 reload。
> 证书由 Caddy 首次加载时自动签发（零停机），无需手动申请。

### 步骤 4 · 验证
```bash
# 主域应 200，且证书为 Let's Encrypt（Caddy 自动签发）
curl -sS -I https://meihaoshuiye.com        | head -5
curl -sS -I https://www.meihaoshuiye.com    | head -5

# 旧域名应 301 跳到主域（注意 Location 头）
curl -sS -I http://meihaowater.site         | grep -i location
curl -sS -I https://meihaowater.site        | grep -i location
curl -sS -I https://廊坊美好水业.online      | grep -i location

# canonical 标签应指向主域
curl -sS https://meihaoshuiye.com | grep -ioE '<link rel="canonical"[^>]*>'
```
全部符合预期即上线成功。

## 上线后的百度动作（SEO 收尾，非阻塞）
1. **百度站长平台**：用 `meihaoshuiye.com` 重新验证站点、提交 `sitemap.xml`、在「链接提交」做主动推送；对旧域名已收录URL 提交「网站改版」规则（旧域→新域 301）。
2. **GEO/AI 搜索**：canonical 已变，建议重跑豆包/元宝诊断，确认引用源切到 meihaoshuiye.com（原 memory 记 meihaowater.site 为 GEO 权威源，现已翻转）。
3. **备案**：若 meihaoshuiye.com 尚未 ICP 备案，尽快补办——百度对未备案域名降权/不收。

## 风险与待办
- **旧站 URL 404（已明确放弃）**：旧 2023 站（103.66.92.229）即将到期，用户决定不再保留，旧 URL 不继承。域名本身（meihaoshuiye.com）百度历史信任会随新站内容保留，仅旧内页权重自然流失——可接受。
  - *可选增强*（非必须）：若想回收旧站少量高价值内页权重，我可从 103.66.92.229 现网爬一份旧 URL 清单，挑 top 数条加进 Caddyfile 的 301 映射（如 `/about.* → /about`）。需要再说。
- **证书签发时机**：务必先 DNS 后 reload（见步骤顺序），否则 Caddy 首次签发失败需等重试。
- **回滚**：若异常，`cp /tmp/Caddyfile.bak-* /etc/caddy/Caddyfile && systemctl reload caddy` 即可（DNS 无需回滚，因旧站已放弃）。
