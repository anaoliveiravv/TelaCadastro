"use client";

import { AppButton, AppCard, AppDatePicker, AppIcon, AppInput } from "@/shared/ui";
import { maskCpf } from "@/shared/utils/masks";
import type { PeopleFilters } from "../types/person.types";

interface SearchFiltersProps {
  value: PeopleFilters;
  onChange: (value: PeopleFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function SearchFilters({ value, onChange, onSearch, onClear }: SearchFiltersProps) {
  const patch = (partial: Partial<PeopleFilters>): void => {
    onChange({ ...value, ...partial });
  };

  return (
    <AppCard className="h-full" title="Pesquisar cadastros">
      <div className="grid grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-2">
        <AppInput label="CPF" placeholder="000.000.000-00" value={value.cpf} onChange={(cpf) => patch({ cpf: maskCpf(cpf) })} />
        <AppInput className="lg:col-start-1 lg:row-start-2" label="Nome" placeholder="Digite o nome da pessoa" value={value.name} onChange={(name) => patch({ name })} />
        <AppDatePicker aria-label="Início do contrato" className="[&>label]:h-6 [&>label]:text-sm [&>span:first-child]:h-6 [&>span:first-child]:text-sm lg:col-start-2 lg:row-start-1" label="Início do contrato" value={value.contractStart} onChange={(contractStart) => patch({ contractStart })} />
        <AppDatePicker aria-label="Término do contrato" className="[&>label]:h-6 [&>label]:text-sm [&>span:first-child]:h-6 [&>span:first-child]:text-sm lg:col-start-2 lg:row-start-2" label="Término do contrato" value={value.contractEnd} onChange={(contractEnd) => patch({ contractEnd })} />
        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-3 lg:col-span-2">
          <AppButton variant="outline" onPress={onClear}>
            <AppIcon className="size-4" icon="lucide:rotate-ccw" />
            Limpar filtros
          </AppButton>
          <AppButton onPress={onSearch}>
            <AppIcon className="size-5" icon="lucide:search" />
            Buscar
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
