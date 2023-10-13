"use client";

import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  User,
  UserPlus,
} from "lucide-react";

import { ChannelType } from "@/db/schema/channel";
import { MemberType } from "@/db/schema/member";
import { ServerType } from "@/db/schema/server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { ProfileType } from "@/db/schema/profile";

interface Members extends MemberType {
  profile: ProfileType
}

type Server = ServerType & {
  members: Members[];
  channels: ChannelType[];
};

interface ServerHeaderProps {
  server: ServerType;
  role?: MemberType["role"];
}

function ServerHeader(props: ServerHeaderProps) {
  const isAdmin = props.role === "ADMIN";
  const isModerator = isAdmin || props.role === "MODERATOR";

  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/70 dark:hover:bg-zinc-700/50 transition">
          {props.server.name}

          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator ? (
          <DropdownMenuItem
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 cursor-pointer text-sm"
            onClick={() => onOpen("INVITE", { server: props.server as Server })}
          >
            Invite people
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : null}
        {isAdmin ? (
          <DropdownMenuItem
            className="px-3 py-2 cursor-pointer text-sm"
            onClick={() => onOpen("EDIT_SERVER", { server: props.server as Server })}
          >
            Server settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : null}
        {isAdmin ? (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm" onClick={() => onOpen("MEMBERS", { server: props.server as Server })}>
            Manage members
            <User className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : null}
        {isModerator ? (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm" onClick={() => onOpen("CREATE_CHANNEL")}>
            Create channel
            <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : null}
        {isModerator ? <DropdownMenuSeparator /> : null}
        {isAdmin ? (
          <DropdownMenuItem className="text-rose-600 px-3 py-2 cursor-pointer text-sm" onClick={() => onOpen("DELETE_SERVER", { server: props.server as Server })}>
            Delete server
            <Trash className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : null}
        {!isAdmin ? (
          <DropdownMenuItem className="text-rose-600 px-3 py-2 cursor-pointer text-sm" onClick={() => onOpen("LEAVE_SERVER", { server: props.server as Server })}>
            Leave server
            <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ServerHeader;
