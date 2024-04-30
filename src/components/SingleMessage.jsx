import moment from "moment";
import React from "react";
import { profileConst } from "../utils/constants";

function SingleMessage({ message, scroll, partnerUser, photo }) {
  return (
    <div className="flex items-center" key={message._id} ref={scroll}>
      <img
        src={photo}
        className="w-6 h-6 rounded-full object-cover"
      />
      <div className="flex-shrink-0 max-w-1/2 bg-purple-400 text-white rounded-full m-2 px-6 py-2">
        <p>{message.text}</p>
      </div>

      <span className="text-xs text-gray-500">
        {moment(message.createdAt).format("h:mm A")}
      </span>
    </div>
  );
}

export default SingleMessage;
