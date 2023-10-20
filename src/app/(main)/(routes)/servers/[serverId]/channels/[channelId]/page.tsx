import { redirect } from "next/navigation";

import { sql } from "drizzle-orm";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { channel as channelSchema } from "@/db/schema/channel";
import { member as memberSchema } from "@/db/schema/member";
import ChatHeader from "@/components/chat/chatHeader";
import ChatInput from "@/components/chat/chatInput";

export default async function ChannelIdPage(props: {
  params: { serverId: string; channelId: string };
}) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.query.channel.findFirst({
    where: sql`${channelSchema.id} = ${props.params.channelId}`,
  });

  const member = await db.query.member.findFirst({
    where: sql`${memberSchema.profileId} = ${profile.id} AND ${memberSchema.serverId} = ${props.params.serverId}`,
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel.serverId!}
        name={channel.name}
        type="channel"
      />
      <div className="flex-1">Chat messages</div>
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{ channelId: channel.id, serverId: channel.serverId }}
      />
    </div>
  );
}
