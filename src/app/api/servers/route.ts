import { NextResponse } from "next/server";

import * as z from "zod";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { channel as channelSchema } from "@/db/schema/channel";
import { member as memberSchema } from "@/db/schema/member";

import { currentProfile } from "@/lib/currentProfile";
import { randomShortString } from "@/lib/randomShortString";

export const runtime = "edge";

const formValidation = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().url({ message: "Server image is required." }),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const parsedData = formValidation.parse(data);

    await db.transaction(async (tx) => {
      const [server] = await tx
        .insert(serverSchema)
        .values({
          profileId: profile.id,
          name: parsedData.name,
          imageUrl: parsedData.imageUrl,
          inviteCode: randomShortString(),
          createdAt: new Date(),
        })
        .returning();

      await tx.insert(channelSchema).values({
        name: "general",
        profileId: profile.id,
        serverId: server.id,
        createdAt: new Date(),
      });

      await tx.insert(memberSchema).values({
        profileId: profile.id,
        serverId: server.id,
        role: "ADMIN",
        createdAt: new Date(),
      });
    });

    return NextResponse.json(
      { message: "Server added with success" },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message:
            "Form not validate please check your server name or image server",
        },
        { status: 400 },
      );
    }
    console.log("[SERVER_POST]", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();

    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const url = new URL(request.url);

    const serverId = url.searchParams.get("serverId");

    if (!serverId) {
      return NextResponse.json({ message: "No server id" }, { status: 400 });
    }

    const parsedData = formValidation.parse(data);

    await db.transaction(async (tx) => {
      const [server] = await tx
        .update(serverSchema)
        .set({
          name: parsedData.name,
          imageUrl: parsedData.imageUrl,
          updatedAt: new Date(),
        })
        .where(sql`${serverSchema.id} = ${serverId}`)
        .where(sql`${serverSchema.profileId} = ${profile.id}`)
        .returning();

      await tx
        .update(channelSchema)
        .set({
          updatedAt: new Date(),
        })
        .where(sql`${channelSchema.serverId} = ${server.id}`)
        .where(sql`${channelSchema.profileId} = ${profile.id}`);

      await tx
        .update(memberSchema)
        .set({
          updatedAt: new Date(),
        })
        .where(sql`${memberSchema.serverId} = ${server.id}`)
        .where(sql`${memberSchema.profileId} = ${profile.id}`);
    });

    return NextResponse.json(
      { message: "Server updated with success" },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message:
            "Form not validate please check your server name or image server",
        },
        { status: 400 },
      );
    }
    console.log("[SERVER_PATCH]", error);
    return NextResponse.json(
      { message: "Internal Error" },
      {
        status: 500,
      },
    );
  }
}
