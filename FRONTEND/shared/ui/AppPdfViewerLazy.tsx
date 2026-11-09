"use client";

import dynamic from "next/dynamic";

export const AppPdfViewerLazy = dynamic(
  () => import("./AppPdfViewer").then((mod) => ({ default: mod.AppPdfViewer })),
  {
    ssr: false,
    loading: () => <p className="p-4 text-sm text-slate-500">Carregando PDF…</p>,
  },
);
