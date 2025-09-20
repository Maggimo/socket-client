import { Route, Routes } from "react-router-dom";
import { ChatRoom } from "../pages/ChatRoom.tsx";
import { Home } from "../pages/Home.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatRoom />} />
      {/*<Route path="*" element={<Home/>}/>*/}
    </Routes>
  );
};
