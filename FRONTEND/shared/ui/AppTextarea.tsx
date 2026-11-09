"use client";

import { FieldError, Label, TextArea, TextField } from "@heroui/react";

interface AppTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
  name?: string;
  "aria-label"?: string;
}

export function AppTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 3,
  name,
  "aria-label": ariaLabel,
}: AppTextareaProps) {
  const accessibleName = ariaLabel || label || undefined;

  return (
    <TextField
      aria-label={accessibleName}
      className="w-full gap-1"
      isInvalid={Boolean(error)}
      name={name}
      value={value}
      onChange={onChange}
    >
      {label ? (
        <Label className="flex h-5 items-center text-xs font-medium text-slate-600">
          {label}
        </Label>
      ) : accessibleName ? (
        <Label className="sr-only">{accessibleName}</Label>
      ) : null}
      <TextArea
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-none"
        placeholder={placeholder}
        rows={rows}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </TextField>
  );
}
