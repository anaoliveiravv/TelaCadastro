"use client";

import { AppButton, AppIcon, AppModal, AppSheet, type AppSectionNavItem } from "@/shared/ui";
import { useA11yNav } from "@/shared/layout/ShellContext";
import { usePeopleDirectory } from "../hooks/usePeople";
import { PeopleForm } from "./PeopleForm";
import { PeopleTable } from "./PeopleTable";
import { PhotoPreview } from "./PhotoPreview";
import { SearchFilters } from "./SearchFilters";

const PAGE_SECTIONS: AppSectionNavItem[] = [
  { id: "inicio", label: "Início", icon: "lucide:home" },
  { id: "pesquisar", label: "Pesquisar cadastros", icon: "lucide:search" },
  { id: "resultados", label: "Resultados da pesquisa", icon: "lucide:table" },
  { id: "cadastro", label: "Novo cadastro", icon: "lucide:user-plus" },
];

export function PeoplePage() {
  const directory = usePeopleDirectory();
  useA11yNav(PAGE_SECTIONS);

  return (
    <div className="scroll-mt-8 space-y-3 sm:space-y-4" id="secao-inicio">
      <div className="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="scroll-mt-8 min-w-0" id="secao-pesquisar">
          <SearchFilters
            value={directory.draftFilters}
            onChange={directory.setDraftFilters}
            onSearch={directory.search}
            onClear={directory.clearFilters}
          />
        </div>
        <PhotoPreview person={directory.selectedPerson} />
      </div>
      <div className="scroll-mt-8 min-w-0" id="secao-resultados">
            <PeopleTable
              isDemo={directory.isDemo}
              isError={directory.isError}
              isPending={directory.isPending}
              people={directory.people}
              selectedId={directory.selectedId}
              isResending={directory.isResending}
              onCreate={directory.startCreate}
              onDelete={directory.askDelete}
              onEdit={directory.startEdit}
              onRetry={() => {
                void directory.refetch();
              }}
              onSelect={(person) => directory.selectPerson(person?.id ?? null)}
              onResendConfirmation={(person) => void directory.resendConfirmation(person)}
              onToggle={directory.toggle}
              onViewPhoto={(person) => directory.selectPerson(person.id)}
            />
      </div>

      <AppModal
        isOpen={directory.isFormOpen}
        description={
          directory.editingId
            ? "Atualize os dados do cadastro. * Campos obrigatórios"
            : "* Campos obrigatórios"
        }
        size="lg"
        title={directory.editingId ? "Editar cadastro" : "Novo cadastro"}
        onOpenChange={(open) => {
          if (!open) directory.cancelForm();
        }}
      >
        <PeopleForm
          key={directory.editingId ?? "create"}
          isSaving={directory.isSaving}
          values={directory.formValues}
          onCancel={directory.cancelForm}
          onSubmit={directory.save}
        />
      </AppModal>

      <AppModal
        footer={
          <div className="flex justify-end gap-2">
            <AppButton
              variant="outline"
              onPress={() => directory.askDelete(null)}
            >
              Cancelar
            </AppButton>
            <AppButton
              isPending={directory.isDeleting}
              variant="danger"
              onPress={directory.confirmDelete}
            >
              Excluir
            </AppButton>
          </div>
        }
        isOpen={directory.personToDelete !== null}
        title="Excluir cadastro"
        onOpenChange={(open) => {
          if (!open) directory.askDelete(null);
        }}
      >
        <p>
          Excluir o cadastro de{" "}
          <strong>{directory.personToDelete?.name ?? "esta pessoa"}</strong>?
        </p>
      </AppModal>

      <AppSheet
        footer={
          <AppButton onPress={directory.closeMailNotice}>Entendi</AppButton>
        }
        isOpen={directory.mailNotice !== null}
        title="Confirmação de e-mail"
        onOpenChange={(open) => {
          if (!open) directory.closeMailNotice();
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <AppIcon
            className={
              directory.mailNotice === "error"
                ? "size-12 text-red-500"
                : "size-12 text-emerald-500"
            }
            icon={directory.mailNotice === "error" ? "lucide:circle-x" : "lucide:circle-check"}
          />
          <p className="text-sm text-slate-600">
            {directory.mailNotice === "error"
              ? "Não foi possível enviar o e-mail agora. Tente de novo em instantes."
              : "Cadastro salvo. O e-mail de confirmação segue em segundo plano. Se este endereço existir, a mensagem chega em instantes. A ativação depende do clique nesse e-mail."}
          </p>
        </div>
      </AppSheet>
    </div>
  );
}
