import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  Group,
  MantineProvider,
  Title,
  mantineHtmlProps,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { IconMusicBolt } from "@tabler/icons-react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import ClientProviders from "@/components/ClientProviders";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "watts-up" },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="no" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <HeadContent />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <ModalsProvider>
            <ClientProviders>
              <AppShell padding="md" header={{ height: 60 }}>
                <AppShellHeader bg={"blue"}>
                  <Group gap={5} px={"md"}>
                    <IconMusicBolt color={"white"} style={{ marginTop: 7 }} />
                    <Title c={"white"}>watts-up</Title>
                  </Group>
                </AppShellHeader>
                <AppShellMain>
                  <Outlet />
                  <Scripts />
                </AppShellMain>
              </AppShell>
            </ClientProviders>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
