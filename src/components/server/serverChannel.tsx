"use client";

import { useParams, useRouter } from "next/navigation";

import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";

import { ChannelType as Channel } from "@/db/schema/channel";
import { ServerType } from "@/db/schema/server";
import { ChannelType } from "@/types";
import { cn } from "@/lib/utils";
import ActionTooltip from "../actionTooltip";
import { ModalType, useModal } from "@/hooks/useModalStore";

const iconChannelMap = {
  TEXT: Hash,
  AUDIO: Mic,
  VIDEO: Video,
};

interface ServerChannelProps {
  channel: Channel;
  server: ServerType;
  role?: "ADMIN" | "MODERATOR" | "GUEST";
}

function ServerChannel(props: ServerChannelProps) {
  const params = useParams();
  const router = useRouter();

  const { onOpen } = useModal();

  const Icon = iconChannelMap[props.channel?.type!];

  function onClick() {
    router.push(`/servers/${props.server?.id}/channels/${props.channel?.id}`)
  }

  function onAction(e: React.MouseEvent, action: ModalType) {
    e.stopPropagation()
    onOpen(action, { channel: props.channel, server: props.server as any})
  }

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === props.channel.id
          ? "bg-zinc-700/20 dark:bg-zinc-700"
          : null
      )}
      onClick={onClick}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />

      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === props.channel.id
            ? "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            : null
        )}
      >
        {props.channel.name}
      </p>
      {props.channel?.name !== "general" && props.role !== "GUEST" ? (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                onAction(e, "EDIT_CHANNEL")
              }}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                onAction(e, "DELETE_CHANNEL");
              }}
            />
          </ActionTooltip>
        </div>
      ) : null}
      {props.channel.name === "general" ? (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      ) : null}
    </button>
  );
}

export default ServerChannel;
