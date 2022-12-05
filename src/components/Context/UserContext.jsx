import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUser({
          value: user.uid,
          label: "you",
        });
      } else {
        setUser({});
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
