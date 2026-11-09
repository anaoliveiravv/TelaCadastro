"use client";

import { Alert, CloseButton } from "@heroui/react";
import { cn } from "@/shared/lib/cn";

interface AppAlertProps {
  title: string;
  description: string;
  status?: "default" | "accent" | "success" | "warning" | "danger";
  className?: string;
  onClose?: () => void;
}

export function AppAlert({
  title,
  description,
  status = "accent",
  className,
  onClose,
}: AppAlertProps) {
  return (
    <Alert className={cn("rounded-md", className)} status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
      {onClose ? (
        <CloseButton aria-label="Fechar informação" onPress={onClose} />
      ) : null}
    </Alert>
  );
}
