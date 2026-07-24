export type Category = "desk" | "chair" | "extras";
export type DeskId = "lift-desk" | "studio-desk";
export type ChairId = "ergo-pro" | "soft-task";
export type ExtraId = "display" | "lamp" | "plant" | "coffee-maker";
export type ProductId = DeskId | ChairId | ExtraId;
export type Plan = "monthly" | "weekly";

export type Product = {
  id: ProductId;
  name: string;
  shortName: string;
  description: string;
  image: string;
  stageImage?: string;
  monthlyPrice: number;
  weeklyPrice: number;
  category: Category;
  accent: string;
  sourceUrl?: string;
};

export const products: Record<ProductId, Product> = {
  "lift-desk": {
    id: "lift-desk",
    name: "Lift Desk",
    shortName: "Electric sit–stand",
    description: "Sit or stand with smooth electric adjustment.",
    image: "/products/lift-desk-oak-v2-trim.png",
    monthlyPrice: 25,
    weeklyPrice: 9,
    category: "desk",
    accent: "Graphite",
  },
  "studio-desk": {
    id: "studio-desk",
    name: "Studio Desk",
    shortName: "Mechanical standing",
    description: "Clean, minimal, and built for focus.",
    image: "/products/studio-desk-oak-v2-trim.png",
    monthlyPrice: 18,
    weeklyPrice: 7,
    category: "desk",
    accent: "Natural oak",
  },
  "ergo-pro": {
    id: "ergo-pro",
    name: "Ergo Pro",
    shortName: "4D ergonomic mesh",
    description: "Breathable mesh and ergonomic all-day support.",
    image: "/products/ergo-chair-v2-trim.png",
    monthlyPrice: 15,
    weeklyPrice: 6,
    category: "chair",
    accent: "Black mesh",
  },
  "soft-task": {
    id: "soft-task",
    name: "Soft Task Chair",
    shortName: "Upholstered swivel",
    description: "Soft curves for calm, compact creative work.",
    image: "/products/soft-task-chair-cutout-v3.png",
    monthlyPrice: 12,
    weeklyPrice: 5,
    category: "chair",
    accent: "Ivory boucle",
  },
  display: {
    id: "display",
    name: '27" 4K Display',
    shortName: "Crisp USB-C display",
    description: "Crisp 4K focus for work and calls.",
    image: "/products/display-cutout-v3.png",
    stageImage: "/products/display-kit-v2-trim.png",
    monthlyPrice: 15,
    weeklyPrice: 6,
    category: "extras",
    accent: "4K · USB-C",
  },
  lamp: {
    id: "lamp",
    name: "Smart Desk Lamp",
    shortName: "Warm-to-cool light",
    description: "Adjustable, flicker-free task light.",
    image: "/products/desk-lamp-arch-v2-trim.png",
    monthlyPrice: 5,
    weeklyPrice: 2,
    category: "extras",
    accent: "Smart light",
  },
  plant: {
    id: "plant",
    name: "Monstera",
    shortName: "Living desk plant",
    description: "A little Bali green for the desk.",
    image: "/products/monstera-cutout-v3-trim.png",
    monthlyPrice: 8,
    weeklyPrice: 3,
    category: "extras",
    accent: "Live plant",
  },
  "coffee-maker": {
    id: "coffee-maker",
    name: "Bosch Coffee Maker",
    shortName: "1.4 L filter brewer",
    description: "Brews 10–15 cups with drip-stop and auto-off.",
    image: "/products/bosch-coffee-maker-cutout.png",
    monthlyPrice: 12,
    weeklyPrice: 5,
    category: "extras",
    accent: "Bosch TKA2M113 · 1200 W",
    sourceUrl: "https://www.monis.rent/products/bosch-coffee-maker",
  },
};

export const categoryProducts: Record<Category, ProductId[]> = {
  desk: ["lift-desk", "studio-desk"],
  chair: ["ergo-pro", "soft-task"],
  extras: ["display", "lamp", "plant", "coffee-maker"],
};

export const categoryLabels: Record<Category, string> = {
  desk: "Desk",
  chair: "Chair",
  extras: "Extras",
};

export const defaultExtras: Record<ExtraId, number> = {
  display: 1,
  lamp: 1,
  plant: 1,
  "coffee-maker": 0,
};
