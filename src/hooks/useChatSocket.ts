import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";
import { message, MessageType } from "@/db/schema/message";
import { MemberType } from "@/db/schema/member";
import { ProfileType } from "@/db/schema/profile";

interface UseChatSocketProps {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

type MessageWithMemberWithProfile = MessageType & {
  member: MemberType & {
    profile: ProfileType;
  };
};

function useChatSocket(props: UseChatSocketProps) {
  const { socket } = useSocket();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(props.updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([props.queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }

              return item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(props.addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([props.queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{
              items: [message],
            }],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [
            message,
            ...newData[0].items,
          ],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(props.addKey);
      socket.off(props.updateKey);
    };
  }, [props.addKey, props.queryKey, props.updateKey, queryClient, socket]);
}

export default useChatSocket;
