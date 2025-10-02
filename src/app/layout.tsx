// fixme: probably should not need use client here
"use client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  AppShell,
  ColorSchemeScript,
  Group,
  mantineHtmlProps,
  MantineProvider,
  Title,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { IconMusicBolt } from "@tabler/icons-react";
import Head from "next/head";

import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="no" {...mantineHtmlProps}>
      <Head key={"mantine"}>
        <ColorSchemeScript />
      </Head>
      <body>
        <MantineProvider>
          <Notifications />
          <ClientProviders>
            <AppShell padding="md" header={{ height: 60 }}>
              <AppShell.Header bg={"blue"}>
                <Group gap={5} px={"md"}>
                  <IconMusicBolt color={"white"} style={{ marginTop: 7 }} />
                  <Title c={"white"}>watts-up</Title>
                </Group>
              </AppShell.Header>
              <AppShell.Main>{children}</AppShell.Main>
            </AppShell>
          </ClientProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
