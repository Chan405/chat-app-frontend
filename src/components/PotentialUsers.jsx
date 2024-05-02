import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { chatConst, profileConst, userConst } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { IoMdPeople } from "react-icons/io";
import CreateGroupModal from "./CreateGroupModal";

function PotentialUsers({ refetch }) {
  const { user } = useContext(AuthContext);
  const { onlineUsers, potentialUsers, setCurrentChat  } = useContext(ChatContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = potentialUsers.filter((pUser) =>
    pUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createChat = async (firstId, secondId) => {
    try {
      const { data } = await axios.post(chatConst, { firstId, secondId });
      if (data) {
        refetch();
      }
    } catch (e) {
      // errorHandler(e)
      if(e?.response && e?.response?.data && e?.response?.data?.existingChat) {
        const currentChat = e?.response?.data?.existingChat
        setCurrentChat(currentChat)
      }
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 ml-4 mt-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search users..."
          className=" w-1/4 h-12 border border-purple-600 rounded px-3 py-1 "
        />

        <div
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full"
          onClick={() => setOpen(true)}
        >
          {" "}
          <IoMdPeople className="text-purple-700 text-2xl cursor-pointer" />{" "}
        </div>
      </div>

      <div className="flex gap-4 m-3">
        {filteredUsers.length === 0 && <p> No users found</p>}
        {filteredUsers.length > 0 &&
          filteredUsers.map((pUser) => (
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

      <CreateGroupModal open={open} setOpen={setOpen} refetch={refetch} />
    </div>
  );
}

export default PotentialUsers;
