import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export const ChannelType = Object.freeze({
  0: "TEXT",
  1: "AUDIO",
  2: "VIDEO",
});

export const MemberRole = Object.freeze({
  0: "GUEST",
  1: "MODERATOR",
  2: "ADMIN",
});

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
