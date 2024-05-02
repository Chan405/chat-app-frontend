import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { chatConst, profileConst } from "../utils/constants";
import { ChatContext } from "../context/ChatContext";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { errorHandler } from "../utils/errorHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "8px",
  outline: "none",
  boxShadow: 24,
};

export default function CreateGroupModal({ open, setOpen, refetch }) {
  //   const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { potentialUsers } = useContext(ChatContext);
  const {user} = useContext(AuthContext)

  const handleGroupName = (e) => {
    setGroupName(e.target.value);
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const createGroupChat = async () => {
    if (!groupName || selectedUsers.length === 0) return;

    const payload = {
      groupName,
      members: [user.id, ...selectedUsers],
    };

    try {
      const { data } = await axios.post(chatConst, payload);
      if (data) {
        refetch();
        setOpen(false);
      }
    } catch (e) {
      errorHandler(e)
    }
  };


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            p={1}
            borderBottom="1px solid gray"
          >
            Create Group
          </Typography>
          <Box padding={4}>
            <input
              type="text"
              value={groupName}
              onChange={handleGroupName}
              placeholder="Group name"
              className=" w-full h-12 border border-purple-600 rounded px-3 py-1 "
            />

            <div className="grid grid-cols-3 gap-4 my-4">
              {potentialUsers.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  isSelected={selectedUsers.includes(user._id)}
                  onSelect={toggleSelectUser}
                />
              ))}
            </div>

            <div>
              <button
                className="w-full bg-fuchsia-400 text-white font-bold p-3 rounded-lg"
                onClick={createGroupChat}
              >
                {" "}
                Create Group{" "}
              </button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

const UserItem = ({ user, isSelected, onSelect }) => {
  return (
    <div
      className={`p-4 border flex items-center justify-center flex-col rounded-md cursor-pointer ${
        isSelected ? "bg-fuchsia-100" : ""
      }`}
      onClick={() => onSelect(user._id)}
    >
      <img
        className="w-10 h-10 rounded-full"
        src={`${profileConst}/${user.photo}`}
        alt={user.name}
      />
      <span className="ml-2">{user.name}</span>
    </div>
  );
};
