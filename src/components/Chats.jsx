import React, { useContext, useEffect, useState } from "react";
import UserChat from "./UserChat";
import PotentialUsers from "./PotentialUsers";
import Messages from "./Messages";
import { ChatContext } from "../context/ChatContext";
import "../App.css"

function Chats() {
  const { currentChat, setCurrentChat, userChats, fetchUserChats } =
    useContext(ChatContext);

  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div>
      <PotentialUsers refetch={fetchUserChats} />
      <div className="flex">
        <div className="w-1/3 max-h-[65vh] overflow-y-auto">
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
