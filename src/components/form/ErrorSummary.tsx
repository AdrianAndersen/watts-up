import { Alert, List } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

import { useFormContext } from "@/hooks/form";

export default function ErrorSummary({
  serverErrors = [],
}: {
  serverErrors?: string[];
}) {
  const form = useFormContext();
  return (
    <form.Subscribe>
      {(formState) => {
        const errors = [
          ...Object.values(formState.fieldMeta).flatMap(
            // @ts-expect-error Object.values() does not retain type information
            (field) => field.errors,
          ),
          ...serverErrors,
        ];
        if (errors.length === 0) return <></>;

        return (
          <Alert
            icon={<IconExclamationCircle />}
            color={"red"}
            title={"Du må rette opp følgende før du kan gå videre"}
          >
            <List size={"sm"}>
              {errors.map((error, i) => (
                <List.Item key={`err-${i}`}>{error}</List.Item>
              ))}
            </List>
          </Alert>
        );
      }}
    </form.Subscribe>
  );
}
