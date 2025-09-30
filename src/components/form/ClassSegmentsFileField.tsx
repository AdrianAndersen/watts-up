import CSVImporter from "@importcsv/react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCloudUpload } from "@tabler/icons-react";

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
  const field = useFieldContext<ClassSegment[] | null>();
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Button leftSection={<IconCloudUpload />} onClick={open}>
        Velg fil (csv)
      </Button>
      <CSVImporter
        modalOnCloseTriggered={close}
        modalIsOpen={opened}
        columns={[
          {
            id: "durationInSeconds",
            label: "durationInSeconds",
            type: "number",
            validators: [{ type: "required" }, { type: "min", value: 1 }],
            transformations: [{ type: "trim" }],
          },
          {
            id: "startWattPercentage",
            label: "startWattPercentage",
            type: "number",
            validators: [{ type: "required" }, { type: "min", value: 0 }],
            transformations: [{ type: "trim" }],
          },
          {
            id: "endWattPercentage",
            label: "endWattPercentage",
            type: "number",
            validators: [{ type: "required" }, { type: "min", value: 0 }],
            transformations: [{ type: "trim" }],
          },
          {
            id: "rpm",
            label: "rpm",
            type: "number",
            validators: [
              { type: "required" },
              { type: "min", value: 60 },
              { type: "max", value: 120 },
            ],
            transformations: [{ type: "trim" }],
          },
          {
            id: "notes",
            label: "notes",
            validators: [{ type: "required" }],
            transformations: [{ type: "trim" }],
          },
          {
            id: "blockLabel",
            label: "blockLabel",
            validators: [{ type: "required" }],
            transformations: [{ type: "trim" }],
          },
        ]}
        onComplete={(data) => {
          const segments =
            (data?.mappedData?.map(
              (entry: { data: unknown }) => entry?.data,
            ) as ClassSegment[]) || null;
          field.handleChange(segments);
          close();
        }}
      />
    </>
  );
}
