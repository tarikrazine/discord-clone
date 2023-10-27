"use client";

import "@livekit/components-styles";

import { useState, useEffect } from "react";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { channel } from "@/db/schema/channel";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

function MediaRoom(props: MediaRoomProps) {
  const { user } = useUser();

  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user.lastName) return;

    const name = `${user?.firstName} ${user?.lastName}` as string;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${props.chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [props.chatId, user?.firstName, user?.lastName]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      datadata-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={props.video}
      audio={props.audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}

export default MediaRoom;
