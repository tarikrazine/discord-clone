import { redirect } from "next/navigation";

import { redirectToSignIn } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";

async function InviteCodePage({ params }: { params: { inviteCode: string } }) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  if (!params.inviteCode) {
    return redirect('/')
  }

  const existingServer = await db.query.server.findFirst({
    where: eq(serverSchema.inviteCode, params.inviteCode),
    with: {
      members: {
        where: eq(memberSchema.profileId, profile.id)
      }
    }
  })

  if (existingServer?.members[0]) {
    return redirect(`/servers/${existingServer.id}`)
  }

  const server = await db.transaction(async (tx) => {
    const [server] = await tx.update(serverSchema).set({
      updatedAt: new Date(),
    }).where(eq(serverSchema.inviteCode, params.inviteCode)).returning()

    await tx.insert(memberSchema).values({
      profileId: profile.id,
      serverId: server.id,
      createdAt: new Date(),
    });

    return server
  })

  if (server) {
    return  redirect(`/servers/${server.id}`)
  }

  return null;
}

export default InviteCodePage;
