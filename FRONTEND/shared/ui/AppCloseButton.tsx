"use client";

import { Button } from "@heroui/react";
import { AppIcon } from "./AppIcon";

interface AppCloseButtonProps {
  onPress: () => void;
  "aria-label"?: string;
  className?: string;
}

export function AppCloseButton({
  onPress,
  "aria-label": ariaLabel = "Fechar",
  className,
}: AppCloseButtonProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      isIconOnly
      size="sm"
      variant="ghost"
      onPress={onPress}
    >
      <span className="inline-flex">
        <AppIcon className="size-4" icon="lucide:x" />
      </span>
    </Button>
  );
}
