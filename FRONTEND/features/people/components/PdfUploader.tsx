"use client";

import { useRef, useState } from "react";
import { AppButton, AppIcon, AppInput, AppModal, AppPdfViewer } from "@/shared/ui";

interface PdfUploaderProps {
  label: string;
  fileName: string | null;
  description: string;
  src: string | null;
  onFileChange: (next: { fileName: string | null; dataUrl: string | null }) => void;
  onDescriptionChange: (description: string) => void;
}

export function PdfUploader({
  label,
  fileName,
  description,
  src,
  onFileChange,
  onDescriptionChange,
}: PdfUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[13rem_11rem_minmax(0,1fr)]">
      <p className="text-sm text-slate-700">{label}</p>
      <div className="flex min-w-0 items-center gap-2">
        <input
          ref={inputRef}
          accept="application/pdf"
          className="sr-only"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) {
              onFileChange({ fileName: null, dataUrl: null });
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              onFileChange({
                fileName: file.name,
                dataUrl: typeof reader.result === "string" ? reader.result : null,
              });
            };
            reader.readAsDataURL(file);
          }}
        />
        <AppButton
          size="sm"
          type="button"
          variant="outline"
          onPress={() => inputRef.current?.click()}
        >
          <AppIcon className="size-5" icon="lucide:upload" />
          Enviar PDF
        </AppButton>
        {src ? (
          <AppButton
            size="sm"
            type="button"
            variant="ghost"
            onPress={() => setIsOpen(true)}
          >
            <AppIcon className="size-4" icon="lucide:eye" />
            Ver
          </AppButton>
        ) : null}
        {fileName ? (
          <span className="truncate text-xs text-slate-500">{fileName}</span>
        ) : null}
      </div>
      <AppInput
        aria-label={`Identificação do documento: ${label}`}
        label="Documento"
        placeholder={label}
        value={description}
        onChange={onDescriptionChange}
      />
      <AppModal
        isOpen={isOpen && Boolean(src)}
        size="cover"
        title={label}
        onOpenChange={setIsOpen}
      >
        {src ? <AppPdfViewer src={src} title={label} /> : null}
      </AppModal>
    </div>
  );
}
