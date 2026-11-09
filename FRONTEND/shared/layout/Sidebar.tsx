"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { AppDropdown, AppIcon, AppScrollShadow, AppTypography } from "@/shared/ui";
import { useShell } from "./ShellContext";

const NAV_ITEMS = [
  { href: "/inicio", label: "Início", icon: "lucide:home" },
  { href: "/cadastros/pessoas", label: "Cadastros", icon: "lucide:users" },
  { href: "/contratos", label: "Contratos", icon: "lucide:file-text" },
  { href: "/relatorios", label: "Relatórios", icon: "lucide:bar-chart-3" },
] as const;

const OPEN_WIDTH = 256;
const CLOSED_WIDTH = 80;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { menuOpen } = useShell();
  const asideRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;

    const tween = gsap.to(aside, {
      width: menuOpen ? OPEN_WIDTH : CLOSED_WIDTH,
      duration: 0.35,
      ease: "power2.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [menuOpen]);

  return (
    <aside
      ref={asideRef}
      className="relative z-10 hidden h-full shrink-0 overflow-hidden bg-[#244969] text-white md:flex md:flex-col"
      style={{ width: OPEN_WIDTH }}
    >
      <div
        aria-hidden="true"
        className="port-bg pointer-events-none absolute inset-0 opacity-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#244969]/85"
      />
      <div className="relative flex h-16 shrink-0 items-center justify-center gap-2 px-3">
        <AppIcon className="size-7 shrink-0" icon="lucide:anchor" />
        {menuOpen ? (
          <AppTypography className="truncate text-white" type="h6" weight="semibold">
            Gestão Portuária
          </AppTypography>
        ) : (
          <span className="sr-only">Gestão Portuária</span>
        )}
      </div>
      <AppScrollShadow
        className="relative min-h-0 flex-1 px-3"
        orientation="vertical"
        size={40}
      >
        <nav aria-label="Principal" className="flex flex-col gap-1 pb-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/cadastros/pessoas"
                ? pathname === "/" || pathname.startsWith("/cadastros")
                : pathname === item.href;

            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-base transition-colors",
                  menuOpen ? "" : "justify-center px-0",
                  isActive
                    ? "bg-white/15 font-medium text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
                href={item.href}
                key={item.href}
                title={item.label}
              >
                <AppIcon className="size-5 shrink-0" icon={item.icon} />
                {menuOpen ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </AppScrollShadow>
      <div className="relative z-10 flex shrink-0 justify-center px-3 pb-4 pt-2">
        <AppDropdown
          aria-label="Menu do usuário"
          className="w-auto max-w-full overflow-visible px-2 py-2"
          placement="top"
          items={[
            {
              id: "profile",
              label: "Meu perfil",
              icon: <AppIcon className="size-5" icon="lucide:circle-user" />,
            },
            {
              id: "exit",
              label: "Sair",
              variant: "danger",
              icon: <AppIcon className="size-5" icon="lucide:log-out" />,
            },
          ]}
          trigger={
            <span className="flex items-center gap-2">
              <AppIcon className="size-8 shrink-0" icon="lucide:circle-user" />
              {menuOpen ? (
                <span className="text-left leading-tight">
                  <span className="block text-sm font-medium text-white">Usuário</span>
                  <span className="block text-xs text-slate-300">Operador</span>
                </span>
              ) : (
                <span className="sr-only">Usuário</span>
              )}
            </span>
          }
          onAction={(id) => {
            if (id === "exit") router.push("/inicio");
          }}
        />
      </div>
    </aside>
  );
}
