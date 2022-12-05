import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import { createAuthUserQuery, createUserQuery } from "./utilis/data";

function Register() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const register = async () => {
    try {
      // register auth
      await createAuthUserQuery(registerEmail, registerPassword);

      var uid = auth.currentUser.uid;

      // create user in real time db
      await createUserQuery(uid, registerEmail, registerPassword, name);

      // create user balance query

      await navigate("/");
    } catch (error) {
      setErrorMessage(error.message);

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <div className="form-floating mb-3 mt-5">
        {errorMessage && (
          <p className="error p-3 mt-n5 bg-danger text-white">
            {" "}
            {errorMessage}{" "}
          </p>
        )}
        <input
          type="email"
          className="form-control-lg"
          id="floatingInput"
          placeholder="Email"
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
      </div>
      <div className="form-floating mb-3 ">
        <input
          type="name"
          className="form-control-lg"
          id="floatingInput"
          placeholder="Name"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </div>

      <div className="form-floating">
        <input
          type="password"
          className="form-control-lg"
          id="floatingPassword"
          placeholder="Password"
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />
      </div>
      <button className="mt-5 btn btn-info" onClick={register}>
        Register
      </button>
    </>
  );
}

export default Register;
