import { NextResponse } from "next/server";

import { sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";

export const runtime = "edge";

export async function DELETE(
  request: Request,
  { params }: { params: { serverId: string } },
) {
  const profile = await currentProfile();

  const serverId = params.serverId;

  if (!profile) {
    return NextResponse.json({ message: "Unauthorized " }, { status: 401 });
  }

  if (!serverId) {
    return NextResponse.json({ message: "Server id is missing" }, {
      status: 400,
    });
  }

  try {
    await db.delete(serverSchema).where(
      sql`${serverSchema.profileId} = ${profile.id} AND ${serverSchema.id} = ${serverId}`,
    );

    return NextResponse.json({ message: "Server deleted" }, { status: 200 });
  } catch (error) {
    console.log("[SERVER_DELETE]", error);

    return NextResponse.json({ message: "Internal server" }, { status: 500 });
  }
}
