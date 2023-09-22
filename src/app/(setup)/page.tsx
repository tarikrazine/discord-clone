import { redirect } from "next/navigation";

import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { initialProfile } from "@/lib/initialprofile";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";
import InitialModal from "@/components/modals/initialModal";

export default async function SetupPage() {
  const profile = await initialProfile();

  const [serverResponse] = await db
    .select()
    .from(serverSchema)
    .where(sql`${serverSchema.profileId} = ${profile.id}`)
    .leftJoin(memberSchema, sql`${memberSchema.profileId} = ${profile.id}`)
    .limit(1);

  if (serverResponse) {
    return redirect(`/servers/${serverResponse?.member?.serverId}`);
  }

  return <InitialModal />;
}
