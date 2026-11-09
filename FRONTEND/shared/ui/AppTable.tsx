"use client";

import { Table } from "@heroui/react";
import type { ComponentProps } from "react";

type TableRootProps = ComponentProps<typeof Table>;

export function AppTable(props: TableRootProps) {
  return <Table {...props} />;
}

AppTable.ScrollContainer = Table.ScrollContainer;
AppTable.Content = Table.Content;
AppTable.Header = Table.Header;
AppTable.Column = Table.Column;
AppTable.Body = Table.Body;
AppTable.Row = Table.Row;
AppTable.Cell = Table.Cell;
AppTable.Footer = Table.Footer;
