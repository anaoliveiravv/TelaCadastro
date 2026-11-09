"use client";

import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.js";

export async function openFancyboxImage(
  src: string | null | undefined,
  caption?: string,
): Promise<void> {
  if (!src) return;

  let url = src;
  let revoke: string | null = null;
  if (!src.startsWith("blob:")) {
    try {
      const response = await fetch(src, { cache: "no-store" });
      if (response.ok) {
        url = URL.createObjectURL(await response.blob());
        revoke = url;
      }
    } catch {
      // Cross-origin images may be displayable by the browser but reject fetch due to CORS.
      url = src;
    }
  }

  Fancybox.show([{ src: url, caption, type: "image" }], {
    on: {
      close: () => {
        if (revoke) URL.revokeObjectURL(revoke);
      },
    },
  });
}
