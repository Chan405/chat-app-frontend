import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket !== null && user !== null) {
      socket.emit("addNewUser", user?.id);
      socket.on("getOnlineUsers", (response) => {
        setOnlineUsers(response);
      });
    }

    return () => {
      socket?.off("getOnlineUsers");
    };
  }, [socket]);

  return (
    <ChatContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  );
};
