"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { AppSectionNav } from "@/shared/ui";
import { useShell } from "./ShellContext";

const OPEN_WIDTH = 196;
const CLOSED_WIDTH = 0;

export function A11ySidebar() {
  const { a11yItems, a11yOpen } = useShell();
  const asideRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;

    const tween = gsap.to(aside, {
      width: a11yOpen ? OPEN_WIDTH : CLOSED_WIDTH,
      duration: 0.35,
      ease: "power2.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [a11yOpen]);

  if (a11yItems.length === 0) return null;

  return (
    <aside
      ref={asideRef}
      aria-label="Linha do tempo das seções"
      className="relative z-10 hidden h-full min-h-0 shrink-0 flex-col overflow-hidden bg-transparent py-4 pr-1 md:flex"
      style={{ width: OPEN_WIDTH }}
    >
      {a11yOpen ? <AppSectionNav aria-label="Ir para seção" items={a11yItems} /> : null}
    </aside>
  );
}
