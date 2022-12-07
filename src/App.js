import "./App.css";
import React from "react";
import Home from "./components/Home";
import Navbar from "./components/UI/Navbar";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import UserContextProvider from "./components/Context/UserContext";

function App() {
  return (
    <UserContextProvider>
      <div className="App">
        <Navbar />
        <div className="h-full ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </UserContextProvider>
  );
}

export default App;
