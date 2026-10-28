
"use client";

import {
  Button,
  Chip,
  Modal,
  Switch,
  Table,
} from "@heroui/react";
import { useState } from "react";
import type { Pessoa } from "./tipos";

type Props = {
  pessoas: Pessoa[];
  onEditar: (pessoa: Pessoa) => void;
  onNovo: () => void;
  onExcluir: (id: number) => void;
  onAlterarSituacao: (id: number, ativo: boolean) => void;
};

export default function Tabelapessoas({
  pessoas,
  onEditar,
  onNovo,
  onExcluir,
  onAlterarSituacao,
}: Props) {
  const [excluirId, setExcluirId] = useState<number | null>(null);

  const moeda = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const data = (valor: string) => {
    if (!valor) return "-";
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Resultados da pesquisa
        </h2>

        <Button
          variant="primary"
          onPress={onNovo}
        >
          + Incluir novo registro
        </Button>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Pessoas cadastradas">
            <Table.Header>
              <Table.Column isRowHeader>CPF</Table.Column>
              <Table.Column>Nome</Table.Column>
              <Table.Column>Salário</Table.Column>
              <Table.Column>Contrato</Table.Column>
              <Table.Column>Situação</Table.Column>
              <Table.Column>Ações</Table.Column>
              <Table.Column>Ativo</Table.Column>
            </Table.Header>

            <Table.Body
              items={pessoas}
              renderEmptyState={() => (
                <div className="p-6 text-center text-slate-500">
                  Nenhum cadastro encontrado.
                </div>
              )}
            >
              {(pessoa) => (
                <Table.Row id={pessoa.id} key={pessoa.id}>
                  <Table.Cell>{pessoa.cpf}</Table.Cell>

                  <Table.Cell>{pessoa.nome}</Table.Cell>

                  <Table.Cell>
                    {moeda(pessoa.salario)}
                  </Table.Cell>

                  <Table.Cell>
                    {data(pessoa.inicio)} até {data(pessoa.fim)}
                  </Table.Cell>

                  <Table.Cell>
                    <Chip
                      color={pessoa.ativo ? "success" : "default"}
                      variant="soft"
                      size="sm"
                    >
                      {pessoa.ativo ? "Ativo" : "Inativo"}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => {
                          onEditar(pessoa);
                          document
                            .getElementById("novo-cadastro")
                            ?.scrollIntoView({
                              behavior: "smooth",
                            });
                        }}
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => setExcluirId(pessoa.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <Switch
                      aria-label={`Ativar ${pessoa.nome}`}
                      isSelected={pessoa.ativo}
                      onChange={(ativo) =>
                        onAlterarSituacao(pessoa.id, ativo)
                      }
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {/* Modal de confirmação */}
      <Modal>
        <Modal.Backdrop
          isOpen={excluirId !== null}
          onOpenChange={(aberto) => {
            if (!aberto) setExcluirId(null);
          }}
        >
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading>
                  Excluir cadastro?
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                Essa ação removerá a pessoa da lista de
                demonstração.
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="outline"
                  onPress={() => setExcluirId(null)}
                >
                  Cancelar
                </Button>

                <Button
                  variant="danger"
                  onPress={() => {
                    if (excluirId !== null) {
                      onExcluir(excluirId);
                    }
                    setExcluirId(null);
                  }}
                >
                  Excluir
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </section>
  );
}
