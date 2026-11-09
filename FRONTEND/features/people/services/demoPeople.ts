import { personSchema } from "../schemas/person.schema";
import type { Person } from "../types/person.types";
import { EMPTY_PERSON_FORM } from "./people.api";

export const DEMO_PEOPLE: Person[] = [
  { id: "demo-marina", name: "Marina Costa", cpf: "529.982.247-25", salary: 3500, active: true },
  { id: "demo-joao", name: "João Almeida", cpf: "390.533.447-05", salary: 2800, active: false },
  { id: "demo-ana", name: "Ana Ribeiro", cpf: "248.438.034-80", salary: 4200, active: true },
].map((item) => personSchema.parse({
  ...EMPTY_PERSON_FORM,
  ...item,
  cargo: "Operadora de terminal",
  address: "Rua do Porto, Centro",
  number: "100",
  uf: "CE",
  city: "Fortaleza",
  cep: "60000-000",
  email: `${item.id}@example.com`,
  contractStart: "2026-01-01",
  contractEnd: "2026-12-31",
  status: item.active ? "active" : "inactive",
  isActive: item.active,
  emailConfirmed: item.active,
  photoUrl: {
    "demo-marina": "/images/marina-costa.png",
    "demo-joao": "https://randomuser.me/api/portraits/men/32.jpg",
    "demo-ana": "https://randomuser.me/api/portraits/women/44.jpg",
  }[item.id] ?? null,
}));
