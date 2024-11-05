import React from "react";
import Markdown from "react-markdown";

type ModelChat = {
  text: string;
};

const ModelChat: React.FC<ModelChat> = ({ text }) => {
  return (
    <div className="px-3 py-5 bg-white shadow-sm rounded-xl leading-7">
      <Markdown>{text}</Markdown>
    </div>
  );
};

export default ModelChat;
