export type Category = "desk" | "chair" | "extras";
export type DeskId = "lift-desk" | "studio-desk";
export type ChairId = "ergo-pro" | "soft-task";
export type ExtraId = "display" | "lamp" | "plant";
export type ProductId = DeskId | ChairId | ExtraId;
export type Plan = "monthly" | "weekly";

export type Product = {
  id: ProductId;
  name: string;
  shortName: string;
  description: string;
  image: string;
  monthlyPrice: number;
  weeklyPrice: number;
  category: Category;
  accent: string;
};

export const products: Record<ProductId, Product> = {
  "lift-desk": {
    id: "lift-desk",
    name: "Lift Desk",
    shortName: "Electric sit–stand",
    description: "Smooth electric adjustment for an easy sit-to-stand rhythm.",
    image: "/products/lift-desk-cutout-v3.png",
    monthlyPrice: 25,
    weeklyPrice: 9,
    category: "desk",
    accent: "Graphite",
  },
  "studio-desk": {
    id: "studio-desk",
    name: "Studio Desk",
    shortName: "Mechanical standing",
    description: "A warm, minimal surface made for deep work and small spaces.",
    image: "/products/studio-desk-cutout-v3.png",
    monthlyPrice: 18,
    weeklyPrice: 7,
    category: "desk",
    accent: "Natural oak",
  },
  "ergo-pro": {
    id: "ergo-pro",
    name: "Ergo Pro",
    shortName: "4D ergonomic mesh",
    description: "Breathable mesh, adjustable support, and all-day comfort.",
    image: "/products/ergo-chair-cutout-v3.png",
    monthlyPrice: 15,
    weeklyPrice: 6,
    category: "chair",
    accent: "Black mesh",
  },
  "soft-task": {
    id: "soft-task",
    name: "Soft Task Chair",
    shortName: "Upholstered swivel",
    description: "A softer silhouette for calm, compact creative workspaces.",
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
    description: "A sharp 4K canvas for focused work, editing, and calls.",
    image: "/products/display-cutout-v3.png",
    monthlyPrice: 15,
    weeklyPrice: 6,
    category: "extras",
    accent: "4K · USB-C",
  },
  lamp: {
    id: "lamp",
    name: "Smart Desk Lamp",
    shortName: "Warm-to-cool light",
    description: "Flicker-free task light with a clean, adjustable profile.",
    image: "/products/desk-lamp-cutout-v3.png",
    monthlyPrice: 5,
    weeklyPrice: 2,
    category: "extras",
    accent: "Smart light",
  },
  plant: {
    id: "plant",
    name: "Monstera",
    shortName: "Living desk plant",
    description: "A little Bali green to soften the setup and brighten the day.",
    image: "/products/monstera-cutout-v3.png",
    monthlyPrice: 8,
    weeklyPrice: 3,
    category: "extras",
    accent: "Live plant",
  },
};

export const categoryProducts: Record<Category, ProductId[]> = {
  desk: ["lift-desk", "studio-desk"],
  chair: ["ergo-pro", "soft-task"],
  extras: ["display", "lamp", "plant"],
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
};
