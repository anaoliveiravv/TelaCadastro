import type { ReactNode } from "react";
import { AppButton } from "./AppButton";
import { AppTypography } from "./AppTypography";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Carregando" }: LoadingStateProps) {
  return (
    <div aria-live="polite" role="status">
      <AppTypography className="py-8 text-center text-slate-500" color="muted" type="body">
        {label}...
      </AppTypography>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <AppTypography className="text-slate-800" type="h5" weight="semibold">
        {title}
      </AppTypography>
      {description ? (
        <AppTypography className="text-slate-500" color="muted" type="body-sm">
          {description}
        </AppTypography>
      ) : null}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Algo deu errado.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-8">
      <AppTypography className="text-slate-700" type="body">
        {message}
      </AppTypography>
      {onRetry ? <AppButton label="Tentar novamente" onPress={onRetry} /> : null}
    </div>
  );
}
