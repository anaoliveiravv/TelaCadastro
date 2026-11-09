"use client";

import { Card } from "@heroui/react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { AppTypography } from "./AppTypography";

interface AppCardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  className?: string;
}

export function AppCard({
  title,
  description,
  children,
  footer,
  headerAction,
  className,
}: AppCardProps) {
  const hasHeader = Boolean(title || description || headerAction);

  return (
    <Card
      className={cn(
        "w-full gap-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {hasHeader ? (
          <Card.Header className="mb-4 flex w-full flex-col items-start justify-between gap-3 p-0 sm:flex-row sm:items-center">
          <div>
            {title ? (
              <Card.Title>
                <AppTypography
                  as="span"
                  className="text-slate-800"
                  type="h5"
                  weight="semibold"
                >
                  {title}
                </AppTypography>
              </Card.Title>
            ) : null}
            {description ? (
              <Card.Description>
                <AppTypography
                  as="span"
                  className="text-slate-500"
                  color="muted"
                  type="body-xs"
                >
                  {description}
                </AppTypography>
              </Card.Description>
            ) : null}
          </div>
          {headerAction}
        </Card.Header>
      ) : null}
      {children ? <Card.Content className="p-0">{children}</Card.Content> : null}
      {footer ? <Card.Footer className="mt-4 p-0">{footer}</Card.Footer> : null}
    </Card>
  );
}
