#!/usr/bin/env python3
"""Generate WebP variants for every news image in assets/berita/.

For each source image `name.jpg` this creates (only when missing or older
than the source):
  name-1200.webp  (max width 1200, hero / article body)
  name-800.webp   (max width 800,  hero mobile / cards)
  name-400.webp   (max width 400,  thumbnails / rows)

Originals are never modified (they stay for og:image and the CMS).
Run from the repo root:  python3 tools/optimize_images.py
The news-publishing workflow runs this before committing so every new
article image ships with variants from day one.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "berita"
SIZES = (1200, 800, 400)
QUALITY = 68
SRC_EXTS = {".jpg", ".jpeg", ".png"}


def variant_path(src: Path, w: int) -> Path:
    return src.with_name(f"{src.stem}-{w}.webp")


def make_variant(src: Path, w: int) -> bool:
    dst = variant_path(src, w)
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        return False
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width > w:
            im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(dst, "WEBP", quality=QUALITY, method=6)
    return True


def main() -> None:
    if not IMG_DIR.is_dir():
        print(f"tidak ada folder {IMG_DIR}", file=sys.stderr)
        sys.exit(1)
    made = skipped = 0
    for src in sorted(IMG_DIR.iterdir()):
        if src.suffix.lower() not in SRC_EXTS or src.stem.endswith(
            ("-400", "-800", "-1200")
        ):
            continue
        for w in SIZES:
            if make_variant(src, w):
                made += 1
            else:
                skipped += 1
    print(f"varian dibuat: {made}, sudah mutakhir: {skipped}")


if __name__ == "__main__":
    main()
