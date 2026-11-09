"use client";

import { Button } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type HeroButtonProps = ComponentProps<typeof Button>;

interface AppButtonProps
  extends Pick<
    HeroButtonProps,
    "variant" | "size" | "isDisabled" | "type" | "isPending" | "isIconOnly" | "fullWidth"
  > {
  label?: string;
  children?: ReactNode;
  className?: string;
  onPress?: () => void;
  "aria-label"?: string;
}

export function AppButton({
  label,
  children,
  onPress,
  className,
  isIconOnly,
  "aria-label": ariaLabel,
  ...rest
}: AppButtonProps) {
  const content = children ?? label;

  return (
    <Button
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      className={className}
      isIconOnly={isIconOnly}
      onPress={onPress}
      {...rest}
    >
      {isIconOnly ? <span className="inline-flex">{content}</span> : content}
    </Button>
  );
}
