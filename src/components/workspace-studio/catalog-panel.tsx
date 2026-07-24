import Image from "next/image";
import { Check, Minus, Plus } from "lucide-react";

import {
  categoryLabels,
  categoryProducts,
  products,
  type Category,
  type ChairId,
  type DeskId,
  type ExtraId,
  type ProductId,
} from "./data";

type CatalogPanelProps = {
  activeCategory: Category;
  selectedDesk: DeskId;
  selectedChair: ChairId;
  extras: Record<ExtraId, number>;
  onCategoryChange: (category: Category) => void;
  onSelectProduct: (id: ProductId) => void;
  onExtraQuantityChange: (id: ExtraId, delta: number) => void;
};

function ProductCard({
  id,
  selected,
  quantity,
  onSelect,
  onQuantityChange,
}: {
  id: ProductId;
  selected: boolean;
  quantity?: number;
  onSelect: () => void;
  onQuantityChange?: (delta: number) => void;
}) {
  const product = products[id];
  const isAccessory = product.category === "extras";

  return (
    <article
      className={`product-card group relative overflow-hidden rounded-[22px] border p-3.5 transition-all duration-300 ${
        selected
          ? "border-[#c6d300] bg-white/72 shadow-[0_18px_50px_rgba(32,35,0,0.12)]"
          : "border-white/65 bg-white/42 hover:border-white hover:bg-white/62"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="absolute inset-0 z-0 cursor-pointer rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c1c1a] focus-visible:ring-offset-2"
        aria-label={`${selected ? "Selected" : "Select"} ${product.name}`}
      />

      <div className="pointer-events-none relative z-10">
        <div className="relative h-28 overflow-hidden rounded-2xl bg-white/58 sm:h-32">
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 767px) 45vw, 270px"
            className="object-contain p-1 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {selected ? (
            <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-[#dbea00] text-[#151600] shadow-[0_5px_14px_rgba(135,145,0,0.25)]">
              <Check aria-hidden="true" size={15} strokeWidth={2.6} />
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex min-h-20 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold leading-5 tracking-[-0.02em] text-[#181816]">
                {product.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-[#555550]">
                {product.accent}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-[#181816]">
              ${product.monthlyPrice}
              <span className="ml-0.5 text-[10px] font-medium text-[#686862]">/mo</span>
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-[1.45] text-[#5b5b55]">
            {product.description}
          </p>
        </div>
      </div>

      {isAccessory && selected && onQuantityChange ? (
        <div className="relative z-20 mt-3 flex items-center justify-between border-t border-black/8 pt-3">
          <span className="text-xs font-semibold text-[#42423d]">Quantity</span>
          <div
            className="flex items-center rounded-full border border-black/10 bg-white/60 p-0.5"
            aria-label={`${product.name} quantity`}
          >
            <button
              type="button"
              onClick={() => onQuantityChange(-1)}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-[#30302d] transition-colors hover:bg-black/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label={`Remove one ${product.name}`}
            >
              <Minus aria-hidden="true" size={14} />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums">
              {quantity ?? 0}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(1)}
              disabled={id !== "display" || (quantity ?? 0) >= 2}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-[#30302d] transition-colors hover:bg-black/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={`Add one ${product.name}`}
            >
              <Plus aria-hidden="true" size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function CatalogPanel({
  activeCategory,
  selectedDesk,
  selectedChair,
  extras,
  onCategoryChange,
  onSelectProduct,
  onExtraQuantityChange,
}: CatalogPanelProps) {
  const visibleProducts = categoryProducts[activeCategory];

  return (
    <aside
      className="liquid-glass catalog-panel relative z-20 w-full rounded-[28px] p-2.5 lg:w-[308px]"
      aria-label="Workspace catalog"
    >
      <div
        className="grid grid-cols-3 gap-1 rounded-[20px] border border-white/70 bg-white/26 p-1"
        role="tablist"
        aria-label="Product categories"
      >
        {(Object.keys(categoryLabels) as Category[]).map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            onClick={() => onCategoryChange(category)}
            className={`min-h-11 cursor-pointer rounded-2xl px-3 text-[13px] font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              activeCategory === category
                ? "bg-white/78 text-[#171715] shadow-[0_8px_22px_rgba(30,30,26,0.09)]"
                : "text-[#54544f] hover:bg-white/40 hover:text-[#171715]"
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <div
        className={`mt-2 grid gap-2 ${
          activeCategory === "extras"
            ? "max-h-[470px] overflow-y-auto overscroll-contain pr-0.5"
            : ""
        }`}
        role="tabpanel"
      >
        {visibleProducts.map((id) => {
          const product = products[id];
          const selected =
            product.category === "desk"
              ? selectedDesk === id
              : product.category === "chair"
                ? selectedChair === id
                : extras[id as ExtraId] > 0;

          return (
            <ProductCard
              key={id}
              id={id}
              selected={selected}
              quantity={product.category === "extras" ? extras[id as ExtraId] : undefined}
              onSelect={() => onSelectProduct(id)}
              onQuantityChange={
                product.category === "extras"
                  ? (delta) => onExtraQuantityChange(id as ExtraId, delta)
                  : undefined
              }
            />
          );
        })}
      </div>
    </aside>
  );
}
