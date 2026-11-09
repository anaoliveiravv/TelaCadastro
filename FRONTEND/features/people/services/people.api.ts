import { z } from "zod";
import { onlyDigits, parseBrl } from "@/shared/utils/masks";
import { personListSchema, personSchema } from "../schemas/person.schema";
import type { PeopleFilters, Person, PersonFormValues } from "../types/person.types";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

function toPerson(id: string, values: PersonFormValues): Person {
  return personSchema.parse({
    id,
    cpf: values.cpf,
    name: values.name.trim(),
    cargo: values.cargo.trim(),
    salary: parseBrl(values.salary),
    contractStart: values.contractStart,
    contractEnd: values.indefiniteContract ? "" : values.contractEnd,
    status: values.isActive ? "active" : "inactive",
    photoUrl: values.photoUrl,
    email: values.email.trim(),
    phone: values.phone,
    address: values.address.trim(),
    number: values.noNumber ? "--" : values.number.trim(),
    noNumber: values.noNumber,
    uf: values.uf,
    city: values.city,
    cep: values.cep,
    notes: values.notes,
    isActive: values.isActive,
    attachments: values.attachments,
  });
}

function payload(values: PersonFormValues) {
  const { id: _id, status: _status, ...body } = toPerson("ignored", values);
  return body;
}

function bustPhoto(person: Person): Person {
  if (!person.photoUrl) {
    return person;
  }
  const sep = person.photoUrl.includes("?") ? "&" : "?";
  return { ...person, photoUrl: `${person.photoUrl}${sep}t=${Date.now()}` };
}

function parsePerson(body: unknown): Person {
  return personSchema.parse(body);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (typeof init?.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 204) {
    return undefined as T;
  }

  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "Erro na API";
    throw new Error(message);
  }

  return body as T;
}

export const EMPTY_FILTERS: PeopleFilters = {
  cpf: "",
  name: "",
  contractStart: "",
  contractEnd: "",
};

export const EMPTY_PERSON_FORM: PersonFormValues = {
  cpf: "",
  name: "",
  cargo: "",
  address: "",
  number: "",
  noNumber: false,
  uf: "",
  city: "",
  cep: "",
  email: "",
  phone: "",
  isActive: false,
  emailConfirmed: false,
  notes: "",
  salary: "",
  contractStart: "",
  contractEnd: "",
  indefiniteContract: false,
  photoUrl: null,
  attachments: {
    rg: { fileName: null, description: "" },
    cpfDoc: { fileName: null, description: "" },
    residence: { fileName: null, description: "" },
  },
};

export function personToFormValues(person: Person): PersonFormValues {
  return {
    cpf: person.cpf,
    name: person.name,
    cargo: person.cargo,
    address: person.address,
    number: person.number,
    noNumber: person.noNumber,
    uf: person.uf,
    city: person.city,
    cep: person.cep,
    email: person.email,
    phone: person.phone,
    isActive: person.isActive,
    emailConfirmed: person.emailConfirmed,
    notes: person.notes,
    salary: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(person.salary),
    contractStart: person.contractStart,
    contractEnd: person.contractEnd,
    indefiniteContract: !person.contractEnd,
    photoUrl: person.photoUrl,
    attachments: person.attachments,
  };
}

export const peopleApi = {
  async list(filters: PeopleFilters): Promise<Person[]> {
    const params = new URLSearchParams();
    const cpf = onlyDigits(filters.cpf);
    if (cpf) params.set("cpf", cpf);

    const name = filters.name.trim();
    if (name) params.set("name", name);

    if (filters.contractStart) params.set("contractStart", filters.contractStart);
    if (filters.contractEnd) params.set("contractEnd", filters.contractEnd);

    const query = params.toString();
    return personListSchema.parse(
      await request(`/api/people${query ? `?${query}` : ""}`),
    );
  },

  async get(id: string): Promise<Person> {
    return parsePerson(await request(`/api/people/${encodeURIComponent(id)}`));
  },

  async create(values: PersonFormValues): Promise<Person> {
    return parsePerson(
      await request("/api/people", {
        method: "POST",
        body: JSON.stringify(payload(values)),
      }),
    );
  },

  async update(id: string, values: PersonFormValues): Promise<Person> {
    return parsePerson(
      await request(`/api/people/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload(values)),
      }),
    );
  },

  async toggle(id: string, isActive: boolean): Promise<Person> {
    return parsePerson(
      await request(`/api/people/${id}/active`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      }),
    );
  },

  async remove(id: string): Promise<void> {
    await request(`/api/people/${id}`, { method: "DELETE" });
  },

  async uploadPhoto(id: string, file: File): Promise<Person> {
    const body = new FormData();
    body.append("file", file);
    return bustPhoto(parsePerson(
      await request(`/api/people/${encodeURIComponent(id)}/photo`, { method: "POST", body }),
    ));
  },

  async uploadAttachment(
    id: string,
    kind: "rg" | "cpfDoc" | "residence",
    file: File,
    description: string,
  ): Promise<Person> {
    const body = new FormData();
    body.append("file", file);
    const params = new URLSearchParams({ description });
    return parsePerson(
      await request(
        `/api/people/${encodeURIComponent(id)}/attachments/${kind}?${params}`,
        { method: "POST", body },
      ),
    );
  },

  async listCargos(): Promise<string[]> {
    return z.array(z.string()).parse(await request("/api/people/cargos"));
  },

  async resendConfirmation(id: string): Promise<void> {
    await request(`/api/people/${id}/confirm-email`, { method: "POST" });
  },
};
