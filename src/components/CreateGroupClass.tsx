"use client";
import { Button, Container, Fieldset, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBike } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

import { ClassSegment } from "@/components/form/ClassSegmentsFileField";
import { emailFieldValidator } from "@/components/form/EmailField";
import { passwordFieldValidator } from "@/components/form/PasswordField";
import { useAppForm } from "@/hooks/form";
import { createNewGroupClass } from "@/lib/mywellness";

export interface CreateClassForm {
  email: string;
  password: string;
  club: string;
  className: string;
  segments: ClassSegment[];
}

const defaultValues: CreateClassForm = {
  email: "",
  password: "",
  club: "staminaski",
  className: "",
  segments: [],
};

export default function CreateGroupClass() {
  const createGroupClassMutation = useMutation({
    mutationFn: async (data: CreateClassForm) => {
      const createData = await createNewGroupClass(data, "TODO");
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
      <Stack gap={"xs"}>
        <Stack gap={5}>
          <Title>Opprett MyWellness-gruppetime</Title>
          <Text fs={"italic"} size={"sm"}>
            Fyll inn informasjonen som trengs for å opprette en Group Cycle
            Connect time med TerskelWatt%
          </Text>
        </Stack>
        <Fieldset legend={"Din MyWellness-konto"}>
          <Stack gap={"xs"}>
            <form.AppField
              name={"email"}
              validators={{
                onSubmit: ({ value }) => emailFieldValidator(value),
              }}
            >
              {(field) => <field.EmailField />}
            </form.AppField>
            <form.AppField
              name={"password"}
              validators={{
                onSubmit: ({ value }) => passwordFieldValidator(value),
              }}
            >
              {(field) => <field.PasswordField />}
            </form.AppField>
          </Stack>
        </Fieldset>
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
        <form.AppField
          name={"segments"}
          validators={{
            onSubmit: ({ value }) =>
              value.length === 0 ? "Du må laste opp progam" : null,
          }}
        >
          {(field) => <field.ClassSegmentsFileField />}
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
