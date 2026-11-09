export async function toPdfObjectUrl(src: string): Promise<string> {
  if (src.startsWith("blob:")) {
    return src;
  }
  const response = src.startsWith("data:")
    ? await fetch(src)
    : await fetch(src, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Falha ao carregar o PDF");
  }
  return URL.createObjectURL(await response.blob());
}
