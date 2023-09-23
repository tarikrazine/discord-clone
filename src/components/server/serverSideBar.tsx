import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";
import { ChannelType } from "@/db/schema/channel";
import ServerHeader from "./serverHeader";

interface ServerSideBarProps {
  serverId: string;
}

async function ServerSideBar(props: ServerSideBarProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.query.server.findFirst({
    where: eq(serverSchema.id, props.serverId),
    with: {
      channels: {
        orderBy: (channels, { desc }) => desc(channels.createdAt),
      },
      members: {
        orderBy: (members, { asc }) => asc(members.role),
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannels = server?.channels.filter(
    (channel) => channel.type === "TEXT"
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === "AUDIO"
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === "VIDEO"
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(member => member.profileId === profile.id)?.role;

  return <div className="flex flex-col h-full w-full text-primary bg-[#F2F3F5] dark:bg-[#2B2D31]"><ServerHeader server={server} role={role} /></div>;
}

export default ServerSideBar;
