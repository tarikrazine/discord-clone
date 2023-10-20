import { Hash } from "lucide-react"

import MobileToggle from "../mobileToggle"
import UserAvatar from "../userAvatar"
import SocketIndicator from "@/components/socketIndicator"

interface ChatHeaderProps {
    serverId: string
    name: string
    type: "channel" | "conversation"
    imageUrl?: string
}

function ChatHeader(props: ChatHeaderProps) {
    return <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <MobileToggle serverId={props.serverId} />
        {
            props.type === "channel"
            ? <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            : null
        }
        {
            props.type === "conversation"
            ? <UserAvatar src={props.imageUrl} className="h-8 w-8" />
            : null
        }
        <p className="ml-2 font-semibold text-md text-black dark:text-white">
            {props.name}
        </p>
        <div className="ml-auto flex items-center"><SocketIndicator /></div>
    </div>
}

export default ChatHeader
