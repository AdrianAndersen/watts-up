import { Metadata } from "next";
import { Suspense } from "react";

import CreateGroupClass from "@/components/CreateGroupClass";

export const metadata: Metadata = {
  title: "watts-up",
};

export default async function IndexPage() {
  return (
    <Suspense>
      <CreateGroupClass />
    </Suspense>
  );
}
