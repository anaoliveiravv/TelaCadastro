"use client";

import { Switch } from "@heroui/react";

interface AppSwitchProps {
  isSelected: boolean;
  onChange: (value: boolean) => void;
  "aria-label": string;
  isDisabled?: boolean;
}

export function AppSwitch({
  isSelected,
  onChange,
  isDisabled = false,
  "aria-label": ariaLabel,
}: AppSwitchProps) {
  return (
    <Switch
      aria-label={ariaLabel}
      isDisabled={isDisabled}
      isSelected={isSelected}
      size="sm"
      onChange={onChange}
    >
      <Switch.Content>
        <Switch.Control aria-label={ariaLabel}>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}
