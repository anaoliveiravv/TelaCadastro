import { PageHeader } from "@/shared/layout";
import { EmptyState } from "@/shared/ui";

export default function InicioPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Início" }]} title="Início" />
      <EmptyState
        description="Use o menu Cadastros para gerenciar pessoas da operação."
        title="Painel inicial"
      />
    </>
  );
}
