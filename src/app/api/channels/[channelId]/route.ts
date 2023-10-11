import { NextResponse } from "next/server";

import { sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { channel as channelSchema } from "@/db/schema/channel";
import { member as memberSchema } from "@/db/schema/member";
import { server as serverSchema } from "@/db/schema/server";
import { z } from "zod";

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

export async function PATCH(
  request: Request,
  { params }: { params: { channelId: string } },
) {
  const profile = await currentProfile();

  const body = await request.json();

  const { searchParams } = new URL(request.url);

  const channelId = params.channelId;
  const serverId = searchParams.get("serverId");

  if (!profile) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!channelId) {
    return NextResponse.json({ message: "No channel id" }, { status: 400 });
  }

  if (!serverId) {
    return NextResponse.json({ message: "No server id" }, { status: 400 });
  }

  if (body?.name === "general") {
    return NextResponse.json({ messagge: "Name cannot be 'general'" }, {
      status: 400,
    });
  }

  try {
    const bodyParsed = formValidation.parse(body);

    console.log("bodyparsed", bodyParsed);

    await db.transaction(async (tx) => {
      const [server] = await tx
        .update(serverSchema)
        .set({
          updatedAt: new Date(),
        })
        .where(sql`${serverSchema.id} = ${serverId}`)
        .returning();

      const member = await tx.query.member.findFirst({
        where:
          sql`${memberSchema.id} = ${profile?.id} AND ${serverSchema.id} = ${server?.id}`,
      });

      if (member?.role === "GUEST") {
        return NextResponse.json(
          { message: "You don't have permission" },
          {
            status: 401,
          },
        );
      }
      await db
        .update(channelSchema)
        .set({
          name: bodyParsed.name,
          type: bodyParsed.type,
          updatedAt: new Date(),
        })
        .where(
          sql`${channelSchema.id} = ${channelId} AND ${channelSchema.name} != 'general'`,
        );
    });

    return NextResponse.json({ message: "Channel updated with success" }, {
      status: 200,
    });
  } catch (error) {
    console.log("[UPDATE_CHANNEL_ID]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { channelId: string } },
) {
  const profile = await currentProfile();

  const { searchParams } = new URL(request.url);

  const channelId = params.channelId;
  const serverId = searchParams.get("serverId");

  if (!profile) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
      },
    );
  }

  if (!channelId) {
    return NextResponse.json({ message: "No channel Id" }, { status: 400 });
  }

  if (!serverId) {
    return NextResponse.json({ message: "No server Id" }, { status: 400 });
  }

  try {
    await db.transaction(async (tx) => {
      const [server] = await tx
        .update(serverSchema)
        .set({
          updatedAt: new Date(),
        })
        .where(sql`${serverSchema.id} = ${serverId}`)
        .returning();

      const member = await tx.query.member.findFirst({
        where:
          sql`${memberSchema.id} = ${profile?.id} AND ${serverSchema.id} = ${server?.id}`,
      });

      console.log("isMember", member);

      if (member?.role === "GUEST") {
        return NextResponse.json(
          { message: "You don't have permission" },
          {
            status: 401,
          },
        );
      }
      await db
        .delete(channelSchema)
        .where(
          sql`${channelSchema.id} = ${channelId} AND ${channelSchema.name} != 'general'`,
        );
    });

    return NextResponse.json(
      { message: "Channel deleted with success" },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
