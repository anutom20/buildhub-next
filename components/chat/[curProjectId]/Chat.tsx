"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import ModelChat from "@/components/chat/ModelChat";
import UserChat from "@/components/chat/UserChat";
import { IoArrowUpCircle } from "react-icons/io5";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setCurrentProject,
  setProjects,
} from "@/lib/features/project/projectSlice";
import {
  setChatMessages,
  setChatMetadata,
} from "@/lib/features/chat/chatSlice";
import {
  updateChatMessages,
  updateStreamingBotSingleMessage,
} from "@/lib/features/chat/chatSlice";
import { initialChatMessage, viewNames } from "@/components/Static";

const Chat = ({ params }: { params: { slug: string[] } }) => {
  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  console.log(JSON.stringify(currentProject));
  const messages = useAppSelector((state) => state.chat.messages);

  const dispatch = useAppDispatch();

  const chatName = params.slug[1];
  const curProjectId = params.slug[0];

  console.log(curProjectId, chatName);

  const chatId = useAppSelector((state) => state.chat.chatId);

  const [loading, setLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>("");
  const [botMessageCompleted, setBotMessageCompleted] =
    useState<boolean>(false);
  const [updateSummary, setUpdateSummary] = useState<boolean>(false);

  const chatDivRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (chatId) fetchChatHistory(chatId, chatName);
    else {
      if (chatName === viewNames.IDENTIFY_A_NEED) {
        dispatch(setChatMessages([initialChatMessage["identifyANeed"]]));
      } else if (chatName === viewNames.VALIDATE_THE_NEED) {
        dispatch(setChatMessages([initialChatMessage["validateTheNeed"]]));
      }
    }
  }, [chatId]);

  useEffect(() => {
    if (!currentProject?.name) fetchProjects(curProjectId);
    else setLoading(false);
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (messages.length > 1 && botMessageCompleted) {
        console.log(chatId);
        await syncChatToDb(chatName, chatId);
        if (!chatId) fetchChatMetadata(currentProject?.id, chatName);
      }
    };
    sync();
  }, [botMessageCompleted]);

  useEffect(() => {
    if (botMessageCompleted && updateSummary) {
      updateSummaryInDb(chatId, currentProject?.id, currentProject?.name);
    }
  }, [botMessageCompleted, updateSummary]);

  const fetchProjects = async (curProjectId: string) => {
    try {
      const response = await axios.get("/api/project/all");
      dispatch(setProjects(response?.data?.projects));
      const curProject = response?.data?.projects?.filter(
        (project: any) => project.id === curProjectId
      );
      dispatch(setCurrentProject(curProject));
      fetchChatMetadata(curProjectId, chatName);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (chatId: string, chatName: string) => {
    try {
      const response = await axios.post("/api/chat/messages", { chatId });
      if (!response?.data?.chatHistory?.messages) {
        if (chatName === viewNames.IDENTIFY_A_NEED) {
          dispatch(setChatMessages([initialChatMessage["identifyANeed"]]));
        } else if (chatName === viewNames.VALIDATE_THE_NEED) {
          dispatch(setChatMessages([initialChatMessage["validateTheNeed"]]));
        }
      } else {
        dispatch(setChatMessages(response?.data?.chatHistory?.messages));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const syncChatToDb = async (chatName: string, chatId: string) => {
    try {
      await axios.post("/api/chat/sync", {
        messages,
        projectId: currentProject?.id,
        chatName,
        chatId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateSummaryInDb = async (
    chatId: string,
    projectId: string,
    projectName: string
  ) => {
    try {
      let chatHistory = [];

      for (const message of messages) {
        chatHistory.push({ role: "user", parts: [{ text: message.user }] });
        chatHistory.push({ role: "model", parts: [{ text: message.bot }] });
      }
      await axios.post("/api/chat/summary", {
        chatHistory,
        chatId,
        projectId,
        projectName,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChatMetadata = async (projectId: string, chatName: string) => {
    try {
      const response = await axios.post("/api/chat/metadata", {
        projectId,
        chatName,
      });
      const chatMetadata = {
        chatId: response?.data?.chatMetadata?.chatId ?? "",
        chatName: response?.data?.chatMetadata?.chatName ?? "",
      };
      dispatch(setChatMetadata(chatMetadata));
    } catch (err) {
      console.log(err);
    }
  };

  const handleChatInput = () => {
    if (chatDivRef.current) {
      setInput(chatDivRef.current.textContent!);
    }
  };

  const sendMessage = async (
    e: any,
    generateRedditSummary: boolean = false,
    postUrl: string = ""
  ) => {
    e.preventDefault();
    setBotMessageCompleted(false);
    setUpdateSummary(false);
    if (!generateRedditSummary && !input) return;
    let history = [];

    for (const message of messages) {
      history.push({ role: "user", parts: [{ text: message.user }] });
      history.push({ role: "model", parts: [{ text: message.bot }] });
    }

    dispatch(
      updateChatMessages({
        user: generateRedditSummary ? "generate reddit post summary" : input,
        bot: "",
      })
    );

    const prompt = generateRedditSummary
      ? "generate reddit post summary"
      : input;
    setInput("");
    if (chatDivRef.current) chatDivRef.current.textContent = "";

    try {
      const response = await fetch("/api/stream", {
        method: "POST",
        body: JSON.stringify({
          generateRedditSummary,
          postUrl,
          history,
          prompt,
          chatName,
          projectId: currentProject?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const reader = response?.body?.getReader();

      if (!reader) return;

      const decoder = new TextDecoder("utf-8");

      let chunkedMessage = "";
      while (true) {
        const { done, value } = await reader.read();
        let messageIndex = messages.length;
        if (done) {
          setBotMessageCompleted(true);
          break;
        }
        try {
          chunkedMessage += decoder.decode(value);

          if (chunkedMessage?.includes("UPDATE_SUMMARY")) {
            setUpdateSummary(true);
            chunkedMessage = chunkedMessage?.replace("UPDATE_SUMMARY", "");
          }

          dispatch(
            updateStreamingBotSingleMessage({
              index: messageIndex,
              message: chunkedMessage,
            })
          );
        } catch (e) {
          console.log(e);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Chatbot</h1>
      <div className="mx-auto max-h-[80vh] overflow-y-auto">
        <div
          id="chatContainer"
          className="mx-auto flex w-1/2 flex-col justify-content space-y-6"
        >
          {messages.map((msg, index) => (
            <div key={index} className="space-y-6">
              {index !== 0 && (
                <div className="flex justify-end">
                  <UserChat text={msg.user} />
                </div>
              )}
              <div className="flex justify-start">
                <ModelChat text={msg.bot} sendMessage={sendMessage} />
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>
      <div className="mt-12 mb-4 flex w-1/2 mx-auto flex-col gap-1">
        <form onSubmit={sendMessage} className="shadow-sm relative">
          <div
            ref={chatDivRef}
            contentEditable
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                sendMessage(e);
              }
            }}
            onInput={handleChatInput}
            className="bg-chatInput border pr-12 border-gray-300 text-md rounded-lg focus:outline-none focus:border-gray-400 focus:border w-full p-2.5"
          />
          <button
            type="submit"
            className="absolute right-5 top-2"
            disabled={input ? false : true}
          >
            <IoArrowUpCircle
              className={`${
                input ? "text-primary" : "text-lightPrimary"
              } transition-all duration-300 ease-in-out`}
              size={32}
            />
          </button>
        </form>
        <span className="text-xs text-charcoal text-center">
          Makerhub can make mistakes. Check important info
        </span>
      </div>
    </div>
  );
};

export default Chat;
