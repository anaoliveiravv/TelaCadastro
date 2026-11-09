"use client";

import { Avatar } from "@heroui/react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface AppAvatarProps {
  src?: string | null;
  alt: string;
  fallback: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AppAvatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: AppAvatarProps) {
  return (
    <Avatar className={cn("shrink-0 overflow-hidden", className)} size={size}>
      {src ? (
        <Avatar.Image
          alt={alt}
          className="size-full object-cover object-center"
          src={src}
        />
      ) : null}
      <Avatar.Fallback className="flex size-full items-center justify-center">
        {fallback}
      </Avatar.Fallback>
    </Avatar>
  );
}
