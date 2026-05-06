import {createContext, useState} from "react";

export const UserContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken());
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

