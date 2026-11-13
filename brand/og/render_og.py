"""Renderiza brand/og/og.html a PNG 1200x630 (ES y EN) y los copia a site/public/brand/.

Uso:  python brand/og/render_og.py
Requiere Microsoft Edge o Google Chrome instalado (modo headless) y `npm install` hecho en site/ (fuentes).
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent.parent / "site" / "public" / "brand"

CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
]


def browser() -> str:
    for c in CANDIDATES:
        if Path(c).exists():
            return c
    for name in ("msedge", "google-chrome", "chromium", "chrome"):
        found = shutil.which(name)
        if found:
            return found
    sys.exit("No se encontró Edge ni Chrome.")


def main() -> None:
    exe = browser()
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for lang in ("es", "en"):
        out = HERE / f"og-{lang}.png"
        url = (HERE / "og.html").as_uri() + f"?lang={lang}&url=kuskalabs.com"
        with tempfile.TemporaryDirectory() as profile:
            subprocess.run(
                [exe, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
                 f"--user-data-dir={profile}", "--force-device-scale-factor=1", "--window-size=1200,630",
                 "--virtual-time-budget=3000", f"--screenshot={out}", url],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90,
            )
        shutil.copy(out, PUBLIC / out.name)
        print("wrote", out, "->", PUBLIC / out.name)


if __name__ == "__main__":
    main()
