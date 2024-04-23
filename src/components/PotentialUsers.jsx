import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { chatConst, profileConst, userConst } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function PotentialUsers({ refetch }) {
  const { user } = useContext(AuthContext);
  const { onlineUsers, potentialUsers } = useContext(ChatContext);

  const createChat = async (firstId, secondId) => {
    try {
      const { data } = await axios.post(chatConst, { firstId, secondId });
      if (data) {
        refetch();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex gap-4 m-2">
      {potentialUsers.length > 0 &&
        potentialUsers.map((pUser) => (
          <div
            key={pUser._id}
            className="cursor-pointer"
            onClick={() => createChat(pUser._id, user.id)}
          >
            <div className="  relative">
              <img
                src={`${profileConst}/${pUser.photo}`}
                className="w-14 h-14 rounded-full object-cover"
              />
              {onlineUsers.some(
                (onlineUser) => onlineUser.userId === pUser._id
              ) && (
                <div className="w-3 h-3 rounded-full bg-green-600 absolute bottom-1 right-0"></div>
              )}
            </div>
            <p className="text-center"> {pUser.name}</p>
          </div>
        ))}
    </div>
  );
}

export default PotentialUsers;
