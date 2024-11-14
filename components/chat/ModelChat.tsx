"use client";
import React, { SetStateAction } from "react";
import Markdown from "react-markdown";

type ModelChatProps = {
  text: string;
  sendMessage: (
    e: any,
    generateRedditSummary?: boolean,
    postUrl?: string
  ) => void;
};

const RedditPosts = ({
  posts,
  handleSummarize,
}: {
  posts: any[];
  handleSummarize: (e: any, postUrl: string) => void;
}) => {
  return (
    <div className="space-y-4">
      {posts?.map((item: any, index: number) => {
        return (
          <div key={item.url} className="p-4 border-b flex flex-col gap-2">
            <a
              href={item.url}
              id={`post-${index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal text-md no-underline hover:underline"
            >
              {item.title}
            </a>
            <button
              className="mt-2 px-3 py-1 text-sm bg-primary max-w-24 text-white rounded hover:bg-darkPrimary focus:outline-none focus:ring-2 transition"
              onClick={(e) => handleSummarize(e, item.url)}
            >
              Summarize
            </button>
          </div>
        );
      })}
    </div>
  );
};

const ModelChat: React.FC<ModelChatProps> = ({ text, sendMessage }) => {
  function parseStringifiedArray(str: string) {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed);
    } catch (e) {
      return null;
    }
  }

  const handleSummarize = (e: any, postUrl: string) => {
    sendMessage(e, true, postUrl);
  };

  return (
    <div className="px-3 py-5 bg-white shadow-sm rounded-xl leading-7">
      {parseStringifiedArray(text) ? (
        <RedditPosts
          posts={JSON.parse(text)}
          handleSummarize={handleSummarize}
        />
      ) : (
        <Markdown>{text}</Markdown>
      )}
    </div>
  );
};

export default ModelChat;
