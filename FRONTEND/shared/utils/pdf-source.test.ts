import { describe, expect, test } from "bun:test";
import { toPdfObjectUrl } from "./pdf-source";

describe("toPdfObjectUrl", () => {
  test("converte data URL em blob URL", async () => {
    const url = await toPdfObjectUrl("data:application/pdf;base64,JVBERi0xLjQK");
    expect(url.startsWith("blob:")).toBe(true);
    URL.revokeObjectURL(url);
  });

  test("mantém blob URL", async () => {
    expect(await toPdfObjectUrl("blob:http://localhost/pdf")).toBe(
      "blob:http://localhost/pdf",
    );
  });
});
