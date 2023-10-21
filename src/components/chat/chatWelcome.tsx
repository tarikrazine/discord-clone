import { Hash } from "lucide-react"

interface ChatWelcomeProps {
    type: "channel" | "conversation"
    name: string
}

function ChatWelcome(props: ChatWelcomeProps) {
    return (
        <div className="space-x-2 px-4 mb-4">
            {
                props.type === "channel"
                ? <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white" />
                </div>
                : null
            }
            <p className="text-xl md:text-3xl font-bold">
                {
                    props.type === "channel"
                    ? "Welcome to #"
                    : ""
                }
                {
                    props.name
                }
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {
                    props.type === "channel" 
                    ? `This is the start of the #${props.name} channel.`
                    : `This is the start of your conversation with ${props.name}`
                }
            </p>
        </div>
    )
}

export default ChatWelcome