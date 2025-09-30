import { Metadata } from "next";

import CreateGroupClass from "@/components/CreateGroupClass";

export const metadata: Metadata = {
  title: "watts-up",
};

export default function IndexPage() {
  return <CreateGroupClass />;
}
