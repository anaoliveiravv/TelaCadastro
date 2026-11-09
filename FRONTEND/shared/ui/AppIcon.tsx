"use client";

import { Icon } from "@iconify/react";

interface AppIconProps {
  icon: string;
  className?: string;
}

export function AppIcon({ icon, className }: AppIconProps) {
  return <Icon aria-hidden="true" className={className} icon={icon} />;
}
