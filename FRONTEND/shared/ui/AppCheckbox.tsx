"use client";

import { Checkbox, Label } from "@heroui/react";

interface AppCheckboxProps {
  label: string;
  isSelected: boolean;
  onChange: (value: boolean) => void;
  isDisabled?: boolean;
  name?: string;
}

export function AppCheckbox({
  label,
  isSelected,
  onChange,
  isDisabled = false,
  name,
}: AppCheckboxProps) {
  return (
    <Checkbox
      aria-label={label}
      isDisabled={isDisabled}
      isSelected={isSelected}
      name={name}
      onChange={onChange}
    >
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Label className="text-sm text-slate-700">{label}</Label>
      </Checkbox.Content>
    </Checkbox>
  );
}
