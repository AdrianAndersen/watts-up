import CSVImporter from "@importcsv/react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCloudUpload, IconX } from "@tabler/icons-react";

import { useFieldContext } from "@/hooks/form";

export interface ClassSegment {
  durationInSeconds: number;
  startWattPercentage: number;
  endWattPercentage: number;
  rpm: number;
  notes: string;
  blockLabel: string;
}

export default function ClassSegmentsFileField() {
  const field = useFieldContext<ClassSegment[]>();
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      {field.state.value.length > 0 ? (
        <Group>
          <Text fs={"italic"}>{field.state.value.length} rader lastet opp</Text>
          <Button
            color={"red"}
            variant={"subtle"}
            leftSection={<IconX />}
            onClick={() => field.setValue([])}
          >
            Fjern
          </Button>
        </Group>
      ) : (
        <Stack gap={5}>
          <Text fs={"italic"}>Ingen fil valgt</Text>
          <Button
            color={"green"}
            leftSection={<IconCloudUpload />}
            onClick={open}
          >
            Last opp program (csv)
          </Button>
          <CSVImporter
            modalOnCloseTriggered={close}
            modalIsOpen={opened}
            columns={[]}
            dynamicColumns={[
              {
                id: "durationInSeconds",
                label: "VarighetSekunder",
                type: "number",
                validators: [{ type: "required" }, { type: "min", value: 1 }],
                transformations: [{ type: "trim" }],
              },
              {
                id: "startWattPercentage",
                label: "StartWattProsent",
                type: "number",
                validators: [{ type: "required" }, { type: "min", value: 0 }],
                transformations: [{ type: "trim" }],
              },
              {
                id: "endWattPercentage",
                label: "SluttWattProsent",
                type: "number",
                validators: [{ type: "required" }, { type: "min", value: 0 }],
                transformations: [{ type: "trim" }],
              },
              {
                id: "rpm",
                label: "RPM",
                type: "number",
                transformations: [{ type: "trim" }],
              },
              {
                id: "notes",
                label: "Notater",
                validators: [{ type: "required" }],
                transformations: [{ type: "trim" }],
              },
              {
                id: "blockLabel",
                label: "Blokk",
                description: "Synlig øverst på programmet",
                validators: [{ type: "required" }],
                transformations: [{ type: "trim" }],
              },
            ]}
            onComplete={(result) => {
              const segments: ClassSegment[] =
                result?.rows?.map((row) => {
                  return {
                    durationInSeconds:
                      Number(row._custom_fields?.["durationInSeconds"]) || 0,
                    startWattPercentage:
                      Number(row._custom_fields?.["startWattPercentage"]) || 0,
                    endWattPercentage:
                      Number(row._custom_fields?.["endWattPercentage"]) || 0,
                    rpm: Number(row._custom_fields?.["rpm"]) || 0,
                    notes: String(row._custom_fields?.["notes"]) || "",
                    blockLabel:
                      String(row._custom_fields?.["blockLabel"]) || "",
                  } satisfies ClassSegment;
                }) || null;
              field.handleChange(segments);
              close();
            }}
          />
        </Stack>
      )}
    </>
  );
}
