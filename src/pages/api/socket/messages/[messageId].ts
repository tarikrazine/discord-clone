import { NextApiRequest } from "next";

import { and, eq } from "drizzle-orm";

import { NextApiResponseServerIO } from "@/types";
import { currentProfile } from "@/lib/currentProfilePages";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";
import { channel as channelSchema } from "@/db/schema/channel";
import { message as messageSchema } from "@/db/schema/message";

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

  const { serverId, channelId, messageId } = request.query;

  if (!serverId) {
    return response.status(400).json({ message: "Server id missing!" });
  }

  if (!channelId) {
    return response.status(400).json({ message: "Channel id is missing!" });
  }

  if (!messageId) {
    return response.status(400).json({ message: "Message id is missing!" });
  }

  try {
    const server = await db.query.server.findFirst({
      where: eq(serverSchema.id, serverId as string),
      with: {
        members: {
          where: eq(memberSchema.profileId, profile.id),
        },
      },
    });

    if (!server) {
      return response.status(404).json({ message: "Server not found" });
    }

    const channel = await db.query.channel.findFirst({
      where: and(
        eq(channelSchema.id, channelId as string),
        eq(channelSchema.serverId, serverId as string),
      ),
    });

    if (!channel) {
      return response.status(404).json({ message: "Channel not found" });
    }

    const member = server?.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return response.status(404).json({ message: "Member not found" });
    }

    let message = await db.query.message.findFirst({
      where: and(
        eq(messageSchema.id, messageId as string),
        eq(messageSchema.channelId, channelId as string),
      ),
      with: {
        member: {
          with: {
            profile: true,
          },
        },
      },
    });

    if (!message) {
      return response.status(404).json({ message: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === "ADMIN";
    const isModerator = member.role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    if (request.method === "DELETE") {
      await db.transaction(async (tx) => {
        const [deleteMessage] = await tx
          .update(messageSchema)
          .set({
            fileUrl: null,
            content: "This message is deleted",
            deleted: true,
            updatedAt: new Date(),
          })
          .where(eq(messageSchema.id, message?.id as string))
          .returning();

        message = await db.query.message.findFirst({
          where: eq(messageSchema.id, deleteMessage.id as string),
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
          .update(messageSchema)
          .set({
            content,
            updatedAt: new Date(),
          })
          .where(eq(messageSchema.id, message?.id as string))
          .returning();

        message = await db.query.message.findFirst({
          where: eq(messageSchema.id, deleteMessage.id as string),
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

    const updateKey = `chat:${channel.id}:messages:update`;

    response?.socket?.server?.io?.emit(updateKey, message);

    return response.status(200).json({ message });
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return response.status(500).json({ message: "Internal error" });
  }
}
