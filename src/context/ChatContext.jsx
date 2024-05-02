import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { chatConst, userConst } from "../utils/constants";
import { errorHandler } from "../utils/errorHandler";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [potentialUsers, setPotentialUsers] = useState([]);

  // chats history of the logged in user
  const [userChats, setUserChats] = useState(null);

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

      socket.on("getNotification", (response) => {
        const isChatOpen = currentChat?.members.some((id) => response.sendId);

        if (isChatOpen) {
          setNotifications((prev) => [{ ...response, isRead: false }, ...prev]);
        } else {
          setNotifications((prev) => [response, ...prev]);
        }
      });
    }

    return () => {
      socket?.off("getOnlineUsers");
      socket?.off("getNotification");
    };
  }, [socket]);

  // fetch the chat history of the logged in user
  const fetchUserChats = async () => {
    if (user) {
      try {
        const { data } = await axios.get(`${chatConst}/${user.id}`);
        setUserChats(data);
      } catch (e) {
       errorHandler(e)
      }
    }
  };

  // fetch all users
  const fetchPotentialUsers = async () => {
    try {
      const { data } = await axios.get(userConst);
      const tmp = data.users.filter((u) => u._id !== user.id);

      setPotentialUsers(tmp);
    } catch (e) {
      errorHandler(e)
    }
  };

  // mark all notis as read
  const markAllAsRead = (notifications) => {
    const newNotis = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(newNotis);
  };

  // mark a single noti as read
  const markSingleNotiAsRead = (noti, userChats, user, notifications) => {
    const desiredChat = userChats.find((chat) => {
      const chatMembers = [user.id, noti.sendId];
      const isDesiredChat = chat?.members.every((member) => {
        return chatMembers.includes(member);
      });

      return isDesiredChat;
    });

    setCurrentChat(desiredChat);

    // mark noti as read
    const tmp = notifications.map((n) => {
      if (n.sendId === noti.sendId) {
        return { ...n, isRead: true };
      } else {
        return n;
      }
    });
    setNotifications(tmp);
  };

  useEffect(() => {
    fetchUserChats();
    fetchPotentialUsers();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        onlineUsers,
        currentChat,
        setCurrentChat,
        notifications,
        setNotifications,
        markAllAsRead,
        userChats,
        fetchUserChats,
        potentialUsers,
        markSingleNotiAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
