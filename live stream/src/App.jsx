import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Room from "./pages/room";
import PreJoin from "./pages/PreJoin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomid" element={<Room />} />
      <Route path="/prejoin/:roomid" element={<PreJoin />} />
    </Routes>
  );
}

export default App;
