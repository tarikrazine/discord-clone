import { NextApiRequest } from "next";

import { sql } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfilePages";

import { NextApiResponseServerIO } from "@/types";
import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { member as memberSchema } from "@/db/schema/member";
import { channel as channelSchema } from "@/db/schema/channel";
import { message as messageSchema } from "@/db/schema/message";

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

  const { serverId, channelId } = request.query as {
    serverId: string;
    channelId: string;
  };

  if (!serverId) {
    return response.status(400).json({ message: "Server id is missing" });
  }

  if (!channelId) {
    return response.status(400).json({ message: "Channel id is missing" });
  }

  if (!content) {
    return response.status(400).json({ message: "Content id is missing" });
  }

  try {
    const server = await db.query.server.findFirst({
      where: sql`${serverSchema.id} = ${serverId}`,
      with: {
        members: {
          where: sql`${memberSchema.profileId} = ${profile.id}`,
        },
      },
    });

    if (!server) {
      return response.status(404).json({ message: "Server not found" });
    }

    const currentMember = server.members.find((member) =>
      member.profileId === profile.id
    );

    if (!currentMember) {
      return response.status(404).json({ message: "Server not found" });
    }

    const channel = await db.query.channel.findFirst({
      where:
        sql`${channelSchema.id} = ${channelId} AND ${channelSchema.serverId} = ${serverId}`,
    });

    if (!channel) {
      return response.status(404).json({ message: "Channel not found" });
    }

    const newMessage = await db.transaction(async (tx) => {
      const [message] = await tx.insert(messageSchema).values({
        channelId: channel.id,
        memberId: currentMember.id,
        content,
        fileUrl,
        createdAt: new Date(),
      }).returning();

      const messageWithMember = await db.query.message.findFirst({
        where: sql`${messageSchema.id} = ${message.id}`,
        with: {
          member: true,
        },
      });

      return messageWithMember;
    });

    const channelKey = `chat:${channel.id}:messages`;

    response?.socket?.server?.io?.emit(channelKey, newMessage);

    return response.status(200).json({
      newMessage,
    });
  } catch (error) {
    console.log("[SOCKET_MESSAGE_POST]", error);
    return response.status(500).json({ messge: "Internal error" });
  }
}
