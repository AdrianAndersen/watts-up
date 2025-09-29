import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack, Text, Title } from "@mantine/core";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Container>
      <Stack>
        <Title>Upload to MyWellness</Title>
        <Text>Feature incoming! 🤘</Text>
      </Stack>
    </Container>
  );
}
