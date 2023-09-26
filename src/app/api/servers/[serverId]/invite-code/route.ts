import { NextResponse } from "next/server";

import { sql } from "drizzle-orm";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";

import { currentProfile } from "@/lib/currentProfile";
import { randomShortString } from "@/lib/randomShortString";

export const runtime = "edge";

export async function PATCH(
  request: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json("UNAUTHORIZED", { status: 401 });
    }

    const serverId = params.serverId;

    if (!serverId) {
      return NextResponse.json("Server id missing", { status: 400 });
    }

    const [server] = await db.update(serverSchema).set({
      inviteCode: randomShortString(),
      updatedAt: new Date(),
    }).where(sql`${serverSchema.profileId} = ${profile
      ?.id!} AND ${serverSchema.id} = ${serverId}`).returning();

    return NextResponse.json({ server }, { status: 200 });
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return NextResponse.json("Internal Error", {
      status: 500,
    });
  }
}
