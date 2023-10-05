import { NextResponse } from "next/server";

import { z } from "zod";
import { sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { channel as channelSchema, ChannelType } from "@/db/schema/channel";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";

const Type = Object.freeze({
  0: "TEXT",
  1: "AUDIO",
  2: "VIDEO",
});

const formValidation = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required." })
    .refine((name) => name !== "general", {
      message: `Channel name cannot be "general"`,
    }),
  type: z.nativeEnum(Type),
});

export async function POST(request: Request) {
  const profile = await currentProfile();

  const body = (await request.json()) as {
    name: string;
    type: ChannelType["type"];
  };

  const url = new URL(request.url);

  const serverId = url.searchParams.get("serverId");

  if (!profile) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!serverId) {
    return NextResponse.json({ message: "No Server id" }, { status: 400 });
  }

  try {
    const parsedBody = formValidation.parse(body);

    const member = await db.query.member.findFirst({
      where:
        sql`${memberSchema.profileId} = ${profile.id} AND ${memberSchema.serverId} = ${serverId}`,
    });

    if (
      member && member?.role === "ADMIN" ||
      member?.role === "MODERATOR"
    ) {
      await db.insert(channelSchema).values({
        serverId: serverId,
        profileId: profile.id,
        name: parsedBody.name,
        type: parsedBody.type,
        createdAt: new Date(),
      });

      return NextResponse.json({ message: "OK" }, { status: 200 });
    }
  } catch (error) {
    console.log("[CHANNEL_POST]", error);
    return NextResponse.json({ message: "Interval Server" }, { status: 500 });
  }
}
