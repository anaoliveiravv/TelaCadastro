export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function maskBrl(value: string): string {
  const digits = onlyDigits(value);
  const cents = Number.parseInt(digits || "0", 10);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function parseBrl(masked: string): number {
  const digits = onlyDigits(masked);
  return Number.parseInt(digits || "0", 10) / 100;
}

export function formatBrl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function maskBrlPreview(): string {
  return "R$ ***.***,**";
}

export function maskCpfPreview(cpf: string): string {
  const digits = onlyDigits(cpf).padStart(11, "*");
  const suffix = digits.slice(-2);
  return `***.***.***-${suffix}`;
}

export function formatDateBr(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function formatDateRange(start: string, end: string): string {
  if (!end) {
    return `${formatDateBr(start)} a indeterminado`;
  }
  return `${formatDateBr(start)} a ${formatDateBr(end)}`;
}

export function isCompleteCpf(value: string): boolean {
  return onlyDigits(value).length === 11;
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const check = (length: number): number => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      const digit = digits[index];
      if (digit === undefined) return -1;
      sum += Number(digit) * (length + 1 - index);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const first = digits[9];
  const second = digits[10];
  if (first === undefined || second === undefined) return false;
  return check(9) === Number(first) && check(10) === Number(second);
}

export function maskPersonName(value: string): string {
  return value.replace(/[^\p{L}\p{M}\s'.-]/gu, "").slice(0, 80);
}

export function maskHouseNumber(value: string): string {
  return onlyDigits(value).slice(0, 6);
}

export function maskEmailInput(value: string): string {
  return value.replace(/\s/g, "").slice(0, 80);
}

export function isCompleteCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

export function isValidEmailFormat(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
