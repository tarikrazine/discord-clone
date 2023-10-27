import { NextApiRequest } from "next";

import { and, eq } from "drizzle-orm";

import { NextApiResponseServerIO } from "@/types";
import { currentProfile } from "@/lib/currentProfilePages";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";
import { channel as channelSchema } from "@/db/schema/channel";
import { message as messageSchema } from "@/db/schema/message";
import { conversation as conversationSchema } from "@/db/schema/conversation";
import { directMessage as directMessageSchema } from "@/db/schema/directMessage";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponseServerIO,
) {
  if (request.method !== "PATCH" && request.method !== "DELETE") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  const profile = await currentProfile(request);

  if (!profile) {
    return response.status(401).json({ message: "unauthorized" });
  }

  const { content } = request.body as {
    content: string;
  };

  const { conversationId, directMessageId } = request.query;

  if (!conversationId) {
    return response.status(400).json({ message: "Conversation id missing!" });
  }

  if (!directMessageId) {
    return response.status(400).json({
      message: "Direct message id is missing!",
    });
  }

  try {
    const conversation = await db.query.conversation.findFirst({
      where: eq(conversationSchema.id, conversationId as string),
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

    let directMessage = await db.query.directMessage.findFirst({
      where: and(
        eq(directMessageSchema.id, directMessageId as string),
        eq(directMessageSchema.conversationId, conversationId as string),
      ),
      with: {
        member: {
          with: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return response.status(404).json({ message: "Message not found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === "ADMIN";
    const isModerator = member.role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    if (request.method === "DELETE") {
      await db.transaction(async (tx) => {
        const [deleteMessage] = await tx
          .update(directMessageSchema)
          .set({
            fileUrl: null,
            content: "This message is deleted",
            deleted: true,
            updatedAt: new Date(),
          })
          .where(eq(directMessageSchema.id, directMessageId as string))
          .returning();

        directMessage = await db.query.directMessage.findFirst({
          where: eq(directMessageSchema.id, deleteMessage.id as string),
          with: {
            member: {
              with: {
                profile: true,
              },
            },
          },
        });
      });
    }

    if (request.method === "PATCH") {
      if (!isMessageOwner) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      await db.transaction(async (tx) => {
        const [deleteMessage] = await tx
          .update(directMessageSchema)
          .set({
            content,
            updatedAt: new Date(),
          })
          .where(eq(directMessageSchema.id, directMessageId as string))
          .returning();

        directMessage = await db.query.directMessage.findFirst({
          where: eq(directMessageSchema.id, deleteMessage.id as string),
          with: {
            member: {
              with: {
                profile: true,
              },
            },
          },
        });
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    response?.socket?.server?.io?.emit(updateKey, directMessage);

    return response.status(200).json({ directMessage });
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return response.status(500).json({ message: "Internal error" });
  }
}
