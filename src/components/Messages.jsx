import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { messagesConst, userConst } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { FiSend } from "react-icons/fi";

function Messages({ currentChat }) {
  const [chatMessages, setChatMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const partnerId = currentChat?.members.find((id) => id !== user?.id);
  const [partnerUser, setPartner] = useState(null);
  const [text, setText] = useState("");

  const handleSendMessage = async () => {
    const payload = {
      text,
      chatId: currentChat._id,
      sendId: user.id,
    };

    try {
      const { data } = await axios.post(messagesConst, payload);

      if (data) {
        data.ownMessage = true;
        setChatMessages((prev) => [...prev, data]);
        setText("");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchPartnerUser = async () => {
    if (partnerId) {
      const { data } = await axios.get(`${userConst}/${partnerId}`);
      setPartner(data.user);
    }
  };

  const fetchChatMessages = async () => {
    try {
      if (currentChat) {
        const { data } = await axios.get(`${messagesConst}/${currentChat._id}`);

        const tmp = data.map((message) => {
          if (message.sendId === user.id) {
            return { ...message, ownMessage: true };
          } else {
            return { ...message };
          }
        });
        setChatMessages(tmp);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    fetchPartnerUser();
  }, [currentChat]);

  return (
    <div className="bg-white rounded-md shadow-lg m-4">
      <div className="bg-purple-400 text-white text-center text-xl font-bold py-2 rounded-t-md">
        {partnerUser?.name}
      </div>

      <div className="p-4">
        {chatMessages.length > 0 &&
          chatMessages.map((message) =>
            message.ownMessage ? (
              <div className="flex items-center justify-end" key={message._id}>
                <span className="text-xs text-gray-500">
                  {moment(message.createdAt).format("h:mm A")}
                </span>
                <div className="flex-shrink-0 max-w-1/2 bg-purple-400 text-white rounded-full m-2 px-6 py-2">
                  <p>{message.text}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center" key={message._id}>
                <div className="flex-shrink-0 max-w-1/2 bg-purple-400 text-white rounded-full m-2 px-6 py-2">
                  <p>{message.text}</p>
                </div>

                <span className="text-xs text-gray-500">
                  {moment(message.createdAt).format("h:mm A")}
                </span>
              </div>
            )
          )}
      </div>

      <div className="flex mb-4">
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={handleSendMessage}
          placeholder
        />

        <button
          className="mr-4 my-2 bg-purple-400 text-white px-4 rounded-xl "
          onClick={handleSendMessage}
        >
          <FiSend className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default Messages;
