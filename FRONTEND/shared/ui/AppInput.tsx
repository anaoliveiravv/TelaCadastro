"use client";

import { Description, FieldError, Input, Label, TextField } from "@heroui/react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface AppInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  type?: "text" | "email" | "password" | "tel" | "date";
  isRequired?: boolean;
  isDisabled?: boolean;
  name?: string;
  suffix?: ReactNode;
  className?: string;
  "aria-label"?: string;
  onBlur?: () => void;
}

export function AppInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  type = "text",
  isRequired = false,
  isDisabled = false,
  name,
  suffix,
  className,
  "aria-label": ariaLabel,
  onBlur,
}: AppInputProps) {
  const accessibleName = ariaLabel || label || undefined;

  return (
    <TextField
      aria-label={accessibleName}
      aria-required={isRequired}
      className={cn("w-full min-w-0 gap-1", className)}
      isDisabled={isDisabled}
      isInvalid={Boolean(error)}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
    >
      {label ? (
        <Label className="flex h-6 items-center text-sm font-medium text-slate-700">
          {label}
          {isRequired ? <span className="text-red-500"> *</span> : null}
        </Label>
      ) : accessibleName ? (
        <Label className="sr-only">{accessibleName}</Label>
      ) : null}
      <div className="relative">
        <Input
          aria-label={label ? undefined : accessibleName}
          className={cn(
            "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-base text-slate-800 shadow-none",
            suffix ? "pr-32" : null,
          )}
          placeholder={placeholder}
          onBlur={onBlur}
        />
        {suffix ? (
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            {suffix}
          </div>
        ) : null}
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
      {!error && hint ? (
        <Description className="text-[11px] leading-4 text-slate-400">{hint}</Description>
      ) : null}
    </TextField>
  );
}
