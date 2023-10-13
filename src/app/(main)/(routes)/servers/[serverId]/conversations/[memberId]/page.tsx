import { redirect } from "next/navigation"

import { sql } from "drizzle-orm"
import { redirectToSignIn } from "@clerk/nextjs"

import { db } from "@/db"
import { channel } from "@/db/schema/channel"
import { member as memberSchema } from "@/db/schema/member"
import { currentProfile } from "@/lib/currentProfile"
import ChatHeader from "@/components/chat/chatHeader"

export default async function MemberIdPage(props: { params: { serverId: string, memberId: string}}) {
    const profile = await currentProfile()

    if (!profile) {
        return redirectToSignIn()
    }

    const member = await db.query.member.findFirst({
        where: sql`${memberSchema.profileId} = ${profile.id} AND ${memberSchema.serverId} = ${props.params.serverId}`,
        with: {
            profile: true
        }
    })

    if (!member) {
        return redirect("/")
    }

    return <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader serverId={member.serverId!} name={member.profile?.name!} type="conversation" />
    </div>
}
