import Image from "next/image";
import { Check, Minus, Plus, Truck } from "lucide-react";

import {
  products,
  type ChairId,
  type DeskId,
  type ExtraId,
  type ProductId,
} from "./data";

type WorkspacePreviewProps = {
  selectedDesk: DeskId;
  selectedChair: ChairId;
  extras: Record<ExtraId, number>;
  selectedItems: ProductId[];
  pieceCount: number;
  onExtraQuantityChange: (id: ExtraId, delta: number) => void;
};

function PreviewProduct({
  productId,
  className,
  priority = false,
}: {
  productId: ProductId;
  className: string;
  priority?: boolean;
}) {
  const product = products[productId];

  return (
    <div key={productId} className={`preview-product absolute ${className}`}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority={priority}
        sizes="(max-width: 767px) 60vw, (max-width: 1279px) 38vw, 42vw"
        className="object-contain"
      />
    </div>
  );
}

export function WorkspacePreview({
  selectedDesk,
  selectedChair,
  extras,
  selectedItems,
  pieceCount,
  onExtraQuantityChange,
}: WorkspacePreviewProps) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src="/products/bali-room.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="workspace-copy absolute left-[356px] top-9 z-10 max-w-[610px] xl:left-[372px] xl:top-11">
        <h1 className="text-balance text-[clamp(2.45rem,4.2vw,4.65rem)] font-semibold leading-[0.98] tracking-[-0.062em] text-[#141412]">
          Build a workspace
          <br />
          that works like you do.
        </h1>
        <p className="mt-4 max-w-[480px] text-[clamp(1rem,1.35vw,1.25rem)] font-medium leading-[1.45] tracking-[-0.025em] text-[#343431]">
          Mix, match, and make it yours.
          <br />
          Delivered and set up anywhere in Bali.
        </p>
      </div>

      <div
        className="workspace-composition absolute inset-0 z-[5]"
        aria-label={`Workspace preview with ${selectedItems
          .map((id) => products[id].name)
          .join(", ")}`}
      >
        <div className="stage-shadow absolute bottom-[11%] left-[46%] h-[11%] w-[45%] -translate-x-1/2 rounded-[50%] bg-black/16 blur-2xl" />

        <PreviewProduct
          key={selectedDesk}
          productId={selectedDesk}
          priority
          className="desk-layer bottom-[8%] left-[65%] h-[43%] w-[54%] -translate-x-1/2"
        />

        {extras.display > 0 ? (
          <>
            <PreviewProduct
              productId="display"
              className="display-layer bottom-[34%] left-[55%] h-[27%] w-[22%] -translate-x-1/2"
            />
            {extras.display > 1 ? (
              <PreviewProduct
                productId="display"
                className="display-layer display-layer-two bottom-[33%] left-[65%] h-[25%] w-[20%] -translate-x-1/2"
              />
            ) : null}
          </>
        ) : null}

        {extras.lamp > 0 ? (
          <PreviewProduct
            productId="lamp"
            className="lamp-layer bottom-[43%] left-[47%] h-[20%] w-[13%] -translate-x-1/2"
          />
        ) : null}

        {extras.plant > 0 ? (
          <PreviewProduct
            productId="plant"
            className="plant-layer bottom-[42%] left-[52%] h-[19%] w-[13%] -translate-x-1/2"
          />
        ) : null}

        <PreviewProduct
          key={selectedChair}
          productId={selectedChair}
          priority
          className="chair-layer bottom-[4%] left-[55%] h-[37%] w-[23%] -translate-x-1/2"
        />
      </div>

      <aside className="liquid-glass setup-summary absolute right-7 top-[124px] z-20 w-[286px] rounded-[26px] p-3 xl:right-9 xl:top-[126px] xl:w-[300px]">
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <div>
            <p className="text-sm font-semibold tracking-[-0.02em] text-[#1b1b18]">
              Your setup
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-[#62625c]">
              {pieceCount} pieces selected
            </p>
          </div>
          <span className="grid size-8 place-items-center rounded-full bg-[#ddea00] text-[#151600]">
            <Check aria-hidden="true" size={16} strokeWidth={2.5} />
          </span>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-white/70 bg-white/36">
          {selectedItems.map((id, index) => {
            const product = products[id];
            const isExtra = product.category === "extras";
            const quantity = isExtra ? extras[id as ExtraId] : 1;

            return (
              <div
                key={id}
                className={`flex min-h-[58px] items-center gap-2.5 px-2.5 py-2 ${
                  index ? "border-t border-black/8" : ""
                }`}
              >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-white/55">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain p-0.5 mix-blend-multiply"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold tracking-[-0.015em] text-[#20201d]">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#686862]">
                    ${product.monthlyPrice * quantity}/month
                  </p>
                </div>

                {isExtra ? (
                  <div className="flex shrink-0 items-center rounded-full border border-black/10 bg-white/55">
                    <button
                      type="button"
                      onClick={() => onExtraQuantityChange(id as ExtraId, -1)}
                      className="grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-black/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                      aria-label={`Remove one ${product.name}`}
                    >
                      <Minus aria-hidden="true" size={12} />
                    </button>
                    <span className="w-4 text-center text-[11px] font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={id !== "display" || quantity >= 2}
                      onClick={() => onExtraQuantityChange(id as ExtraId, 1)}
                      className="grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-black/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-25"
                      aria-label={`Add one ${product.name}`}
                    >
                      <Plus aria-hidden="true" size={12} />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/65 bg-white/36 px-3 py-2.5">
          <span className="grid size-8 place-items-center rounded-full border border-[#d5df00]/50 bg-[#edfa00]/16 text-[#6d7500]">
            <Truck aria-hidden="true" size={15} />
          </span>
          <p className="text-[11px] font-semibold leading-4 text-[#373733]">
            Delivered & assembled in Bali
          </p>
        </div>
      </aside>
    </>
  );
}
