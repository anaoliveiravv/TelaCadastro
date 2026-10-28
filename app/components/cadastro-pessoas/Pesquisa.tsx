
"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  SearchField,
  TextField,
} from "@heroui/react";

import CampoData from "./CampoData";

type Filtros = {
  cpf: string;
  nome: string;
  salarioMinimo: string;
  salarioMaximo: string;
};

export default function Pesquisa({
  onBuscar,
}: {
  onBuscar: (filtros: Filtros) => void;
}) {
  const [filtros, setFiltros] = useState<Filtros>({
    cpf: "",
    nome: "",
    salarioMinimo: "",
    salarioMaximo: "",
  });

  function atualizar(campo: keyof Filtros, valor: string) {
    setFiltros((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  return (
    <section className="h-full rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        Pesquisar cadastros
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SearchField
          name="cpf"
          fullWidth
          value={filtros.cpf}
          onChange={(v) => atualizar("cpf", v)}
        >
          <Label>CPF</Label>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Digite o CPF" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <SearchField
          name="nome"
          fullWidth
          value={filtros.nome}
          onChange={(v) => atualizar("nome", v)}
        >
          <Label>Nome</Label>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Digite o nome" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Faixa salarial</p>

          <div className="grid grid-cols-2 gap-3">
            <TextField name="salarioMinimo">
              <Label>Mínimo</Label>
              <Input
                type="number"
                min="0"
                placeholder="0,00"
                value={filtros.salarioMinimo}
                onChange={(e) =>
                  atualizar("salarioMinimo", e.target.value)
                }
              />
            </TextField>

            <TextField name="salarioMaximo">
              <Label>Máximo</Label>
              <Input
                type="number"
                min="0"
                placeholder="0,00"
                value={filtros.salarioMaximo}
                onChange={(e) =>
                  atualizar("salarioMaximo", e.target.value)
                }
              />
            </TextField>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Período de contrato
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CampoData titulo="Início" />
            <CampoData titulo="Fim" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          onPress={() => onBuscar(filtros)}
        >
          Buscar
        </Button>
      </div>
    </section>
  );
}
