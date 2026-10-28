
"use client";

import {
  DatePicker,
  DateField,
  Calendar,
  Label,
} from "@heroui/react";

import {
  parseDate,
  type DateValue,
} from "@internationalized/date";

type CampoDataProps = {
  titulo: string;
  valor?: string;
  aoAlterar?: (data: string) => void;
  dataMinima?: string;
  obrigatorio?: boolean;
};

export default function CampoData({
  titulo,
  valor,
  aoAlterar,
  dataMinima,
  obrigatorio = false,
}: CampoDataProps) {
  return (
    <DatePicker
      className="w-full"
      value={valor ? parseDate(valor) : null}
      onChange={(data: DateValue | null) => {
        aoAlterar?.(data ? data.toString() : "");
      }}
      minValue={dataMinima ? parseDate(dataMinima) : undefined}
      isRequired={obrigatorio}
    >
      <Label>{titulo}</Label>

      <DateField.Group fullWidth>
        <DateField.Input>
          {(segment) => (
            <DateField.Segment segment={segment} />
          )}
        </DateField.Input>

        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>

      <DatePicker.Popover>
        <Calendar aria-label={titulo}>
          <Calendar.Header>
            <Calendar.Heading />
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>

          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => (
                <Calendar.HeaderCell>
                  {day}
                </Calendar.HeaderCell>
              )}
            </Calendar.GridHeader>

            <Calendar.GridBody>
              {(date) => (
                <Calendar.Cell date={date} />
              )}
            </Calendar.GridBody>
          </Calendar.Grid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}
