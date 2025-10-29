import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  Group,
  mantineHtmlProps,
  MantineProvider,
  Title,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
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
          <ModalsProvider>
            <ClientProviders>
              <AppShell padding="md" header={{ height: 60 }}>
                <AppShellHeader bg={"blue"}>
                  <Group gap={5} px={"md"}>
                    <IconMusicBolt color={"white"} style={{ marginTop: 7 }} />
                    <Title c={"white"}>watts-up</Title>
                  </Group>
                </AppShellHeader>
                <AppShellMain>{children}</AppShellMain>
              </AppShell>
            </ClientProviders>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
