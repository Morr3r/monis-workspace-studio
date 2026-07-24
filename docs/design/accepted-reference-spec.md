# Accepted reference specification

Source of truth: `workspace-configurator-concept.png`

The source image is 1586 × 992 pixels. Measurements below are normalized to a
1600 × 1000 CSS viewport so browser captures can be compared at 1:1 scale.

## Fixed desktop composition

| Region | Target geometry at 1600 × 1000 |
| --- | --- |
| Header | `x 0`, `y 0`, `w 1600`, `h 85` |
| Catalog | `x 52`, `y 150`, `w 345`, `h 640` |
| Hero copy | `x 446`, `y 123`, max width `720` |
| Setup summary | `x 1222`, `y 207`, `w 341`, `h 573` |
| Bottom dock | `x 89`, `y 822`, `w 1426`, `h 153` |

The stage begins immediately below the 85px header and uses a full-bleed 16:10
high-key Bali villa image. The intended crop has a warm carved-wood detail at
the far left, cream floor and walls, and a panoramic opening onto palms and rice
terraces.

## Typography

- Brand: 28/32, `700` for `monis`, `500` for `.studio`, tight tracking.
- Navigation: 16/20, active underline 65 × 2.
- Hero: 54/60, `600`, approximately `-0.055em`, exactly two lines.
- Hero support: 20/28, `500`.
- Panel tabs and item names: 18/24, `500–600`.
- Small description text: 14/19.
- Total: 48/48; billing unit 16/20.
- Primary CTA: 18/24, `600`.

## Catalog anatomy

- Outer radius 30, 17–18px internal horizontal padding.
- Tabs: 308 × 58; active tab about 99 × 56 with 17px radius.
- Selected product: 308 × 255 with a 1.5–2px lime border.
- Product cards are horizontal media rows, not stacked cards.
- Product media is approximately 145 × 102; copy sits to its right.
- Cards show title, description, and an explicit `Selected` or `Select` button.
- Price and material/accent rows are not present in this panel.

## Setup summary anatomy

- Outer radius 29, approximately 15px padding.
- Header contains only `Your setup`.
- Inner list is 312 × 442 with five approximately 88px rows.
- Every row has a product thumbnail, name, and quantity pill.
- Prices and selected-count text are not present in the summary.
- The delivery strip is approximately 306 × 50 below the list.

## Bottom dock anatomy

- Outer radius 30 with a stronger glass surface than the side panels.
- The steps well is 781 × 113 with 22px radius.
- Step circles are 52px. Each step also includes its selected product image.
- Divider sits around x 920.
- Total begins around x 968.
- Primary CTA is approximately 224 × 72 with an 18px radius.

## Product staging

Approximate visible bounds:

| Asset | Target bounds |
| --- | --- |
| Lift desk | `x 501`, `y 473`, `w 721`, `h 352` |
| Ergo chair | `x 529`, `y 416`, `w 340`, `h 409` |
| 4K monitor | `x 832`, `y 312`, `w 195`, `h 163` |
| Laptop | `x 709`, `y 399`, `w 98`, `h 85` |
| Desk lamp | `x 1037`, `y 320`, `w 157`, `h 174` |
| Monstera | `x 1013`, `y 370`, `w 115`, `h 123` |

The selected lift desk uses a natural-oak top and matte-black legs. Furniture,
technology, lighting, and plant layers must share the same warm daylight,
perspective, edge quality, and contact-shadow treatment.

## Glass tokens

- Fill: white at approximately `0.56 → 0.34`.
- Border: 2px white at `0.82–0.90`.
- Backdrop blur: 28–32px; saturation around 140%.
- Inner highlight: `inset 0 1px rgba(255,255,255,.9)`.
- Elevation: approximately `0 22px 60px rgba(30,27,21,.14)`.
- Accent: around `#e1e606`; selected button around `#d9de04`.

## Allowed above-the-fold copy

- `monis.studio`
- `Design`
- `How it works`
- `Start over`
- `Build a workspace`
- `that works like you do.`
- `Mix, match, and make it yours.`
- `Delivered and set up anywhere in Bali.`
- `Desk`
- `Chair`
- `Extras`
- Product names and descriptions
- `Selected`
- `Select`
- `Your setup`
- `Delivered & assembled in Bali`
- `01`, `Desk`, selected desk name
- `02`, `Chair`, selected chair name
- `03`, `Setup`, selected item count
- Total, billing unit, and `Review setup`

No additional visible badge, eyebrow, selected-count line, price row, or hero
copy is allowed in the desktop first viewport.
