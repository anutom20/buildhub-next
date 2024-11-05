import React from "react";

type UserChat = {
  text: string;
};
const UserChat: React.FC<UserChat> = ({ text }) => {
  return (
    <div className="max-w-lg bg-userChatInput rounded-xl shadow-sm  px-2 py-4 leading-5">
      {text}
    </div>
  );
};

export default UserChat;
