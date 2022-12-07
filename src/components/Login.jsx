import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { UserContext } from "./Context/UserContext";
import {
  createAuthUserQuery,
  createUserQuery,
  mapAuthCodeToMessage,
} from "./utilis/data";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginEmail, setLoginemail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginuser, setLoginuser] = useState(true);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registeruser, setRegisteruser] = useState(false);
  const [name, setName] = useState("");

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
      debugger
      setErrorMessage(mapAuthCodeToMessage(error.code));
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const register = async () => {
    try {
      // register auth
      await createAuthUserQuery(registerEmail, registerPassword);

      let uid = auth.currentUser.uid;

      // create user in real time db
      await createUserQuery(uid, registerEmail, registerPassword, name);

      // create user balance query

      navigate("/");
    } catch (error) {
      debugger
      setErrorMessage(mapAuthCodeToMessage(error.code));
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const handleNavigate = () => {
    setLoginuser(false);
    setRegisteruser(true);
  };

  return (
    <>
      <div className="mt-5">
        {errorMessage && (
          <p className="error p-3 mt-n5 bg-danger text-white">{errorMessage}</p>
        )}

        {loginuser && (
          <>
            <div className="form-floating mb-3 mt-5">
              <input
                type="email"
                className={
                  errorMessage
                    ? "form-control-lg border border-danger"
                    : "form-control-lg"
                }
                id="floatingInput"
                placeholder="Email"
                onChange={(event) => {
                  setLoginemail(event.target.value);
                }}
                required
              />
            </div>
            <div className="form-floating">
              <input
                type="password"
                className={
                  errorMessage
                    ? "form-control-lg border border-danger"
                    : "form-control-lg"
                }
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
            <button onClick={handleNavigate} className="mt-5 ml-5 btn btn-info">
              Register
            </button>
          </>
        )}

        {registeruser && (
          <>
            <div className="form-floating mb-3 mt-5">
              <input
                type="email"
                className={
                  errorMessage
                    ? "form-control-lg border border-danger"
                    : "form-control-lg"
                }
                id="floatingInput"
                placeholder="Email"
                required
                onChange={(event) => {
                  setRegisterEmail(event.target.value);
                }}
              />
            </div>
            <div className="form-floating mb-3 ">
              <input
                type="name"
                className={
                  errorMessage
                    ? "form-control-lg border border-danger"
                    : "form-control-lg"
                }
                id="floatingInput"
                placeholder="Name"
                required
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>

            <div className="form-floating">
              <input
                type="password"
                className={
                  errorMessage
                    ? "form-control-lg border border-danger"
                    : "form-control-lg"
                }
                id="floatingPassword"
                placeholder="Password"
                required
                onChange={(e) => {
                  setRegisterPassword(e.target.value);
                }}
              />
            </div>
            <button className="mt-5 btn btn-info" onClick={register}>
              Register
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Login;
