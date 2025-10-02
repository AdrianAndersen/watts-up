"use client";
import { Button, Container, Fieldset, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBike } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

import { ClassSegment } from "@/components/form/ClassSegmentsFileField";
import { emailFieldValidator } from "@/components/form/EmailField";
import { passwordFieldValidator } from "@/components/form/PasswordField";
import { useAppForm } from "@/hooks/form";
import MyWellness from "@/lib/my-wellness";

interface CreateClassForm {
  email: string;
  password: string;
  className: string;
  segments: ClassSegment[];
}

const defaultValues: CreateClassForm = {
  email: "",
  password: "",
  className: "",
  segments: [],
};

export default function CreateGroupClass() {
  const createGroupClassMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      className,
      segments,
    }: CreateClassForm) => {
      const loginResponse = await MyWellness.login({
        username: email,
        password,
      });
      if ("errorMessage" in loginResponse) {
        notifications.show({
          title: "Klarte ikke logge inn",
          message: loginResponse.errorMessage,
          color: "red",
          autoClose: 6000,
        });
        return;
      }
      const createResponse = await MyWellness.createNewGroupClass({
        facilityUrl: loginResponse.facilityUrl,
        accessToken: loginResponse.token,
        className,
      });
      if ("errorMessage" in createResponse) {
        notifications.show({
          title: "Klarte ikke opprette time",
          message: createResponse.errorMessage,
          color: "red",
          autoClose: 6000,
        });
        return;
      }

      const updateResponse = await MyWellness.updateGroupClass({
        facilityUrl: loginResponse.facilityUrl,
        accessToken: loginResponse.token,
        activityId: createResponse.activityId,
        segments,
      });
      if ("errorMessage" in updateResponse || !updateResponse.success) {
        notifications.show({
          title: "Klarte ikke oppdatere time",
          message: updateResponse?.errorMessage ?? "Ukjent feil",
          color: "red",
          autoClose: 6000,
        });
        return;
      }
      window.open(
        `https://pronext.mywellness.com/training/formats/groupcycle/detail/${createResponse.activityId}`,
        "_blank",
      );
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
