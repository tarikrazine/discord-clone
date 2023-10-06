import { create } from "zustand";

import { ChannelType } from "@/db/schema/channel";
import { MemberType } from "@/db/schema/member";
import { ServerType } from "@/db/schema/server";

export type ModalType =
  | "CREATE_SERVER"
  | "INVITE"
  | "EDIT_SERVER"
  | "MEMBERS"
  | "CREATE_CHANNEL"
  | "LEAVE_SERVER"
  | "DELETE_SERVER";

type Server = ServerType & {
  members: MemberType[];
  channels: ChannelType[];
};

interface ModalData {
  server?: Server;
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
