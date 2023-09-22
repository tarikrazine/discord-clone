import { ChannelType } from "@/db/schema/channel"
import { MemberType } from "@/db/schema/member"
import { ServerType } from "@/db/schema/server"

type Server = ServerType & {
    members: MemberType[]
    channels: ChannelType[]
}

interface ServerHeaderProps {
    server: Server
    role: MemberType["role"]
}

function ServerHeader(props: ServerHeaderProps) {
    return (
        <div>ServerHeader</div>
    )
}

export default ServerHeader