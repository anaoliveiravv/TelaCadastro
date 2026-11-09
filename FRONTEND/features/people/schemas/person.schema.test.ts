import { describe, expect, test } from "bun:test";
import { peopleFiltersSchema, personFormSchema } from "./person.schema";

const validForm = {
  cpf: "529.982.247-25",
  name: "Marina Costa",
  cargo: "Operadora de terminal",
  address: "Rua do Porto, Bairro Centro",
  number: "--",
  noNumber: true,
  uf: "CE",
  city: "Fortaleza",
  cep: "60000-000",
  email: "marina.costa@example.com",
  phone: "(85) 90000-0000",
  isActive: false,
  emailConfirmed: false,
  notes: "Cadastro demonstrativo para operação portuária.",
  salary: "R$ 3.500,00",
  contractStart: "2026-11-01",
  contractEnd: "2027-10-31",
  indefiniteContract: false,
  photoUrl: null,
  attachments: {
    rg: { fileName: null, description: "Documento de identidade" },
    cpfDoc: { fileName: null, description: "Comprovante de CPF" },
    residence: { fileName: null, description: "Conta de energia" },
  },
};

describe("personFormSchema", () => {
  test("aceita o cadastro demonstrativo", () => {
    const result = personFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  test("rejeita data final anterior à inicial", () => {
    const result = personFormSchema.safeParse({
      ...validForm,
      contractEnd: "2026-01-01",
    });
    expect(result.success).toBe(false);
  });

  test("rejeita início de contrato no ano 1600", () => {
    expect(
      personFormSchema.safeParse({ ...validForm, contractStart: "1600-01-09" }).success,
    ).toBe(false);
  });

  test("aceita até um milhão e rejeita salários acima do limite", () => {
    expect(personFormSchema.safeParse({ ...validForm, salary: "R$ 1.000.000,00" }).success).toBe(true);
    expect(personFormSchema.safeParse({ ...validForm, salary: "R$ 1.000.000,01" }).success).toBe(false);
  });

  test("rejeita datas muito distantes na busca", () => {
    expect(
      peopleFiltersSchema.safeParse({
        cpf: "",
        name: "",
        contractStart: "2600-01-01",
        contractEnd: "",
      }).success,
    ).toBe(false);
  });

  test("exige número quando o endereço tem número", () => {
    const result = personFormSchema.safeParse({
      ...validForm,
      noNumber: false,
      number: "",
    });
    expect(result.success).toBe(false);
  });

  test("rejeita CPF inválido", () => {
    expect(
      personFormSchema.safeParse({ ...validForm, cpf: "123.456.789-01" }).success,
    ).toBe(false);
  });

  test("rejeita e-mail inválido", () => {
    expect(
      personFormSchema.safeParse({ ...validForm, email: "123" }).success,
    ).toBe(false);
  });

  test("rejeita telefone com DDD inválido", () => {
    expect(
      personFormSchema.safeParse({ ...validForm, phone: "(00) 90000-0000" }).success,
    ).toBe(false);
  });

  test("rejeita nome com número", () => {
    expect(
      personFormSchema.safeParse({ ...validForm, name: "Marina 123" }).success,
    ).toBe(false);
  });

  test("exige cargo", () => {
    expect(personFormSchema.safeParse({ ...validForm, cargo: "" }).success).toBe(false);
  });

  test("aceita contrato indeterminado sem data final", () => {
    expect(
      personFormSchema.safeParse({
        ...validForm,
        contractEnd: "",
        indefiniteContract: true,
      }).success,
    ).toBe(true);
  });

  test("exige data final quando o contrato não é indeterminado", () => {
    expect(
      personFormSchema.safeParse({
        ...validForm,
        contractEnd: "",
        indefiniteContract: false,
      }).success,
    ).toBe(false);
  });

  test("aceita PDF em dataUrl", () => {
    expect(
      personFormSchema.safeParse({
        ...validForm,
        attachments: {
          ...validForm.attachments,
          rg: {
            fileName: "rg.pdf",
            description: "RG",
            dataUrl: "data:application/pdf;base64,QQ==",
          },
        },
      }).success,
    ).toBe(true);
  });
});
