"use client";

import { ScrollShadow } from "@heroui/react";
import type { ComponentProps } from "react";

type AppScrollShadowProps = ComponentProps<typeof ScrollShadow>;

export function AppScrollShadow(props: AppScrollShadowProps) {
  return <ScrollShadow {...props} />;
}
