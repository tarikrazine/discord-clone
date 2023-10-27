import { redirect } from "next/navigation"

import { sql } from "drizzle-orm"
import { redirectToSignIn } from "@clerk/nextjs"

import { db } from "@/db"
import { channel } from "@/db/schema/channel"
import { member as memberSchema } from "@/db/schema/member"
import { currentProfile } from "@/lib/currentProfile"
import ChatHeader from "@/components/chat/chatHeader"
import { getOrCreateConversation } from "@/lib/conversation"
import ChatMessages from "@/components/chat/chatMessage"
import ChatInput from "@/components/chat/chatInput"

export default async function MemberIdPage(props: { params: { serverId: string, memberId: string}}) {
    const profile = await currentProfile()

    if (!profile) {
        return redirectToSignIn()
    }

    const currentMember = await db.query.member.findFirst({
        where: sql`${memberSchema.profileId} = ${profile.id} AND ${memberSchema.serverId} = ${props.params.serverId}`,
        with: {
            profile: true
        }
    })

    if (!currentMember) {
        return redirect("/")
    }

    const conversation = await getOrCreateConversation(currentMember.id, props.params.memberId)

    if (!conversation) {
        return redirect(`/servers/${props.params.serverId}`)
    }
    
    const { memberOne, memberTwo } = conversation
    
    const otherMember = memberOne?.profileId === profile.id ? memberTwo : memberOne

    return <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader serverId={props.params.serverId} name={otherMember?.profile?.name!} type="conversation" imageUrl={otherMember?.profile?.imageUrl!} />
        <ChatMessages 
            member={currentMember}
            name={otherMember?.profile?.name || ""}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
                conversationId: conversation.id
            }}
        />
        <ChatInput 
            apiUrl="/api/socket/direct-messages"
            name={otherMember?.profile?.name || ""}
            query={{ conversationId: conversation.id}}
            type="conversation"
        />
    </div>
}
