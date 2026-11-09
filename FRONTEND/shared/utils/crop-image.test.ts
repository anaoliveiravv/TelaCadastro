import { describe, expect, test } from "bun:test";
import { getRadianAngle, PHOTO_OUTPUT_SIZE, rotateSize } from "./crop-image";

describe("crop-image", () => {
  test("converte graus em radianos", () => {
    expect(getRadianAngle(180)).toBeCloseTo(Math.PI);
  });

  test("caixa rotacionada 90 graus troca os lados", () => {
    const box = rotateSize(200, 100, 90);
    expect(box.width).toBeCloseTo(100);
    expect(box.height).toBeCloseTo(200);
  });

  test("foto salva sempre no mesmo quadrado", () => {
    expect(PHOTO_OUTPUT_SIZE).toBe(512);
  });
});
