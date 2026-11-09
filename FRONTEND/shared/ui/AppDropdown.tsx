"use client";

import { Button, Dropdown, Label, Separator } from "@heroui/react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface AppDropdownItem {
  id: string;
  label: string;
  variant?: "default" | "danger";
  icon?: ReactNode;
}

interface AppDropdownProps {
  "aria-label": string;
  trigger: ReactNode;
  items: AppDropdownItem[];
  onAction: (id: string) => void;
  className?: string;
  placement?: "top" | "bottom";
}

export function AppDropdown({
  "aria-label": ariaLabel,
  trigger,
  items,
  onAction,
  className,
  placement = "bottom",
}: AppDropdownProps) {
  return (
    <Dropdown>
      <Button
        aria-label={ariaLabel}
        className={cn("h-auto min-h-0 bg-transparent text-white shadow-none", className)}
        variant="ghost"
      >
        {trigger}
      </Button>
      <Dropdown.Popover
        className="min-w-44 rounded-md border border-slate-200 bg-white p-1 shadow-lg"
        placement={placement}
      >
        <Dropdown.Menu
          aria-label={ariaLabel}
          onAction={(key) => {
            onAction(String(key));
          }}
        >
          {items.flatMap((item, index) => {
            const entry = (
              <Dropdown.Item
                className="rounded-sm px-2 py-1.5"
                id={item.id}
                key={item.id}
                textValue={item.label}
                variant={item.variant}
              >
                {item.icon}
                <Label>{item.label}</Label>
              </Dropdown.Item>
            );

            if (index === 0) return [entry];

            return [
              <Separator className="my-1 bg-slate-200" key={`sep-${item.id}`} />,
              entry,
            ];
          })}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
