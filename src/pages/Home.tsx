import { clsx } from "clsx";
import { useState } from "react";
import { SelectedRoomProvider } from "../shared/model/selectedRoomContext/selectedRoomContext.tsx";
import { JoinOrCreateRoom, RoomsList } from "../widgets";
import React from "react";

export const Home = () => {
  const [joinOrCreate, setJoinOrCreate] = useState<"join" | "createRoom">(
    "join",
  );

  const buttonClass =
    "text-slate-800 text-3xl font-bold text-center disabled:opacity-50 border-b-4 border-transparent" +
    " transition-all duration-500 ";

  const buttonHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    state: "join" | "createRoom",
  ) => {
    event.preventDefault();
    if (state === "join") {
      setJoinOrCreate("join");
    } else {
      setJoinOrCreate("createRoom");
    }
  };

  return (
    <SelectedRoomProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="mx-auto max-w-md h-screen flex flex-col items-center justify-center">
          <form className="w-full bg-white/80 backdrop-blur border border-slate-300 rounded-2xl shadow-sm px-6 py-6 flex flex-col gap-4">
            <div className="flex justify-between mx-10">
              <button
                className={clsx(buttonClass, {
                  "opacity-50 hover:border-blue-500":
                    joinOrCreate === "createRoom",
                })}
                onClick={(event) => buttonHandler(event, "join")}
              >
                Join
              </button>
              <button
                onClick={(event) => buttonHandler(event, "createRoom")}
                className={clsx(buttonClass, {
                  "opacity-50 hover:border-blue-500": joinOrCreate === "join",
                })}
              >
                Create
              </button>
            </div>
            <JoinOrCreateRoom {...{ joinOrCreate }} />
          </form>
          <RoomsList {...{ joinOrCreate }} />
        </div>
      </div>
    </SelectedRoomProvider>
  );
};
