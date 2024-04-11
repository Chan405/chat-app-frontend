import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { chatConst, messagesConst } from "../utils/constants";
import UserChat from "./UserChat";
import PotentialUsers from "./PotentialUsers";
import Messages from "./Messages";

function Chats() {
  const [userChats, setUserChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  const { user } = useContext(AuthContext);
  const fetchUserChats = async () => {
    if (user) {
      try {
        const { data } = await axios.get(`${chatConst}/${user.id}`);
        setUserChats(data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
  };

  useEffect(() => {
    fetchUserChats();
  }, [user]);

  return (
    <div>
      <PotentialUsers refetch={fetchUserChats} />
      <div className="flex">
        <div className="w-1/3 ">
          {userChats?.length > 0 &&
            userChats?.map((chat) => (
              <UserChat
                key={chat._id}
                chat={chat}
                handleCurrentChat={handleCurrentChat}
              />
            ))}
        </div>

        <div className="w-2/3">
          {currentChat && <Messages currentChat={currentChat} />}
        </div>
      </div>
    </div>
  );
}

export default Chats;
