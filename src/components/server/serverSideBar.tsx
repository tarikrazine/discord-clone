import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/db";
import { server as serverSchema } from "@/db/schema/server";

import ServerHeader from "./serverHeader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./serverSearch";

const ChannelType = Object.freeze({
  0: "TEXT",
  1: "AUDIO",
  2: "VIDEO",
});

const MemberRole = Object.freeze({
  0: "GUEST",
  1: "MODERATOR",
  2: "ADMIN",
});

const iconChannelMap = {
  [ChannelType[0]]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType[1]]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType[2]]: <Video className="mr-2 h-4 w-4" />,
};

const iconRoleMap = {
  [MemberRole[0]]: null,
  [MemberRole[1]]: <ShieldCheck className="mr-2 w-4 h-2 text-indigo-500" />,
  [MemberRole[2]]: <ShieldAlert className="mr-2 w-4 h-2 text-indigo-500" />,
};

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
        with: {
          profile: true,
        },
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

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#F2F3F5] dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconChannelMap[channel.type!],
                })),
              },
              {
                label: "Audio channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconChannelMap[channel.type!],
                })),
              },
              {
                label: "Video channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconChannelMap[channel.type!],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile?.name!,
                  icon: iconRoleMap[member.role!],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

export default ServerSideBar;
