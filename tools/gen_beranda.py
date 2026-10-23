#!/usr/bin/env python3
"""Generate the slim homepage index data/beranda.json from data/berita.json.

The homepage (assets/beranda.js) only needs metadata + a short excerpt,
not the full article body (~577 KB). This emits one entry per article with:
title, slug, category, breaking, author, published_at, image, image_w,
image_h (real pixel dimensions, used for width/height attributes so the
layout never shifts), and excerpt (~220 chars of the body).

Run from the repo root:  python3 tools/gen_beranda.py
The news-publishing workflow runs this (via tools/publish_assets.py)
whenever berita.json changes.
"""
import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "berita.json"
DST = ROOT / "data" / "beranda.json"


def excerpt(body: str, n: int = 220) -> str:
    b = re.sub(r"\s+", " ", str(body or "")).strip()
    return b[:n].rsplit(" ", 1)[0] + "…" if len(b) > n else b


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    out = []
    for it in data.get("items", []):
        row = {
            "title": it.get("title", ""),
            "slug": it.get("slug", ""),
            "category": it.get("category", ""),
            "breaking": bool(it.get("breaking", False)),
            "author": it.get("author", ""),
            "published_at": it.get("published_at", ""),
            "image": it.get("image", ""),
            "excerpt": excerpt(it.get("body", "")),
        }
        img = ROOT / str(it.get("image", ""))
        if img.is_file():
            try:
                with Image.open(img) as im:
                    row["image_w"], row["image_h"] = im.size
            except Exception:
                pass
        out.append(row)
    DST.write_text(
        json.dumps({"items": out}, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"beranda.json: {len(out)} item, {DST.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
