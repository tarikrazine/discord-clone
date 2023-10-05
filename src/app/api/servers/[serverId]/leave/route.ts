import { NextResponse } from "next/server";

import { sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";

export const runtime = "edge";

export async function PATCH(
  request: Request,
  { params }: { params: { serverId: string } },
) {
  const profile = await currentProfile();

  const serverId = params.serverId;

  if (!profile) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!serverId) {
    return NextResponse.json({ message: "No server id" }, { status: 400 });
  }

  try {
    const server = await db.transaction(async (tx) => {
      const [server] = await tx.update(serverSchema).set({
        updatedAt: new Date(),
      }).where(
        sql`${serverSchema.id} = ${serverId} AND ${serverSchema.profileId} != ${profile.id}`,
      ).returning();

      await tx.delete(memberSchema).where(
        sql`${memberSchema.profileId} = ${profile.id} AND ${memberSchema.serverId} = ${server.id}`,
      );

      return server;
    });

    return NextResponse.json({ server }, { status: 200 });
  } catch (error) {
    console.log("[LEAVE_PATCH]", error);
    return NextResponse.json({ message: "Internal Server" }, { status: 500 });
  }
}
