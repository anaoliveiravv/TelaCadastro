"use client";

import { AppIcon } from "./AppIcon";
import { AppTypography } from "./AppTypography";

export interface AppSectionNavItem {
  id: string;
  label: string;
  icon: string;
}

interface AppSectionNavProps {
  "aria-label": string;
  items: AppSectionNavItem[];
}

function scrollToSection(id: string) {
  const el =
    document.getElementById(`secao-${id}`) ??
    document.querySelector(`[data-section="secao-${id}"]`);
  const root = document.getElementById("app-scroll");
  if (!el) return;
  if (root) {
    const top =
      el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 12;
    root.scrollTo({ top, behavior: "smooth" });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AppSectionNav({
  "aria-label": ariaLabel,
  items,
}: AppSectionNavProps) {
  return (
    <nav aria-label={ariaLabel} className="flex min-h-0 flex-1 flex-col">
      <ol className="relative flex min-h-0 flex-1 flex-col justify-between">
        <span
          aria-hidden="true"
          className="absolute top-5 bottom-5 left-5 w-0.5 bg-blue-300"
        />
        {items.map((item) => (
          <li key={item.id} className="relative shrink-0">
            <button
              className="flex w-full cursor-pointer items-center gap-2 py-1 pr-0 text-left text-slate-600 hover:text-blue-700"
              type="button"
              onClick={() => scrollToSection(item.id)}
            >
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white ring-4 ring-[#e8eef5]">
                <AppIcon className="size-5" icon={item.icon} />
              </span>
              <AppTypography as="span" type="body-xs" weight="medium">
                {item.label}
              </AppTypography>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
