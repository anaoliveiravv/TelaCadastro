"use client";

import { Sheet } from "@heroui/react";
import type { ReactNode } from "react";

interface AppSheetProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: ReactNode;
}

export function AppSheet({ title, children, isOpen, onOpenChange, footer }: AppSheetProps) {
  return (
    <Sheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <Sheet.Backdrop>
        <Sheet.Content className="mx-auto max-h-[95vh] max-w-[420px]">
          <Sheet.Dialog>
            <Sheet.Handle />
            <Sheet.CloseTrigger aria-label="Fechar" />
            <Sheet.Header>
              <Sheet.Heading>{title}</Sheet.Heading>
            </Sheet.Header>
            <Sheet.Body>{children}</Sheet.Body>
            {footer ? <Sheet.Footer>{footer}</Sheet.Footer> : null}
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  );
}
