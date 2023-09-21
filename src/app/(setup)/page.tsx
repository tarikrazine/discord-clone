import { redirect } from "next/navigation"

import { eq } from "drizzle-orm"

import { db } from "@/db"
import { initialProfile } from "@/lib/initialprofile"
import { server as serverSchema } from "@/db/schema/server"
import { member as memberSchema } from "@/db/schema/member"
import InitialModal from "@/components/modals/initialModal"

export default async function SetupPage() {

    const profile = await initialProfile()

    const serverResponse = await db.query.server.findFirst({
        with: {
         members: {
          where: eq(memberSchema.profileId, profile.id)
         } 
        }
      })
    
    console.log("Server response", serverResponse)
    
    if (serverResponse) {
        return redirect(`/servers/${serverResponse?.id}`)
    }
    
    return (
        <InitialModal />
    )
}