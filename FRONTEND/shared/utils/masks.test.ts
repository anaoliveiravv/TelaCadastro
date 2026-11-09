import { describe, expect, test } from "bun:test";
import {
  formatBrl,
  formatDateRange,
  isValidCpf,
  maskCep,
  maskCpf,
  maskBrlPreview,
  maskCpfPreview,
  maskPersonName,
  maskPhone,
  parseBrl,
} from "./masks";

describe("masks", () => {
  test("maskCpf formata onze dígitos", () => {
    expect(maskCpf("12345678901")).toBe("123.456.789-01");
  });

  test("maskCep formata oito dígitos", () => {
    expect(maskCep("60000000")).toBe("60000-000");
  });

  test("maskPhone formata celular", () => {
    expect(maskPhone("85900000000")).toBe("(85) 90000-0000");
  });

  test("parseBrl lê valor mascarado", () => {
    expect(parseBrl("R$ 3.500,00")).toBe(3500);
  });

  test("formatBrl usa pt-BR", () => {
    expect(formatBrl(3500).replace(/\s/g, " ")).toBe("R$ 3.500,00");
  });

  test("maskCpfPreview oculta os primeiros dígitos", () => {
    expect(maskCpfPreview("123.456.789-01")).toBe("***.***.***-01");
  });

  test("maskBrlPreview oculta o valor", () => {
    expect(maskBrlPreview()).toBe("R$ ***.***,**");
  });

  test("formatDateRange junta as datas", () => {
    expect(formatDateRange("2026-11-01", "2027-10-31")).toBe(
      "01/11/2026 a 31/10/2027",
    );
  });

  test("formatDateRange aceita contrato indeterminado", () => {
    expect(formatDateRange("2026-11-01", "")).toBe("01/11/2026 a indeterminado");
  });

  test("isValidCpf rejeita repetição e dígito errado", () => {
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("123.456.789-01")).toBe(false);
  });

  test("isValidCpf aceita CPF verdadeiro", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
  });

  test("maskPersonName remove número", () => {
    expect(maskPersonName("Marina 123 Costa")).toBe("Marina  Costa");
  });
});
