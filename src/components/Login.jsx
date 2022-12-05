import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./Context/UserContext";

function Login() {
  const [loginEmail, setLoginemail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setUser({
        value: auth.currentUser.uid,
        label: "you",
      });

      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="form-floating mb-3 mt-5">
        <input
          type="email"
          className="form-control-lg"
          id="floatingInput"
          placeholder="Email"
          onChange={(event) => {
            setLoginemail(event.target.value);
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
            setLoginPassword(event.target.value);
          }}
        />
      </div>
      <button className="mt-5 btn btn-info" onClick={login}>
        Login
      </button>
      <Link to="/register" className="mt-5 ml-5 btn btn-info">
        Register
      </Link>
    </>
  );
}

export default Login;
