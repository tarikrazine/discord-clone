"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";

import { MemberType } from "@/db/schema/member";
import { ProfileType } from "@/db/schema/profile";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import UserAvatar from "@/components/userAvatar";
import ActionTooltip from "@/components/actionTooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/useModalStore";

const formValidation = z.object({
  content: z.string().min(1),
});

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

interface ChatItemProps {
  id: string;
  content: string;
  fileUrl: string | null;
  deleted: boolean;
  timestamp: string;
  isUpdated: boolean;
  member: MemberType & {
    profile: ProfileType;
  };
  currentMember: MemberType;
  socketUrl: string;
  socketQuery: Record<string, any>;
}

function ChatItem(props: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { onOpen } = useModal();

  const isAdmin = props.currentMember.role === "ADMIN";
  const moderator = props.currentMember.role === "MODERATOR";

  const isOwner = props.currentMember.id === props.member.id;

  const canDeletedMessage = !props.deleted && (isAdmin || moderator || isOwner);
  const canEditMessage = !props.deleted && isOwner && !props.fileUrl;

  const fileType = props.fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && props.fileUrl;
  const isImage = !isPDF && props.fileUrl;

  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      content: props.content,
    },
  });

  useEffect(() => {
    form.reset({
      content: props.content,
    });
  }, [form, props.content]);

  useEffect(() => {
    function handleKeyDown(event: any) {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isLoading = form.formState.isSubmitting;

  async function handleForm(values: z.infer<typeof formValidation>) {
    try {
      const url = qs.stringifyUrl({
        url: `${props.socketUrl}/${props.id}`,
        query: props.socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="flex group gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={props.member?.profile?.imageUrl!} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="text-sm font-semibold hover:underline cursor-pointer">
                {props.member?.profile?.name}
              </p>
              <ActionTooltip label={props.member?.role!}>
                <p>{roleIconMap[props.member?.role!]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {props.timestamp}
            </span>
          </div>
          {isImage ? (
            <a
              href={props.fileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={props.fileUrl!}
                alt={props.content}
                fill
                className="object-cover"
              />
            </a>
          ) : null}
          {isPDF ? (
            <div className="relative flex items-center p-2 mr-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

              <a
                href={props.fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF file
              </a>
            </div>
          ) : null}
          {!props.fileUrl && !isEditing ? (
            <p
              className={cn(
                "text-sm text-zinc-500 dark:text-zinc-300",
                props.deleted,
                "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {props.content}
              {props.isUpdated && !props.deleted ? (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              ) : null}
            </p>
          ) : null}
          {!props.fileUrl && isEditing ? (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(handleForm)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                              placeholder="Edited message"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          ) : null}
        </div>
      </div>
      {canDeletedMessage ? (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage ? (
            <ActionTooltip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          ) : null}
          <ActionTooltip label="Delete">
            <Trash
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              onClick={() =>
                onOpen("DELETE_MESSAGE", {
                  apiUrl: `${props.socketUrl}/${props.id}`,
                  query: props.socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      ) : null}
    </div>
  );
}

export default ChatItem;
