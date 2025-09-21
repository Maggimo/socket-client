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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="mx-auto max-w-md h-screen flex items-center justify-center px-4">
        <form className="w-full bg-white/80 backdrop-blur border border-slate-300 rounded-2xl shadow-sm px-6 py-6 flex flex-col gap-4">
          <p className="text-slate-800 text-3xl font-bold text-center">Join</p>
          <input
            type="text"
            name="Name"
            value={values.name}
            placeholder="Your name"
            className="bg-white border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            onChange={inputChangeHandler}
            autoComplete="off"
            required
          />
          <input
            type="text"
            name="Room"
            value={values.room}
            placeholder="Room"
            className="bg-white border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            onChange={inputChangeHandler}
            autoComplete="off"
            required
          />
          <Link to={`/chat?name=${values.name}&room=${values.room}`}>
            <button
              disabled={isDisabled}
              className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connect
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};
