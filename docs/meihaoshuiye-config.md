# meihaoshuiye.com 上线操作手册（canonical 主域）

> 决策：meihaoshuiye.com 作为官网 2.0 的 **canonical 主域**，其余 4 个旧域名 301 永久跳转到它。
> 范围：本次仅上线域名（不含旧站 URL 继承，见末尾风险）。
> 为什么是我写、你执行：本机连不上你的 DNSPod 与服务器 22 端口（与现有「服务器主动拉」部署模型一致），DNS 改解析与 Caddy reload 需你在对应控制台/服务器上完成。

## 仓库侧已完成的改动（已 commit 前请 review）
- `src/data/site.ts`：`domain` / `url` → `meihaoshuiye.com` / `https://meihaoshuiye.com`（canonical 全站自动传导：seo/sitemap/robots/JSON-LD 均读 `site.url`）。
- `infra/Caddyfile`：
  - 新增主站块 `meihaoshuiye.com, www.meihaoshuiye.com` → 静态根 `/var/www/mhsy/out`，`tls` 自动签发。
  - 旧 4 域名块改为 `redir https://meihaoshuiye.com{uri} permanent`（共用原共享证书）。
- 未动：`src/data/media.ts` 的 `img.meihaowater.site`（图片 CDN，独立子域、走 `*.meihaowater.site` 共享证书，保留）。

## 执行顺序（重要：先切 DNS，再 reload Caddy）
证书走 ACME `tls-alpn-01`，**校验时 CA 会解析 DNS 到 49.233.87.42 做 443 挑战**。
若先 reload Caddy 而 DNS 还指向旧 IP，证书签发会失败。故顺序固定为：

### 步骤 1 · DNSPod 改解析（腾讯云控制台）
在 DNSPod / 腾讯云 DNS 解析控制台，把 `meihaoshuiye.com` 的解析改为：
- 主机记录 `@`（裸域）：类型 `A`，记录值 `49.233.87.42`，TTL 建议先设 `600`（10 分钟，便于回滚）。
- 主机记录 `www`：类型 `A`，记录值 `49.233.87.42`。
- 删除/替换原先指向 `103.66.92.229` 的记录（旧 IIS 站随之离线，符合预期）。

> 旧域名（meihaowater.site / 廊坊美好水业.online）的解析**保持不动**（仍指向 49.233.87.42，共享证书已覆盖）。

### 步骤 2 · 等解析生效
本地验：
```bash
nslookup -type=A meihaoshuiye.com      # 应返回 49.233.87.42
nslookup -type=A www.meihaoshuiye.com  # 应返回 49.233.87.42
```
全球生效可能 5–30 分钟，以本地 `nslookup` 看到 49.233.87.42 为准（可多查几次）。

### 步骤 3 · 服务器应用新 Caddyfile（49.233.87.42）
SSH 登录服务器后：
```bash
# 0) 先备份
cp /etc/caddy/Caddyfile /tmp/Caddyfile.bak-$(date +%s)

# 1) 用最新仓库的 infra/Caddyfile 覆盖（下面给完整内容，粘贴或 scp 均可）
#    推荐：从本机把文件 base64 后粘贴（避免中文/格式错乱）
#    本机：  base64 -w0 infra/Caddyfile
#    服务器：echo '<BASE64>' | base64 -d | tee /etc/caddy/Caddyfile

# 2) 校验（必须 0 错误）
caddy validate --config /etc/caddy/Caddyfile

# 3) 热加载（不中断现网）
systemctl reload caddy
```
> 若 `caddy validate` 报证书相关错误，通常是 DNS 未完全生效，回到步骤 2 再等；不要强行 reload。

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
- **旧站 URL 404**：用户本次选择「仅上线域名」。旧 2023 站（103.66.92.229）原有页面切 DNS 后失效，若百度已收录这些旧 URL，会逐步 404 丢权重。建议后续做一次「旧 URL → 新站对应页 301」映射（需先抓取旧站 URL 清单，可上线前从 103.66.92.229 现网爬取）。
- **证书签发时机**：务必先 DNS 后 reload（见步骤顺序），否则 Caddy 首次签发失败需等重试。
- **回滚**：若异常，`cp /tmp/Caddyfile.bak-* /etc/caddy/Caddyfile && systemctl reload caddy`，并把 DNS 改回 `103.66.92.229`（如需临时恢复旧站）。
