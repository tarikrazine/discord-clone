"use client"

import { ChannelType } from "@/db/schema/channel"
import { ServerType } from "@/db/schema/server"

interface ServerChannelProps {
    channel: ChannelType
    server: ServerType
    role?: "ADMIN" | "MODERATOR" | "GUEST";
}

function ServerChannel(props: ServerChannelProps) {
    return (
        <div>ServerChannel</div>
    )
}

export default ServerChannel