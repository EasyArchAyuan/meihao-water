#!/usr/bin/env bash
#
# 美好水业官网 —— 服务器端拉取部署脚本（「服务器主动拉」模式）
#
# 背景：GitHub 托管 Runner 连不上本服务器的 22 端口（TCP 探针 UNREACHABLE），
#       且服务器连不上 github.com（仅 raw.githubusercontent.com 可达）。
#       因此改为：CI 把构建产物打包推到 dist 分支 → 本脚本从 raw 拉取并原子切换。
#
# 用法：
#   /usr/local/bin/mhsy-pull.sh
#   （通常由 /etc/cron.d/mhsy-pull 每 5 分钟调用一次）
#
# 行为：
#   1. 先取 64 字节的 site.sha256，与本地记录比对；相同则直接退出（几乎零开销）。
#   2. 不同则下载 site.tar.gz，校验 sha256；CDN 可能短暂返回旧包，故重试 3 次。
#      校验始终不通过就中止 —— 现网保持原样，绝不部署坏包。
#   3. 解压到临时目录，再原子切换到 /var/www/mhsy/out（旧版本保留为 out.prev）。
#
set -euo pipefail

SITE=/var/www/mhsy/out
BASE=https://raw.githubusercontent.com/EasyArchAyuan/meihao-water/dist
T=/tmp/mhsy-pull
S=/root/.mhsy-dist-sha

mkdir -p "$T"

# 1) 快速判断是否更新
wget -q --timeout=60 -O "$T/site.sha256" "$BASE/site.sha256?r=$RANDOM"
N=$(cut -d' ' -f1 "$T/site.sha256")
O=$(cat "$S" 2>/dev/null || echo "")
if [ "$N" = "$O" ]; then
  echo "no-change $N"
  exit 0
fi

# 2) 下载并校验（raw 有 CDN 缓存，可能短暂返回旧包 → 重试）
ok=0
for i in 1 2 3; do
  wget -q --timeout=180 -O "$T/site.tar.gz" "$BASE/site.tar.gz?r=$RANDOM$RANDOM" || true
  A=$(sha256sum "$T/site.tar.gz" 2>/dev/null | cut -d' ' -f1 || echo "")
  if [ "$A" = "$N" ]; then
    ok=1
    break
  fi
  sleep 5
done
if [ "$ok" != "1" ]; then
  echo "sha mismatch after retries: want=$N got=${A:-none}"
  exit 1
fi

# 3) 解压 + 原子切换
rm -rf "$T/out"
mkdir -p "$T/out"
tar xzf "$T/site.tar.gz" -C "$T/out"
test -f "$T/out/index.html"

rm -rf "${SITE}.new"
cp -a "$T/out" "${SITE}.new"
chmod -R a+rX "${SITE}.new"

if [ -d "$SITE" ]; then
  rm -rf "${SITE}.prev"
  mv "$SITE" "${SITE}.prev"
fi
mv "${SITE}.new" "$SITE"

echo "$N" > "$S"
echo "deployed $N"
