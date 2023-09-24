import { redirect } from "next/navigation";

import { sql } from "drizzle-orm";

import { initialProfile } from "@/lib/initialprofile";

import { db } from "@/db";
import { member as memberSchema } from "@/db/schema/member";

import InitialModal from "@/components/modals/initialModal";

export default async function SetupPage() {
  const profile = await initialProfile();

    const server = await db.query.member.findFirst({
      where: sql`${memberSchema.profileId} = ${profile.id}`,
      with: {
        server: true
      }})

  if (server?.server) {
    return redirect(`/servers/${server?.server.id}`);
  }

  return <InitialModal />;
}
