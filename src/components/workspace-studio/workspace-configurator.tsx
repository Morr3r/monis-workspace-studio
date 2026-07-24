"use client";

import {
  ArrowRight,
  Check,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { CatalogPanel } from "./catalog-panel";
import { CheckoutSheet } from "./checkout-sheet";
import {
  categoryLabels,
  defaultExtras,
  products,
  type Category,
  type ChairId,
  type DeskId,
  type ExtraId,
  type Plan,
  type ProductId,
} from "./data";
import { WorkspacePreview } from "./workspace-preview";

const basicExtras: Record<ExtraId, number> = {
  display: 0,
  lamp: 0,
  plant: 0,
};

export function WorkspaceConfigurator() {
  const [activeCategory, setActiveCategory] = useState<Category>("desk");
  const [selectedDesk, setSelectedDesk] = useState<DeskId>("lift-desk");
  const [selectedChair, setSelectedChair] = useState<ChairId>("ergo-pro");
  const [extras, setExtras] =
    useState<Record<ExtraId, number>>(defaultExtras);
  const [plan, setPlan] = useState<Plan>("monthly");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const selectedItems = useMemo<ProductId[]>(
    () => [
      selectedDesk,
      selectedChair,
      ...(Object.entries(extras)
        .filter(([, quantity]) => quantity > 0)
        .map(([id]) => id) as ExtraId[]),
    ],
    [selectedChair, selectedDesk, extras],
  );

  const pieceCount = useMemo(
    () => 2 + Object.values(extras).reduce((sum, quantity) => sum + quantity, 0),
    [extras],
  );

  const total = useMemo(
    () =>
      selectedItems.reduce((sum, id) => {
        const product = products[id];
        const quantity =
          product.category === "extras" ? extras[id as ExtraId] : 1;
        return (
          sum +
          (plan === "monthly" ? product.monthlyPrice : product.weeklyPrice) *
            quantity
        );
      }, 0),
    [extras, plan, selectedItems],
  );

  const notify = useCallback((message: string) => {
    setAnnouncement("");
    window.setTimeout(() => setAnnouncement(message), 20);
  }, []);

  const handleSelectProduct = (id: ProductId) => {
    const product = products[id];
    if (product.category === "desk") {
      setSelectedDesk(id as DeskId);
      notify(`${product.name} selected. Preview updated.`);
      return;
    }
    if (product.category === "chair") {
      setSelectedChair(id as ChairId);
      notify(`${product.name} selected. Preview updated.`);
      return;
    }

    const extraId = id as ExtraId;
    setExtras((current) => ({
      ...current,
      [extraId]: current[extraId] > 0 ? 0 : 1,
    }));
    notify(
      `${product.name} ${extras[extraId] > 0 ? "removed from" : "added to"} the workspace.`,
    );
  };

  const handleExtraQuantityChange = (id: ExtraId, delta: number) => {
    setExtras((current) => {
      const max = id === "display" ? 2 : 1;
      const next = Math.max(0, Math.min(max, current[id] + delta));
      return { ...current, [id]: next };
    });
    notify(`${products[id].name} quantity updated.`);
  };

  const handleReset = () => {
    setSelectedDesk("lift-desk");
    setSelectedChair("ergo-pro");
    setExtras(basicExtras);
    setPlan("monthly");
    setActiveCategory("desk");
    setCheckoutOpen(false);
    setHowOpen(false);
    notify("Workspace reset to the essentials.");
  };

  const steps: { id: Category; number: string; label: string; value: string }[] = [
    {
      id: "desk",
      number: "01",
      label: "Desk",
      value: products[selectedDesk].name,
    },
    {
      id: "chair",
      number: "02",
      label: "Chair",
      value: products[selectedChair].name,
    },
    {
      id: "extras",
      number: "03",
      label: "Setup",
      value: `${pieceCount} pieces`,
    },
  ];

  return (
    <div className="studio-shell min-h-dvh bg-[#f5f5f1] text-[#171715]">
      <a
        href="#studio-main"
        className="fixed left-4 top-3 z-[200] -translate-y-20 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to workspace designer
      </a>

      <header className="studio-header relative z-50 flex h-[74px] items-center justify-between border-b border-black/10 bg-white/78 px-5 backdrop-blur-2xl sm:px-8 lg:px-10">
        <a
          href="#studio-main"
          className="flex min-h-11 items-center rounded-xl pr-3 text-[22px] font-bold tracking-[-0.055em] text-[#171715] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          aria-label="monis.studio workspace designer"
        >
          monis<span className="font-medium">.studio</span>
        </a>

        <nav
          className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-7 sm:flex"
          aria-label="Primary navigation"
        >
          <a
            href="#studio-main"
            className="relative flex h-full items-center px-1 text-sm font-semibold text-[#1d1d1a] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#171715] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Design
          </a>
          <button
            type="button"
            onClick={() => setHowOpen((current) => !current)}
            aria-expanded={howOpen}
            className="min-h-11 cursor-pointer rounded-xl px-2 text-sm font-medium text-[#5d5d57] transition-colors hover:text-[#1d1d1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            How it works
          </button>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setHowOpen((current) => !current)}
            aria-label="How it works"
            aria-expanded={howOpen}
            className="grid size-11 cursor-pointer place-items-center rounded-full text-[#4f4f49] transition-colors hover:bg-black/5 sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <Sparkles aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-black/12 bg-white/50 px-3.5 text-[13px] font-semibold text-[#242421] transition-colors hover:bg-white sm:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <RotateCcw aria-hidden="true" size={15} />
            <span className="hidden sm:inline">Start over</span>
          </button>
        </div>
      </header>

      {howOpen ? (
        <section className="how-panel liquid-glass-strong fixed left-1/2 top-[84px] z-[80] w-[min(660px,calc(100vw-24px))] -translate-x-1/2 rounded-[26px] p-3.5 sm:p-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.035em]">
                From blank room to ready-to-work
              </h2>
              <p className="mt-1 text-sm text-[#60605a]">
                Choose it here. Monis handles the heavy lifting.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHowOpen(false)}
              className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label="Close how it works"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              ["01", "Design it", "Mix your desk, chair, and the extras you actually use."],
              ["02", "Review it", "See a clear plan, live price, and delivery details."],
              ["03", "We set it up", "Monis delivers, assembles, and collects it later."],
            ].map(([number, title, description]) => (
              <article
                key={number}
                className="rounded-[20px] border border-white/65 bg-white/40 p-4"
              >
                <span className="grid size-8 place-items-center rounded-full border border-[#cfd800]/55 bg-[#e9f400]/16 text-xs font-bold text-[#626900]">
                  {number}
                </span>
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-xs leading-[1.5] text-[#5f5f59]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <main
        id="studio-main"
        className="studio-main relative min-h-[calc(100dvh-74px)] overflow-hidden"
      >
        <section
          className="workspace-stage relative min-h-[calc(100dvh-74px)] overflow-hidden"
          aria-label="Interactive workspace designer"
        >
          <WorkspacePreview
            selectedDesk={selectedDesk}
            selectedChair={selectedChair}
            extras={extras}
            selectedItems={selectedItems}
            pieceCount={pieceCount}
            onExtraQuantityChange={handleExtraQuantityChange}
          />

          <div className="catalog-position absolute bottom-[122px] left-7 top-[76px] z-30 flex items-end xl:left-9">
            <CatalogPanel
              activeCategory={activeCategory}
              selectedDesk={selectedDesk}
              selectedChair={selectedChair}
              extras={extras}
              onCategoryChange={setActiveCategory}
              onSelectProduct={handleSelectProduct}
              onExtraQuantityChange={handleExtraQuantityChange}
            />
          </div>

          <div className="liquid-glass bottom-dock absolute bottom-5 left-7 right-7 z-40 flex min-h-[88px] items-center rounded-[26px] p-2.5 xl:left-9 xl:right-9">
            <div className="grid min-w-0 flex-1 grid-cols-3 rounded-[20px] border border-white/65 bg-white/32 p-1.5">
              {steps.map((step, index) => (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setActiveCategory(step.id)}
                  aria-label={`Edit ${categoryLabels[step.id]}: ${step.value}`}
                  className={`group relative flex min-h-[62px] cursor-pointer items-center gap-2 rounded-2xl px-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    activeCategory === step.id
                      ? "bg-white/72 shadow-[0_8px_20px_rgba(25,25,20,0.07)]"
                      : "hover:bg-white/38"
                  }`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full border text-xs font-bold tabular-nums ${
                      activeCategory === step.id
                        ? "border-[#ccd600] bg-[#ecf600]/25 text-[#454a00]"
                        : "border-black/12 bg-white/35 text-[#52524c]"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-[#242421]">
                      {step.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] font-medium text-[#6a6a64]">
                      {step.value}
                    </span>
                  </span>
                  {index < steps.length - 1 ? (
                    <ChevronRight
                      aria-hidden="true"
                      size={15}
                      className="ml-auto hidden shrink-0 text-[#6d6d66] min-[1180px]:block"
                    />
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mx-3 h-14 w-px shrink-0 bg-black/10 xl:mx-6" />

            <div className="flex shrink-0 items-center gap-4">
              <div className="min-w-[118px]">
                <p className="text-[28px] font-semibold leading-none tabular-nums tracking-[-0.055em] text-[#1e1e1b] xl:text-[32px]">
                  ${total}
                  <span className="ml-1 text-xs font-medium tracking-normal text-[#60605a]">
                    /{plan === "monthly" ? "month" : "week"}
                  </span>
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-[#66665f]">
                  <Truck aria-hidden="true" size={12} />
                  Bali setup included
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="flex min-h-[58px] min-w-[190px] cursor-pointer items-center justify-between gap-4 rounded-[18px] bg-[#e4f000] px-5 text-sm font-bold text-[#171800] shadow-[0_14px_34px_rgba(139,149,0,0.22)] transition-all duration-200 hover:bg-[#f0fb12] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 xl:min-w-[218px]"
              >
                Review setup
                <ArrowRight aria-hidden="true" size={19} />
              </button>
            </div>
          </div>
        </section>

        <section className="mobile-controls relative z-30 hidden bg-[#f4f4ef] px-3 pb-32 pt-3">
          <CatalogPanel
            activeCategory={activeCategory}
            selectedDesk={selectedDesk}
            selectedChair={selectedChair}
            extras={extras}
            onCategoryChange={setActiveCategory}
            onSelectProduct={handleSelectProduct}
            onExtraQuantityChange={handleExtraQuantityChange}
          />

          <div className="mt-3 rounded-[24px] border border-black/8 bg-white/70 p-4 shadow-[0_20px_50px_rgba(30,30,25,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-[-0.03em]">
                  Your setup
                </h2>
                <p className="mt-1 text-xs text-[#676761]">
                  {pieceCount} pieces · ${total}/month
                </p>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-[#e4ef00]">
                <Check aria-hidden="true" size={17} />
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedItems.map((id) => (
                <span
                  key={id}
                  className="rounded-full border border-black/9 bg-[#f4f4ef] px-3 py-1.5 text-[11px] font-semibold text-[#4f4f49]"
                >
                  {products[id].name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="mobile-cta liquid-glass-strong fixed bottom-0 left-0 right-0 z-50 hidden items-center gap-3 border-t border-white/70 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5">
        <div className="min-w-[90px] pl-1">
          <p className="text-xl font-semibold tabular-nums tracking-[-0.045em]">
            ${total}
          </p>
          <p className="text-[10px] font-medium text-[#64645e]">per month</p>
        </div>
        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          className="flex min-h-14 flex-1 cursor-pointer items-center justify-between rounded-[18px] bg-[#e4f000] px-5 text-sm font-bold text-[#171800] shadow-[0_10px_26px_rgba(139,149,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          Review setup
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>

      <CheckoutSheet
        open={checkoutOpen}
        plan={plan}
        selectedItems={selectedItems}
        pieceCount={pieceCount}
        extras={extras}
        total={total}
        onClose={() => setCheckoutOpen(false)}
        onPlanChange={setPlan}
        onExtraQuantityChange={handleExtraQuantityChange}
      />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
