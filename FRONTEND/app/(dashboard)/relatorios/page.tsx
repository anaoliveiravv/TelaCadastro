import { PageHeader } from "@/shared/layout";
import { EmptyState } from "@/shared/ui";

export default function RelatoriosPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Relatórios" },
        ]}
        title="Relatórios"
      />
      <EmptyState title="Módulo de relatórios em construção" />
    </>
  );
}
