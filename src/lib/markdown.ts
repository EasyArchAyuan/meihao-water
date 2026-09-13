/**
 * 极简 Markdown 渲染（零第三方依赖）。
 *
 * 支持语法：## / ### 标题、段落、- 与 1. 列表、> 引用、--- 分隔线、
 * **加粗**、*斜体*、[文字](链接)。其余按纯文本处理。
 *
 * 安全：先做 HTML 转义再渲染行内标记，避免正文里的尖括号破坏页面结构。
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 行内标记：**加粗** *斜体* [文字](链接) */
function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t: string, u: string) => {
      // 只放行站内绝对路径与 http(s) 外链，其余一律丢弃 href，防注入
      const href = u.startsWith("/") || /^https?:\/\//.test(u) ? u : "#";
      return `<a href="${href}">${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

export function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      const tag = list.ordered ? "ol" : "ul";
      out.push(`<${tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${tag}>`);
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      out.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      quote = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushAll();
      continue;
    }
    if (/^(---|\*\*\*)$/.test(line)) {
      flushAll();
      out.push("<hr />");
      continue;
    }
    if (/^###\s+/.test(line)) {
      flushAll();
      out.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      flushAll();
      out.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s?/, ""));
      continue;
    }
    const ol = /^\d+\.\s+/.exec(line);
    const ul = /^[-*]\s+/.exec(line);
    if (ol || ul) {
      flushParagraph();
      flushQuote();
      const ordered = Boolean(ol);
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push(line.replace(ol ? /^\d+\.\s+/ : /^[-*]\s+/, ""));
      continue;
    }
    flushList();
    flushQuote();
    paragraph.push(line);
  }
  flushAll();
  return out.join("\n");
}
