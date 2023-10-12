import { sql } from "drizzle-orm"
import { redirectToSignIn } from "@clerk/nextjs"

import { currentProfile } from "@/lib/currentProfile"

import { db } from "@/db"
import { server as serverSchema } from "@/db/schema/server"
import { member as memberSchema } from "@/db/schema/member"
import { channel as channelSchema } from "@/db/schema/channel"
import { redirect } from "next/navigation"

export default async function ServerIdPage({ params }: { params: { serverId: string } }) {
    const profile = await currentProfile()
    
    const serverId = params.serverId

    if (!profile) {
        return redirectToSignIn()
    }

    const server = await db.query.server.findFirst({
        where: sql`${serverSchema.id} = ${serverId}`,
        with: {
            members: {
                where: sql`${memberSchema.profileId} = ${profile.id}`,
            },
            channels: {
                where: sql`${channelSchema.name} = 'general'`
            }
        }
    })

    if (server?.channels[0].name !== "general") {
        return null
    }

    return redirect(`/servers/${serverId}/channels/${server.channels[0].id}`)
}