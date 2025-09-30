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
            validators: [{ type: "required" }],
          },
          {
            id: "startWattPercentage",
            label: "startWattPercentage",
            validators: [{ type: "required" }, { type: "min", value: 0 }],
          },
          {
            id: "endWattPercentage",
            label: "endWattPercentage",
            validators: [{ type: "required" }, { type: "min", value: 0 }],
          },
          {
            id: "rpm",
            label: "rpm",
            validators: [
              { type: "required" },
              { type: "min", value: 50 },
              { type: "max", value: 150 },
            ],
          },
          {
            id: "notes",
            label: "notes",
            validators: [{ type: "required" }],
          },
          {
            id: "blockLabel",
            label: "blockLabel",
            validators: [{ type: "required" }],
          },
        ]}
        onComplete={(data) => {
          field.handleChange(null);
          console.log(data);
          close();
        }}
      />
    </>
  );
}
