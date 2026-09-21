#!/usr/bin/env node
/**
 * 抓取门店静态地图 + 坐标（高德 Web 服务 API）。
 *
 * ── 为什么是「构建期抓取」而不是「前端直引 URL」────────────────
 * 本站是纯静态导出（next.config.ts 的 output: "export"），没有服务端。
 * 若在前端直接拼 `https://restapi.amap.com/v3/staticmap?...&key=xxx`：
 *   - key 会明文出现在每个访客的 HTML 里；
 *   - 高德的 **Web 服务 key 只能绑 IP、绑不了域名**，等于公开送人盗刷配额。
 * 改为构建期抓一次、PNG 纳入 git，则站点运行时：零 key、零外部请求、零性能开销。
 *
 * ── 用法 ────────────────────────────────────────────────────
 *   echo "AMAP_WEB_KEY=<你的高德 Web服务 key>" >> .env.local
 *   npm run map:fetch
 *
 * ── 产物（均纳入 git，站点构建不依赖高德）──────────────────────
 *   public/map/location.png      静态地图图片
 *   src/data/geo.generated.ts    坐标（供「一键导航」URI 使用）
 *
 * ── 可选参数 ────────────────────────────────────────────────
 *   --lng 116.68 --lat 39.52   手动指定坐标（跳过地理编码，推荐用坐标拾取器核对后填入）
 *   --zoom 16                  地图级别 [1,17]，默认 16
 *   --size 750*422             图片尺寸（size 参数上限 1024*1024），默认 750*422
 *   --dry                      只打印将请求的内容，不写文件、不联网
 *
 * ⚠️ key 只从环境变量 / .env.local 读取，**绝不写入任何会被提交的文件**。
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MAP_DIR = join(ROOT, "public", "map");
const MAP_FILE = join(MAP_DIR, "location.png");
const GEO_FILE = join(ROOT, "src", "data", "geo.generated.ts");

const AMAP_STATICMAP = "https://restapi.amap.com/v3/staticmap";
const AMAP_GEOCODE = "https://restapi.amap.com/v3/geocode/geo";

/** 品牌深海蓝（见 src/app/globals.css 的 --brand） */
const BRAND_COLOR = "0x0d47a1";
/** 地图中心城市的限定范围，避免同名道路被匹配到外地 */
const CITY = "廊坊";

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const ZOOM = Number(arg("zoom", "16"));
const SIZE = arg("size", "750*422");
const DRY = argv.includes("--dry");
const MANUAL_LNG = arg("lng", null);
const MANUAL_LAT = arg("lat", null);

function fail(message) {
  console.error(`\n[map:fetch] 失败：${message}\n`);
  process.exit(1);
}

/** 高德 key 是分平台的，这里把最常见的两类错误翻译成人话 */
function explainAmapError(info, infocode) {
  if (info === "USERKEY_PLAT_NOMATCH" || infocode === "10009") {
    return [
      "该 key 的平台类型不是「Web服务」，不能调用静态地图 / 地理编码接口。",
      "",
      "  高德的 key 按平台分开授权，本脚本需要 Web服务 API 类型的 key：",
      "    高德控制台 → 应用管理 → 我的应用 → 创建应用",
      "    → 添加 Key → 服务平台选择「Web服务」",
      "",
      "  注意：Web端(JS API)、iOS、Android 类型的 key 都无法用于本脚本。",
    ].join("\n");
  }
  if (info === "INVALID_USER_KEY" || infocode === "10001") {
    return "key 无效或已删除，请到高德控制台确认。";
  }
  if (info === "DAILY_QUERY_OVER_LIMIT" || infocode === "10003") {
    return "当日调用量已超限，明天再试或到控制台提升配额。";
  }
  if (info === "USERKEY_OVER_QUOTA" || infocode === "10044") {
    return "该 key 已超配额限制。";
  }
  return `${info}（infocode ${infocode}）`;
}

function readKey() {
  const fromEnv = process.env.AMAP_WEB_KEY;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();

  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return null;
  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith("AMAP_WEB_KEY="));
  return line ? line.slice(line.indexOf("=") + 1).trim() : null;
}

function readAddress() {
  const src = readFileSync(join(ROOT, "src", "data", "company.ts"), "utf8");
  const m = /address:\s*"([^"]+)"/.exec(src);
  if (!m) fail("无法从 src/data/company.ts 读取 address 字段");
  return m[1];
}

async function amapJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const json = await res.json();
  if (json.status !== "1") {
    fail(explainAmapError(json.info, json.infocode));
  }
  return json;
}

async function geocode(address, key) {
  const url = new URL(AMAP_GEOCODE);
  url.searchParams.set("address", address);
  url.searchParams.set("city", CITY);
  url.searchParams.set("key", key);
  const json = await amapJson(url);
  const first = json.geocodes?.[0];
  if (!first) fail(`地理编码没有返回结果：${address}`);
  const [lng, lat] = first.location.split(",").map(Number);
  return { lng, lat, formatted: first.formatted_address, level: first.level };
}

async function staticMap({ lng, lat, key }) {
  const pos = `${lng.toFixed(6)},${lat.toFixed(6)}`;
  const url = new URL(AMAP_STATICMAP);
  url.searchParams.set("location", pos);
  url.searchParams.set("zoom", String(ZOOM));
  url.searchParams.set("size", SIZE);
  // scale=2 → 高清图（尺寸与视觉级别均翻倍），用于 retina 展示
  url.searchParams.set("scale", "2");
  // markers 格式：size,color,label:lng,lat（label 支持单个中文字）
  url.searchParams.set("markers", `mid,${BRAND_COLOR},美:${pos}`);
  // labels 格式：content,font,bold,fontSize,fontColor,background:lng,lat
  url.searchParams.set(
    "labels",
    `美好水业,0,1,14,0xFFFFFF,${BRAND_COLOR}:${pos}`,
  );
  url.searchParams.set("key", key);

  if (DRY) {
    const shown = new URL(url);
    shown.searchParams.set("key", "<AMAP_WEB_KEY>");
    console.log(`[dry] 静态地图请求：\n${shown.toString()}\n`);
    return null;
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("image")) {
    const text = await res.text();
    let human = text.slice(0, 200);
    try {
      const json = JSON.parse(text);
      human = explainAmapError(json.info, json.infocode);
    } catch {
      /* 非 JSON，保留原文 */
    }
    fail(`静态地图没有返回图片：${human}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function writeGeoFile({ lng, lat, formatted, level }) {
  const today = new Date().toISOString().slice(0, 10);
  const content = `/**
 * 门店坐标（GCJ-02 高德坐标系）。
 *
 * ⚠️ 本文件由 \`npm run map:fetch\` 生成；也可手工修正。
 *
 * 坐标系不可混用 —— 直接抄 GPS 或百度地图的坐标会整体偏移数百米：
 *   - 高德 / 腾讯  → GCJ-02（本文件使用）
 *   - 百度         → BD-09（需转换）
 *   - GPS 原始数据 → WGS-84（需转换）
 * 改动前请在高德「坐标拾取器」https://lbs.amap.com/tools/picker 目视核对门牌位置，
 * 坐标偏差会让客户按导航跑到错误的地点。
 */

export const geo: {
  /** 经度（GCJ-02） */
  lng: number | null;
  /** 纬度（GCJ-02） */
  lat: number | null;
  /** 地理编码返回的规范化地址，用于人工核对 */
  formatted: string;
  /** 地理编码精度（如「门牌号」「兴趣点」「道路」），精度越低越需要人工校正 */
  level: string;
  /** 生成日期 */
  fetchedAt: string;
} = {
  lng: ${lng},
  lat: ${lat},
  formatted: ${JSON.stringify(formatted)},
  level: ${JSON.stringify(level)},
  fetchedAt: ${JSON.stringify(today)},
};

/**
 * 静态地图图片是否已生成（public/map/location.png）。
 * false 时 /contact 自动降级为「地址卡片 + 一键导航」，不留死链、不显示破图。
 */
export const hasStaticMap = true;
`;
  writeFileSync(GEO_FILE, content, "utf8");
}

async function main() {
  const address = readAddress();
  console.log(`[map:fetch] 地址：${address}`);

  const hasManual = Boolean(MANUAL_LNG && MANUAL_LAT);
  const key = readKey();

  if (!key && !hasManual) {
    fail(
      [
        "未找到 AMAP_WEB_KEY，也没有用 --lng/--lat 指定坐标。",
        "",
        "  配置 key：echo \"AMAP_WEB_KEY=<你的 Web服务 key>\" >> .env.local",
        "  申请位置：高德控制台 → 应用管理 → 创建应用 → 添加 Key → 服务平台选「Web服务」",
        "",
        "  或：npm run map:fetch -- --lng 116.68 --lat 39.52 --dry",
        "      （手动给坐标 + --dry，可完全离线预览请求 URL）",
      ].join("\n"),
    );
  }
  if (!key && !DRY) {
    fail("抓取图片需要 AMAP_WEB_KEY。只做离线预览请加 --dry。");
  }

  let lng;
  let lat;
  let formatted = address;
  let level = "manual";

  if (hasManual) {
    lng = Number(MANUAL_LNG);
    lat = Number(MANUAL_LAT);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      fail("--lng / --lat 不是合法数字");
    }
    console.log(
      `[map:fetch] 使用手动坐标：${lng},${lat}（请确认已在高德坐标拾取器核对）`,
    );
  } else {
    const g = await geocode(address, key);
    lng = g.lng;
    lat = g.lat;
    formatted = g.formatted;
    level = g.level;
    console.log(
      [
        "[map:fetch] 地理编码结果：",
        `  坐标   ${lng},${lat}`,
        `  规范地址 ${formatted}`,
        `  精度   ${level}`,
        "",
        "  ⚠️ 请到 https://lbs.amap.com/tools/picker 输入该坐标目视核对门牌位置；",
        "     若与实际位置有偏差，用 `npm run map:fetch -- --lng <经度> --lat <纬度>` 重抓。",
      ].join("\n"),
    );
  }

  const png = await staticMap({ lng, lat, key });
  if (DRY) {
    console.log("[dry] 未写入任何文件。");
    return;
  }

  mkdirSync(MAP_DIR, { recursive: true });
  writeFileSync(MAP_FILE, png);
  writeGeoFile({ lng, lat, formatted, level });

  console.log(
    [
      "",
      "[map:fetch] 完成：",
      `  ${MAP_FILE.replace(ROOT, ".")}  (${(png.length / 1024).toFixed(0)} KB)`,
      `  ${GEO_FILE.replace(ROOT, ".")}`,
      "",
      "  下一步：npm run build && npm run verify:ssg，然后把这两个产物一起提交。",
    ].join("\n"),
  );
}

main().catch((err) => fail(err?.stack ?? String(err)));
