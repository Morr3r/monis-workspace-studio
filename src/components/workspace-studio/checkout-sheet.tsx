"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  LoaderCircle,
  MapPin,
  Minus,
  Plus,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  products,
  type ExtraId,
  type Plan,
  type ProductId,
} from "./data";

type CheckoutSheetProps = {
  open: boolean;
  plan: Plan;
  selectedItems: ProductId[];
  pieceCount: number;
  extras: Record<ExtraId, number>;
  total: number;
  onClose: () => void;
  onPlanChange: (plan: Plan) => void;
  onExtraQuantityChange: (id: ExtraId, delta: number) => void;
};

export function CheckoutSheet({
  open,
  plan,
  selectedItems,
  pieceCount,
  extras,
  total,
  onClose,
  onPlanChange,
  onExtraQuantityChange,
}: CheckoutSheetProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [area, setArea] = useState("Canggu");
  const [deliveryDate, setDeliveryDate] = useState("2026-08-03");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    setStatus("idle");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, open]);

  const handleContinue = () => {
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 850);
  };

  if (!open) return null;

  return (
    <div className="checkout-layer fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#10100d]/22 backdrop-blur-[5px]"
        onClick={handleClose}
        aria-label="Close setup summary"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="checkout-sheet liquid-glass-strong absolute bottom-2 right-2 top-2 flex w-[min(610px,45vw)] flex-col overflow-hidden rounded-[30px] p-4 sm:p-5"
      >
        {status === "success" ? (
          <div className="flex h-full flex-col">
            <div className="flex justify-end">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-black/10 bg-white/48 text-[#20201d] transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                aria-label="Close confirmation"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </div>

            <div className="m-auto flex max-w-md flex-col items-center px-4 text-center">
              <span className="success-bloom grid size-20 place-items-center rounded-full bg-[#dbea00] text-[#151600] shadow-[0_24px_60px_rgba(143,153,0,0.28)]">
                <Check aria-hidden="true" size={36} strokeWidth={2.4} />
              </span>
              <h2 className="mt-7 text-[clamp(2.35rem,4vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-[#171715]">
                You&apos;re ready
                <br />
                for Bali.
              </h2>
              <p className="mt-5 max-w-sm text-base leading-7 text-[#55554f]">
                Your workspace request is ready. Monis will confirm availability and
                arrange delivery at checkout.
              </p>

              <div className="mt-8 flex w-full items-center justify-between rounded-[22px] border border-white/70 bg-white/48 px-5 py-4">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71716a]">
                    Your setup
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#22221f]">
                    {pieceCount} pieces · {area}
                  </p>
                </div>
                <p className="text-xl font-semibold tabular-nums tracking-[-0.04em]">
                  ${total}
                  <span className="ml-1 text-xs font-medium text-[#686862]">
                    /{plan === "monthly" ? "month" : "week"}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="mt-4 min-h-14 w-full cursor-pointer rounded-[18px] bg-[#e4f000] px-6 text-sm font-bold text-[#171800] shadow-[0_12px_32px_rgba(138,148,0,0.24)] transition-all duration-200 hover:bg-[#f0fb12] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Back to studio
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-black/10 bg-white/48 text-[#20201d] transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                aria-label="Keep designing"
              >
                <X aria-hidden="true" size={19} />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-11 cursor-pointer rounded-full px-3 text-sm font-semibold text-[#4e4e48] transition-colors hover:bg-white/45 hover:text-[#1c1c19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                Keep designing
              </button>
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col">
              <h2
                id="checkout-title"
                className="text-[clamp(2rem,3.2vw,3rem)] font-semibold tracking-[-0.055em] text-[#171715]"
              >
                Your workspace
              </h2>

              <div
                className="mt-4 grid grid-cols-2 rounded-2xl border border-black/10 bg-black/[0.035] p-1"
                aria-label="Rental plan"
              >
                {(["monthly", "weekly"] as Plan[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-label={`${option} rental plan`}
                    aria-pressed={plan === option}
                    onClick={() => onPlanChange(option)}
                    className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                      plan === option
                        ? "bg-white/80 text-[#1b1b18] shadow-[0_7px_18px_rgba(22,22,18,0.08)]"
                        : "text-[#5e5e58] hover:bg-white/40"
                    }`}
                  >
                    {option}
                    {plan === option ? (
                      <span className="grid size-5 place-items-center rounded-full bg-[#ddea00] text-[#171800]">
                        <Check aria-hidden="true" size={11} strokeWidth={2.7} />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="checkout-items mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                {selectedItems.map((id) => {
                  const product = products[id];
                  const isExtra = product.category === "extras";
                  const quantity = isExtra ? extras[id as ExtraId] : 1;
                  const unitPrice =
                    plan === "monthly" ? product.monthlyPrice : product.weeklyPrice;

                  return (
                    <div
                      key={id}
                      className="flex min-h-[72px] items-center gap-3 border-b border-black/9 py-2.5"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-white/50">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain p-1 mix-blend-multiply"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold tracking-[-0.02em] text-[#232320]">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-[#696963]">
                          {product.shortName}
                        </p>
                      </div>

                      {isExtra ? (
                        <div className="flex shrink-0 items-center rounded-full border border-black/10 bg-white/45">
                          <button
                            type="button"
                            onClick={() =>
                              onExtraQuantityChange(id as ExtraId, -1)
                            }
                            className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-black/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                            aria-label={`Remove one ${product.name}`}
                          >
                            <Minus aria-hidden="true" size={13} />
                          </button>
                          <span className="w-5 text-center text-xs font-semibold tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            disabled={id !== "display" || quantity >= 2}
                            onClick={() =>
                              onExtraQuantityChange(id as ExtraId, 1)
                            }
                            className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-black/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-25"
                            aria-label={`Add one ${product.name}`}
                          >
                            <Plus aria-hidden="true" size={13} />
                          </button>
                        </div>
                      ) : null}

                      <p className="w-[82px] shrink-0 text-right text-sm font-bold tabular-nums tracking-[-0.02em] text-[#242420]">
                        ${unitPrice * quantity}
                        <span className="ml-0.5 text-[9px] font-medium text-[#6e6e67]">
                          /{plan === "monthly" ? "mo" : "wk"}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-black/10 pt-3">
              <h3 className="text-base font-semibold tracking-[-0.03em] text-[#262623]">
                Delivery details
              </h3>

              <div className="mt-2 grid grid-cols-2 gap-2.5">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold text-[#55554f]">
                    Bali area
                  </span>
                  <span className="relative block">
                    <MapPin
                      aria-hidden="true"
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#66665f]"
                    />
                    <select
                      value={area}
                      onChange={(event) => setArea(event.target.value)}
                      className="min-h-12 w-full cursor-pointer appearance-none rounded-[14px] border border-black/12 bg-white/48 pl-9 pr-9 text-sm font-semibold text-[#272724] outline-none transition-colors focus:border-black/35 focus:ring-2 focus:ring-black/20"
                    >
                      <option>Canggu</option>
                      <option>Seminyak</option>
                      <option>Ubud</option>
                      <option>Uluwatu</option>
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold text-[#55554f]">
                    Delivery date
                  </span>
                  <span className="relative block">
                    <CalendarDays
                      aria-hidden="true"
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#66665f]"
                    />
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(event) => setDeliveryDate(event.target.value)}
                      min="2026-07-25"
                      className="min-h-12 w-full rounded-[14px] border border-black/12 bg-white/48 pl-9 pr-3 text-sm font-semibold text-[#272724] outline-none transition-colors focus:border-black/35 focus:ring-2 focus:ring-black/20"
                    />
                  </span>
                </label>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#44443f]">
                <span className="grid size-8 place-items-center rounded-full border border-[#cdd700]/55 bg-[#e7f000]/15 text-[#747b00]">
                  <Truck aria-hidden="true" size={15} />
                </span>
                Delivery, setup & pickup included
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={status === "loading"}
                className="mt-3 flex min-h-14 w-full cursor-pointer items-center justify-between rounded-[18px] bg-[#e4f000] px-5 text-[#171800] shadow-[0_14px_34px_rgba(138,148,0,0.22)] transition-all duration-200 hover:bg-[#f0fb12] active:scale-[0.988] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait"
              >
                <span className="text-left">
                  <span className="block text-base font-bold tracking-[-0.025em]">
                    Continue to rent
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold text-[#555a00]">
                    ${total} / {plan === "monthly" ? "month" : "week"}
                  </span>
                </span>
                {status === "loading" ? (
                  <LoaderCircle
                    aria-hidden="true"
                    size={21}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowRight aria-hidden="true" size={21} />
                )}
              </button>
              <p className="mt-2 text-center text-[11px] font-medium text-[#66665f]">
                No commitment <span aria-hidden="true">•</span> Swap items anytime
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
