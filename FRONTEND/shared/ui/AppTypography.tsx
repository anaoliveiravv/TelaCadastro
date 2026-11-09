"use client";

import { Typography } from "@heroui/react";
import type { ComponentProps } from "react";

type AppTypographyProps = ComponentProps<typeof Typography> & {
  as?: "span" | "p";
};

export function AppTypography({ as, render: _render, ...props }: AppTypographyProps) {
  if (!as) return <Typography {...props} />;

  return <Typography {...props} {...{ elementType: as }} />;
}
