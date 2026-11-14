"""Genera los fotogramas del scroll "Del cuaderno al sistema".

Entradas (brand/sequence/src/): antes.webp y despues.webp (misma cámara), y ui/laptop.png + ui/phone.png
(interfaces reales que se proyectan en perspectiva sobre las pantallas de despues.webp).

Salida: site/public/sequence/{desktop,mobile}/NNN.webp

Transición en 4 tiempos (marca Kuska: píxeles en escalones + chakana = "juntos"):
  1. El "antes" se pixela por escalones y sus objetos se desprenden en cuadros dorados.
  2. Los cuadros se juntan en una chakana en el centro (la escena se oscurece).
  3. La chakana se deshace y los cuadros viajan a la laptop y al celular.
  4. El "después" se aclara por escalones, con las pantallas encendidas.

Uso:  python brand/sequence/build_sequence.py
"""
from pathlib import Path
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
OUT = HERE.parent.parent / "site" / "public" / "sequence"

FRAMES = 72
W, H = 1600, 900            # lienzo de trabajo
SIZES = {"desktop": (1280, 720, 68), "mobile": (640, 360, 62)}  # ancho, alto, calidad WebP
CELL = 16                   # tamaño del "píxel" de marca
GOLD = [(242, 179, 61), (184, 134, 47)]  # Oro Inti y oro profundo (tejido)

# Esquinas de las pantallas en despues.webp (1672x941): TL, TR, BR, BL
LAPTOP_QUAD = [(380, 204), (921, 185), (957, 506), (390, 556)]
PHONE_QUAD = [(1200, 284), (1336, 290), (1295, 597), (1150, 589)]

random.seed(7)


# ---------------------------------------------------------------- utilidades
def coeffs(dst, src):
    """Coeficientes para Image.transform(PERSPECTIVE): mapea el cuadrilátero dst -> rectángulo src."""
    m = []
    for (x, y), (u, v) in zip(dst, src):
        m.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        m.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    a = np.array(m, dtype=float)
    b = np.array(src, dtype=float).reshape(8)
    return np.linalg.solve(a, b).tolist()


def rounded(img, r):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.size[0] - 1, img.size[1] - 1], r, fill=255)
    img = img.convert("RGBA")
    img.putalpha(mask)
    return img


def project(base, ui, quad, radius=0, opacity=0.94):
    """Proyecta la interfaz `ui` sobre `quad` de `base` (con un poco de brillo de pantalla)."""
    ui = rounded(ui, radius) if radius else ui.convert("RGBA")
    w, h = ui.size
    c = coeffs(quad, [(0, 0), (w, 0), (w, h), (0, h)])
    warped = ui.transform(base.size, Image.PERSPECTIVE, c, Image.BICUBIC)
    alpha = warped.getchannel("A").point(lambda a: int(a * opacity))
    warped.putalpha(alpha)
    out = base.convert("RGBA")
    out.alpha_composite(warped)
    # brillo suave alrededor de la pantalla
    glow = Image.new("L", base.size, 0)
    ImageDraw.Draw(glow).polygon(quad, fill=60)
    glow = glow.filter(ImageFilter.GaussianBlur(28))
    tint = Image.new("RGBA", base.size, (242, 179, 61, 0))
    tint.putalpha(glow)
    out.alpha_composite(tint)
    return out.convert("RGB")


def mosaic(img, block):
    if block <= 1:
        return img
    small = img.resize((max(1, img.width // block), max(1, img.height // block)), Image.BILINEAR)
    return small.resize(img.size, Image.NEAREST)


def ease(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def stepped(x, steps=6):
    """Progreso en escalones (como los escalones de la chakana)."""
    x = min(1.0, max(0.0, x))
    return math.floor(x * steps) / steps


def chakana_cells(cx, cy, size):
    """Celdas (centros) que caen dentro de la chakana de 4 piezas (geometría de build_logo.py)."""
    s = size / 256
    pieces = [
        [(106.5, 123), (24, 123), (24, 90), (46, 90), (46, 68), (68, 68), (68, 46), (90, 46), (90, 24), (123, 24), (123, 106.5), (106.5, 106.5)],
        [(149.5, 123), (232, 123), (232, 90), (210, 90), (210, 68), (188, 68), (188, 46), (166, 46), (166, 24), (133, 24), (133, 106.5), (149.5, 106.5)],
        [(106.5, 133), (24, 133), (24, 166), (46, 166), (46, 188), (68, 188), (68, 210), (90, 210), (90, 232), (123, 232), (123, 149.5), (106.5, 149.5)],
        [(149.5, 133), (232, 133), (232, 166), (210, 166), (210, 188), (188, 188), (188, 210), (166, 210), (166, 232), (133, 232), (133, 149.5), (149.5, 149.5)],
    ]
    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    for p in pieces:
        d.polygon([(cx + (x - 128) * s, cy + (y - 128) * s) for x, y in p], fill=255)
    m = np.array(mask)
    cells = []
    for gy in range(0, H, CELL):
        for gx in range(0, W, CELL):
            if m[gy + CELL // 2 if gy + CELL // 2 < H else gy, gx + CELL // 2 if gx + CELL // 2 < W else gx] > 0:
                cells.append((gx, gy))
    return cells


def diff_cells(a, b, thr=38):
    """Celdas donde cambia la escena (objetos que desaparecen / aparecen)."""
    da = np.abs(np.asarray(a, dtype=np.int16) - np.asarray(b, dtype=np.int16)).mean(axis=2)
    cells = []
    for gy in range(0, H - CELL + 1, CELL):
        for gx in range(0, W - CELL + 1, CELL):
            if da[gy:gy + CELL, gx:gx + CELL].mean() > thr:
                cells.append((gx, gy))
    return cells


# ---------------------------------------------------------------- escena
def main():
    antes = Image.open(HERE / "src" / "antes.webp").convert("RGB")
    despues = Image.open(HERE / "src" / "despues.webp").convert("RGB")
    despues = project(despues, Image.open(HERE / "ui" / "laptop.png"), LAPTOP_QUAD)
    despues = project(despues, Image.open(HERE / "ui" / "phone.png"), PHONE_QUAD, radius=46, opacity=0.96)
    despues.save(HERE / "src" / "despues-ui.webp", quality=90)

    a = antes.resize((W, H), Image.LANCZOS)
    b = despues.resize((W, H), Image.LANCZOS)

    target_cells = chakana_cells(W // 2, int(H * 0.47), 432)
    n = len(target_cells)
    # Solo objetos sobre el mostrador (los estantes del fondo varían un poco entre imágenes y no deben desprenderse)
    src_pool = [c for c in diff_cells(a, b, thr=45) if c[1] > H * 0.27]
    random.shuffle(src_pool)
    # Origen: objetos del "antes" (cuaderno, recibos, nota, celular) -> dónde cambian las imágenes en la mitad inferior/izq/der
    sources = [src_pool[i % len(src_pool)] for i in range(n)]
    # Destino final: dentro de las pantallas (y el teclado) del "después"
    sx = W / 1672
    sy = H / 941
    def inside(quad, gx, gy):
        poly = [(x * sx, y * sy) for x, y in quad]
        img = Image.new("1", (1, 1))
        # prueba punto en polígono (ray casting)
        x, y = gx + CELL / 2, gy + CELL / 2
        c = False
        j = len(poly) - 1
        for i in range(len(poly)):
            xi, yi = poly[i]
            xj, yj = poly[j]
            if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi:
                c = not c
            j = i
        return c
    screen_cells = [(gx, gy) for gy in range(0, H, CELL) for gx in range(0, W, CELL)
                    if inside(LAPTOP_QUAD, gx, gy) or inside(PHONE_QUAD, gx, gy)]
    random.shuffle(screen_cells)
    finals = [screen_cells[i % len(screen_cells)] for i in range(n)]

    starts = [0.06 + 0.22 * random.random() for _ in range(n)]     # cuándo se desprende cada cuadro
    lands = [0.66 + 0.2 * random.random() for _ in range(n)]       # cuándo llega a la pantalla
    random.shuffle(target_cells)

    for size_name, (ow, oh, q) in SIZES.items():
        (OUT / size_name).mkdir(parents=True, exist_ok=True)

    for f in range(FRAMES):
        t = f / (FRAMES - 1)
        # Fondo: pixelado por escalones -> oscurecido -> "después" nítido
        if t < 0.5:
            blk = [1, 2, 4, 8, 12, 16, 24][min(6, int(stepped(t / 0.42, 6) * 6))]
            mix = ease((t - 0.36) / 0.14)
        else:
            blk = [24, 16, 12, 8, 4, 2, 1][min(6, int(stepped((t - 0.58) / 0.34, 6) * 6))] if t > 0.58 else 24
            mix = 1.0
        bg = Image.blend(mosaic(a, blk), mosaic(b, blk), mix)
        dim = 1 - 0.62 * (ease((t - 0.2) / 0.22) - ease((t - 0.6) / 0.25))
        bg = Image.eval(bg, lambda v, d=dim: int(v * d))

        d = ImageDraw.Draw(bg)
        for k in range(n):
            s0, s1 = starts[k], lands[k]
            if t < s0:
                continue
            (x0, y0), (xc, yc), (x1, y1) = sources[k], target_cells[k], finals[k]
            if t < 0.46:            # vuela a la chakana
                p = ease((t - s0) / max(0.01, 0.44 - s0))
                x = x0 + (xc - x0) * p
                y = y0 + (yc - y0) * p - math.sin(p * math.pi) * 60
            elif t < 0.6:           # chakana formada
                x, y = xc, yc
            elif t < s1:            # viaja a las pantallas
                p = ease((t - 0.6) / max(0.01, s1 - 0.6))
                x = xc + (x1 - xc) * p
                y = yc + (y1 - yc) * p - math.sin(p * math.pi) * 40
            else:
                continue            # ya aterrizó: se funde con la pantalla
            col = GOLD[(k + (int(xc) // CELL + int(yc) // CELL)) % 2]
            d.rectangle([x + 1, y + 1, x + CELL - 2, y + CELL - 2], fill=col)

        for size_name, (ow, oh, q) in SIZES.items():
            bg.resize((ow, oh), Image.LANCZOS).save(OUT / size_name / f"{f:03d}.webp", "WEBP", quality=q, method=6)
        if f % 12 == 0:
            print(f"frame {f}/{FRAMES - 1}")

    for size_name in SIZES:
        total = sum(p.stat().st_size for p in (OUT / size_name).glob("*.webp"))
        print(size_name, f"{total / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
