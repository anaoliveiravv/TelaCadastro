import type { ReactNode } from "react";
import { AppScrollCue, AppScrollShadow } from "@/shared/ui";
import { Navbar } from "./Navbar";
import { PageTransition } from "./PageTransition";
import { ShellProvider } from "./ShellContext";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ShellProvider>
      <div className="flex h-screen overflow-hidden bg-[#e8eef5]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <div className="relative min-h-0 min-w-0 flex-1">
            <AppScrollShadow
              className="h-full min-h-0 min-w-0 px-8 py-6"
              id="app-scroll"
              orientation="vertical"
              size={56}
            >
              <PageTransition>{children}</PageTransition>
            </AppScrollShadow>
            <AppScrollCue />
          </div>
        </div>
      </div>
    </ShellProvider>
  );
}
