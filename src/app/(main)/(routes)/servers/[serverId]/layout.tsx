import { redirectToSignIn } from "@clerk/nextjs";

import { eq, sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";
import { redirect } from "next/navigation";
import ServerSideBar from "@/components/server/serverSideBar";

export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.query.server.findFirst({
    where: eq(serverSchema.id, params.serverId),
    with: {
      members: {
        where: eq(memberSchema.profileId, profile.id),
      },
    },
  });

  if (!server?.members[0]) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <section className="hidden md:flex flex-col h-full w-60 fixed z-20 inset-y-0">
        <ServerSideBar serverId={params.serverId} />
      </section>
      <section className="h-full md:pl-60">{children}</section>
    </div>
  );
}
