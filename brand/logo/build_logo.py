"""Generador del logo de Kuska Labs (chakana en piezas + wordmark geométrico).

Uso:  python build_logo.py      -> escribe los SVG maestros en ./final/
Todo es geometría construida (sin texto vivo ni fuentes), en un lienzo de 256 de alto.
"""
from pathlib import Path

OUT = Path(__file__).parent / "final"

# ---------- Paleta ----------
NEGRO = "#0B0B0F"   # Negro Kuska (fondo principal)
ORO = "#F2B33D"     # Oro Inti (símbolo sobre fondo oscuro)
ORO_OSC = "#A86A00"  # Oro profundo (símbolo sobre fondo claro)
HUESO = "#F4F2EE"   # Blanco hueso (texto sobre oscuro)
PIEDRA = "#8B8B94"  # Gris piedra ("labs" sobre oscuro)
PIEDRA_OSC = "#5E5E66"  # Gris piedra oscuro ("labs" sobre claro)

# ---------- Símbolo: chakana en 4 piezas ----------
# Retícula de 9 x 9 módulos (u = 22). Puntas de 1/3 del ancho, 3 escalones, hueco central.
U = 22
HALF = 4.5 * U  # 99


def _quarter(h):
    """Contorno de la pieza superior-izquierda en coordenadas locales (a = hacia la izquierda, b = hacia arriba)."""
    return [(h, 0), (HALF, 0), (HALF, 1.5 * U), (3.5 * U, 1.5 * U), (3.5 * U, 2.5 * U), (2.5 * U, 2.5 * U),
            (2.5 * U, 3.5 * U), (1.5 * U, 3.5 * U), (1.5 * U, HALF), (0, HALF), (0, h), (h, h)]


def _fmt(v):
    v = round(v, 2)
    return str(int(v)) if v == int(v) else str(v)


def _poly(pts):
    return "M" + " L".join(f"{_fmt(x)} {_fmt(y)}" for x, y in pts) + " Z"


def symbol_paths(gap=10, hole=16.5, cx=128, cy=128, scale=1.0):
    """Cuatro piezas separadas por una cruz de `gap` unidades; hueco central de semilado `hole`."""
    d = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            pts = []
            for a, b in _quarter(hole):
                x = cx + sx * (gap / 2 + a) * scale
                y = cy + sy * (gap / 2 + b) * scale
                if not pts or pts[-1] != (x, y):
                    pts.append((x, y))
            if pts[0] == pts[-1]:
                pts.pop()
            d.append(_poly(pts))
    return " ".join(d)


# ---------- Wordmark: letras geométricas cuadradas ----------
# Coordenadas con línea base en y=0, altura x = 120, ascendente = 180, trazo = 26.
LETTERS = {
    # k en un solo contorno (sin solapes: el wordmark usa evenodd); brazos a 45°
    "k": (105, ["M0 -180 L26 -180 L26 -78 L68 -120 L105 -120 L45 -60 L105 0 L68 0 L26 -42 L26 0 L0 0 Z"]),
    "u": (96, ["M0 -120 L26 -120 L26 -26 L70 -26 L70 -120 L96 -120 L96 0 L0 0 Z"]),
    "s": (92, ["M0 -120 L92 -120 L92 -94 L26 -94 L26 -73 L92 -73 L92 0 L0 0 L0 -26 L66 -26 L66 -47 L0 -47 Z"]),
    "a": (92, ["M0 -120 L92 -120 L92 0 L0 0 L0 -73 L66 -73 L66 -94 L0 -94 Z M26 -47 L26 -26 L66 -26 L66 -47 Z"]),
    "l": (26, ["M0 -180 L26 -180 L26 0 L0 0 Z"]),
    "b": (92, ["M0 -180 L26 -180 L26 -120 L92 -120 L92 0 L0 0 Z M26 -94 L26 -26 L66 -26 L66 -94 Z"]),
}
# Espaciado óptico (después de cada letra)
KERN = {"k": 16, "u": 20, "s": 20, "a": 20, "l": 30, "b": 30}


def _transform_path(d, dx, dy, s):
    out, nums, tok = [], [], ""
    parts = d.replace("M", " M ").replace("L", " L ").replace("Z", " Z ").split()
    coord = []
    for p in parts:
        if p in ("M", "L", "Z"):
            out.append(p)
        else:
            coord.append(float(p))
            if len(coord) == 2:
                x, y = coord
                out.append(f"{_fmt(dx + x * s)} {_fmt(dy + y * s)}")
                coord = []
    return " ".join(out).replace("M ", "M").replace("L ", "L")


def word(text, x, baseline, s, tracking=0):
    """Devuelve (path_d, ancho_final)."""
    ds, cur = [], 0.0
    for i, ch in enumerate(text):
        w, paths = LETTERS[ch]
        for p in paths:
            ds.append(_transform_path(p, x + cur * s, baseline, s))
        cur += w
        if i < len(text) - 1:
            cur += KERN[ch] + tracking
    return " ".join(ds), cur * s


S_WORD = 0.72      # escala de "kuska" en el lockup
S_LABS = 0.56      # "labs" relativo a "kuska"


def wordmark(x, baseline, s=S_WORD):
    kuska_d, kw = word("kuska", x, baseline, s)
    gap = 44 * s
    labs_d, lw = word("labs", x + kw + gap, baseline, s * S_LABS, tracking=-6)
    return kuska_d, labs_d, kw + gap + lw


def svg(w, h, title, body, bg=None):
    bgr = f'<rect width="{_fmt(w)}" height="{_fmt(h)}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {_fmt(w)} {_fmt(h)}" width="{_fmt(w)}" '
            f'height="{_fmt(h)}" role="img" aria-labelledby="title"><title id="title">{title}</title>{bgr}{body}</svg>\n')


def main():
    OUT.mkdir(exist_ok=True)
    files = {}
    sym = symbol_paths()
    sym_rev = symbol_paths(gap=12, hole=17.5)  # versión invertida: corte un poco más ancho (irradiación)

    # Símbolo
    files["kuska-symbol.svg"] = svg(256, 256, "Kuska Labs — símbolo", f'<path id="symbol" fill="#000" d="{sym}"/>')
    # Tamaño pequeño (favicon): corte de 1 módulo y sin hueco extra, para que la cruz sobreviva a 16 px
    files["kuska-symbol-small.svg"] = svg(256, 256, "Kuska Labs — símbolo tamaño pequeño",
                                          f'<path id="symbol" fill="#000" d="{symbol_paths(gap=26, hole=0)}"/>')
    files["kuska-symbol-color-dark.svg"] = svg(256, 256, "Kuska Labs — símbolo oro sobre negro",
                                               f'<path fill="{ORO}" d="{sym_rev}"/>', bg=NEGRO)

    # Horizontal
    base = 128 + 180 * S_WORD / 2
    kd, ld, ww = wordmark(292, base)
    W = round(292 + ww + 24)
    files["kuska-horizontal.svg"] = svg(W, 256, "Kuska Labs — logo horizontal",
        f'<g id="symbol" fill="#000"><path d="{sym}"/></g><g id="wordmark" fill="#000" fill-rule="evenodd">'
        f'<path d="{kd}"/><path d="{ld}"/></g>')
    files["kuska-horizontal-color-dark.svg"] = svg(W, 256, "Kuska Labs — horizontal sobre negro",
        f'<path fill="{ORO}" d="{sym_rev}"/><path fill="{HUESO}" fill-rule="evenodd" d="{kd}"/>'
        f'<path fill="{PIEDRA}" fill-rule="evenodd" d="{ld}"/>', bg=NEGRO)
    files["kuska-horizontal-color-dark-transparent.svg"] = svg(W, 256, "Kuska Labs — horizontal para fondo oscuro",
        f'<path fill="{ORO}" d="{sym_rev}"/><path fill="{HUESO}" fill-rule="evenodd" d="{kd}"/>'
        f'<path fill="{PIEDRA}" fill-rule="evenodd" d="{ld}"/>')
    files["kuska-horizontal-color-light.svg"] = svg(W, 256, "Kuska Labs — horizontal para fondo claro",
        f'<path fill="{ORO_OSC}" d="{sym}"/><path fill="{NEGRO}" fill-rule="evenodd" d="{kd}"/>'
        f'<path fill="{PIEDRA_OSC}" fill-rule="evenodd" d="{ld}"/>')

    # Apilado
    _, _, ww2 = wordmark(0, 0)
    SW = round(max(ww2, 256) + 48)
    sx = SW / 2
    top_word = 232 + 40
    base2 = top_word + 180 * S_WORD
    kd2, ld2, _ = wordmark((SW - ww2) / 2, base2)
    SH = round(base2 + 24)
    sym2 = symbol_paths(cx=sx)
    sym2r = symbol_paths(gap=12, hole=17.5, cx=sx)
    files["kuska-stacked.svg"] = svg(SW, SH, "Kuska Labs — logo apilado",
        f'<g id="symbol" fill="#000"><path d="{sym2}"/></g><g id="wordmark" fill="#000" fill-rule="evenodd">'
        f'<path d="{kd2}"/><path d="{ld2}"/></g>')
    files["kuska-stacked-color-dark.svg"] = svg(SW, SH, "Kuska Labs — apilado sobre negro",
        f'<path fill="{ORO}" d="{sym2r}"/><path fill="{HUESO}" fill-rule="evenodd" d="{kd2}"/>'
        f'<path fill="{PIEDRA}" fill-rule="evenodd" d="{ld2}"/>', bg=NEGRO)

    # Solo wordmark
    kd3, ld3, ww3 = wordmark(24, 24 + 180 * S_WORD)
    files["kuska-wordmark.svg"] = svg(round(ww3 + 48), round(48 + 180 * S_WORD), "Kuska Labs — wordmark",
        f'<g id="wordmark" fill="#000" fill-rule="evenodd"><path d="{kd3}"/><path d="{ld3}"/></g>')

    for name, content in files.items():
        (OUT / name).write_text(content, encoding="utf-8")
        print("wrote", OUT / name)


if __name__ == "__main__":
    main()
