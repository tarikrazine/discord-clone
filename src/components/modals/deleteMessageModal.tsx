"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import axios from "axios";
import qs from "query-string"

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

function DeleteMessageModal() {
  const [isLoading, setIsLoading] = useState(false);
  const router  = useRouter()

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "DELETE_MESSAGE";

  console.log(data.apiUrl)

  async function deleteChannel() {

    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: data.apiUrl || "",
        query: data.query
      })

      await axios.delete(url)

      onClose();
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
            Delete message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            This message will be permanently deleted. 
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
              onClick={() => deleteChannel()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteMessageModal 
