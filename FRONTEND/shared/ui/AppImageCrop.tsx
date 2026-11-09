"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg } from "@/shared/utils/crop-image";
import { AppButton } from "./AppButton";
import { AppIcon } from "./AppIcon";
import { AppModal } from "./AppModal";

// The cropper's local object URL lifecycle and reset behavior are driven by prop changes.
/* eslint-disable react-hooks/set-state-in-effect */

const RATIOS = [
  { id: "1:1", aspect: 1 },
  { id: "4:3", aspect: 4 / 3 },
  { id: "3:4", aspect: 3 / 4 },
  { id: "16:9", aspect: 16 / 9 },
] as const;

const DEFAULT_RATIO = RATIOS[0];

interface AppImageCropProps {
  src: string | null;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
}

export function AppImageCrop({ src, isOpen, onCancel, onConfirm }: AppImageCropProps) {
  const [localSrc, setLocalSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [ratioId, setRatioId] = useState<string>(DEFAULT_RATIO.id);
  const ratio = RATIOS.find((item) => item.id === ratioId) ?? DEFAULT_RATIO;

  useEffect(() => {
    if (!src) {
      setLocalSrc(null);
      return;
    }
    let objectUrl: string | null = null;
    let cancelled = false;

    void (async () => {
      if (src.startsWith("data:") || src.startsWith("blob:")) {
        if (!cancelled) setLocalSrc(src);
        return;
      }
      const response = await fetch(src, { cache: "no-store" });
      const next = URL.createObjectURL(await response.blob());
      if (cancelled) {
        URL.revokeObjectURL(next);
        return;
      }
      objectUrl = next;
      setLocalSrc(next);
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setArea(null);
    setRatioId(DEFAULT_RATIO.id);
  }, [localSrc]);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
  }, [ratioId]);

  const confirm = async (): Promise<void> => {
    if (!localSrc || !area) return;
    setIsCropping(true);
    try {
      onConfirm(await getCroppedImg(localSrc, area, rotation));
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <AppModal
      footer={
        <div className="flex justify-end gap-2">
          <AppButton variant="outline" onPress={onCancel}>
            Cancelar
          </AppButton>
          <AppButton isDisabled={!area} isPending={isCropping} onPress={() => void confirm()}>
            Aplicar
          </AppButton>
        </div>
      }
      isOpen={isOpen && Boolean(src)}
      title="Cortar foto"
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-72 w-full overflow-hidden rounded-lg bg-black">
          {localSrc ? (
            <Cropper
              aspect={ratio.aspect}
              crop={crop}
              image={localSrc}
              rotation={rotation}
              showGrid={false}
              zoom={zoom}
              onCropChange={setCrop}
              onCropComplete={(_, pixels) => setArea(pixels)}
              onRotationChange={setRotation}
              onZoomChange={setZoom}
            />
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-2">
          <p className="text-xs font-medium text-slate-600">Proporções</p>
          <div className="flex flex-wrap gap-2">
            {RATIOS.map((item) => (
              <AppButton
                key={item.id}
                size="sm"
                type="button"
                variant={item.id === ratioId ? "primary" : "outline"}
                onPress={() => setRatioId(item.id)}
              >
                {item.id}
                {item.id === DEFAULT_RATIO.id ? " (padrão)" : ""}
              </AppButton>
            ))}
          </div>
        </div>
        <input
          aria-label="Zoom"
          className="w-56"
          max={3}
          min={1}
          step={0.05}
          type="range"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
        <AppButton
          size="sm"
          type="button"
          variant="outline"
          onPress={() => setRotation((value) => value + 90)}
        >
          <AppIcon className="size-4" icon="lucide:rotate-cw" />
          Girar
        </AppButton>
      </div>
    </AppModal>
  );
}
