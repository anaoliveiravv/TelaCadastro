"use client";

import { useEffect, useRef, useState } from "react";

import {
  AppButton,
  AppCard,
  AppChip,
  AppIcon,
  AppSwitch,
  AppTable,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/ui";
import { openFancyboxImage } from "@/shared/ui/AppFancybox";
import { formatBrl, formatDateRange, maskBrlPreview, maskCpfPreview } from "@/shared/utils/masks";
import type { Person } from "../types/person.types";

interface PeopleTableProps {
  isDemo?: boolean;
  people: Person[];
  selectedId: string | null;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onCreate: () => void;
  onEdit: (person: Person) => void;
  onViewPhoto: (person: Person) => void;
  onSelect: (person: Person | null) => void;
  onResendConfirmation: (person: Person) => void;
  isResending: boolean;
  onDelete: (person: Person) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export function PeopleTable({
  people,
  selectedId,
  isDemo = false,
  isPending,
  isError,
  onRetry,
  onCreate,
  onEdit,
  onViewPhoto,
  onSelect,
  onResendConfirmation,
  isResending,
  onDelete,
  onToggle,
}: PeopleTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(people.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visiblePeople = people.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisible = people.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisible = Math.min(currentPage * pageSize, people.length);

  const [visiblePrivateInfoIds, setVisiblePrivateInfoIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!selectedId) return;
    const clearOnOutsidePress = (event: PointerEvent): void => {
      const target = event.target as HTMLElement;
      if (
        !tableRef.current?.contains(target) &&
        !target.closest("[data-preserve-person-selection]")
      ) onSelect(null);
    };
    document.addEventListener("pointerdown", clearOnOutsidePress);
    return () => document.removeEventListener("pointerdown", clearOnOutsidePress);
  }, [selectedId, onSelect]);

  const togglePrivateInfo = (id: string): void => {
    setVisiblePrivateInfoIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <AppCard
      className="min-w-0"
      headerAction={
        <AppButton size="sm" onPress={onCreate}>
          <AppIcon className="size-5" icon="lucide:plus" />
          Incluir novo registro
        </AppButton>
      }
      title="Resultados da pesquisa"
    >
      {isDemo ? <p className="mb-3 text-xs text-slate-500">Cadastros de demonstração — alterações válidas nesta sessão.</p> : null}
      {isPending ? <LoadingState label="Carregando cadastros" /> : null}
      {isError ? (
        <ErrorState message="Não foi possível carregar os cadastros." onRetry={onRetry} />
      ) : null}
      {!isPending && !isError && people.length === 0 ? (
        <EmptyState title="Nenhum cadastro encontrado" />
      ) : null}
      {!isPending && !isError && people.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200" ref={tableRef}>
          <AppTable>
            <AppTable.ScrollContainer>
              <AppTable.Content
                aria-label="Resultados da pesquisa de pessoas"
                className="min-w-[860px]"
              >
                <AppTable.Header className="sticky top-0 z-10 bg-slate-100">
                  <AppTable.Column isRowHeader>CPF</AppTable.Column>
                  <AppTable.Column>Nome</AppTable.Column>
                  <AppTable.Column>Salário</AppTable.Column>
                  <AppTable.Column>Período de contrato</AppTable.Column>
                  <AppTable.Column>Situação</AppTable.Column>
                  <AppTable.Column>Foto</AppTable.Column>
                  <AppTable.Column>Ações</AppTable.Column>
                  <AppTable.Column>Ativar/desativar</AppTable.Column>
                </AppTable.Header>
                <AppTable.Body>
                  {visiblePeople.map((person) => (
                    <AppTable.Row
                      aria-selected={selectedId === person.id}
                      className={`align-middle cursor-pointer [&>td]:h-16 [&>td]:py-4 ${selectedId === person.id ? "bg-blue-50 [&>td]:bg-blue-50" : "hover:bg-slate-50"}`}
                      id={person.id}
                      key={person.id}
                      onClick={(event) => {
                        if (!(event.target as HTMLElement).closest("button, input, [role='switch']")) onSelect(person);
                      }}
                      onAction={() => onSelect(person)}
                    >
                      <AppTable.Cell>
                        <span className="inline-block w-[15ch] whitespace-nowrap font-mono tabular-nums">
                          {visiblePrivateInfoIds.has(person.id) ? person.cpf : maskCpfPreview(person.cpf)}
                        </span>
                      </AppTable.Cell>
                      <AppTable.Cell>
                        {person.name}
                      </AppTable.Cell>
                      <AppTable.Cell>
                        <span className="inline-block w-[15ch] whitespace-nowrap tabular-nums">
                          {visiblePrivateInfoIds.has(person.id) ? formatBrl(person.salary) : maskBrlPreview()}
                        </span>
                      </AppTable.Cell>
                      <AppTable.Cell>
                        {formatDateRange(person.contractStart, person.contractEnd)}
                      </AppTable.Cell>
                      <AppTable.Cell>
                        {person.status === "active" ? (
                          <AppChip color="success" label="Ativo" />
                        ) : (
                          <AppChip color="default" label="Inativo" />
                        )}
                      </AppTable.Cell>
                      <AppTable.Cell>
                        <AppButton
                          isIconOnly
                          aria-label={`Visualizar foto de ${person.name}`}
                          size="sm"
                          variant="ghost"
                          onPress={() => {
                            onViewPhoto(person);
                            void openFancyboxImage(person.photoUrl, person.name);
                          }}
                        >
                          <AppIcon className="size-5 text-blue-600" icon="lucide:image" />
                        </AppButton>
                      </AppTable.Cell>
                      <AppTable.Cell>
                        <div className="flex items-center gap-1">
                          <AppButton
                            isIconOnly
                            aria-label={`Reenviar confirmação de e-mail para ${person.name}`}
                            isPending={isResending}
                            size="sm"
                            variant="ghost"
                            onPress={() => onResendConfirmation(person)}
                          >
                            <AppIcon className="size-5 text-blue-600" icon="lucide:mail" />
                          </AppButton>
                          <AppButton
                            isIconOnly
                            aria-label={`Editar ${person.name}`}
                            size="sm"
                            variant="ghost"
                            onPress={() => onEdit(person)}
                          >
                            <AppIcon className="size-5 text-blue-600" icon="lucide:pencil" />
                          </AppButton>
                          <AppButton
                            isIconOnly
                            aria-label={`Excluir ${person.name}`}
                            size="sm"
                            variant="ghost"
                            onPress={() => onDelete(person)}
                          >
                            <AppIcon className="size-5 text-red-500" icon="lucide:trash-2" />
                          </AppButton>
                          <AppButton
                            isIconOnly
                            aria-label={`${visiblePrivateInfoIds.has(person.id) ? "Ocultar" : "Mostrar"} CPF e salário de ${person.name}`}
                            size="sm"
                            variant="ghost"
                            onPress={() => togglePrivateInfo(person.id)}
                          >
                            <AppIcon
                              className="size-5 text-blue-600"
                              icon={visiblePrivateInfoIds.has(person.id) ? "lucide:eye-off" : "lucide:eye"}
                            />
                          </AppButton>
                        </div>
                      </AppTable.Cell>
                      <AppTable.Cell>
                        <AppSwitch
                          aria-label={`Ativar ou desativar ${person.name}`}
                          isSelected={person.isActive}
                          onChange={(isActive) => onToggle(person.id, isActive)}
                        />
                      </AppTable.Cell>
                    </AppTable.Row>
                  ))}
                </AppTable.Body>
              </AppTable.Content>
            </AppTable.ScrollContainer>
          </AppTable>
        </div>
      ) : null}
      {!isPending && !isError && people.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>Exibindo {firstVisible}–{lastVisible} de {people.length} registros</span>
          <nav aria-label="Paginação dos resultados" className="flex items-center gap-2">
            <button
              aria-label="Página anterior"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === 1}
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
            >
              <AppIcon className="size-4" icon="lucide:chevron-left" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button
                aria-current={currentPage === pageNumber ? "page" : undefined}
                aria-label={`Página ${pageNumber}`}
                className={currentPage === pageNumber
                  ? "rounded-md bg-blue-100 px-3 py-1 font-medium text-blue-700"
                  : "rounded-md px-3 py-1 font-medium text-slate-700 hover:bg-slate-100"}
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              aria-label="Próxima página"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === pageCount}
              type="button"
              onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
            >
              <AppIcon className="size-4" icon="lucide:chevron-right" />
            </button>
          </nav>
        </div>
      ) : null}
    </AppCard>
  );
}
