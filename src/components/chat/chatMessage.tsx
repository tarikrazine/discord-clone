"use client";

import { Fragment } from "react";

import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";

import { MemberType } from "@/db/schema/member";
import ChatWelcome from "./chatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Messages } from "@/app/api/messages/route";
import ChatItem from "./chatItem";

const DATE_FORMAT = "d MMM yyyy, HH:mm"

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl: props.apiUrl,
      paramKey: props.paramKey,
      paramValue: props.paramValue,
      queryKey,
    });

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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={props.type} name={props.name} />
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
    </div>
  );
}

export default ChatMessages;
