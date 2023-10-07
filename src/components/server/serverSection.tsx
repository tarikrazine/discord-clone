"use client";

import { Plus, Settings } from "lucide-react";

import { Server, useModal } from "@/hooks/useModalStore";
import ActionTooltip from "../actionTooltip";
import { MemberRole } from "@/types";

interface ServerSectionProps {
  label: string;
  role?: "ADMIN" | "MODERATOR" | "GUEST";
  channelType?: "TEXT" | "AUDIO" | "VIDEO";
  sectionType: string;
  server: Server;
}

function ServerSection(props: ServerSectionProps) {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {props.label}
      </p>
      {props.role !== "GUEST" && props.sectionType === "channels" ? (
        <ActionTooltip label="Create channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("CREATE_CHANNEL")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      ) : null}
      {props.role ===  "ADMIN" && props.sectionType === "members" ? (
        <ActionTooltip label="Create channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("MEMBERS", { server: props.server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      ) : null}
    </div>
  );
}

export default ServerSection;
