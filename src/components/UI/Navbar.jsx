import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

function Navbar() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (curretUser) => {
        setUser(curretUser);
      },
      []
    );
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg text-white bg-dark">
      <Link to="/" className="nav-link active text-light">
        home
      </Link>
      {!user && (
        <Link to="/login" className="nav-link active text-light">
          login
        </Link>
      )}
      {user && (
        <Link onClick={logout} className="nav-link active text-light">
          logout
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
