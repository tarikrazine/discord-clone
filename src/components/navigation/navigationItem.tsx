"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import ActionTooltip from "../actionTooltip";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

function NavigationItem(props: NavigationItemProps) {
  const router = useRouter();
  const params = useParams();

  function onClick() {
    router.push(`/servers/${props.id}`)
  }
  return (
    <ActionTooltip side="right" align="center" label={props.name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            props.id !== params?.serverId && "group-hover:h-[20px]",
            props.id === params?.serverId ? "h-[36px]": "h-[8px]"
          )}
         />
         <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden", props.id === params?.serverId && "bg-primary/10 text-primary rounded-[16px]")}> <Image fill src={props.imageUrl} alt={props.name} /></div>
      </button>
    </ActionTooltip>
  );
}

export default NavigationItem;
