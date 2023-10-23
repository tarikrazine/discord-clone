import { type NextRequest, NextResponse } from "next/server";

import { and, desc, eq, gt, sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { message as messageSchema, MessageType } from "@/db/schema/message";
import { MemberType } from "@/db/schema/member";
import { ProfileType } from "@/db/schema/profile";

export const runtime = "edge";

const MESSAGES_BATCH = 10;

interface Member extends MemberType {
  profile: ProfileType;
}

export interface Messages extends MessageType {
  member: Member;
}

export async function GET(request: NextRequest) {
  const profile = await currentProfile();

  if (!profile) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const cursor = searchParams.get("cursor");

  const channelId = searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json(
      { message: "Channel id is missing" },
      {
        status: 400,
      },
    );
  }

  try {
    let messages: Messages[] = [];

    if (cursor) {
      messages = (await db.query.message.findMany({
        where: and(
          eq(messageSchema.channelId, channelId),
          gt(messageSchema.id, cursor),
        ),
        limit: MESSAGES_BATCH,
        offset: 1,
        with: {
          member: {
            with: { profile: true },
          },
        },
        orderBy: desc(messageSchema.createdAt),
      })) as any;
    } else {
      messages = (await db.query.message.findMany({
        where: eq(messageSchema.channelId, channelId),
        limit: MESSAGES_BATCH,
        with: {
          member: {
            with: { profile: true },
          },
        },
        orderBy: desc(messageSchema.createdAt),
      })) as any;
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json(
      {
        items: messages,
        nextCursor,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
