"use client";

import {
  Autocomplete,
  Description,
  FieldError,
  Label,
  ListBox,
  SearchField,
  Select,
  useFilter,
} from "@heroui/react";

interface AppSelectOption {
  id: string;
  label: string;
}

interface AppSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isSearchable?: boolean;
  name?: string;
}

export function AppSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione",
  error,
  hint,
  isRequired = false,
  isDisabled = false,
  isSearchable = false,
  name,
}: AppSelectProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  const selected = value ? value : null;
  const labelNode = (
    <Label className="flex h-5 items-center text-xs font-medium text-slate-600">
      {label}
      {isRequired ? <span className="text-red-500"> *</span> : null}
    </Label>
  );
  const items = options.map((option) => (
    <ListBox.Item id={option.id} key={option.id} textValue={option.label}>
      {option.label}
      <ListBox.ItemIndicator />
    </ListBox.Item>
  ));
  const hintNode =
    error ? (
      <FieldError>{error}</FieldError>
    ) : hint ? (
      <Description className="text-[11px] leading-4 text-slate-400">{hint}</Description>
    ) : null;

  if (isSearchable) {
    return (
      <Autocomplete
        allowsEmptyCollection
        aria-label={label}
        className="w-full min-w-0 gap-1"
        fullWidth
        aria-required={isRequired}
        isDisabled={isDisabled}
        isInvalid={Boolean(error)}
        name={name}
        placeholder={placeholder}
        value={selected}
        onChange={(key) => {
          if (typeof key === "string") onChange(key);
        }}
      >
        {labelNode}
        <Autocomplete.Trigger className="h-9 min-h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-none">
          <Autocomplete.Value />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover placement="bottom" shouldFlip={false}>
          <Autocomplete.Filter filter={contains}>
            <SearchField aria-label="Pesquisar" className="px-2 pt-2">
              <Label className="sr-only">Pesquisar</Label>
              <SearchField.Group className="rounded-md border border-slate-200">
                <SearchField.SearchIcon />
                <SearchField.Input aria-label="Pesquisar" placeholder="Pesquisar" />
              </SearchField.Group>
            </SearchField>
            <ListBox aria-label={label}>{items}</ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
        {hintNode}
      </Autocomplete>
    );
  }

  return (
    <Select
      aria-label={label}
      className="w-full min-w-0 gap-1"
      aria-required={isRequired}
      isDisabled={isDisabled}
      isInvalid={Boolean(error)}
      name={name}
      placeholder={placeholder}
      selectedKey={selected}
      onSelectionChange={(key) => {
        if (key === null) return;
        onChange(String(key));
      }}
    >
      {labelNode}
      <Select.Trigger className="h-9 min-h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-none">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover placement="bottom" shouldFlip={false}>
        <ListBox aria-label={label}>{items}</ListBox>
      </Select.Popover>
      {hintNode}
    </Select>
  );
}
