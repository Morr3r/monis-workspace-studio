import Image from "next/image";
import { Minus, Plus, RotateCcw, Truck } from "lucide-react";
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useRef,
  useState,
} from "react";

import {
  products,
  type ChairId,
  type DeskId,
  type ExtraId,
  type ProductId,
} from "./data";

export type TransformAssetId =
  | "desk"
  | "chair"
  | "display-1"
  | "display-2"
  | "lamp"
  | "plant"
  | "coffee-maker";

type AssetTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type InteractionMode = "move" | "resize" | "rotate";

type PointerInteraction = {
  assetId: TransformAssetId;
  mode: InteractionMode;
  pointerId: number;
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
  startAngle: number;
  startDistance: number;
  startTransform: AssetTransform;
};

type WorkspacePreviewProps = {
  selectedDesk: DeskId;
  selectedChair: ChairId;
  extras: Record<ExtraId, number>;
  selectedItems: ProductId[];
  activeAssetId: TransformAssetId | null;
  onActiveAssetChange: (id: TransformAssetId | null) => void;
  onExtraQuantityChange: (id: ExtraId, delta: number) => void;
};

const DEFAULT_TRANSFORM: AssetTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

const TRANSFORM_ASSET_IDS: TransformAssetId[] = [
  "desk",
  "chair",
  "display-1",
  "display-2",
  "lamp",
  "plant",
  "coffee-maker",
];

function createInitialTransforms() {
  return Object.fromEntries(
    TRANSFORM_ASSET_IDS.map((id) => [id, { ...DEFAULT_TRANSFORM }]),
  ) as Record<TransformAssetId, AssetTransform>;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function TransformableProduct({
  assetId,
  productId,
  className,
  transform,
  selected,
  priority = false,
  onSelect,
  onTransformChange,
}: {
  assetId: TransformAssetId;
  productId: ProductId;
  className: string;
  transform: AssetTransform;
  selected: boolean;
  priority?: boolean;
  onSelect: (id: TransformAssetId | null) => void;
  onTransformChange: (
    id: TransformAssetId,
    transform: AssetTransform,
  ) => void;
}) {
  const product = products[productId];
  const interactionRef = useRef<PointerInteraction | null>(null);

  const beginInteraction = (
    event: PointerEvent<HTMLElement>,
    mode: InteractionMode,
  ) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    onSelect(assetId);

    const control = event.currentTarget;
    const asset = control.closest<HTMLElement>("[data-transform-asset]");
    if (!asset) return;

    const bounds = asset.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    interactionRef.current = {
      assetId,
      mode,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerX,
      centerY,
      startAngle: Math.atan2(event.clientY - centerY, event.clientX - centerX),
      startDistance: Math.max(
        1,
        Math.hypot(event.clientX - centerX, event.clientY - centerY),
      ),
      startTransform: transform,
    };

    control.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();

    if (interaction.mode === "move") {
      onTransformChange(assetId, {
        ...interaction.startTransform,
        x:
          interaction.startTransform.x +
          event.clientX -
          interaction.startX,
        y:
          interaction.startTransform.y +
          event.clientY -
          interaction.startY,
      });
      return;
    }

    if (interaction.mode === "resize") {
      const distance = Math.hypot(
        event.clientX - interaction.centerX,
        event.clientY - interaction.centerY,
      );
      onTransformChange(assetId, {
        ...interaction.startTransform,
        scale: clamp(
          interaction.startTransform.scale *
            (distance / interaction.startDistance),
          0.4,
          2.5,
        ),
      });
      return;
    }

    const angle = Math.atan2(
      event.clientY - interaction.centerY,
      event.clientX - interaction.centerX,
    );
    const rotation =
      interaction.startTransform.rotation +
      ((angle - interaction.startAngle) * 180) / Math.PI;

    onTransformChange(assetId, {
      ...interaction.startTransform,
      rotation: Math.round(rotation * 10) / 10,
    });
  };

  const endInteraction = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (interactionRef.current?.pointerId === event.pointerId) {
      interactionRef.current = null;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(assetId);
      return;
    }

    if (!selected) return;

    if (event.key === "Escape") {
      event.preventDefault();
      onSelect(null);
      return;
    }

    const moveStep = event.shiftKey ? 15 : 5;
    const nextTransform = { ...transform };
    let handled = true;

    switch (event.key) {
      case "ArrowLeft":
        nextTransform.x -= moveStep;
        break;
      case "ArrowRight":
        nextTransform.x += moveStep;
        break;
      case "ArrowUp":
        nextTransform.y -= moveStep;
        break;
      case "ArrowDown":
        nextTransform.y += moveStep;
        break;
      case "[":
        nextTransform.rotation -= event.shiftKey ? 15 : 5;
        break;
      case "]":
        nextTransform.rotation += event.shiftKey ? 15 : 5;
        break;
      case "-":
        nextTransform.scale = clamp(nextTransform.scale - 0.05, 0.4, 2.5);
        break;
      case "=":
      case "+":
        nextTransform.scale = clamp(nextTransform.scale + 0.05, 0.4, 2.5);
        break;
      default:
        handled = false;
    }

    if (!handled) return;
    event.preventDefault();
    onTransformChange(assetId, nextTransform);
  };

  const style = {
    "--asset-x": `${transform.x}px`,
    "--asset-y": `${transform.y}px`,
    "--asset-scale": transform.scale,
    "--asset-rotation": `${transform.rotation}deg`,
  } as CSSProperties;

  return (
    <div
      className={`preview-product transform-asset absolute ${className} ${
        selected ? "is-transform-selected" : ""
      }`}
      data-transform-asset
      data-transform-asset-id={assetId}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`${product.name}. Select to move, resize, or rotate.`}
      aria-pressed={selected}
      aria-describedby="transform-instructions"
      onPointerDown={(event) => beginInteraction(event, "move")}
      onPointerMove={handlePointerMove}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
      onKeyDown={handleKeyDown}
    >
      <Image
        src={product.stageImage ?? product.image}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 767px) 60vw, (max-width: 1279px) 38vw, 42vw"
        className="transform-asset-image object-contain"
      />

      {selected ? (
        <>
          <span className="transform-outline" aria-hidden="true" />
          {["north-west", "north-east", "south-west", "south-east"].map(
            (position) => (
              <button
                key={position}
                type="button"
                data-transform-control
                className={`transform-handle transform-handle-${position}`}
                aria-label={`Resize ${product.name}`}
                onPointerDown={(event) => beginInteraction(event, "resize")}
                onPointerMove={handlePointerMove}
                onPointerUp={endInteraction}
                onPointerCancel={endInteraction}
              />
            ),
          )}
          <button
            type="button"
            data-transform-control
            className="transform-handle transform-rotate"
            aria-label={`Rotate ${product.name}`}
            onPointerDown={(event) => beginInteraction(event, "rotate")}
            onPointerMove={handlePointerMove}
            onPointerUp={endInteraction}
            onPointerCancel={endInteraction}
          />
          <button
            type="button"
            data-transform-control
            className="transform-reset"
            aria-label={`Reset ${product.name} transform`}
            title="Reset position, size, and rotation"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onTransformChange(assetId, { ...DEFAULT_TRANSFORM });
            }}
          >
            <RotateCcw aria-hidden="true" size={13} strokeWidth={2.4} />
          </button>
        </>
      ) : null}
    </div>
  );
}

export function WorkspacePreview({
  selectedDesk,
  selectedChair,
  extras,
  selectedItems,
  activeAssetId,
  onActiveAssetChange,
  onExtraQuantityChange,
}: WorkspacePreviewProps) {
  const [transforms, setTransforms] = useState(createInitialTransforms);

  const handleTransformChange = (
    id: TransformAssetId,
    transform: AssetTransform,
  ) => {
    setTransforms((current) => ({
      ...current,
      [id]: transform,
    }));
  };

  const summaryName = (id: ProductId) => {
    if (id === "display") return "4K Display";
    if (id === "lamp") return "Desk Lamp";
    return products[id].name;
  };

  return (
    <>
      <div className="absolute inset-0">
        <Image
          src="/products/bali-room-v3.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="workspace-copy absolute z-10">
        <h1>
          Build a workspace
          <br />
          that works like you do.
        </h1>
        <p>
          <span className="workspace-copy-line workspace-copy-line-one">
            Mix, match, and make it yours.
          </span>
          <span className="workspace-copy-line workspace-copy-line-two">
            Delivered and set up anywhere in Bali.
          </span>
        </p>
      </div>

      <div
        className="workspace-composition absolute inset-0 z-[15]"
        aria-label={`Workspace preview with ${selectedItems
          .map((id) => products[id].name)
          .join(", ")}`}
        onPointerDown={(event) => {
          if (event.currentTarget === event.target) {
            onActiveAssetChange(null);
          }
        }}
      >
        <p id="transform-instructions" className="sr-only">
          Drag an asset to move it. Drag a corner handle to resize it. Drag the
          round handle above the selection to rotate it. Use arrow keys to move,
          square brackets to rotate, and plus or minus to resize.
        </p>
        <div className="stage-shadow absolute" />

        <TransformableProduct
          key={selectedDesk}
          assetId="desk"
          productId={selectedDesk}
          priority
          className={`desk-layer ${selectedDesk}-layer`}
          transform={transforms.desk}
          selected={activeAssetId === "desk"}
          onSelect={onActiveAssetChange}
          onTransformChange={handleTransformChange}
        />

        {extras.display > 0 ? (
          <>
            <TransformableProduct
              assetId="display-1"
              productId="display"
              className="display-layer"
              transform={transforms["display-1"]}
              selected={activeAssetId === "display-1"}
              onSelect={onActiveAssetChange}
              onTransformChange={handleTransformChange}
            />
            {extras.display > 1 ? (
              <TransformableProduct
                assetId="display-2"
                productId="display"
                className="display-layer display-layer-two"
                transform={transforms["display-2"]}
                selected={activeAssetId === "display-2"}
                onSelect={onActiveAssetChange}
                onTransformChange={handleTransformChange}
              />
            ) : null}
          </>
        ) : null}

        {extras.lamp > 0 ? (
          <TransformableProduct
            assetId="lamp"
            productId="lamp"
            className="lamp-layer"
            transform={transforms.lamp}
            selected={activeAssetId === "lamp"}
            onSelect={onActiveAssetChange}
            onTransformChange={handleTransformChange}
          />
        ) : null}

        {extras.plant > 0 ? (
          <TransformableProduct
            assetId="plant"
            productId="plant"
            className="plant-layer"
            transform={transforms.plant}
            selected={activeAssetId === "plant"}
            onSelect={onActiveAssetChange}
            onTransformChange={handleTransformChange}
          />
        ) : null}

        {extras["coffee-maker"] > 0 ? (
          <TransformableProduct
            assetId="coffee-maker"
            productId="coffee-maker"
            className="coffee-maker-layer"
            transform={transforms["coffee-maker"]}
            selected={activeAssetId === "coffee-maker"}
            onSelect={onActiveAssetChange}
            onTransformChange={handleTransformChange}
          />
        ) : null}

        <TransformableProduct
          key={selectedChair}
          assetId="chair"
          productId={selectedChair}
          priority
          className={`chair-layer ${selectedChair}-layer`}
          transform={transforms.chair}
          selected={activeAssetId === "chair"}
          onSelect={onActiveAssetChange}
          onTransformChange={handleTransformChange}
        />
      </div>

      <aside className="liquid-glass setup-summary absolute z-20">
        <div className="setup-summary-heading">
          <p>Your setup</p>
        </div>

        <div
          className="setup-list"
          style={
            {
              "--setup-count": Math.max(1, selectedItems.length),
            } as CSSProperties
          }
        >
          {selectedItems.map((id, index) => {
            const product = products[id];
            const isExtra = product.category === "extras";
            const quantity = isExtra ? extras[id as ExtraId] : 1;

            return (
              <div
                key={id}
                className={`setup-row ${
                  index ? "border-t border-black/8" : ""
                }`}
              >
                <div className="setup-row-media">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain p-1 mix-blend-multiply"
                  />
                </div>
                <div className="setup-row-copy">
                  <p>{summaryName(id)}</p>
                </div>

                <div className="setup-quantity">
                  <button
                    type="button"
                    disabled={!isExtra}
                    onClick={() =>
                      isExtra
                        ? onExtraQuantityChange(id as ExtraId, -1)
                        : undefined
                    }
                    aria-label={`Remove one ${product.name}`}
                  >
                    <Minus aria-hidden="true" size={12} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    disabled={!isExtra || id !== "display" || quantity >= 2}
                    onClick={() =>
                      isExtra
                        ? onExtraQuantityChange(id as ExtraId, 1)
                        : undefined
                    }
                    aria-label={`Add one ${product.name}`}
                  >
                    <Plus aria-hidden="true" size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="setup-delivery">
          <span>
            <Truck aria-hidden="true" size={15} />
          </span>
          <p>Delivered & assembled in Bali</p>
        </div>
      </aside>
    </>
  );
}
