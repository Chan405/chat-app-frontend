import React from "react";
import InputEmoji from "react-input-emoji";
import { FiSend } from "react-icons/fi";

function MessageInput({ text, setText, handleSendMessage }) {
  return (
    <div className="flex mb-4">
      <InputEmoji
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={handleSendMessage}
        placeholder={"Message"}
      />

      <button
        className="mr-4 my-2 bg-purple-400 text-white px-4 rounded-xl "
        onClick={handleSendMessage}
      >
        <FiSend className="text-xl" />
      </button>
    </div>
  );
}

export default MessageInput;
