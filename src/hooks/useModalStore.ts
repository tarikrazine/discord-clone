import { create } from "zustand";

import { ChannelType } from "@/db/schema/channel";
import { MemberType } from "@/db/schema/member";
import { ServerType } from "@/db/schema/server";
import { ProfileType } from "@/db/schema/profile";

export type ModalType =
  | "CREATE_SERVER"
  | "INVITE"
  | "EDIT_SERVER"
  | "MEMBERS"
  | "CREATE_CHANNEL"
  | "LEAVE_SERVER"
  | "DELETE_SERVER"
  | "DELETE_CHANNEL"
  | "EDIT_CHANNEL";

interface Members extends MemberType {
  profile: ProfileType;
}

export type Server = ServerType & {
  members: Members[];
  channels: ChannelType[];
};

interface ModalData {
  server?: Server;
  channel?: ChannelType;
  channelType?: "TEXT" | "AUDIO" | "VIDEO";
}

export interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
