"use client";

import { useEffect, useState } from "react";
import { toPdfObjectUrl } from "@/shared/utils/pdf-source";

interface AppPdfViewerProps {
  src: string;
  title?: string;
}

export function AppPdfViewer({ src, title = "Documento PDF" }: AppPdfViewerProps) {
  const [viewerSrc, setViewerSrc] = useState<string | null>(src.startsWith("blob:") ? src : null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void toPdfObjectUrl(src)
      .then((next) => {
        if (cancelled) {
          if (next.startsWith("blob:") && next !== src) URL.revokeObjectURL(next);
          return;
        }
        if (next.startsWith("blob:") && next !== src) objectUrl = next;
        setViewerSrc(next);
      })
      .catch(() => {
        if (!cancelled) setViewerSrc(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!viewerSrc) {
    return <p className="p-4 text-sm text-slate-500">Carregando PDF…</p>;
  }

  // shortcut: native iframe viewer, switch to pdf.js canvases if a browser downloads instead of showing
  return (
    <iframe
      className="block h-[calc(100dvh-8rem)] w-full rounded-md bg-slate-100"
      src={viewerSrc}
      title={title}
    />
  );
}
