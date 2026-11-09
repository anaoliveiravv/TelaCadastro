"use client";

import { getLocalTimeZone, parseDate, today, type DateValue } from "@internationalized/date";
import {
  Calendar,
  DateField,
  DatePicker,
  Description,
  FieldError,
  Label,
} from "@heroui/react";
import { useSyncExternalStore } from "react";
import { cn } from "@/shared/lib/cn";
import { AppIcon } from "./AppIcon";

function subscribe(): () => void {
  return () => undefined;
}

function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

interface AppDatePickerProps {
  className?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  "aria-label"?: string;
}

function toDateValue(iso: string): DateValue | null {
  if (!iso) return null;
  try {
    return parseDate(iso);
  } catch {
    return null;
  }
}

function toIso(value: DateValue | null): string {
  if (!value) return "";
  const year = String(value.year).padStart(4, "0");
  const month = String(value.month).padStart(2, "0");
  const day = String(value.day).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const SEGMENT_LABEL: Record<string, string> = {
  day: "Dia",
  month: "Mês",
  year: "Ano",
  era: "Era",
  literal: "separador de data",
};

function segmentAriaLabel(type: string, text: string): string {
  return SEGMENT_LABEL[type] ?? text ?? type;
}

function DateFieldChrome({
  label,
  isRequired,
}: {
  label: string;
  isRequired: boolean;
}) {
  if (!label) return null;

  return (
    <span className="flex h-6 items-center text-sm font-medium text-slate-700">
      {label}
      {isRequired ? <span className="text-red-500"> *</span> : null}
    </span>
  );
}

export function AppDatePicker({
  className,
  label,
  value,
  onChange,
  error,
  hint,
  isRequired = false,
  isDisabled = false,
  "aria-label": ariaLabel,
}: AppDatePickerProps) {
  const calendarLabel = ariaLabel || label || "Escolher data";
  const isClient = useIsClient();
  const currentDate = today(getLocalTimeZone());
  const minValue = currentDate.subtract({ years: 120 });
  const maxValue = currentDate.add({ years: 120 });

  if (!isClient) {
    return (
      <div className={cn(label ? "flex w-full min-w-0 flex-col gap-1" : "w-full min-w-0", className)}>
        <DateFieldChrome isRequired={isRequired} label={label} />
        <div className="flex h-10 min-h-10 w-full min-w-0 items-center justify-between gap-1 rounded-md border border-slate-200 bg-white px-2 text-base text-slate-400">
          <span className="truncate">dd/mm/aaaa</span>
          <AppIcon className="size-4 shrink-0" icon="lucide:calendar" />
        </div>
      </div>
    );
  }

  return (
    <DatePicker
      aria-label={calendarLabel}
      aria-required={isRequired}
      className={cn(label ? "w-full min-w-0 gap-1" : "w-full min-w-0", className)}
      granularity="day"
      isDisabled={isDisabled}
      isInvalid={Boolean(error)}
      minValue={minValue}
      maxValue={maxValue}
      shouldForceLeadingZeros
      value={toDateValue(value)}
      onChange={(next) => onChange(toIso(next))}
    >
      {label ? (
        <Label className="flex h-5 items-center text-xs font-medium text-slate-600">
          {label}
          {isRequired ? <span className="text-red-500"> *</span> : null}
        </Label>
      ) : (
        <Label className="sr-only">{calendarLabel}</Label>
      )}
      <DateField.Group
        className="flex h-10 min-h-10 w-full min-w-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-base shadow-none"
        fullWidth
      >
        <DateField.Input className="min-w-0 flex-1 overflow-hidden">
          {(segment) => (
            <DateField.Segment
              aria-label={segmentAriaLabel(segment.type, segment.text)}
              segment={segment}
            />
          )}
        </DateField.Input>
        <DateField.Suffix className="shrink-0">
          <DatePicker.Trigger
            aria-label={`Abrir calendário ${calendarLabel}`}
            className="inline-flex size-6 shrink-0 items-center justify-center"
          >
            <DatePicker.TriggerIndicator>
              <AppIcon className="size-4" icon="lucide:calendar" />
            </DatePicker.TriggerIndicator>
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      {error ? <FieldError>{error}</FieldError> : null}
      {!error && hint ? (
        <Description className="text-[11px] text-slate-400">{hint}</Description>
      ) : null}
      <DatePicker.Popover>
        <Calendar aria-label={calendarLabel}>
          <Calendar.Header>
            <Calendar.YearPickerTrigger aria-label="Escolher ano">
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton aria-label="Mês anterior" slot="previous" />
            <Calendar.NavButton aria-label="Próximo mês" slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}
