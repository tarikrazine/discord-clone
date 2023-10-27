"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import qs from 'query-string'
import { VideoOff, Video } from "lucide-react"

import ActionTooltip from "@/components/actionTooltip"
import { Icon } from "@radix-ui/react-select"

function ChatVideoButton() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isVideo = searchParams?.get("video")
    
    const Icon = isVideo ? VideoOff : Video
    const tooltipLabel = isVideo ? "End of video call" : "Start video call"

    function onClick() {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true})

        router.push(url)
    }
    
    return (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    )
}

export default ChatVideoButton