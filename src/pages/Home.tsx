import { type ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  const [values, setValues] = useState({ name: "", room: "" });

  const isDisabled = Object.values(values).some((v) => !v);

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name.toLowerCase()]: event.target.value,
    }));
  };

  // const buttonHandler = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {};

  return (
    <div className="flex justify-center items-center mt-5">
      <form className="bg-gray-600 flex items-center justify-center gap-2 flex-col w-1/2 rounded-xl">
        <p className="text-white text-2xl font-bold mt-2">Join</p>
        <input
          type="text"
          name="Name"
          value={values.name}
          placeholder="Name"
          className="bg-gray-400 border-gray-800 border-2 rounded-xl pl-3 mt-2"
          onChange={inputChangeHandler}
          autoComplete="off"
        />
        <input
          type="text"
          name="Room"
          value={values.room}
          placeholder="Room"
          className="bg-gray-400 border-gray-800 border-2 rounded-xl pl-3 mt-2"
          onChange={inputChangeHandler}
          autoComplete="off"
          required
        />
        <Link to={`/chat?name=${values.name}&room=${values.room}`}>
          <button
            disabled={isDisabled}
            // onClick={(event) => buttonHandler(event)}
            className="bg-gray-400 p-1.5 rounded-xl mb-2 hover:bg-gray-50 hover:cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-red-500"
          >
            Connect
          </button>
        </Link>
      </form>
    </div>
  );
};
