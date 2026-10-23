#!/usr/bin/env python3
"""One command for everything the publish flow must refresh after
data/berita.json changes: image WebP variants, the slim homepage index,
and the sitemap. Run from the repo root:  python3 tools/publish_assets.py
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

for step in ("optimize_images.py", "gen_beranda.py", "gen_sitemap.py"):
    print(f"== {step}")
    r = subprocess.run(
        [sys.executable, str(ROOT / "tools" / step)], cwd=ROOT
    )
    if r.returncode != 0:
        sys.exit(f"gagal di {step}")
print("semua aset terbit selesai")
