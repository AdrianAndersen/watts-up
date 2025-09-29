import { createFileRoute } from "@tanstack/react-router";
import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { useAppForm } from "../hooks/form.ts";
import { IconBike } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createNewGroupClass } from "../lib/mywellness.ts";
import { notifications } from "@mantine/notifications";

export const Route = createFileRoute("/")({
  component: Index,
});

export interface ClassData {
  accessToken: string;
  className: string;
}

const defaultValues: ClassData = {
  accessToken: "",
  className: "",
};

function Index() {
  const createGroupClassMutation = useMutation({
    mutationFn: async (classData: ClassData) => {
      const createData = await createNewGroupClass(classData);
      // TODO: parse response with Zod to get typed response (either error or success response)
      // If error, show error message
      // If success, grab the created ID and use that to populate the class with data
      console.log(createData);
    },
    onError: (error) => {
      notifications.show({
        title: "Klarte ikke opprette gruppetime!",
        message: `Feilmelding: ${error} (se console.error([...]) for flere detaljer.`,
        color: "red",
        autoClose: 6000,
      });
      console.error(error);
    },
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      createGroupClassMutation.mutate(value);
    },
  });
  return (
    <Container>
      <Stack>
        <Stack gap={5}>
          <Title>Opprett MyWellness-gruppetime</Title>
          <Text fs={"italic"} size={"sm"}>
            Fyll inn informasjonen som trengs for å opprette en Group Cycle
            Connect time med TerskelWatt%
          </Text>
        </Stack>
        <form.AppField
          name={"accessToken"}
          validators={{
            onSubmit: ({ value }) =>
              value.length === 0 ? "Du må fylle inn token" : null,
          }}
        >
          {(field) => (
            <field.TextField
              required
              label={"Token"}
              description={
                "Ditt access token fra https://pronext.mywellness.com"
              }
              placeholder={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
            />
          )}
        </form.AppField>
        <form.AppField
          name={"className"}
          validators={{
            onSubmit: ({ value }) =>
              value.length === 0 ? "Du må fylle inn timenavn" : null,
          }}
        >
          {(field) => (
            <field.TextField
              required
              label={"Timenavn"}
              description={
                "Synlig for kunder, f.eks. i Apple Health eller på Strava"
              }
              placeholder={"Aktiv55 - Release X (Ditt fornavn)"}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.ErrorSummary />
        </form.AppForm>
        <Button
          leftSection={<IconBike />}
          onClick={form.handleSubmit}
          loading={createGroupClassMutation.isPending}
        >
          Opprett time
        </Button>
      </Stack>
    </Container>
  );
}
