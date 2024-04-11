import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { userConst } from "../utils/constants";
import { ChatContext } from "../context/ChatContext";

function UserChat({ chat, handleCurrentChat }) {
  const { user } = useContext(AuthContext);
  const { onlineUsers } = useContext(ChatContext);
  const partnerId = chat?.members.find((id) => id !== user?.id);

  const [partnerUser, setPartner] = useState(null);
  const isOnline = onlineUsers.some(
    (onlineUser) => onlineUser.userId === partnerUser?._id
  );

  const fetchPartnerUser = async () => {
    if (partnerId) {
      const { data } = await axios.get(`${userConst}/${partnerId}`);
      setPartner(data.user);
    }
  };

  useEffect(() => {
    fetchPartnerUser();
  }, [chat]);
  return (
    <div
      className="flex items-center gap-3 bg-white shadow-md rounded-md px-3 py-2 m-4 cursor-pointer"
      onClick={() => handleCurrentChat(chat)}
    >
      <div className="w-11 h-11 rounded-full bg-fuchsia-500 text-white font-bold flex items-center justify-center relative">
        {partnerUser?.name[0].toUpperCase()}

        {isOnline && (
          <div className="w-2 h-2 rounded-full bg-green-500 absolute bottom-1 right-1"></div>
        )}
      </div>

      <div>
        {partnerUser?.name} <p> Message </p>
      </div>
    </div>
  );
}

export default UserChat;
