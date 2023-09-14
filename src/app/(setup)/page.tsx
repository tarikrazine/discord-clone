import { initialProfile } from "@/lib/initialprofile"

export default async function SetupPage() {

    await initialProfile()
    
    return (
        <>Setup page</>
    )
}