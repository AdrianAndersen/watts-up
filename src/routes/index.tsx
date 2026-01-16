import { createFileRoute } from "@tanstack/react-router";

import CreateGroupClass from "@/components/CreateGroupClass";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <CreateGroupClass />;
}
