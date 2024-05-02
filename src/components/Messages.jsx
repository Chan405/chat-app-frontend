import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { messagesConst, profileConst, userConst } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { ChatContext } from "../context/ChatContext";
import MessageInput from "./MessageInput";
import SingleOwnMessage from "./SingleOwnMessage";
import SingleMessage from "./SingleMessage";
import { errorHandler } from "../utils/errorHandler";

function Messages({ currentChat }) {
  const [chatMessages, setChatMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(ChatContext);
  const partnerId = currentChat?.members.find((id) => id !== user?.id);
  const [partnerUser, setPartner] = useState(null);
  const [text, setText] = useState("");
  const [memberData, setMemberData] = useState({});

  const scroll = useRef();

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

        if (socket !== null) {
          socket.emit("sendMessage", { data, partnerId: partnerUser?._id });
        }
      }
    } catch (e) {
      errorHandler(e)
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
      errorHandler(e)
    }
  };

  useEffect(() => {
    fetchChatMessages();
    fetchPartnerUser();

    if (socket !== null) {
      socket.on("getMessage", (response) => {
        const newMessage = { ...response.data, ownMessage: false };

        setChatMessages((prev) => [...prev, newMessage]);
      });

      return () => {
        socket.off("getMessage");
      };
    }
  }, [currentChat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchMemberData = async (memberIds) => {
    try {
      const promises = memberIds.map(async (id) => {
        const { data } = await axios.get(`${userConst}/${id}`);
        // console.log("data fetch", data);
        return data.user;
      });
      const userData = await Promise.all(promises);
      // console.log({ userData });
      const memberDataObj = userData.reduce((acc, user) => {
        acc[user._id] = user;
        return acc;
      }, {});
      setMemberData(memberDataObj);
    } catch (e) {
        errorHandler(e)
    }
  };

  useEffect(() => {
    const memberIds = chatMessages.map((message) => message.sendId);
    const uniqueMemberIds = [...new Set(memberIds)];
    // Fetch member data

    // console.log({ uniqueMemberIds });
    fetchMemberData(uniqueMemberIds);
  }, [chatMessages]);

  return (
    <div className="bg-white rounded-md shadow-lg m-4 -mt-14">
      <div className="bg-purple-400 text-white text-center text-xl font-bold py-2 rounded-t-md">
        { currentChat?.groupName ? currentChat?.groupName : partnerUser?.name}
      </div>

      <div className="p-4 max-h-96 h-96 overflow-y-scroll">
        {chatMessages.length > 0 &&
          chatMessages.map((message) =>
            message.ownMessage ? (
              <SingleOwnMessage scroll={scroll} message={message} />
            ) : (
              <SingleMessage
                scroll={scroll}
                message={message}
                partnerUser={partnerUser}
                photo={`${profileConst}/${memberData[message.sendId]?.photo}`}
              />
            )
          )}
      </div>

      <MessageInput
        text={text}
        setText={setText}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default Messages;
