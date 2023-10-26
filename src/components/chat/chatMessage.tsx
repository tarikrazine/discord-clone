"use client";

import { Fragment, useRef, ElementRef } from "react";

import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";

import { MemberType } from "@/db/schema/member";

import ChatWelcome from "./chatWelcome";
import { Messages } from "@/app/api/messages/route";
import ChatItem from "./chatItem";
import { useChatQuery } from "@/hooks/useChatQuery";
import useChatSocket from "@/hooks/useChatSocket";
import {useChatScroll} from "./useChatScorll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  name: string;
  member: MemberType;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

function ChatMessages(props: ChatMessagesProps) {
  const queryKey = `chat:${props.chatId}`;
  const addKey = `chat:${props.chatId}:messages`
  const updateKey = `chat:${props.chatId}:messages:update`

  const chatRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  useChatQuery({
    apiUrl: props.apiUrl,
    paramKey: props.paramKey,
    paramValue: props.paramValue,
    queryKey,
  });

  useChatSocket({ addKey, updateKey, queryKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: (data as any)?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === "pending") {
    return (
      <div className="flex flex-1 justify-center items-center flex-col sm:flex-row">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4 mr-2" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 justify-center items-center flex-col sm:flex-row">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4 mr-2" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {
        !hasNextPage
        ? <div className="flex-1" />
        : null
      }
      {
        !hasNextPage
        ? <ChatWelcome type={props.type} name={props.name} />
        : null
      }
      {
        hasNextPage
        ? <div className="flex justify-center">
          {
            isFetchingNextPage
            ? <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
            : <button onClick={() => fetchNextPage()} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 text-sm my-4 transition">Load previous messages</button>
          }
        </div>
        : null
      }
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group: any, i) => (
          <Fragment key={i}>
            {group.items.map((message: Messages) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted || false}
                timestamp={format(new Date(message.createdAt!), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                member={message.member}
                currentMember={props.member}
                socketUrl={props.socketUrl}
                socketQuery={props.socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
