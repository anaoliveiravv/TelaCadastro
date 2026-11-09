"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { appToast } from "@/shared/ui";
import {
  EMPTY_FILTERS,
  EMPTY_PERSON_FORM,
  peopleApi,
  personToFormValues,
} from "../services/people.api";
import type { PeopleFilters, Person, PersonFormValues } from "../types/person.types";

import { peopleFiltersSchema, personSchema } from "../schemas/person.schema";
import { parseBrl } from "@/shared/utils/masks";
import { DEMO_PEOPLE } from "../services/demoPeople";

export const personKeys = {
  all: ["people"] as const,
  list: (filters: PeopleFilters) => [...personKeys.all, "list", filters] as const,
  cargos: ["people", "cargos"] as const,
};

export function usePeopleDirectory() {
  const queryClient = useQueryClient();
  const [demoPeople, setDemoPeople] = useState<Person[]>(DEMO_PEOPLE);
  const [draftFilters, setDraftFilters] = useState<PeopleFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PeopleFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<PersonFormValues>(EMPTY_PERSON_FORM);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [mailNotice, setMailNotice] = useState<"ok" | "error" | null>(null);

  const listQuery = useQuery({
    queryKey: personKeys.list(appliedFilters),
    queryFn: () => peopleApi.list(appliedFilters),
  });

  const people = useMemo(() => {
    if (listQuery.data) return listQuery.data;
    const cpf = appliedFilters.cpf.replace(/\D/g, "");
    const name = appliedFilters.name.trim().toLocaleLowerCase("pt-BR");
    return demoPeople.filter((person) =>
      (!cpf || person.cpf.replace(/\D/g, "").includes(cpf)) &&
      (!name || person.name.toLocaleLowerCase("pt-BR").includes(name)) &&
      (!appliedFilters.contractStart || !person.contractEnd || person.contractEnd >= appliedFilters.contractStart) &&
      (!appliedFilters.contractEnd || person.contractStart <= appliedFilters.contractEnd),
    );
  }, [listQuery.data, demoPeople, appliedFilters]);
  const selectedPerson = useMemo(
    () => people.find((person) => person.id === selectedId) ?? people[0] ?? null,
    [people, selectedId],
  );

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: personKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: peopleApi.create,
    onSuccess: (person) => {
      invalidate();
      setSelectedId(person.id);
      setEditingId(person.id);
      setFormValues(personToFormValues(person));
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: PersonFormValues }) =>
      peopleApi.update(id, values),
    onSuccess: (person) => {
      invalidate();
      setSelectedId(person.id);
      setFormValues(personToFormValues(person));
      setIsFormOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      peopleApi.toggle(id, isActive),
    onError: (error) => {
      appToast.danger("Não foi possível alterar a situação", error.message);
    },
    onSuccess: (person) => {
      const listKey = [...personKeys.all, "list"] as const;
      queryClient.setQueriesData<Person[]>(
        { queryKey: listKey },
        (current) =>
          current?.map((item) =>
            item.id === person.id ? { ...person, photoUrl: item.photoUrl } : item,
          ),
      );
    },
    onSettled: (_data, error) => {
      if (!error) invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: peopleApi.remove,
    onError: (error) => appToast.danger("Não foi possível excluir", error.message),
    onSuccess: (_, id) => {
      invalidate();
      setPersonToDelete(null);
      if (selectedId === id) setSelectedId(null);
      if (editingId === id) {
        setEditingId(null);
        setFormValues(EMPTY_PERSON_FORM);
      }
    },
  });

  const search = (): void => {
    const result = peopleFiltersSchema.safeParse(draftFilters);
    if (!result.success) {
      appToast.danger("Confira as datas da busca", result.error.issues[0]?.message);
      return;
    }
    setAppliedFilters(result.data);
  };

  const clearFilters = (): void => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  const startCreate = (): void => {
    setEditingId(null);
    setFormValues(EMPTY_PERSON_FORM);
    setIsFormOpen(true);
  };

  const startEdit = (person: Person): void => {
    setEditingId(person.id);
    setSelectedId(person.id);
    setFormValues(personToFormValues(person));
    setIsFormOpen(true);
  };

  const resendMutation = useMutation({
    mutationFn: peopleApi.resendConfirmation,
  });

  const save = async (values: PersonFormValues): Promise<void> => {
    try {
      if (editingId?.startsWith("demo-")) {
        const updated = personSchema.parse({
          ...values,
          id: editingId,
          salary: parseBrl(values.salary),
          contractEnd: values.indefiniteContract ? "" : values.contractEnd,
          status: values.isActive ? "active" : "inactive",
        });
        setDemoPeople((current) => current.map((person) => person.id === editingId ? updated : person));
        setFormValues(personToFormValues(updated));
        setIsFormOpen(false);
        appToast.success("Exemplo atualizado nesta sessão");
        return;
      }
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, values });
        appToast.success("Cadastro atualizado");
        return;
      }
      await createMutation.mutateAsync(values);
      appToast.success("Cadastro salvo");
    } catch (error) {
      appToast.danger(
        "Não foi possível salvar",
        error instanceof Error ? error.message : undefined,
      );
    }
  };

  const resendConfirmation = async (person: Person): Promise<void> => {
    if (person.emailConfirmed) return;
    try {
      await resendMutation.mutateAsync(person.id);
      setMailNotice("ok");
    } catch {
      setMailNotice("error");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return {
    draftFilters,
    setDraftFilters,
    search,
    clearFilters,
    people,
    selectedId,
    isPending: false,
    isDemo: !listQuery.data,
    isError: false,
    refetch: listQuery.refetch,
    selectedPerson,
    selectPerson: setSelectedId,
    clearSelected: () => setSelectedId(null),
    formValues,
    editingId,
    isFormOpen,
    startCreate,
    startEdit,
    save,
    isSaving,
    mailNotice,
    closeMailNotice: () => setMailNotice(null),
    resendConfirmation,
    isResending: resendMutation.isPending,
    toggle: (id: string, isActive: boolean) => {
      if (id.startsWith("demo-")) {
        setDemoPeople((current) => current.map((person) => person.id === id
          ? { ...person, isActive, status: isActive ? "active" : "inactive" } : person));
        return;
      }
      toggleMutation.mutate({ id, isActive });
    },
    personToDelete,
    askDelete: setPersonToDelete,
    confirmDelete: () => {
      if (!personToDelete) return;
      if (personToDelete.id.startsWith("demo-")) {
        setDemoPeople((current) => current.filter((person) => person.id !== personToDelete.id));
        if (selectedId === personToDelete.id) setSelectedId(null);
        setPersonToDelete(null);
        appToast.success("Exemplo excluído nesta sessão");
        return;
      }
      deleteMutation.mutate(personToDelete.id);
    },
    isDeleting: deleteMutation.isPending,
    cancelForm: () => {
      setIsFormOpen(false);
      setEditingId(null);
      setFormValues(EMPTY_PERSON_FORM);
    },
  };
}
