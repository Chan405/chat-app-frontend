import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { profileConst } from "../utils/constants";

function SingleOwnMessage({ message, scroll }) {
  const { user } = useContext(AuthContext);

  return (
    <div
      className="flex items-center justify-end"
      key={message._id}
      ref={scroll}
    >
      <span className="text-xs text-gray-500">
        {moment(message.createdAt).format("h:mm A")}
      </span>
      <div className="flex-shrink-0 max-w-1/2 bg-purple-400 text-white rounded-full m-2 px-6 py-2">
        <p>{message.text}</p>
      </div>

      <img
        src={`${profileConst}/${user?.profilePic}`}
        className="w-6 h-6 rounded-full object-cover"
      />
    </div>
  );
}

export default SingleOwnMessage;
