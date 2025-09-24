import { createContext } from "react";

export type SelectedRoom = {
  roomName: string;
  password: string;
  users: { name: string }[];
};

export type Ctx = {
  selectedRoom: SelectedRoom;
  setSelectedRoom: (room: SelectedRoom) => void;
  joinOrCreate: "join" | "createRoom";
  setJoinOrCreate: (state: "join" | "createRoom") => void;
};

export const RoomsContext = createContext<Ctx | undefined>(undefined);
