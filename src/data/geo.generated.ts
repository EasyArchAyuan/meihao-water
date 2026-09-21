/**
 * 门店坐标（GCJ-02 高德坐标系）。
 *
 * ⚠️ 本文件由 `npm run map:fetch` 生成；也可手工修正。
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
  lng: 116.74647,
  lat: 39.554991,
  formatted: "河北省廊坊市广阳区北凤道399号",
  level: "门址",
  fetchedAt: "2026-09-21",
};

/**
 * 静态地图图片是否已生成（public/map/location.png）。
 * false 时 /contact 自动降级为「地址卡片 + 一键导航」，不留死链、不显示破图。
 */
export const hasStaticMap = true;
