
"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  Button,
  Checkbox,
  Chip,
  Input,
  Label,
  ListBox,
  Select,
  Switch,
  TextArea,
  TextField,
} from "@heroui/react";

import CampoData from "./CampoData";
import type { Pessoa } from "./tipos";

type Props = {
  pessoa: Pessoa | null;
  onSalvar: (pessoa: Pessoa) => void;
  onCancelar: () => void;
};

const dadosVazios = {
  cpf: "",
  nome: "",
  email: "",
  telefone: "",
  endereco: "",
  numero: "",
  cep: "",
  uf: "",
  cidade: "",
  observacao: "",
  salario: "",
  inicio: "",
  fim: "",
};

export default function FormularioCadastro({
  pessoa,
  onSalvar,
  onCancelar,
}: Props) {
  const [dados, setDados] = useState({ ...dadosVazios });
  const [ativo, setAtivo] = useState(true);
  const [semNumero, setSemNumero] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [anexos, setAnexos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pessoa) {
      setDados({
        ...dadosVazios,
        cpf: pessoa.cpf,
        nome: pessoa.nome,
        salario: String(pessoa.salario),
        inicio: pessoa.inicio,
        fim: pessoa.fim,
      });

      setAtivo(pessoa.ativo);
    } else {
      setDados({ ...dadosVazios });
      setAtivo(true);
    }

    setSemNumero(false);
    setFoto(null);
    setAnexos({});
  }, [pessoa]);

  function alterar(
    campo: keyof typeof dadosVazios,
    valor: string
  ) {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function limparFormulario() {
    setDados({ ...dadosVazios });
    setAtivo(true);
    setSemNumero(false);
    setFoto(null);
    setAnexos({});
  }

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!dados.inicio || !dados.fim) {
      alert("Preencha as datas do contrato.");
      return;
    }

    if (dados.fim < dados.inicio) {
      alert(
        "A data final deve ser igual ou posterior à inicial."
      );
      return;
    }

    onSalvar({
      id: pessoa?.id ?? Date.now(),
      cpf: dados.cpf,
      nome: dados.nome,
      salario: Number(dados.salario),
      inicio: dados.inicio,
      fim: dados.fim,
      ativo,
    });

    limparFormulario();
  }

  function cancelar() {
    limparFormulario();
    onCancelar();
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">

      {/* TÍTULO */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {pessoa ? "Editar cadastro" : "Novo cadastro"}
        </h2>

        <p className="text-xs text-slate-500">
          * Campos obrigatórios
        </p>
      </div>

      <form onSubmit={salvar} className="space-y-8">

        {/* DADOS PESSOAIS */}
        <div className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2 font-semibold">
            Dados pessoais
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <TextField isRequired>
              <Label>CPF</Label>
              <Input
                required
                placeholder="000.000.000-00"
                value={dados.cpf}
                onChange={(e) =>
                  alterar("cpf", e.target.value)
                }
              />
            </TextField>

            <TextField isRequired>
              <Label>Nome completo</Label>
              <Input
                required
                placeholder="Digite o nome completo"
                value={dados.nome}
                onChange={(e) =>
                  alterar("nome", e.target.value)
                }
              />
            </TextField>

          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2 font-semibold">
            Endereço
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">

            {/* Endereço */}
            <div className="md:col-span-3">
              <TextField>
                <Label>Endereço completo</Label>
                <Input
                  placeholder="Rua, avenida, bairro..."
                  value={dados.endereco}
                  onChange={(e) =>
                    alterar("endereco", e.target.value)
                  }
                />
              </TextField>
            </div>

            {/* Número */}
            <div className="md:col-span-1">
              <TextField>
                <Label>Número</Label>
                <Input
                  placeholder="Nº"
                  disabled={semNumero}
                  value={dados.numero}
                  onChange={(e) =>
                    alterar("numero", e.target.value)
                  }
                />
              </TextField>

              <div className="mt-2">
                <Checkbox
                  isSelected={semNumero}
                  onChange={(selecionado) => {
                    setSemNumero(selecionado);

                    if (selecionado) {
                      alterar("numero", "");
                    }
                  }}
                >
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>

                    <span className="text-xs">
                      Sem número
                    </span>
                  </Checkbox.Content>
                </Checkbox>
              </div>
            </div>

            {/* UF */}
            <div className="md:col-span-1">
              <Select
                placeholder="Selecione"
                selectedKey={dados.uf || null}
                onSelectionChange={(key) =>
                  alterar("uf", String(key ?? ""))
                }
              >
                <Label>UF</Label>

                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="MA" textValue="Maranhão">
                      Maranhão
                    </ListBox.Item>

                    <ListBox.Item id="CE" textValue="Ceará">
                      Ceará
                    </ListBox.Item>

                    <ListBox.Item id="PI" textValue="Piauí">
                      Piauí
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* CEP */}
            <div className="md:col-span-1">
              <TextField>
                <Label>CEP</Label>
                <Input
                  placeholder="00000-000"
                  value={dados.cep}
                  onChange={(e) =>
                    alterar("cep", e.target.value)
                  }
                />
              </TextField>
            </div>

            {/* Cidade */}
            <div className="md:col-span-3">
              <TextField>
                <Label>Cidade</Label>
                <Input
                  placeholder="Digite a cidade"
                  value={dados.cidade}
                  onChange={(e) =>
                    alterar("cidade", e.target.value)
                  }
                />
              </TextField>
            </div>

          </div>
        </div>

        {/* CONTATO E SITUAÇÃO */}
        <div className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2 font-semibold">
            Contato e situação
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* E-mail */}
            <TextField>
              <Label>E-mail</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={dados.email}
                onChange={(e) =>
                  alterar("email", e.target.value)
                }
              />
            </TextField>

            {/* Telefone */}
            <TextField>
              <Label>Telefone</Label>
              <Input
                type="tel"
                placeholder="(00) 90000-0000"
                value={dados.telefone}
                onChange={(e) =>
                  alterar("telefone", e.target.value)
                }
              />
            </TextField>

            {/* Situação */}
            <div className="flex flex-col justify-center gap-2">
              <Switch
                isSelected={ativo}
                onChange={setAtivo}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>

                <Switch.Content>
                  <Label>Cadastro ativo</Label>
                </Switch.Content>
              </Switch>

              <Chip
                color={ativo ? "success" : "default"}
                variant="soft"
                size="sm"
              >
                {ativo ? "Ativo" : "Inativo"}
              </Chip>
            </div>
          </div>

          {/* Observação */}
          <TextField>
            <Label>Observação</Label>
            <TextArea
              rows={3}
              fullWidth
              placeholder="Informações adicionais"
              value={dados.observacao}
              onChange={(e) =>
                alterar("observacao", e.target.value)
              }
            />
          </TextField>
        </div>

        {/* REMUNERAÇÃO E CONTRATO */}
        <div className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2 font-semibold">
            Remuneração e contrato
          </h3>

          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">

            {/* Salário */}
            <TextField isRequired>
              <Label>Salário (R$)</Label>

              <Input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="3500,00"
                value={dados.salario}
                onChange={(e) =>
                  alterar("salario", e.target.value)
                }
              />
            </TextField>

            {/* Início do contrato - HeroUI */}
            <CampoData
              titulo="Início do contrato"
              valor={dados.inicio}
              aoAlterar={(data) =>
                alterar("inicio", data)
              }
              obrigatorio
            />

            {/* Fim do contrato - HeroUI */}
            <CampoData
              titulo="Fim do contrato"
              valor={dados.fim}
              aoAlterar={(data) =>
                alterar("fim", data)
              }
              dataMinima={dados.inicio}
              obrigatorio
            />

          </div>
        </div>

        {/* FOTO */}
        <div className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2 font-semibold">
            Foto
          </h3>

          <div className="flex flex-wrap items-center gap-5">

            {foto ? (
              <img
                src={foto}
                alt="Prévia da foto"
                className="h-24 w-24 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
                Sem foto
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="foto-upload"
                className="inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Selecionar foto
              </label>

              <input
                id="foto-upload"
                type="file"
                accept="image/png,image/jpeg,image/gif"
                className="sr-only"
                onChange={(e) => {
                  const arquivo = e.target.files?.[0];

                  if (!arquivo) return;

                  const leitor = new FileReader();

                  leitor.onload = () => {
                    setFoto(String(leitor.result));
                  };

                  leitor.readAsDataURL(arquivo);
                }}
              />

              <p className="text-xs text-slate-500">
                Formatos aceitos: JPG, PNG e GIF.
              </p>
            </div>

          </div>
        </div>

        {/* ANEXOS */}
        <div className="space-y-4">
          <h3 className="border-b border-slate-200 pb-2 font-semibold">
            Anexos
          </h3>

          <p className="text-xs text-slate-500">
            Somente arquivos PDF.
          </p>

          {[
            "Cópia do RG",
            "Cópia do CPF",
            "Comprovante de residência",
          ].map((nome) => (
            <div
              key={nome}
              className="grid grid-cols-1 items-center gap-3 md:grid-cols-3"
            >
              <p className="text-sm">{nome}</p>

              <input
                type="file"
                accept="application/pdf"
                className="block w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700"
                onChange={(e) => {
                  const arquivo = e.target.files?.[0];

                  if (arquivo) {
                    setAnexos((anterior) => ({
                      ...anterior,
                      [nome]: arquivo.name,
                    }));
                  }
                }}
              />

              <p className="truncate text-xs text-slate-500">
                {anexos[nome] ?? "Nenhum arquivo selecionado"}
              </p>
            </div>
          ))}
        </div>

        {/* BOTÕES */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">

          <Button
            type="button"
            variant="outline"
            onPress={cancelar}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
          >
            {pessoa
              ? "Salvar alterações"
              : "Salvar cadastro"}
          </Button>

        </div>

      </form>
    </section>
  );
}
