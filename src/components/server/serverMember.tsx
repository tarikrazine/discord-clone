"use client";

import { MemberType, member } from "@/db/schema/member";
import { ProfileType } from "@/db/schema/profile";
import { Server } from "@/hooks/useModalStore";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../userAvatar";
import { ServerType } from "@/db/schema/server";

const iconRoleMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

interface ServerMemberProps {
  member: MemberType & { profile: ProfileType };
  server: ServerType;
}

function ServerMember(props: ServerMemberProps) {
  const params = useParams();
  const router = useRouter();

  const icon = iconRoleMap[props.member?.role!];

  function onClick() {
    router.push(
      `/servers/${props.server?.id}/conversations/${props.member.id}`
    );
  }

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === props.member.id
          ? "bg-zinc-700/20 dark:bg-zinc-700"
          : null
      )}
      onClick={onClick}
    >
      <UserAvatar src={props.member?.profile?.imageUrl!} className="h-8 w-8" />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === props.member?.id
            ? "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            : null
        )}
      >
        {props.member?.profile?.name}
      </p>
      {icon}
    </button>
  );
}

export default ServerMember;
