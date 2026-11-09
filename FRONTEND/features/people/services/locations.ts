export const BRAZIL_STATES = [
  { id: "AC", label: "AC" },
  { id: "AL", label: "AL" },
  { id: "AP", label: "AP" },
  { id: "AM", label: "AM" },
  { id: "BA", label: "BA" },
  { id: "CE", label: "CE" },
  { id: "DF", label: "DF" },
  { id: "ES", label: "ES" },
  { id: "GO", label: "GO" },
  { id: "MA", label: "MA" },
  { id: "MT", label: "MT" },
  { id: "MS", label: "MS" },
  { id: "MG", label: "MG" },
  { id: "PA", label: "PA" },
  { id: "PB", label: "PB" },
  { id: "PR", label: "PR" },
  { id: "PE", label: "PE" },
  { id: "PI", label: "PI" },
  { id: "RJ", label: "RJ" },
  { id: "RN", label: "RN" },
  { id: "RS", label: "RS" },
  { id: "RO", label: "RO" },
  { id: "RR", label: "RR" },
  { id: "SC", label: "SC" },
  { id: "SP", label: "SP" },
  { id: "SE", label: "SE" },
  { id: "TO", label: "TO" },
] as const;

export async function citiesForUf(uf: string): Promise<Array<{ id: string; label: string }>> {
  if (!uf) return [];
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
  );
  if (!response.ok) throw new Error("Não foi possível carregar as cidades");
  const cities: unknown = await response.json();
  if (!Array.isArray(cities)) throw new Error("Resposta inválida ao carregar cidades");
  return cities.flatMap((city: unknown) => {
    if (typeof city !== "object" || city === null || !("id" in city) || !("nome" in city)) return [];
    return [{ id: String(city.nome), label: String(city.nome) }];
  });
}
