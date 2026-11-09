import { PageHeader } from "@/shared/layout";
import { EmptyState } from "@/shared/ui";

export default function ContratosPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Contratos" },
        ]}
        title="Contratos"
      />
      <EmptyState title="Módulo de contratos em construção" />
    </>
  );
}
