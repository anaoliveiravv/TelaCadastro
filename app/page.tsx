
"use client";

import { useState } from "react";
import TituloPagina from "./components/cadastro-pessoas/TituloPagina";
import Pesquisa from "./components/cadastro-pessoas/Pesquisa";
import FotoCadastro from "./components/cadastro-pessoas/FotoCadastro";
import Tabelapessoas from "./components/cadastro-pessoas/Tabelapessoas";
import FormularioCadastro from "./components/cadastro-pessoas/FormularioCadastro";
import type { Pessoa } from "./components/cadastro-pessoas/tipos";

const pessoasIniciais: Pessoa[] = [
  {
    id: 1,
    cpf: "123.456.789-01",
    nome: "Marina Costa",
    salario: 3500,
    inicio: "2026-11-01",
    fim: "2027-10-31",
    ativo: true,
  },
  {
    id: 2,
    cpf: "987.654.321-00",
    nome: "João Almeida",
    salario: 2800,
    inicio: "2025-03-15",
    fim: "2026-03-14",
    ativo: false,
  },
  {
    id: 3,
    cpf: "456.789.123-00",
    nome: "Ana Ribeiro",
    salario: 4200,
    inicio: "2026-10-01",
    fim: "2027-09-30",
    ativo: true,
  },
];

export default function Home() {
  const [pessoas, setPessoas] = useState(pessoasIniciais);
  const [filtros, setFiltros] = useState({
    cpf: "",
    nome: "",
    salarioMinimo: "",
    salarioMaximo: "",
  });
  const [editando, setEditando] = useState<Pessoa | null>(null);

  const pessoasFiltradas = pessoas.filter((pessoa) => {
    const cpfBusca = filtros.cpf.replace(/\D/g, "");
    const cpfPessoa = pessoa.cpf.replace(/\D/g, "");

    return (
      cpfPessoa.includes(cpfBusca) &&
      pessoa.nome.toLowerCase().includes(filtros.nome.toLowerCase()) &&
      (!filtros.salarioMinimo ||
        pessoa.salario >= Number(filtros.salarioMinimo)) &&
      (!filtros.salarioMaximo ||
        pessoa.salario <= Number(filtros.salarioMaximo))
    );
  });

  function salvarPessoa(pessoa: Pessoa) {
    setPessoas((anteriores) => {
      const existe = anteriores.some((p) => p.id === pessoa.id);

      return existe
        ? anteriores.map((p) => (p.id === pessoa.id ? pessoa : p))
        : [...anteriores, pessoa];
    });

    setEditando(null);
  }

  function alterarSituacao(id: number, ativo: boolean) {
    setPessoas((anteriores) =>
      anteriores.map((p) =>
        p.id === id ? { ...p, ativo } : p
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <TituloPagina />

        {/* Área superior */}
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
          <Pesquisa onBuscar={setFiltros} />
          <FotoCadastro />
        </div>

        {/* Resultados */}
        <Tabelapessoas
          pessoas={pessoasFiltradas}
          onEditar={setEditando}
          onAlterarSituacao={alterarSituacao}
          onExcluir={(id) =>
            setPessoas((anteriores) =>
              anteriores.filter((p) => p.id !== id)
            )
          }
          onNovo={() => {
            setEditando(null);
            document
              .getElementById("novo-cadastro")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Cadastro */}
        <div id="novo-cadastro">
          <FormularioCadastro
            pessoa={editando}
            onSalvar={salvarPessoa}
            onCancelar={() => setEditando(null)}
          />
        </div>
      </div>
    </main>
  );
}
