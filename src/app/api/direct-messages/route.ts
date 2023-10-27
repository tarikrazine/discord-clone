import { NextResponse } from "next/server";

import { and, desc, eq, gt } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { conversation as conversationSchema } from "@/db/schema/conversation";
import {
  directMessage as directMessageSchema,
  DirectMessageType,
} from "@/db/schema/directMessage";

export const runtime = "edge";

const MESSAGES_BATCH = 10;

export async function GET(request: Request) {
  const profile = await currentProfile();

  if (!profile) {
    return NextResponse.json({ message: "Unautorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const conversationId = searchParams.get("conversationId");
  const cursor = searchParams.get("cursor");

  if (!conversationId) {
    return NextResponse.json(
      { message: "Conversation id is missing" },
      {
        status: 400,
      },
    );
  }

  try {
    let directMessages: DirectMessageType[] = [];

    const conversation = await db.query.conversation.findFirst({
      where: eq(conversationSchema.id, conversationId),
    });

    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found!" });
    }

    if (cursor) {
      directMessages = await db.query.directMessage.findMany({
        where: and(
          eq(directMessageSchema.conversationId, conversation.id),
          gt(directMessageSchema.id, cursor),
        ),
        limit: MESSAGES_BATCH,
        offset: 1,
        with: {
          member: {
            with: { profile: true },
          },
        },
        orderBy: desc(directMessageSchema.createdAt),
      });
    } else {
      directMessages = await db.query.directMessage.findMany({
        where: eq(directMessageSchema.conversationId, conversation.id),
        limit: MESSAGES_BATCH,
        offset: 1,
        with: {
          member: {
            with: { profile: true },
          },
        },
        orderBy: desc(directMessageSchema.createdAt),
      });
    }

    let nextCursor = null;

    if (directMessages.length === MESSAGES_BATCH) {
      nextCursor = directMessages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json(
      {
        items: directMessages,
        nextCursor,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return NextResponse.json({ message: "Internal error" });
  }
}
