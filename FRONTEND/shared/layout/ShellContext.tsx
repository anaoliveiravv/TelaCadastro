"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppSectionNavItem } from "@/shared/ui";

interface ShellContextValue {
  menuOpen: boolean;
  toggleMenu: () => void;
  a11yItems: AppSectionNavItem[];
  a11yOpen: boolean;
  toggleA11y: () => void;
  setA11yItems: (items: AppSectionNavItem[]) => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

interface ShellProviderProps {
  children: ReactNode;
}

export function ShellProvider({ children }: ShellProviderProps) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [a11yOpen, setA11yOpen] = useState(true);
  const [a11yItems, setA11yItems] = useState<AppSectionNavItem[]>([]);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);
  const toggleA11y = useCallback(() => setA11yOpen((open) => !open), []);
  const value = useMemo(
    () => ({
      menuOpen,
      toggleMenu,
      a11yItems,
      a11yOpen,
      toggleA11y,
      setA11yItems,
    }),
    [menuOpen, toggleMenu, a11yItems, a11yOpen, toggleA11y],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell precisa do ShellProvider");
  }
  return context;
}

export function useA11yNav(items: AppSectionNavItem[]): void {
  const { setA11yItems } = useShell();

  useLayoutEffect(() => {
    setA11yItems(items);
    return () => setA11yItems([]);
  }, [items, setA11yItems]);
}
