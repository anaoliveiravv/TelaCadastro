"use client";

import { Modal } from "@heroui/react";
import type { ReactNode } from "react";
import { AppIcon } from "./AppIcon";

interface AppModalProps {
  title: string;
  description?: string;
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "cover" | "full";
}

export function AppModal({
  title,
  description,
  children,
  isOpen,
  onOpenChange,
  footer,
  size = "md",
}: AppModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size={size}>
          <Modal.Dialog className={size === "lg" ? "w-[min(900px,calc(100vw-32px))] max-h-[90dvh] max-w-none" : undefined}>
            <Modal.Header>
              <Modal.Heading className={size === "lg" ? "text-2xl font-semibold text-slate-800" : undefined}>{title}</Modal.Heading>
              {description ? <p className="text-sm text-slate-500">{description}</p> : null}
              <Modal.CloseTrigger aria-label="Fechar janela">
                <AppIcon className="size-5" icon="lucide:x" />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body className={size === "cover" || size === "full" ? "min-h-0 p-2" : undefined}>
              {children}
            </Modal.Body>
            {footer ? <Modal.Footer>{footer}</Modal.Footer> : null}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
