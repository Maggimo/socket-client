import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type SelectedRoom = {
  roomName: string;
  password: string;
  users: { name: string }[];
};

type Ctx = {
  selectedRoom: SelectedRoom;
  setSelectedRoom: (room: SelectedRoom) => void;
};

export const SelectedRoomContext = createContext<Ctx | undefined>(undefined);

export function SelectedRoomProvider({ children }: { children: ReactNode }) {
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom>({
    roomName: "",
    password: "",
    users: [{ name: "" }],
  });

  return (
    <SelectedRoomContext.Provider value={{ selectedRoom, setSelectedRoom }}>
      {children}
    </SelectedRoomContext.Provider>
  );
}
