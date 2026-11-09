const ONES = [
  "",
  "um",
  "dois",
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
] as const;

const TEENS = [
  "dez",
  "onze",
  "doze",
  "treze",
  "quatorze",
  "quinze",
  "dezesseis",
  "dezessete",
  "dezoito",
  "dezenove",
] as const;

const TENS = [
  "",
  "",
  "vinte",
  "trinta",
  "quarenta",
  "cinquenta",
  "sessenta",
  "setenta",
  "oitenta",
  "noventa",
] as const;

const HUNDREDS = [
  "",
  "cento",
  "duzentos",
  "trezentos",
  "quatrocentos",
  "quinhentos",
  "seiscentos",
  "setecentos",
  "oitocentos",
  "novecentos",
] as const;

function joinAnd(parts: string[]): string {
  return parts.filter(Boolean).join(" e ");
}

function chunkToWords(value: number): string {
  if (value === 0) return "";
  if (value === 100) return "cem";

  const hundred = Math.floor(value / 100);
  const rest = value % 100;
  const parts: string[] = [];

  if (hundred > 0) {
    const label = HUNDREDS[hundred];
    if (label) parts.push(label);
  }

  if (rest >= 10 && rest < 20) {
    const label = TEENS[rest - 10];
    if (label) parts.push(label);
    return joinAnd(parts);
  }

  const ten = Math.floor(rest / 10);
  const one = rest % 10;
  if (ten > 0) {
    const label = TENS[ten];
    if (label) parts.push(label);
  }
  if (one > 0) {
    const label = ONES[one];
    if (label) parts.push(label);
  }

  return joinAnd(parts);
}

function capitalize(value: string): string {
  const first = value.charAt(0).toUpperCase();
  return `${first}${value.slice(1)}`;
}

/** Escreve valores inteiros até um milhão; centavos não são incluídos. */
export function moneyToWordsPt(value: number): string {
  const amount = Math.round(Math.abs(value));

  if (amount === 0) return "Zero reais";
  if (amount === 1) return "Um real";
  if (amount === 1_000_000) return "Um milhão de reais";

  const thousands = Math.floor(amount / 1000);
  const rest = amount % 1000;
  const parts: string[] = [];

  if (thousands === 1) {
    parts.push("mil");
  } else if (thousands > 0) {
    parts.push(`${chunkToWords(thousands)} mil`);
  }

  if (rest > 0) {
    parts.push(chunkToWords(rest));
  }

  return `${capitalize(joinAnd(parts))} reais`;
}
