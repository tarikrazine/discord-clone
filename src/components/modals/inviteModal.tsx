"use client";

import { useState } from "react";

import { Check, Copy, RefreshCcw } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrigin } from "@/hooks/useOrigin";
import axios from "axios";
import { cn } from "@/lib/utils";

function InviteModal() {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { onOpen, isOpen, onClose, type, data } = useModal();

  const origin = useOrigin();

  const isModalOpen = isOpen && type === "INVITE";

  const invitedUrl = `${origin}/invite/${data.server?.inviteCode}`;

  function onCopy() {
    navigator.clipboard.writeText(invitedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function onNew() {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/servers/${data.server?.id}/invite-code`
      );

      onOpen("INVITE", { server: response.data?.server });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={invitedUrl}
            />
            <Button disabled={isLoading} size="icon" onClick={() => onCopy()}>
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            className="text-xs text-zinc-500 mt-4"
            variant="link"
            size="sm"
            disabled={isLoading}
            onClick={() => onNew()}
          >
            Generate a new link
            <RefreshCcw
              className={cn("w-4 h-4 ml-2", isLoading ? "animate-spin" : null)}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteModal;
