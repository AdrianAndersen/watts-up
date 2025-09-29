/// <reference types="vite/client" />
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import type { PropsWithChildren } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { FormDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { AppShell, MantineProvider, Title } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export const Route = createRootRoute<{
  queryClient: QueryClient;
}>({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "watts-up",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<PropsWithChildren>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <AppShell padding="md" header={{ height: 60 }}>
            <AppShell.Header bg={"blue"}>
              <Title px={"md"} c={"white"}>
                watts-up
              </Title>
            </AppShell.Header>
            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
        <Scripts />
        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            FormDevtoolsPlugin(),
          ]}
        />
      </body>
    </html>
  );
}
