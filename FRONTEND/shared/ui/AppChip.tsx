"use client";

import { Chip } from "@heroui/react";
import type { ComponentProps } from "react";

type HeroChipProps = ComponentProps<typeof Chip>;

interface AppChipProps {
  label: string;
  color?: HeroChipProps["color"];
  variant?: HeroChipProps["variant"];
  size?: HeroChipProps["size"];
}

export function AppChip({
  label,
  color = "default",
  variant = "soft",
  size = "sm",
}: AppChipProps) {
  return (
    <Chip color={color} size={size} variant={variant}>
      <Chip.Label>{label}</Chip.Label>
    </Chip>
  );
}
