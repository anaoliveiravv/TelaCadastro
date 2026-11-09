"use client";

import { AppAvatar, AppCard, AppIcon, AppTypography } from "@/shared/ui";
import { openFancyboxImage } from "@/shared/ui/AppFancybox";
import { maskCpfPreview } from "@/shared/utils/masks";
import type { Person } from "../types/person.types";

interface PhotoPreviewProps {
  person: Person | null;
}

const DEMO_PHOTO = "/images/marina-costa.png";

export function PhotoPreview({ person }: PhotoPreviewProps) {
  if (!person) return null;

  const name = person?.name ?? "Marina Costa";
  const photoUrl = !person || person.id.includes("marina") ? DEMO_PHOTO : person.photoUrl ?? DEMO_PHOTO;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");

  return (
    <AppCard title="Foto do cadastro">
      <div className="flex flex-col items-center text-center">
        <button
          aria-label={name ? `Ampliar foto de ${name}` : "Foto do cadastro"}
          className="aspect-square w-full max-w-[10rem] overflow-hidden rounded-lg bg-slate-100 disabled:cursor-default"
          type="button"
          onClick={() => openFancyboxImage(photoUrl, name)}
        >
          <AppAvatar
            alt={name ? `Foto de ${name}` : "Foto do cadastro"}
            className="size-full rounded-lg bg-slate-100"
            fallback={
              initials || <AppIcon className="size-12 text-slate-400" icon="lucide:user" />
            }
            size="lg"
            src={photoUrl}
          />
        </button>
        <AppTypography className="mt-3 text-slate-800" type="body" weight="semibold">
          {name}
        </AppTypography>
        {person ? (
          <AppTypography className="mt-1 text-slate-500" type="body-sm">
            {maskCpfPreview(person.cpf)}
          </AppTypography>
        ) : null}
      </div>
    </AppCard>
  );
}
