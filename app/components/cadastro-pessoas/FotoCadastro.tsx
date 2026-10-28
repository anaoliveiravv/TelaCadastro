
"use client";

import { Avatar } from "@heroui/react";

const foto =
  "https://img.magnific.com/fotos-gratis/mulher-de-negocios-confiante_329181-11696.jpg?semt=ais_hybrid&w=740&q=80";

export default function FotoCadastro() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-center text-base font-semibold text-slate-900">
        Foto do cadastro
      </h2>

      <Avatar className="h-40 w-40 rounded-xl">
        <Avatar.Image
          src={foto}
          alt="Foto do cadastro"
          className="h-full w-full object-cover"
        />
        <Avatar.Fallback>MC</Avatar.Fallback>
      </Avatar>

      <p className="text-sm font-medium text-slate-700">
        Minha conta
      </p>
    </section>
  );
}
