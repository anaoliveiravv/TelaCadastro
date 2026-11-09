"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { AppAlert, AppIcon, AppTypography } from "@/shared/ui";
import { useShell } from "./ShellContext";

function titleForPath(pathname: string): string {
  if (pathname.startsWith("/contratos")) return "Contratos";
  if (pathname.startsWith("/relatorios")) return "Relatórios";
  if (pathname.startsWith("/inicio")) return "Início";
  return "Cadastro de pessoas";
}

function helpForPath(pathname: string): { title: string; description: string } {
  if (pathname.startsWith("/contratos")) {
    return {
      title: "Contratos",
      description:
        "Acompanhe os contratos da operação portuária vinculados às pessoas cadastradas. Este módulo ainda está em construção.",
    };
  }

  if (pathname.startsWith("/relatorios")) {
    return {
      title: "Relatórios",
      description:
        "Consulte relatórios e indicadores da operação. Este módulo ainda está em construção.",
    };
  }

  if (pathname.startsWith("/inicio")) {
    return {
      title: "Início",
      description:
        "Painel inicial da gestão portuária. Use o menu ao lado para abrir cadastros, contratos e relatórios.",
    };
  }

  return {
    title: "Cadastro de pessoas",
    description:
      "Pesquise, inclua e atualize pessoas da operação: dados pessoais, endereço, contrato, foto e anexos.",
  };
}

export function Navbar() {
  const pathname = usePathname();
  const { menuOpen, toggleMenu } = useShell();
  const [helpFor, setHelpFor] = useState<string | null>(null);
  const help = helpForPath(pathname);
  const helpOpen = helpFor === pathname;

  return (
    <div className="relative z-20 mx-8 shrink-0">
      <header className="relative isolate overflow-hidden rounded-b-2xl bg-[#244969] text-white shadow-[0_10px_28px_rgba(11,35,64,0.22)]">
        <div
          aria-hidden="true"
          className="port-bg pointer-events-none absolute inset-0 opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#244969]/85"
        />
        <div className="relative flex h-16 items-center justify-center px-4">
          <button
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="absolute left-3 z-10 inline-flex size-10 items-center justify-center rounded-md text-white hover:bg-white/10"
            type="button"
            onClick={toggleMenu}
          >
            <AppIcon
              className="size-6"
              icon={menuOpen ? "lucide:x" : "lucide:menu"}
            />
          </button>
          <div className="relative flex items-center gap-1" data-preserve-person-selection>
            <AppTypography className="text-white" type="h4" weight="semibold">
              {titleForPath(pathname)}
            </AppTypography>
            <button
              aria-expanded={helpOpen}
              aria-label={`Sobre ${help.title}`}
              className="inline-flex size-10 items-center justify-center rounded-md text-white hover:bg-white/10"
              type="button"
              onClick={() =>
                setHelpFor((current) => (current === pathname ? null : pathname))
              }
            >
              <AppIcon className="size-6" icon="lucide:info" />
            </button>
          </div>

        </div>
        <div
          data-preserve-person-selection
          className={cn(
            "relative grid transition-[grid-template-rows] duration-300 ease-out",
            helpOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="px-4 pb-4">
              <AppAlert
                className="bg-sky-100"
                description={help.description}
                status="accent"
                title={help.title}
                onClose={() => setHelpFor(null)}
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
