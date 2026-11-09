import { onlyDigits } from "@/shared/utils/masks";
import { API_URL } from "./people.api";

export interface CepLookup {
  cep: string;
  address: string;
  district: string;
  city: string;
  uf: string;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

async function lookupViaCep(digits: string): Promise<CepLookup | null> {
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) throw new Error("Falha ao consultar ViaCEP");
  const result = (await response.json()) as ViaCepResponse;
  if (result.erro || !result.uf) return null;
  return {
    cep: result.cep ?? digits,
    address: result.logradouro ?? "",
    district: result.bairro ?? "",
    city: result.localidade ?? "",
    uf: result.uf,
  };
}

export async function lookupCep(cep: string): Promise<CepLookup | null> {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/cep/${digits}`);
    if (response.status === 404) return null;
    if (response.ok) return (await response.json()) as CepLookup;
  } catch {
    // Use ViaCEP when the local backend is unavailable.
  }
  return lookupViaCep(digits);
}
