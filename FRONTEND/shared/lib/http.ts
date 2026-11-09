import type { z } from "zod";

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<TSchema extends z.ZodType>(
  path: string,
  schema: TSchema,
  init?: RequestInit,
): Promise<z.infer<TSchema>> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    const details: unknown = await response.json().catch(() => null);
    throw new ApiError(response.status, `Erro ${response.status}`, details);
  }

  const json: unknown = await response.json();
  return schema.parse(json);
}

export const http = {
  get: <TSchema extends z.ZodType>(path: string, schema: TSchema) =>
    request(path, schema),
  post: <TSchema extends z.ZodType>(
    path: string,
    schema: TSchema,
    body: unknown,
  ) => request(path, schema, { method: "POST", body: JSON.stringify(body) }),
};
