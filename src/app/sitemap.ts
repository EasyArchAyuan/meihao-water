import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    "",
    "/about",
    "/products",
    "/shuineighbor",
    "/contact",
    "/brands",
  ];
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
