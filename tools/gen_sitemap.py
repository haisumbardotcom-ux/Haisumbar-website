#!/usr/bin/env python3
"""Generate sitemap.xml from data/berita.json.

Run from the repo root:  python3 tools/gen_sitemap.py
Re-run whenever berita.json changes (the news-update workflow does this
before committing) so the sitemap always lists every article.
"""
import json
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://haisumbar.com"


def main() -> None:
    data = json.loads((ROOT / "data" / "berita.json").read_text(encoding="utf-8"))
    items = data.get("items", [])

    def day(ts: str) -> str:
        return str(ts)[:10]

    latest = max((day(it.get("published_at", "")) for it in items), default="")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        "  <url>",
        f"    <loc>{BASE}/</loc>",
    ]
    if latest:
        lines.append(f"    <lastmod>{latest}</lastmod>")
    lines += [
        "    <changefreq>hourly</changefreq>",
        "    <priority>1.0</priority>",
        "  </url>",
    ]
    for it in items:
        slug = it.get("slug")
        if not slug:
            continue
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(f'{BASE}/artikel.html?slug={slug}')}</loc>")
        pub = day(it.get("published_at", ""))
        if pub:
            lines.append(f"    <lastmod>{pub}</lastmod>")
        lines.append("    <priority>0.8</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")

    out = ROOT / "sitemap.xml"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"sitemap.xml written: {len(items)} articles + homepage")


if __name__ == "__main__":
    main()
