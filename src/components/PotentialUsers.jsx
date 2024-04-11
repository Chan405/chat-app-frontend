import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { chatConst, userConst } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function PotentialUsers({ refetch }) {
  const [potentialUsers, setPotentialUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const { onlineUsers } = useContext(ChatContext);

  const fetchPotentialUsers = async () => {
    try {
      const { data } = await axios.get(userConst);
      const tmp = data.users.filter((u) => u._id !== user.id);

      setPotentialUsers(tmp);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPotentialUsers();
  }, []);

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
            <div className="w-11 h-11 rounded-full bg-fuchsia-500 text-white font-bold flex items-center justify-center relative">
              {pUser?.name[0].toUpperCase()}
              {onlineUsers.some(
                (onlineUser) => onlineUser.userId === pUser._id
              ) && (
                <div className="w-3 h-3 rounded-full bg-green-600 absolute bottom-1 right-0"></div>
              )}
            </div>
            <p> {pUser.name}</p>
          </div>
        ))}
    </div>
  );
}

export default PotentialUsers;
