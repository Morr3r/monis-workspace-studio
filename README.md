# monis.studio — Workspace Designer

A visual office-rental configurator for digital nomads and startup teams in Bali. Build a complete workspace by switching desks and chairs, adding accessories directly into the room, freely arranging every placed asset, and reviewing a live rental summary before checkout.

**[Open the live experience](https://desent-test-xi.vercel.app)** · **[View the repository](https://github.com/Morr3r/monis-workspace-studio)**

![Workspace configurator](docs/design/workspace-configurator-implementation1.png)

## Approach

The experience is designed around one idea: choosing rental furniture should feel like creating a space, not filling in a form. A bright Bali room acts as the canvas, each product is composited into that scene as the selection changes, and the price and setup summary remain visible without interrupting the design flow. The interface uses a restrained iOS-inspired liquid-glass system, warm natural imagery, editorial typography, and a single lime action color to keep the result premium but easy to scan.

The checkout is intentionally lightweight. Users can compare monthly and weekly plans, adjust accessory quantities, choose an area and delivery date, then complete the prototype flow with clear loading and success feedback.

Placed products behave like objects on a design canvas. Selecting an item reveals controls for moving, resizing, rotating, and resetting it without changing the underlying catalog selection or rental calculation.

## Highlights

- Two selectable desks and two selectable chairs
- Live layered workspace preview
- Free-transform controls for every placed desk, chair, monitor, light, plant, and appliance
- Pointer and keyboard support for moving, resizing, and rotating selected assets
- Add, remove, and quantity-control monitors, lighting, plants, and a Bosch Coffee Maker
- Monthly/weekly pricing and accurate piece totals
- Responsive desktop, tablet, and mobile layouts
- Accessible tabs, focus states, live announcements, Escape-to-close, and reduced-motion support
- Itemized checkout with delivery details and confirmation state

## Canvas controls

1. Choose a product from the catalog to place and select it on the canvas.
2. Drag the selected asset itself to move it.
3. Drag any square corner handle to resize it proportionally.
4. Drag the round handle above the selection to rotate it.
5. Use the reset button beside the rotation handle to restore that asset, or use **Start over** to reset the whole workspace.

Keyboard controls are available when an asset has focus:

| Key | Action |
| --- | --- |
| `Enter` or `Space` | Select the focused asset |
| Arrow keys | Move by 5px |
| `Shift` + Arrow keys | Move by 15px |
| `[` / `]` | Rotate by 5° |
| `-` / `+` | Scale down or up |
| `Escape` | Clear the canvas selection |

## Tech choices

- **Next.js 16 App Router** and **React 19** for the application shell and interactive client state
- **Tailwind CSS 4** plus a small custom CSS layer for responsive composition, glass materials, and motion
- **TypeScript** for the product model and UI state
- **Lucide React** for consistent interface iconography
- **Vercel** for production deployment

No external state library is needed for this MVP. Catalog, checkout, selection, and per-asset transform state remain local and predictable.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production checks:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

## Project structure

```text
src/
  app/                         App shell, metadata, and global visual system
  components/workspace-studio Product data, catalog, transform canvas, checkout
public/products/               Room, catalog photography, and transparent cutouts
docs/design/                   Concept, implementation captures, fidelity notes
design-system/                 Persisted UI/UX direction and design tokens
```

## Asset notes

Desk, ergonomic chair, monitor, lamp, and appliance references are based on product photography from [monis.rent](https://monis.rent/). The Bosch Coffee Maker uses the product data and original catalog image from the [Bosch Coffee Maker product page](https://www.monis.rent/products/bosch-coffee-maker), including the TKA2M113 model details and $5/week or $12/month rental pricing.

The original Bosch image is retained as the source reference. A transparent cutout derived from that image is used throughout the catalog, checkout, summary, and canvas so the appliance never exposes the original white photo background.

The empty Bali room, soft task chair, plant, and visual direction concepts were generated specifically for this prototype, then optimized and isolated for real-time compositing.

## With more time

I would connect the final CTA to Monis inventory and availability, persist shareable configurations and transforms in a database, add snapping, alignment guides, collision-aware placement, undo/redo, and support multiple room templates. I would also add automated visual-regression tests across breakpoints and replace prototype delivery pricing with live service-area rules.

## Design documentation

- [Visual fidelity ledger](docs/design/fidelity-ledger.md)
- [Accepted reference specification](docs/design/accepted-reference-spec.md)
- [Configurator concept](docs/design/workspace-configurator-concept.png)
- [Checkout concept](docs/design/workspace-checkout-concept.png)
