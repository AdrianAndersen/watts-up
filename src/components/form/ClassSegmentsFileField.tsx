import { FileInput, type FileInputProps } from "@mantine/core";
import { useFieldContext } from "../../hooks/form.ts";
import { IconFileUpload } from "@tabler/icons-react";
import Papa from "papaparse";
import { notifications } from "@mantine/notifications";

export interface ClassSegment {
  durationInSeconds: number;
  startWattPercentage: number;
  endWattPercentage: number;
  rpm: number;
  notes: string;
  blockLabel: string;
}

function parseSegments(data: string[][]) {
  console.log(data);
  return [] as ClassSegment[];
}

export default function ClassSegmentsFileField(props: FileInputProps) {
  const field = useFieldContext<ClassSegment[] | null>();

  return (
    <FileInput
      required
      label={"Timedetaljer"}
      placeholder={"Velg fil (csv)"}
      leftSection={<IconFileUpload />}
      accept="csv,text/csv"
      clearable
      {...props}
      onChange={(file: File | null) => {
        if (!file) return field.handleChange(null);

        const reader = new FileReader();
        reader.onload = () => {
          Papa.parse<string[]>(reader.result as string, {
            header: false,
            skipEmptyLines: true,
            complete: ({ data, errors }) => {
              if (errors.length) {
                notifications.show({
                  title: "Klarte ikke parse CSV-fil!",
                  message: `Feilmelding: ${errors.join(", ")} (se console.error([...]) for flere detaljer.`,
                  color: "red",
                  autoClose: 6000,
                });
                console.error("File parse errors:", errors.join(", "));
                return;
              }
              const segments = parseSegments(data);
              if (segments !== null) {
                field.handleChange(segments);
              }
            },
            error: (error: unknown) => {
              notifications.show({
                title: "Klarte ikke parse CSV-fil!",
                message: `Feilmelding: ${error} (se console.error([...]) for flere detaljer.`,
                color: "red",
                autoClose: 6000,
              });
              console.error("File parse error:", error);
            },
          });
        };

        reader.onerror = (err) => {
          notifications.show({
            title: "Klarte ikke lese CSV-fil!",
            message: `Feilmelding: ${err} (se console.error([...]) for flere detaljer.`,
            color: "red",
            autoClose: 6000,
          });
          console.error("File read error:", err);
        };

        reader.readAsText(file);
      }}
      onBlur={field.handleBlur}
      error={field.state.meta.errors.join(", ")}
    />
  );
}
