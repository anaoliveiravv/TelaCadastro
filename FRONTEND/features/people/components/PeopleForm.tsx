"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  AppAccordion,
  AppAccordionSection,
  AppAvatar,
  AppButton,
  AppImageCrop,
  AppCard,
  AppCheckbox,
  AppChip,
  AppDatePicker,
  AppIcon,
  AppInput,
  AppSelect,
  AppTextarea,
  type AppSectionNavItem,
} from "@/shared/ui";
import {
  isValidEmailFormat,
  maskBrl,
  maskCep,
  maskCpf,
  maskEmailInput,
  maskHouseNumber,
  maskPersonName,
  maskPhone,
  onlyDigits,
  parseBrl,
} from "@/shared/utils/masks";
import { moneyToWordsPt } from "@/shared/utils/money-in-words";
import { personKeys } from "../hooks/usePeople";
import { MAX_PERSON_SALARY, personFormSchema } from "../schemas/person.schema";
import { lookupCep } from "../services/cep.api";
import { peopleApi } from "../services/people.api";
import { BRAZIL_STATES, citiesForUf } from "../services/locations";
import type { PersonFormValues } from "../types/person.types";
import { PdfUploader } from "./PdfUploader";

export const FORM_SECTIONS: AppSectionNavItem[] = [
  { id: "pessoais", label: "Dados pessoais", icon: "lucide:user" },
  { id: "endereco", label: "Endereço", icon: "lucide:map-pin" },
  { id: "contato", label: "Contato", icon: "lucide:mail" },
  { id: "remuneracao", label: "Remuneração", icon: "lucide:banknote" },
  { id: "observacao", label: "Observação", icon: "lucide:sticky-note" },
  { id: "foto", label: "Foto", icon: "lucide:camera" },
  { id: "anexos", label: "Anexos", icon: "lucide:paperclip" },
];

interface PeopleFormProps {
  values: PersonFormValues;
  isSaving: boolean;
  onSubmit: (values: PersonFormValues) => Promise<void>;
  onCancel: () => void;
}

export function PeopleForm({
  values,
  isSaving,
  onSubmit,
  onCancel,
}: PeopleFormProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const cargosQuery = useQuery({
    queryKey: personKeys.cargos,
    queryFn: peopleApi.listCargos,
  });
  const cargoOptions = (cargosQuery.data ?? ["Operadora de terminal", "Auxiliar de cais", "Analista de contratos"]).map((label) => ({ id: label, label }));
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: values,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const noNumber = useWatch({ control: form.control, name: "noNumber" });
  const uf = useWatch({ control: form.control, name: "uf" });
  const city = useWatch({ control: form.control, name: "city" });
  const email = useWatch({ control: form.control, name: "email" });
  const salary = useWatch({ control: form.control, name: "salary" });
  const photoUrl = useWatch({ control: form.control, name: "photoUrl" });
  const emailConfirmed = useWatch({ control: form.control, name: "emailConfirmed" });
  const indefiniteContract = useWatch({
    control: form.control,
    name: "indefiniteContract",
  });
  const citiesQuery = useQuery({
    queryKey: ["cities", uf],
    queryFn: () => citiesForUf(uf),
    enabled: Boolean(uf),
    staleTime: 24 * 60 * 60 * 1000,
  });
  const cities = [...(citiesQuery.data ?? [])];
  if (city && !cities.some((option) => option.id === city)) {
    cities.push({ id: city, label: city });
  }

  const readPhotoFile = (file: File): void => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setCropSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fillFromCep = async (cep: string): Promise<void> => {
    if (onlyDigits(cep).length !== 8) {
      return;
    }
    try {
      const found = await lookupCep(cep);
      if (!found) {
        form.setError("cep", { type: "manual", message: "CEP não encontrado" });
        return;
      }
      form.clearErrors("cep");
      form.setValue("uf", found.uf);
      form.setValue("city", found.city);
      if (found.address) {
        form.setValue("address", found.address);
      }
      form.setValue("cep", maskCep(found.cep));
    } catch {
      form.setError("cep", { type: "manual", message: "Falha ao consultar CEP" });
    }
  };
  const emailOk = isValidEmailFormat(email);
  const salaryAmount = salary ? parseBrl(salary) : 0;
  const salaryWords = salary && salaryAmount <= MAX_PERSON_SALARY ? moneyToWordsPt(salaryAmount) : "";

  return (
    <>
    <form
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit(onSubmit)(event);
      }}
    >
    <AppCard className="border-0 bg-transparent p-0 shadow-none">
      <div className="space-y-3">
        <AppAccordion
          allowsMultipleExpanded
          className="flex w-full flex-col gap-2"
          defaultExpandedKeys={[
            "pessoais",
            "endereco",
            "contato",
            "remuneracao",
            "observacao",
            "foto",
            "anexos",
          ]}
          hideSeparator
        >
            <AppAccordionSection
              icon={<AppIcon className="size-5 text-slate-500" icon="lucide:user" />}
              id="pessoais"
              title="Dados pessoais"
            >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Controller
              control={form.control}
              name="cpf"
              render={({ field, fieldState }) => (
                <AppInput
                  isRequired
                  error={fieldState.error?.message}
                  label="CPF"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(value) => field.onChange(maskCpf(value))}
                />
              )}
            />
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <AppInput
                  isRequired
                  error={fieldState.error?.message}
                  label="Nome"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(value) => field.onChange(maskPersonName(value))}
                />
              )}
            />
            <Controller
              control={form.control}
              name="cargo"
              render={({ field, fieldState }) => (
                <AppSelect
                  isRequired
                  isSearchable
                  error={fieldState.error?.message}
                  label="Cargo"
                  options={cargoOptions}
                  placeholder="Selecione o cargo"
                  value={field.value || null}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
            </AppAccordionSection>
            <AppAccordionSection
              icon={<AppIcon className="size-5 text-slate-500" icon="lucide:map-pin" />}
              id="endereco"
              title="Endereço"
            >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <Controller
                control={form.control}
                name="cep"
                render={({ field, fieldState }) => (
                  <AppInput
                    isRequired
                    error={fieldState.error?.message}
                    label="CEP"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(value) => {
                      const next = maskCep(value);
                      field.onChange(next);
                      if (onlyDigits(next).length === 8) void fillFromCep(next);
                    }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <AppInput
                    isRequired
                    error={fieldState.error?.message}
                    label="Endereço completo"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={form.control}
                name="number"
                render={({ field, fieldState }) => (
                  <AppInput
                    isDisabled={noNumber}
                    isRequired
                    error={fieldState.error?.message}
                    label="Número"
                    value={noNumber ? "--" : field.value}
                    onBlur={field.onBlur}
                    onChange={(value) => field.onChange(maskHouseNumber(value))}
                  />
                )}
              />
            </div>
            <div className="flex h-9 items-center">
              <Controller
                control={form.control}
                name="noNumber"
                render={({ field }) => (
                  <AppCheckbox
                    isSelected={field.value}
                    label="Sem número"
                    onChange={(checked) => {
                      field.onChange(checked);
                      form.setValue("number", checked ? "--" : "");
                    }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={form.control}
                name="uf"
                render={({ field, fieldState }) => (
                  <AppSelect
                    isRequired
                    error={fieldState.error?.message}
                    label="UF"
                    options={[...BRAZIL_STATES]}
                    value={field.value || null}
                    onChange={(next) => {
                      field.onChange(next);
                      form.setValue("city", "");
                    }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={form.control}
                name="city"
                render={({ field, fieldState }) => (
                  <AppSelect
                    isDisabled={cities.length === 0}
                    isRequired
                    error={fieldState.error?.message}
                    label="Cidade"
                    options={cities}
                    value={field.value || null}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
            </AppAccordionSection>
            <AppAccordionSection
              icon={<AppIcon className="size-5 text-slate-500" icon="lucide:mail" />}
              id="contato"
              title="Contato e situação"
            >
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <AppInput
                    isRequired
                    error={fieldState.error?.message}
                    label="E-mail"
                    suffix={
                      emailOk ? (
                        <span className="text-xs font-medium text-emerald-600">
                          ✓ Formato válido
                        </span>
                      ) : null
                    }
                    type="email"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(value) => field.onChange(maskEmailInput(value))}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <AppInput
                    error={fieldState.error?.message}
                    label="Telefone"
                    type="tel"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(value) => field.onChange(maskPhone(value))}
                  />
                )}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Controller
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <AppCheckbox
                    isDisabled={!emailConfirmed}
                    isSelected={field.value}
                    label="Cadastro ativo"
                    onChange={field.onChange}
                  />
                )}
              />
              <AppChip
                color={emailConfirmed ? "success" : "warning"}
                label={emailConfirmed ? "E-mail confirmado" : "Aguardando confirmação"}
              />
            </div>
          </div>
            </AppAccordionSection>
            <AppAccordionSection
              icon={<AppIcon className="size-5 text-slate-500" icon="lucide:banknote" />}
              id="remuneracao"
              title="Remuneração e contrato"
            >
          <div className="grid grid-cols-1 gap-4 lg:items-start">
            <Controller
              control={form.control}
              name="salary"
              render={({ field, fieldState }) => (
                <div className="flex items-start gap-3">
                  <div className="w-44 shrink-0">
                    <AppInput
                      error={fieldState.error?.message}
                      label="Salário"
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(value) => field.onChange(maskBrl(value))}
                    />
                  </div>
                  {salaryWords ? (
                    <p className="mt-6 min-w-0 break-words text-xs leading-5 text-slate-500">{salaryWords}</p>
                  ) : null}
                </div>
              )}
            />
            <div>
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  control={form.control}
                  name="contractStart"
                  render={({ field, fieldState }) => (
                    <AppDatePicker
                      isRequired
                      error={fieldState.error?.message}
                      label="Início"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="contractEnd"
                  render={({ field, fieldState }) => (
                    <AppDatePicker
                      isDisabled={indefiniteContract}
                      isRequired={!indefiniteContract}
                      error={fieldState.error?.message}
                      label="Fim"
                      value={indefiniteContract ? "" : field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="mt-2">
                <Controller
                  control={form.control}
                  name="indefiniteContract"
                  render={({ field }) => (
                    <AppCheckbox
                      isSelected={field.value}
                      label="Contrato indeterminado"
                      onChange={(checked) => {
                        field.onChange(checked);
                        if (checked) form.setValue("contractEnd", "");
                      }}
                    />
                  )}
                />
              </div>
              <p className="mt-1 text-[11px] leading-4 text-slate-400">
                {indefiniteContract
                  ? "Sem data final."
                  : "A data final deve ser igual ou posterior à inicial."}
              </p>
            </div>
          </div>
            </AppAccordionSection>
          <AppAccordionSection
            icon={<AppIcon className="size-5 text-slate-500" icon="lucide:sticky-note" />}
            id="observacao"
            title="Observação"
          >
          <Controller
            control={form.control}
            name="notes"
            render={({ field, fieldState }) => (
              <AppTextarea
                aria-label="Observação"
                error={fieldState.error?.message}
                label=""
                rows={3}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          </AppAccordionSection>
          <AppAccordionSection
            icon={<AppIcon className="size-5 text-slate-500" icon="lucide:camera" />}
            id="foto"
            title="Foto"
          >
          <div
            aria-label="Área da foto: cole uma imagem com Ctrl+V ou ⌘V"
            className="flex items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-blue-500"
            role="region"
            tabIndex={0}
            onClick={(event) => event.currentTarget.focus()}
            onPaste={(event) => {
              const item = Array.from(event.clipboardData.items).find((entry) => entry.type.startsWith("image/"));
              const file = item?.getAsFile();
              if (file) {
                event.preventDefault();
                readPhotoFile(file);
              }
            }}
          >
            {photoUrl ? (
              <AppAvatar
                alt="Pré-visualização da foto"
                className="size-16 rounded-md"
                fallback={<AppIcon className="size-7 text-slate-400" icon="lucide:user" />}
                size="lg"
                src={photoUrl}
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-md bg-slate-100">
                <AppIcon className="size-7 text-slate-400" icon="lucide:user" />
              </div>
            )}
            <div>
              <input
                ref={photoInputRef}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="sr-only"
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  readPhotoFile(file);
                }}
              />
              <div className="flex flex-wrap gap-2">
                <AppButton
                  size="sm"
                  type="button"
                  onPress={() => photoInputRef.current?.click()}
                >
                  <AppIcon className="size-5" icon="lucide:upload" />
                  Upload da foto
                </AppButton>
                {photoUrl ? (
                  <AppButton
                    size="sm"
                    type="button"
                    variant="outline"
                    onPress={() => setCropSrc(photoUrl)}
                  >
                    <AppIcon className="size-4" icon="lucide:crop" />
                    Editar
                  </AppButton>
                ) : null}
              </div>
              <p className="mt-1 max-w-sm text-[11px] leading-4 text-slate-500">
                Formatos aceitos: JPG, GIF e PNG. Clique nesta área e cole uma imagem com Ctrl+V ou ⌘V.
              </p>
            </div>
          </div>
          </AppAccordionSection>
          <AppAccordionSection
            icon={<AppIcon className="size-5 text-slate-500" icon="lucide:paperclip" />}
            id="anexos"
            title="Anexos"
          >
          <p className="mb-3 text-xs text-slate-400">Somente arquivos PDF.</p>
          <div className="space-y-3">
            <Controller
              control={form.control}
              name="attachments.rg"
              render={({ field }) => (
                <PdfUploader
                  description={field.value.description}
                  fileName={field.value.fileName}
                  label="Cópia do RG"
                  src={field.value.dataUrl ?? field.value.url ?? null}
                  onDescriptionChange={(description) =>
                    field.onChange({ ...field.value, description })
                  }
                  onFileChange={(file) => field.onChange({ ...field.value, ...file })}
                />
              )}
            />
            <Controller
              control={form.control}
              name="attachments.cpfDoc"
              render={({ field }) => (
                <PdfUploader
                  description={field.value.description}
                  fileName={field.value.fileName}
                  label="Cópia do CPF"
                  src={field.value.dataUrl ?? field.value.url ?? null}
                  onDescriptionChange={(description) =>
                    field.onChange({ ...field.value, description })
                  }
                  onFileChange={(file) => field.onChange({ ...field.value, ...file })}
                />
              )}
            />
            <Controller
              control={form.control}
              name="attachments.residence"
              render={({ field }) => (
                <PdfUploader
                  description={field.value.description}
                  fileName={field.value.fileName}
                  label="Comprovante de residência"
                  src={field.value.dataUrl ?? field.value.url ?? null}
                  onDescriptionChange={(description) =>
                    field.onChange({ ...field.value, description })
                  }
                  onFileChange={(file) => field.onChange({ ...field.value, ...file })}
                />
              )}
            />
          </div>
          </AppAccordionSection>
        </AppAccordion>
      </div>
    </AppCard>
      <div className="sticky bottom-2 z-20 mt-5 flex justify-center">
        <div className="flex gap-2 rounded-full border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur">
          <AppButton isPending={isSaving} type="submit">
            <AppIcon className="size-5" icon="lucide:save" />
            Salvar
          </AppButton>
          <AppButton type="button" variant="outline" onPress={onCancel}>
            Cancelar
          </AppButton>
        </div>
      </div>
    </form>
    <AppImageCrop
      isOpen={Boolean(cropSrc)}
      src={cropSrc}
      onCancel={() => setCropSrc(null)}
      onConfirm={(dataUrl) => {
        form.setValue("photoUrl", dataUrl, { shouldDirty: true, shouldValidate: true });
        setCropSrc(null);
      }}
    />
    </>
  );
}
