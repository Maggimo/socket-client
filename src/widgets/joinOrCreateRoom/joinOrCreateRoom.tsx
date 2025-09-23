import React, {
  type ChangeEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { Switch } from "antd";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Input } from "../../shared/ui";
import { SelectedRoomContext } from "../../shared/model/selectedRoomContext/selectedRoomContext";

const socket = io("https://magchat-back.onrender.com");

export const JoinOrCreateRoom = ({
  joinOrCreate,
}: {
  joinOrCreate: "join" | "createRoom";
}) => {
  const [userData, setUserData] = useState({
    name: "",
    room: "",
    password: "",
  });
  const ctx = useContext(SelectedRoomContext);
  if (!ctx) throw new Error("SelectedRoomContext is not provided");
  const { selectedRoom, setSelectedRoom } = ctx;

  const [isCreatingRoomPrivate, setIsCreatingRoomPrivate] =
    useState<boolean>(false);

  const [roomsList, setRoomsList] = useState<
    { roomName: string; password: string; users: { name: string }[] }[]
  >([]);

  const [inputError, setInputError] = useState({
    user: "",
    room: "",
    password: "",
  });

  const [isJoiningPrivateRoom, setIsJoiningPrivateRoom] =
    useState<boolean>(false);

  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();
  const isDisabled = Boolean(
    !userData.name ||
      !userData.room ||
      (joinOrCreate === "createRoom" &&
        isCreatingRoomPrivate &&
        !userData.password) ||
      (joinOrCreate === "join" && isJoiningPrivateRoom && !userData.password) ||
      (joinOrCreate === "join" &&
        (inputError.user || inputError.room || inputError.password)) ||
      isPending,
  );

  useEffect(() => {
    socket.emit("getRoomsList");
    socket.on("getRoomsList", ({ data }) => {
      setRoomsList(data.roomsList);
    });
    return () => {
      socket.off("getRoomsList");
    };
  }, []);

  useEffect(() => {
    setUserData((prevState) => ({
      ...prevState,
      room: selectedRoom!.roomName,
    }));
    setInputError((p) => ({ ...p, room: "" }));
  }, [selectedRoom]);

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputError({ room: "", user: "", password: "" });

    setUserData((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));

    socket.emit("getRoomsList");

    if (joinOrCreate === "join") {
      if (event.target.name === "room") {
        const room = roomsList.find(
          (room) => room.roomName === event.target.value,
        );
        if (room && room.password) {
          setSelectedRoom(room);
          setIsJoiningPrivateRoom(true);
        } else if (room) {
          setSelectedRoom(room);
          setIsJoiningPrivateRoom(false);
        }
      }
    }
  };

  const createBtnHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setIsPending(true);
    const payload =
      joinOrCreate === "createRoom"
        ? {
            roomName: userData.room,
            password: userData.password,
          }
        : {
            userName: userData.name,
            roomName: userData.room,
            password: userData.password,
          };
    const ackFunc = (res: { message: string; type: string }) => {
      setIsPending(false);
      if (res) {
        setInputError((p) => ({ ...p, [res.type]: res.message }));
      } else {
        navigate(
          `/chat?name=${userData.name}&room=${userData.room}` +
            (userData.password && `&password=${userData.password}`),
        );
      }
    };
    socket.emit(joinOrCreate.toString(), payload, ackFunc);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        name="name"
        value={userData.name}
        placeholder="Your name"
        onChange={inputChangeHandler}
        error={inputError.user}
      />
      <Input
        name="room"
        value={userData.room || selectedRoom?.roomName}
        placeholder="Room ID"
        onChange={inputChangeHandler}
        error={inputError.room}
      />

      <div
        className={clsx(
          "transition-all duration-800 ease-in-out transform flex flex-col",
          {
            "max-h-0 opacity-0 -translate-y-2 pointer-events-none":
              joinOrCreate === "join",
            "max-h-16 opacity-100 translate-y-0":
              joinOrCreate === "createRoom" || isJoiningPrivateRoom,
          },
          { "mb-6": isCreatingRoomPrivate || isJoiningPrivateRoom },
        )}
      >
        <div
          className={clsx(
            "transition-all duration-800 ease-in-out transform self-end",
            {
              "max-h-0 opacity-0 -translate-y-2 pointer-events-none":
                joinOrCreate === "join",
              "max-h-16 opacity-100 translate-y-0":
                joinOrCreate === "createRoom",
            },
          )}
        >
          <Switch
            checkedChildren="Private"
            unCheckedChildren="Public"
            className="w-25"
            onChange={setIsCreatingRoomPrivate}
          />
        </div>
        <div
          className={clsx("transition-all duration-800 ease-in-out transform", {
            "max-h-0 opacity-0 -translate-y-2 pointer-events-none ":
              !isCreatingRoomPrivate && !isJoiningPrivateRoom,
            "max-h-16 opacity-100 translate-y-0 my-4 pointer-events-auto":
              isCreatingRoomPrivate || isJoiningPrivateRoom,
          })}
        >
          <Input
            name="password"
            value={userData.password}
            placeholder="Password"
            onChange={inputChangeHandler}
            error={inputError.password}
          />
        </div>
      </div>
      <button
        onClick={createBtnHandler}
        disabled={isDisabled}
        className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {joinOrCreate === "join" ? "Connect" : "Create"}
      </button>
    </div>
  );
};
