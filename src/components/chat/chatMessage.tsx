import { MemberType } from "@/db/schema/member";
import ChatWelcome from "./chatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";

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

  const queryKey = `chat:${props.chatId}`
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({apiUrl: props.apiUrl, paramKey: props.paramKey, paramValue: props.paramValue, queryKey})

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={props.type} name={props.name} />
    </div>
  );
}

export default ChatMessages;
