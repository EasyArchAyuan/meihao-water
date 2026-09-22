# 百度：加速收录新站 + 放弃旧站数据

> 结论先行版。配套素材：`docs/baidu-old-urls.txt`（旧 URL 清单）、`scripts/baidu-push.mjs`（主动推送脚本）。
> 数据来源：Wayback Machine CDX（188 条归档记录，182 条 HTTP 200），2026-09-22 实测。

---

## 一、先厘清一个关键事实

**旧站 `meihaoshuiye.com`（2023/IIS 虚拟主机）和新站是同一个域名。**

所以这**不是「换域名」，而是「同域名换站」**。差别很大：

| | 换域名 | 同域名换站（你的情况） |
|---|---|---|
| 百度认知 | 新域是全新站点，需重建立信任 | 域名已有历史与权重，**天然继承** |
| 首页权重 | 需 301 迁移 | 直接延续，无需操作 |
| 旧 URL | 301 到新域 | 现在全部 **404**（已实测确认） |
| 索引更新 | 需「网站改版」工具 | 百度重新抓取即可，改动更轻 |

**好消息**：旧 URL 返回的是**真 404**（不是 200 软 404），这是百度删除索引的**正确信号**，不会拖累新站质量分。

---

## 二、实测诊断

| 检查项 | 现状 | 判断 |
|---|---|---|
| 旧站页面类 URL 状态码 | **404**（如 `/tongzhuangshuixilie-32.html`、`/news/486.html`、`/product/tzsxl/`） | ✅ 正确，非软 404 |
| 404 页面响应体 | **0 字节、无 `content-type`** | ⚠️ **需修**：空 404 会被百度当「异常/临时故障」，拖慢删除 |
| 旧 URL 是否 410 | 否，是 404 | ⚠️ 可升级为 **410 Gone** 加速清除 |
| `sitemap.xml` | 24 条，**不带尾斜杠** | ⚠️ **已修**：与 `trailingSlash:true` 不一致，每条多一跳 308 |
| `robots.txt` | `Allow: /` + `Host` + `Sitemap` 均指向新域 | ✅ |
| canonical / og:url | 全部 `https://meihaoshuiye.com/` | ✅ |
| 百度站长平台验证文件 | **不存在**（`public/` 下那个 `.txt` 不是百度格式） | ❌ 必须补 |
| ICP 备案号 | `company.icp` 仍是 `"TODO: ICP备案完成后填写"` | ❌ **前提条件** |
| 旧域名 301 | 4 个（meihaowater.site / IDN / 各自 www）→ `https://meihaoshuiye.com` | ✅ |

---

## 三、决定「多快」的其实是三件事

百度换站的速度**不取决于 410**，而取决于：

1. **备案 → 有没有资格被收录**（第 0 步，一票否决）
2. **站长平台验证 + 主动推送 → 新页面多快被抓**（分钟级）
3. **旧 URL 状态码 + 死链提交 → 旧数据多快被删**（天级 vs 月级）

### 第 0 步：ICP 备案接入（**卡点，先办**）

⚠️ **同域名换了服务器，必须办「备案接入变更」。**

你的站从原虚拟主机（`103.66.92.229`，物理路径 `d:\freehost\meihaoshuiye\web\`）迁到了腾讯云（`49.233.87.42`）。按工信部规则，备案是「域名 + 主体 + 接入商」三者绑定：

- 域名没变、主体没变 → **原备案号大概率仍有效**
- 但**接入商变了** → 需在腾讯云做**接入备案**，否则备案可能被注销
- 备案一旦注销 → 百度**降权甚至不收录**，前面所有优化归零

**动作**：登录腾讯云 → 备案控制台 → 查 `meihaoshuiye.com` 备案状态；若显示「未接入腾讯云」，走「接入备案」流程（腾讯云初审 1–2 天，管局 1–20 工作日）。
拿到备案号后填进 `src/data/company.ts` 的 `icp` 字段（全站 footer 自动生效）。

### 第 1 步：百度站长平台（决定新页面收录速度）

1. 打开 `ziyuan.baidu.com` → 添加站点 `meihaoshuiye.com`
2. **验证归属**：推荐用「HTML 标签验证」或「文件验证」
   - 文件验证：把百度给的文件放到 `public/` 下（如 `public/baidu_verify_code-xxxx.html`），构建部署后即可验证通过
3. **提交 sitemap**：`https://meihaoshuiye.com/sitemap.xml`
4. **普通收录 → 主动推送**：拿到 `token`，用 `scripts/baidu-push.mjs` 推送（见下）
5. 顺手做一次「抓取诊断」，手动触发百度来抓首页

> 主动推送是**唯一能到分钟级**的手段。sitemap 是「等百度来」，推送是「告诉百度来」。

### 第 2 步：旧数据清除（决定旧索引多快消失）

| 手段 | 生效速度 | 说明 |
|---|---|---|
| 什么都不做（停在 404） | 数周 ~ 数月 | 百度自然淘汰，最慢 |
| **旧 URL 升级为 410 Gone** | 数天 | 410 = 永久消失，比 404 更明确，百度优先清理 |
| **站长平台「死链提交」** | 数天 ~ 2 周 | 直接告诉百度「这些别留了」，用 `docs/baidu-old-urls.txt` |
| 死链提交 + 410 双管 | 数天 | 推荐组合 |

⚠️ 两条铁律：
- **不要**把旧 URL 301 到首页（会被判「软 404 / 作弊」，比 404 更糟）
- **不要**让旧 URL 返回 200 空页（soft 404，最糟）

---

## 四、旧 URL 处理：两种策略，请二选一

### 策略 A：全量放弃（你当前的选择）

约 110 条页面类旧 URL **全部 410**，配合死链提交。

- ✅ 最干净、最快、维护成本为零
- ❌ **代价**：旧站栏目页积累的商业词排名**直接清零**

旧站栏目名本身就是有搜索量的词，这些是 2013–2020 年积累的资产：

| 旧栏目 | 对应中文词 |
|---|---|
| `/tongzhuangshuixilie/` | 桶装水系列 |
| `/pingzhuangshuixilie/` | 瓶装水系列 |
| `/maishuizengjixilie/` | 买水赠机系列 |
| `/langfangtongzhuangshuipeisong/` | **廊坊桶装水配送** |
| `/langfangtongzhuangshuipeisonggongsi/` | **廊坊桶装水配送公司** |
| `/langfangpinpaitongzhuangshuixiaoshou/` | **廊坊品牌桶装水销售** |
| `/langfangtongzhuangshuirongyuzizhi/` | 廊坊桶装水荣誉资质 |
| `/langfangtongzhuangshuiqiyewenhua/` | 廊坊桶装水企业文化 |

### 策略 B：栏目级 301 继承 + 其余 410（**更推荐**）

把这批栏目页 **301 到新站语义最近的页面**，等于让新站直接接管旧词的排名；文章页与垃圾页再 410。

这**完全符合「以新站为准」**——301 的目的就是让新站接管，用户访问旧链接会直接落到新站对应页。

| 旧 URL 前缀 | → 新站目标 | 语义 |
|---|---|---|
| `/tongzhuangshuixilie/`、`-32..43.html` | `/products/` | 桶装水系列 |
| `/pingzhuangshuixilie/`、`-37..60.html` | `/products/` | 瓶装水系列 |
| `/maishuizengjixilie/`、`-51..59.html` | `/products/` | 买水赠机 |
| `/product/tzsxl/`、`/product/pzsxl/`、`/product/mszjxl/`、`/product/products/` | `/products/` | 产品分类 |
| `/pzsxl/*.html`、`/tzsxl/*.html` | `/products/` | 产品详情 |
| `/langfangtongzhuangshuipeisong/` | `/langfang/` | 廊坊配送 |
| `/langfangtongzhuangshuipeisonggongsi/` | `/langfang/` | 配送公司 |
| `/langfangpinpaitongzhuangshuixiaoshou/` + 分页 | `/products/` | 品牌销售 |
| `/langfangtongzhuangshuizuixinyouhui/` | `/products/` | 最新优惠 |
| `/langfangtongzhuangshuichangjialiuyan/`（含 `/web/` 变体） | `/contact/` | 厂家留言 |
| `/langfangtongzhuangshuizixungoumai/` | `/contact/` | 咨询购买 |
| `/langfangtongzhuangshuirongyuzizhi/` | `/about/` | 荣誉资质 |
| `/langfangtongzhuangshuiqiyewenhua/` | `/about/` | 企业文化 |
| `/jianjie/index.html`、`/wenhua/index.html` | `/about/` | 简介 / 文化 |
| `/lianxi/index.html`、`/gcal/index.html`、`/web/check.php` | `/contact/` | 联系 |
| `/wenti/index.html` | `/faq/` | 常见问题 |
| `/xswl/index.html` | `/langfang/` | 销售网络 |
| `/langfangtongzhuangshuidongtai/` + 分页 | `/news/` | 企业动态 |
| `/news/index.html`、`/news/486..563.html` | `/news/` | 新闻 |
| `/wahahatongzhuangshui-*.html`、`/yibaopingzhuang*.html` | `/brands/` | 品牌介绍（娃哈哈 / 怡宝） |

其余无法判断语义的拼音文章页（`dnhdfmn73`、`lftzs77` 等）→ **410**。

> 建议：**策略 B 的栏目部分（约 45 条）+ 其余 410**。映射表就上面这张，不猜、不硬凑——语义不对的宁可 410，无关 301 会被百度判无效。

---

## 五、Caddy 规则草案（待确认后应用）

服务器配置变更，**确认后再动**。三块改动，加在主站 block 内：

```
meihaoshuiye.com, www.meihaoshuiye.com {
    import headers_cache
    root * /var/www/mhsy/out

    # ① 旧 URL → 新站 301（策略 B 用；策略 A 删掉整块）
    map {path} {legacy} {
        "/tongzhuangshuixilie/"            "/products/"
        "/tongzhuangshuixilie,4,0/"        "/products/"
        "/langfangtongzhuangshuipeisong/"  "/langfang/"
        "/langfangtongzhuangshuipeisonggongsi/" "/langfang/"
        "/jianjie/index.html"              "/about/"
        "/lianxi/index.html"               "/contact/"
        "/wenti/index.html"                "/faq/"
        "/news/index.html"                 "/news/"
        default ""
    }
    @legacy expression {legacy} != ""
    redir @legacy https://meihaoshuiye.com{legacy} permanent

    # ② 其余旧 URL → 410 Gone（明确「永久消失」，加速百度删除）
    #    ⚠️ 必须排除各搜索引擎的站点验证文件，否则验证随时失效、收录中断
    @gone {
        path *.html *.asp *.php /templates/* /images/* /upload/* /userFile/* /web/* /adapters/*
        not path /baidu_verify_* /google*.html /BingSiteAuth.xml /sogou_verify_* /360_verify_* /so_verify_*
    }
    respond @gone "410 Gone" 410

    file_server

    # ③ 修空 404：保持 404 状态码，但返回真实页面
    handle_errors {
        @n404 expression {err.status_code} == 404
        rewrite @n404 /404.html
        file_server
    }
}
```

要点：
- Caddy 指令顺序是 `map → redir → respond`，所以 301 先命中、410 兜底，互不打架
- `@gone` 的 `*.html` 不会误伤新站：Next 静态导出页面 URL 都是 `/xxx/`（目录式），新站没有对外 `.html` 页面
- `handle_errors` 让 404 有内容但**状态码仍是 404**（不是软 404）

---

## 六、时间预期（务实）

| 事项 | 预期 |
|---|---|
| 主动推送后被抓取 | 分钟 ~ 数小时 |
| 新页面被收录 | 1 ~ 3 天（受备案与站点权重影响） |
| 全站 sitemap 抓完 | 3 ~ 7 天 |
| 旧 URL 从索引消失（410 + 死链提交） | 3 天 ~ 2 周 |
| 旧 URL 从索引消失（只靠 404） | 数周 ~ 数月 |
| ICP 接入备案 | 腾讯云初审 1–2 天，管局 1–20 工作日 |

**百度没有「立刻生效」的开关**。能压缩的是「抓取」环节（主动推送），清不掉的是「管局审核」和「百度的重估周期」。

---

## 七、待办清单

**你做（我无法代做）**
- [ ] 腾讯云备案控制台 → 确认 / 办理 `meihaoshuiye.com` **接入备案**
- [ ] 百度站长平台 → 添加站点 + 验证归属（拿到验证文件后我负责放进 `public/`）
- [ ] 百度站长平台 → 提交 sitemap + 拿主动推送 `token`（给我，或你自己跑脚本）
- [ ] 百度站长平台 → 死链提交，上传 `docs/baidu-old-urls.txt`
- [ ] 拿到备案号后填 `src/data/company.ts` 的 `icp`

**我做（确认即执行）**
- [x] 修 `sitemap.xml` 尾斜杠（已改，待发布）
- [ ] 应用 Caddy 规则（404 修复 + 410 + 可选 301）——**需你确认策略 A / B**
- [ ] 验证文件放进 `public/`（等你从站长平台拿到）
- [ ] 填备案号（等你拿到）

---

## 八、风险与提醒

- ⚠️ **备案是最大变数**。若原备案已注销或未做接入，百度会降权，其余优化全部打折。
- ⚠️ **策略 A 的隐性损失**：旧栏目词的排名不会转移，只能靠新站内容重新竞争，周期以月计。
- ⚠️ 410 不可逆：一旦对某 URL 返回 410，百度会较快删除其索引与关联权重。确认映射无误再上。
- ⚠️ 服务器配置变更前先备份 Caddyfile（现有备份在 `/tmp/Caddyfile.bak*-*`）。

---

## 九、站长平台「验证失败：无法连接到您网站的服务器」排查记录

**现象**（2026-09-22）：文件验证点了「完成验证」，百度返回
「原因：无法连接到您网站的服务器。问题分析&解决办法：请检查网站是否能正常访问……网络或者线路问题」。

**这是典型的「我通、百度不通」类问题**，必须逐层排除。已做的实测：

| 层级 | 实测结果 | 结论 |
|---|---|---|
| DNS（多解析器） | `223.5.5.5` / `119.29.29.29` / **`180.76.76.76`（百度自己的 DNS）** / `8.8.8.8` 均返回 `49.233.87.42`，且**无 AAAA 记录** | ✅ 排除解析与 IPv6 残留 |
| 云防火墙 | 80 / 443 对 `0.0.0.0/0` ACCEPT | ✅ 排除端口封锁 |
| 服务监听 | Caddy active，`:80` / `:443` 均在听 | ✅ |
| 80 端口 | 返回 **308** → https | ⚠️ **308 是重点怀疑对象**，百度只认 301 |
| 443 直连 | 验证文件 200，`canonical`/`sitemap` 正常 | ✅ |
| 境外线路 | 走代理出口同样 200 | ✅ 排除单线路故障 |
| 证书链 | `leaf → YE2 → Root YE → ISRG Root X2`，**Caddy 只下发 3 张**；而 `/etc/ssl/shared/fullchain.pem` 有 **4 张**（多一张 `ISRG Root X2 ← ISRG Root X1` 交叉签名） | ⚠️ **潜在风险**：只信任 `ISRG Root X1` 的老旧信任库（百度蜘蛛信任库滞后）无法构建链，握手失败会被报成「无法连接」 |
| 访问日志 | `/var/log/caddy/` **为空** —— 本站此前没配日志 | ❌ 之前无法判断百度到底有没有摸到服务器 |

**本轮据此做的两项修改**（`infra/Caddyfile`）：

1. **80 端口 308 → 301**：Caddy 自动 HTTPS 跳转默认用 308；改为显式 `http://` 站点块 + `redir ... permanent`（301）。
2. **访问日志**：全局 `log` → `/var/log/caddy/access.log`（JSON，20 MiB × 5 滚动）。
   拿到地面真相的命令：
   ```bash
   grep -i baiduspider /var/log/caddy/access.log | tail
   grep baidu_verify      /var/log/caddy/access.log | tail
   ```
   另有 **80 端口直出**验证文件（不跳转）的例外规则，让文件验证不必依赖 TLS 握手 ——
   既是保险，也是诊断：若直出后验证通过，即可确认瓶颈在 TLS/443。

**判读规则**（点了「完成验证」之后）：

| 日志里看到什么 | 说明 | 下一步 |
|---|---|---|
| 有 `Baiduspider` 访问记录，且状态 200 | 链路完全通，百度侧误报 | 直接再点一次「完成验证」 |
| 有请求但状态非 200 | 服务器有拦截/规则冲突 | 按具体状态码修 |
| **完全没有任何百度请求** | 腾讯云备案拦截或线路级不可达 | 优先办「接入备案」，并提工单给腾讯云 |

**遗留风险（尚未处理）**：证书链缺 `ISRG Root X1` 交叉签名。
若上表落到「完全没有请求」之外的其它情况，下一步可考虑：
- 让 Caddy 走兼容链：`tls { preferred_chains { root_common_name "ISRG Root X1" } }`（需验证 ACME 是否提供该链）；
- 或直接换用**国内 CA 证书**（腾讯云免费 SSL，TrustAsia / DigiCert 签发）——
  百度对国内 CA 的信任库兼容性最好，这也是「百度 SEO 技术清单」里
  `SSL certificate: Domestic CA recommended` 的原始出处。
  代价：失去 Caddy 自动续期，改为一年一次手动换证。
