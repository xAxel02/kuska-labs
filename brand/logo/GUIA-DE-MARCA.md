# Kuska Labs: guía de uso del logo

## 1. El logo
- **Idea:** cuatro piezas que solo forman la chakana cuando están juntas. Eso es *kuska*. Los escalones de píxel conectan la tradición andina con el software.
- **Versiones:**
  - horizontal (principal)
  - apilado
  - solo símbolo
  - solo wordmark
  - símbolo pequeño (≤ 32 px)
- **Dónde está cada archivo** (`final/`):

| Uso | Archivo |
|---|---|
| Header de la web (fondo oscuro) | `kuska-horizontal-color-dark-transparent.svg` |
| Documentos y fondos claros | `kuska-horizontal-color-light.svg` |
| Un color (negro / blanco / oro) | `horizontal/`, `stacked/`, `symbol/` |
| Redes sociales, foto de perfil, WhatsApp | `symbol/kuska-symbol-app-icon-1024.png` |
| Favicon e íconos web | `web-icons/` (incluye `head-snippet.html` y `site.webmanifest`) |
| PNG listos para usar | `png/` y los `*-1200.png` |

Para cambiar algo, no edites los SVG a mano. Modifica `build_logo.py` y ejecuta `python build_logo.py`.

## 2. Zona de protección
Deja libre alrededor del logo **1 X** por cada lado, donde **X = ancho de una punta de la chakana** (1,5 módulos de la retícula). La zona crece y se achica junto con el logo.

## 3. Tamaño mínimo
| Versión | Pantalla | Impresión |
|---|---|---|
| Horizontal | 120 px de ancho | 30 mm de ancho |
| Apilado | 64 px de ancho | 18 mm de ancho |
| Símbolo | 33–64 px | 8 mm |
| Símbolo pequeño | 16–32 px (`kuska-symbol-small*.svg`, favicon) | 6 mm |

## 4. Color
| Nombre | Uso | HEX | RGB | CMYK (aprox.) |
|---|---|---|---|---|
| **Negro Kuska** | Fondo principal de la web | `#0B0B0F` | 11 11 15 | 60 40 40 100 (negro enriquecido) |
| **Oro Inti** | Símbolo y acentos sobre oscuro | `#F2B33D` | 242 179 61 | 0 26 75 5 |
| **Oro profundo** | Símbolo sobre fondos claros | `#A86A00` | 168 106 0 | 0 37 100 34 |
| **Blanco hueso** | "kuska" y textos sobre oscuro | `#F4F2EE` | 244 242 238 | 0 1 2 4 |
| **Gris piedra** | "labs" y textos secundarios sobre oscuro | `#8B8B94` | 139 139 148 | 6 6 0 42 |
| **Gris piedra oscuro** | "labs" sobre fondos claros | `#5E5E66` | 94 94 102 | 8 8 0 60 |

El Pantone se confirma con la imprenta cuando haya material impreso.

**Contraste verificado:**
- Oro Inti sobre negro: 10,6:1.
- Blanco hueso sobre negro: 17,6:1.
- Oro profundo sobre blanco: 4,4:1. Sirve para el logo, pero no para texto pequeño.

**Combinaciones aprobadas:**
- color sobre Negro Kuska (principal)
- color claro sobre blanco
- todo blanco sobre negro o sobre fotos oscuras
- todo negro sobre blanco
- Negro Kuska sobre Oro Inti

## 5. Tipografía
- El wordmark *kuska labs* son letras construidas a mano, no una fuente. Nunca lo escribas con el teclado.
- **Tipografía web ("técnica cercana")**, todas de Google Fonts con licencia OFL:

| Rol | Fuente | Pesos | Uso |
|---|---|---|---|
| Títulos | **Space Grotesk** | 500 · 700 | H1–H3 |
| Texto e interfaz | **Inter** | 400 · 500 · 600 | párrafos, botones, formularios |
| Detalles | **JetBrains Mono** | 400 · 500 | etiquetas `// servicios`, datos, precios |

- La monoespaciada se usa en dosis pequeñas, nunca en párrafos.
- Los tokens completos (escala fluida, colores web y estados) están en [`site/src/styles/tokens.css`](../../site/src/styles/tokens.css). Esa es la fuente de verdad para la web.
- **Color en la web:** el Oro Inti es el único acento. Va en el botón principal, los enlaces y los detalles.
- **Botón de WhatsApp:** es secundario, con borde neutro y solo el ícono en verde.

## 6. No hacer
- No estirar, aplastar ni rotar el logo.
- No cambiar los colores fuera de la paleta.
- No agregar sombras, brillos, degradados ni contornos.
- No unir las cuatro piezas de la chakana, salvo en la versión de tamaño pequeño, que ya trae su propio corte.
- No cambiar la distancia ni el tamaño relativo entre el símbolo y "kuska labs".
- No colocar el logo sobre fondos recargados sin una base oscura.
- No usar la versión pequeña en tamaños grandes, ni la principal por debajo de 33 px.

## 7. Pendientes y advertencias
- **Marca registrada:** antes de usar el logo comercialmente, hagan una búsqueda en Indecopi y una búsqueda inversa de imágenes. El logo no garantiza por sí mismo que esté libre de registro.
- La chakana es un símbolo andino de uso común. Lo que hace propia a esta versión es su construcción: piezas separadas, retícula de píxel y oro sobre negro.
- **Lámina de presentación** (`board/`): reemplacen el nombre de ejemplo de la tarjeta y el dominio cuando estén definidos.
- **Archivos pendientes:** PDF/EPS para imprenta y Pantone.
