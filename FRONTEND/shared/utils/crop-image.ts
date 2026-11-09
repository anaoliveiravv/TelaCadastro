import type { Area } from "react-easy-crop";

export function getRadianAngle(degree: number): number {
  return (degree * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Falha ao carregar a imagem")));
    if (!src.startsWith("blob:") && !src.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = src;
  });
}

export const PHOTO_OUTPUT_SIZE = 512;

export async function getCroppedImg(
  src: string,
  crop: Area,
  rotation = 0,
): Promise<string> {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas indisponível");
  }

  const rad = getRadianAngle(rotation);
  const { width: boxW, height: boxH } = rotateSize(image.width, image.height, rotation);
  canvas.width = boxW;
  canvas.height = boxH;
  ctx.translate(boxW / 2, boxH / 2);
  ctx.rotate(rad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const aspect = crop.height === 0 ? 1 : crop.width / crop.height;
  const outW = aspect >= 1 ? PHOTO_OUTPUT_SIZE : Math.round(PHOTO_OUTPUT_SIZE * aspect);
  const outH = aspect >= 1 ? Math.round(PHOTO_OUTPUT_SIZE / aspect) : PHOTO_OUTPUT_SIZE;
  const out = document.createElement("canvas");
  out.width = outW;
  out.height = outH;
  const outCtx = out.getContext("2d");
  if (!outCtx) {
    throw new Error("Canvas indisponível");
  }
  outCtx.drawImage(canvas, crop.x, crop.y, crop.width, crop.height, 0, 0, outW, outH);
  return out.toDataURL("image/jpeg", 0.9);
}
