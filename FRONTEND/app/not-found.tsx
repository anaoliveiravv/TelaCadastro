import { EmptyState } from "@/shared/ui";

export default function NotFoundPage() {
  return (
    <EmptyState
      description="A página solicitada não existe."
      title="Página não encontrada"
    />
  );
}
