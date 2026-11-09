"use client";

import { Toast, toast } from "@heroui/react";

export function AppToastProvider() {
  return <Toast.Provider aria-label="Notificações" placement="top end" />;
}

export const appToast = {
  success: (title: string, description?: string) =>
    toast.success(title, description ? { description } : undefined),
  danger: (title: string, description?: string) =>
    toast.danger(title, description ? { description } : undefined),
};
