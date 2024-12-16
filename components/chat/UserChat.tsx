import React from "react";

type UserChat = {
  text: string;
};

const UserChat: React.FC<UserChat> = ({ text }) => {
  return (
    <div className="flex items-center max-w-lg bg-userChatInput rounded-xl shadow-sm px-4 py-4 leading-5">
      {/* Display image to the right */}
      <div className="flex-1">
        {text.split("<br>").map((line, index) => (
          <>
            <p key={index} className="mb-1">
              {line}
            </p>
            {index < text.split("<br>").length - 1 && <br />}
          </>
        ))}
      </div>
    </div>
  );
};

export default UserChat;
