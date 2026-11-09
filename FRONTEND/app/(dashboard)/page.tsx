import { Suspense } from "react";
import { PageHeader } from "@/shared/layout";
import { PeoplePage } from "@/features/people";
import { LoadingState } from "@/shared/ui";

export default function HomePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/inicio" },
          { label: "Cadastros" },
          { label: "Pessoas" },
        ]}
        title="Cadastro de pessoas"
      />
      <Suspense fallback={<LoadingState label="Carregando cadastro" />}>
        <PeoplePage />
      </Suspense>
    </>
  );
}
