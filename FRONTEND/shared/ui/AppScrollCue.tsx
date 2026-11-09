"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "./AppIcon";

export function scrollCueState(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
): { canUp: boolean; canDown: boolean } {
  const overflow = scrollHeight > clientHeight + 2;
  return {
    canUp: overflow && scrollTop > 8,
    canDown: overflow && scrollTop + clientHeight < scrollHeight - 8,
  };
}

interface AppScrollCueProps {
  targetId?: string;
}

export function AppScrollCue({ targetId = "app-scroll" }: AppScrollCueProps) {
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);

  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;

    const update = () => {
      const next = scrollCueState(root.scrollTop, root.clientHeight, root.scrollHeight);
      setCanUp(next.canUp);
      setCanDown(next.canDown);
    };

    update();
    root.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(root);
    return () => {
      root.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [targetId]);

  const go = (delta: number) => {
    document.getElementById(targetId)?.scrollBy({ top: delta, behavior: "smooth" });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {canUp ? (
        <div className="absolute inset-x-0 top-3 z-20 flex justify-center px-8">
          <button
            aria-label="Ver o que está acima"
            className="pointer-events-auto cursor-pointer rounded-full bg-[#0b2340]/30 p-1.5 text-white/90 shadow-sm hover:bg-[#0b2340]/50"
            type="button"
            onClick={() => go(-180)}
          >
            <AppIcon className="size-4" icon="lucide:chevron-up" />
          </button>
        </div>
      ) : null}
      {canDown ? (
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-8">
          <button
            aria-label="Ver o que está abaixo"
            className="scroll-hint-down pointer-events-auto cursor-pointer rounded-full bg-[#0b2340]/30 p-1.5 text-white/90 shadow-sm hover:bg-[#0b2340]/50"
            type="button"
            onClick={() => go(180)}
          >
            <AppIcon className="size-4" icon="lucide:chevron-down" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
