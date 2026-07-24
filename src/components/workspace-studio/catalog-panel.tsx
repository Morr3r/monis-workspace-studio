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
      className={`product-card group relative overflow-hidden border transition-all duration-300 ${
        selected
          ? "is-selected"
          : ""
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="absolute inset-0 z-0 cursor-pointer rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c1c1a] focus-visible:ring-offset-2"
        aria-label={`${selected ? "Selected" : "Select"} ${product.name}`}
      />

      <div className="product-card-layout pointer-events-none relative z-10">
        <div className="product-media relative overflow-hidden">
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 767px) 45vw, 270px"
            className="object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="product-card-copy">
          <h3>{product.name}</h3>
          <p>
            {product.description}
          </p>
          <span className={`product-select-pill ${selected ? "is-selected" : ""}`}>
            {selected ? "Selected" : "Select"}
          </span>
        </div>
        {selected ? (
          <span className="product-selected-check">
            <Check aria-hidden="true" size={15} strokeWidth={2.6} />
          </span>
        ) : null}
      </div>

      {isAccessory && selected && onQuantityChange ? (
        <div className="product-card-quantity relative z-20">
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
      className="liquid-glass catalog-panel relative z-20 w-full"
      aria-label="Workspace catalog"
    >
      <div
        className="catalog-tabs"
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
            className={`cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              activeCategory === category
                ? "is-active"
                : ""
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <div
        className={`catalog-products ${
          activeCategory === "extras"
            ? "is-extras overflow-y-auto overscroll-contain pr-0.5"
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
