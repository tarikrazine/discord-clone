"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/userAvatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { ProfileType } from "@/db/schema/profile";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

function MembersModal() {
  const [loadingId, setIsLoadingId] = useState("");
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "MEMBERS";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage members
            <DialogDescription className="text-center text-zinc-500">
              {data.server?.members.length} members
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {data.server?.members.map((member) => {

            const { profile } = member as any
            
            return (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar
                src={profile.imageUrl || undefined}
                name={profile.name!}
              />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {profile.name} {roleIconMap[member.role!]}
                </div>
                <p className="text-xs text-zinc-500">{profile.email}</p>
              </div>
              <div className="ml-auto">{data.server?.profileId !== member.profileId &&
                loadingId !== member.id ? <div>Action!</div>: null}</div>
            </div>
          )})}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default MembersModal;
