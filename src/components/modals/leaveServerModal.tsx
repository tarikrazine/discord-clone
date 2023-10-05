"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";

function LeaveServerModal() {
  const [isLoading, setIsLoading] = useState(false);
  const router  = useRouter()

  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "LEAVE_SERVER";

  async function leaveServer() {
    try {
      setIsLoading(true)
      await axios.patch(`/api/servers/${data.server?.id}/leave`)

      onClose();
      router.refresh();
      router.push("/");    
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite friends
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{data.server?.name}?</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={() => leaveServer()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveServerModal;
