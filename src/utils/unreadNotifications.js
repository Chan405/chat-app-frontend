export const filterUnreadNotis = (notifications) => {
  return notifications.filter((noti) => noti.isRead === false);
};
