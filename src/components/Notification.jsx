import React, { useContext, useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { ChatContext } from "../context/ChatContext";
import axios from "axios";
import { userConst } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { filterUnreadNotis } from "../utils/unreadNotifications";

function Notification() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    markAllAsRead,
    markSingleNotiAsRead,
    potentialUsers,
    userChats,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const modiNotifications = notifications.map((noti) => {
    const sender = potentialUsers.find((user) => user._id === noti.sendId);

    return { ...noti, senderName: sender?.name };
  });

  const unreadNoti = filterUnreadNotis(notifications);

  // console.log("notifications", modiNotifications);
  return (
    <div className="relative">
      <div className="">
        <FaBell
          className="text-white text-xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        {unreadNoti.length > 0 && (
          <span className="flex justify-center items-center bg-black text-white text-xs w-4 h-4 rounded-full absolute -top-2 -right-2">
            {unreadNoti.length}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="bg-slate-100 absolute right-0 top-6 p-2 rounded-sm"
          style={{ width: "300px" }}
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <p> Notifications </p>
            <span
              className="cursor-pointer"
              onClick={() => markAllAsRead(modiNotifications)}
            >
              Mark all as read
            </span>
          </div>

          {unreadNoti.length === 0 && (
            <p className="text-blue-500 text-center my-4">
              {" "}
              No new notifications
            </p>
          )}

          {modiNotifications.length > 0 &&
            modiNotifications.map((noti) => (
              <div
                key={noti.date}
                className="relative text-blue-600 flex items-center gap-4 bg-blue-100 shadow-sm p-2 rounded-md my-2 cursor-pointer"
                onClick={() => {
                  markSingleNotiAsRead(noti, userChats, user, notifications);
                  setIsOpen(false);
                }}
              >
                <p className=""> {noti.senderName} sent you a message</p>

                <span className="text-xs">
                  {moment(noti.date).format("h:mm A")}
                </span>

                {!noti.isRead && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full absolute right-0 top-0"></span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
