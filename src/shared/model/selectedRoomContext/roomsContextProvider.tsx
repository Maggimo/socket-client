import { useState } from "react";
import type { ReactNode } from "react";
import { type SelectedRoom, RoomsContext } from "../index.ts";

export function RoomProvider({ children }: { children: ReactNode }) {
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom>({
    roomName: "",
    password: "",
    users: [{ name: "" }],
  });
  const [joinOrCreate, setJoinOrCreate] = useState<"join" | "createRoom">(
    "join",
  );

  const exportingProps = {
    selectedRoom,
    setSelectedRoom,
    joinOrCreate,
    setJoinOrCreate,
  };
  
  return (
    <RoomsContext.Provider value={exportingProps}>
      {children}
    </RoomsContext.Provider>
  );
}
