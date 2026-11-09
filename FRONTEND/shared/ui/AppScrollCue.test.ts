import { describe, expect, test } from "bun:test";
import { scrollCueState } from "./AppScrollCue";

describe("scrollCueState", () => {
  test("no topo só mostra descer", () => {
    expect(scrollCueState(0, 400, 900)).toEqual({ canUp: false, canDown: true });
  });

  test("no meio mostra os dois", () => {
    expect(scrollCueState(200, 400, 900)).toEqual({ canUp: true, canDown: true });
  });

  test("no fim só mostra subir", () => {
    expect(scrollCueState(500, 400, 900)).toEqual({ canUp: true, canDown: false });
  });
});
