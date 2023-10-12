import { Hash, Menu } from "lucide-react"

interface ChatHeaderProps {
    serverId: string
    name: string
    type: "channel" | "conversation"
    imageUrl?: string
}

function ChatHeader(props: ChatHeaderProps) {
    return <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <Menu className="cursor-pointer h-5 w-5" />
        {
            props.type === "channel"
            ? <Hash className="h-5 w-5 mr-2 text-zinc-500 dark:text-zinc-400" />
            : null
        }
        <p className="font-semibold text-md text-black dark:text-white">
            {props.name}
        </p>
    </div>
}

export default ChatHeader