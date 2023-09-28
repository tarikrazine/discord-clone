"use client"

import { useEffect, useState } from "react"

import CreateServerModal from "../modals/createServerModal"
import EditServerModal from "../modals/editServerModal"
import InviteModal from "../modals/inviteModal"
import MembersModal from "../modals/membersModal"

function ModalProvider() {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <CreateServerModal />
            <EditServerModal />
            <MembersModal />
            <InviteModal />
        </>
    )
}

export default ModalProvider