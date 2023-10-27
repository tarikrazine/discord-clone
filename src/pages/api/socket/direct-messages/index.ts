import { NextApiRequest } from "next";

import { eq, sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfilePages";

import { NextApiResponseServerIO } from "@/types";
import { db } from "@/db";
import { member as memberSchema } from "@/db/schema/member";
import { channel as channelSchema } from "@/db/schema/channel";
import { message as messageSchema } from "@/db/schema/message";
import { conversation as conversationSchema } from "@/db/schema/conversation";
import { directMessage as directMessageSchema } from "@/db/schema/directMessage";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponseServerIO,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const profile = await currentProfile(request);

  if (!profile) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { content, fileUrl } = request.body as {
    content: string;
    fileUrl: string;
  };

  const { conversationId } = request.query as {
    conversationId: string;
  };

  if (!conversationId) {
    return response.status(400).json({ message: "Conversation id is missing" });
  }

  if (!content) {
    return response.status(400).json({ message: "Content id is missing" });
  }

  try {
    const conversation = await db.query.conversation.findFirst({
      where: sql`${conversationSchema.id} = ${conversationId}`,
      with: {
        memberOne: {
          with: {
            profile: true,
          },
        },
        memberTwo: {
          with: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return response.status(404).json({ message: "Conversation not found!" });
    }

    const member = conversation?.memberOne?.profileId === profile.id
      ? conversation?.memberOne
      : conversation?.memberTwo;

    if (!member) {
      return response.status(404).json({ message: "Member not found" });
    }

    const newMessage = await db.transaction(async (tx) => {
      const [message] = await tx.insert(directMessageSchema).values({
        conversationId: conversationId,
        memberId: member.id,
        content,
        fileUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const directMessageWithMember = await db.query.directMessage.findFirst({
        where: sql`${directMessageSchema.id} = ${message.id}`,
        with: {
          member: {
            with: {
              profile: true,
            },
          },
        },
      });

      return directMessageWithMember;
    });

    const channelKey = `chat:${conversationId}:messages`;

    response?.socket?.server?.io?.emit(channelKey, newMessage);

    return response.status(200).json({
      newMessage,
    });
  } catch (error) {
    console.log("[SOCKET_DIRECT_MESSAGE_POST]", error);
    return response.status(500).json({ message: "Internal error" });
  }
}
