# 美好水业官网 — Lighthouse 部署指南

目标：把 Next.js 16 静态导出站点部署到腾讯云 Lighthouse 实例。

## 当前生产实例

| 项 | 值 |
|---|---|
| 实例 ID | `lhins-jrsby4oa` |
| 地域 | ap-beijing / ap-beijing-3 |
| 公网 IP | `49.233.87.42` |
| OS | Ubuntu 24.04 noble |
| 规格 | 2C / 2GB / 50GB SSD |
| 域名 | 暂未绑定（HTTP only） |
| 部署路径 | `/var/www/mhsy/out` |
| Web Server | Caddy（系统默认） |

## 首次部署

### 1. 一次性初始化

通过腾讯云控制台 → Lighthouse → 实例 → 执行命令（或 SSH）：

```bash
# 装 curl（系统自带但确认）+ git
apt-get update && apt-get install -y curl git

# Node 22 通过 NodeSource 源预装；如未装：
# curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
# apt-get install -y nodejs

node -v && npm -v   # 确认 v22.x
```

### 2. clone + build

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/EasyArchAyuan/meihao-water.git mhsy
cd mhsy
npm ci
npm run build      # 产出 out/（约 2 MB）
```

### 3. 写 Caddy 配置

把仓库里的 `infra/Caddyfile` 复制到 `/etc/caddy/Caddyfile`（覆盖默认）：

```bash
cp infra/Caddyfile /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
```

### 4. 放行 80 端口

腾讯云控制台 → Lighthouse → 实例 → 防火墙 → 添加规则：

| Protocol | Port | Cidr Block | Action |
|---|---|---|---|
| TCP | 80 | 0.0.0.0/0 | ACCEPT |

或用 `mcp__lighthouse-ops__create_firewall_rules` API 自动化。

### 5. 验证

```bash
curl -sI http://127.0.0.1/
curl -sI http://49.233.87.42/
curl -s http://49.233.87.42/ | grep -c "廊坊市美好商贸有限公司"
curl -sI http://49.233.87.42/sitemap.xml
```

## 后续更新（重新部署）

```bash
cd /var/www/mhsy
git pull origin main
npm run build      # 重新生成 out/
systemctl reload caddy
```

`git pull` 会保留 Caddyfile / package.json 等配置文件（除非被改过）。
**不要**在服务器上 `git reset --hard` —— 会清掉本地 `out/`。

## HTTPS（待办）

如果后续要上 HTTPS：

1. 把域名 `meihaoshuiye.cn` 解析到 `49.233.87.42`（A 记录）
2. 改 Caddyfile 把 `:80` 替换为域名：
   ```caddy
   meihaoshuiye.cn, www.meihaoshuiye.cn {
       root * /var/www/mhsy/out
       file_server
       # 其他配置
   }
   ```
3. `systemctl reload caddy` —— Caddy 会自动通过 ACME (Let's Encrypt) 签证书
4. 在 Lighthouse 防火墙添加 TCP 443 ACCEPT 规则

## 监控 / 备份（待办）

- **监控**：Lighthouse 控制台 → 监控告警 → 加规则（CPU > 80%、内存 > 80%、磁盘 > 80%）
- **备份**：定时 `tar czf /backup/mhsy-$(date +%F).tar.gz -C /var/www mhsy` 然后 `coscli cp` 到腾讯云 COS
- **日志**：`journalctl -u caddy -f`（无需 tail -f）

## 回滚

```bash
# 1. 退回到上一版本
cd /var/www/mhsy && git checkout HEAD~1
npm run build
systemctl reload caddy

# 2. 完全清掉部署（慎重）
rm -rf /var/www/mhsy
# 删 Caddy 站点
echo ':80 { root * /usr/share/caddy file_server }' > /etc/caddy/Caddyfile
systemctl reload caddy
# 删防火墙规则（控制台操作）
```

## 故障排查

| 症状 | 排查 |
|---|---|
| 外网访问 502 | `curl http://127.0.0.1/`，若 200 则防火墙问题 |
| Caddy reload 失败 | `caddy validate --config /etc/caddy/Caddyfile` 看错误 |
| build 失败（找不到 @tailwindcss/postcss） | 需 `npm ci`（带 devDependencies），不能 `--omit=dev` |
| Caddy 配置改后没生效 | `systemctl status caddy`；`journalctl -u caddy -n 30` |
| github.com 拉不动 | 检查 Lighthouse 是否能访问外网；DNS 是否被污染 |