import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { initialProfile } from "@/lib/initialprofile";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";
import InitialModal from "@/components/modals/initialModal";

export default async function SetupPage() {
  const profile = await initialProfile();

  const [serverResponse] = await db
    .select()
    .from(serverSchema).where(eq(serverSchema.profileId, profile.id))
    .leftJoin(memberSchema, eq(memberSchema.profileId, profile.id))
    .limit(1);

  console.log("Server response", serverResponse);

  if (serverResponse) {
    return redirect(`/servers/${serverResponse?.member?.serverId}`);
  }

  return <InitialModal />;
}
