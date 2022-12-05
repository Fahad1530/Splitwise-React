import "./App.css";
import React from "react";
import Home from "./components/Home";
import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
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
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </UserContextProvider>
  );
}

export default App;
