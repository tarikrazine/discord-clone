"use client";

import { MemberType } from "@/db/schema/member";
import { ProfileType } from "@/db/schema/profile";
import UserAvatar from "../userAvatar";
import ActionTooltip from "../actionTooltip";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

interface ChatItemProps {
  id: string;
  content: string;
  fileUrl: string | null;
  deleted: boolean;
  timestamp: string;
  isUpdated: boolean;
  member: MemberType & {
    profile: ProfileType;
  };
  currentMember: MemberType;
  socketUrl: string;
  socketQuery: Record<string, any>;
}

function ChatItem(props: ChatItemProps) {
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
        <div className="flex group gap-x-2 items-start w-full">
            <div className="cursor-pointer hover:drop-shadow-md transition">
                <UserAvatar src={props.member?.profile?.imageUrl!} />
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center">
                        <p className="text-sm font-semibold hover:underline cursor-pointer">
                            {
                                props.member?.profile?.name
                            }
                        </p>
                        <ActionTooltip label={props.member?.role!} >
                            <p>{roleIconMap[props.member?.role!]}</p>
                        </ActionTooltip>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {
                            props.timestamp
                        }
                    </span>
                </div>
                {props.content}
            </div>
        </div>
    </div>
  );
}

export default ChatItem;
