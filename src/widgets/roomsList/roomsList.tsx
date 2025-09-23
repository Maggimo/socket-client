import { LockOutlined } from "@ant-design/icons";
import { clsx } from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SelectedRoomContext } from "../../shared/model/selectedRoomContext/selectedRoomContext.tsx";

const socket = io("https://magchat-back.onrender.com");

export const RoomsList = ({
  joinOrCreate,
}: {
  joinOrCreate: "join" | "createRoom";
}) => {
  const [roomsListVisibility, setRoomsListVisibility] =
    useState<boolean>(false);
  const [roomsList, setRoomsList] = useState<
    { roomName: string; password: string; users: { name: string }[] }[]
  >([]);

  const ctx = useContext(SelectedRoomContext);
  if (!ctx) throw new Error("SelectedRoomContext is not provided");
  const { selectedRoom, setSelectedRoom } = ctx;

  useEffect(() => {
    socket.on("getRoomsList", ({ data }) => {
      setRoomsList(data.roomsList);
    });

    return () => {
      socket.off("getRoomsList");
    };
  }, []);

  const showBtnHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setRoomsListVisibility((p) => !p);
    socket.emit("getRoomsList");
  };

  const btnClasses =
    "px-4 py-2 rounded-md bg-transparent border-2 border-gray-400 text-gray hover:bg-blue-100 disabled:opacity-50" +
    " disabled:cursor-not-allowed transition-all duration-800 ease-in-out transform";

  const listClasses =
    "w-full max-h-46 overflow-y-scroll bg-white/80 backdrop-blur border border-slate-300 rounded-2xl shadow-sm px-6 py-6 flex flex-col" +
    " gap-4" +
    " transition-all" +
    " duration-400 ease-in-out transform";

  const selectedRoomClasses = "bg-blue-100 text-blue-600";

  return (
    <div className={"pt-4 w-full flex flex-col gap-4"}>
      <button
        onClick={showBtnHandler}
        className={clsx(btnClasses, {
          "opacity-100": joinOrCreate === "join",
          "opacity-0": joinOrCreate === "createRoom",
        })}
      >
        Show rooms list
      </button>
      <div
        className={clsx(listClasses, {
          "opacity-100": roomsListVisibility && joinOrCreate === "join",
          "opacity-0": !roomsListVisibility || joinOrCreate === "createRoom",
        })}
      >
        {roomsList.length === 0
          ? "Not yet is any room brought forth..."
          : roomsList.map((room, i) => {
              return (
                <div
                  key={i}
                  className={clsx(
                    selectedRoom?.roomName === room.roomName &&
                      selectedRoomClasses,
                    "p-4 border-2 border-slate-300 rounded-2xl",
                  )}
                  onClick={() => {
                    setSelectedRoom(room);
                  }}
                >
                  <div className={"flex justify-between"}>
                    <div className={"text-slate-800"}>{room.roomName}</div>
                    <div className={"flex gap-2 items-center"}>
                      <div className={"text-slate-800"}>
                        Users: {room.users.length}
                      </div>
                      <div className={"text-slate-800"}>
                        {room.password && <LockOutlined />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
