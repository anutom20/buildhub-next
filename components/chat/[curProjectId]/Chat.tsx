"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import ModelChat from "@/components/chat/ModelChat";
import UserChat from "@/components/chat/UserChat";
import { IoArrowUpCircle } from "react-icons/io5";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { IoMicOutline } from "react-icons/io5";
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
import {
  initialChatMessage,
  viewNames,
  phaseNamesMapping,
} from "@/components/Static";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import Confetti from "react-confetti";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";

const Chat = ({
  params,
  image,
}: {
  params: { slug: string[] };
  image: string;
}) => {
  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  const promptFromOverviewSection = useSearchParams().get("initialPrompt");

  console.log(JSON.stringify(currentProject));
  const messages = useAppSelector((state) => state.chat.messages);

  const chatIdState = useAppSelector((state) => state.chat.chatId);
  console.log("chatIdState", chatIdState);

  console.log("messages", messages);

  const dispatch = useAppDispatch();

  let chatName = params.slug[1].replace(/%20/g, " ");
  const currentProjectIdQueryParam = params.slug[0];

  if (chatName?.includes(" ")) {
    chatName = chatName
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  }
  const normalChat = !Object.keys(phaseNamesMapping).some(
    (name) => chatName === name
  );

  console.log(chatName);
  const curProjectId = params.slug[0];

  let includeProjectHistory = false;

  if (params.slug.length > 2) {
    includeProjectHistory = params.slug[2] === "true";
  }

  const chatId = useAppSelector((state) => state.chat.chatId);

  const [loading, setLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>(promptFromOverviewSection ?? "");
  const [botMessageCompleted, setBotMessageCompleted] =
    useState<boolean>(false);
  const [updateSummary, setUpdateSummary] = useState<boolean>(false);
  const [updateUserPersona, setUpdateUserPersona] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [stepCompleted, setStepCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const chatDivRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pageEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  console.log("Current input value:", input);

  const [recognition, setRecognition] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        setInput(transcript);
        if (chatDivRef.current) {
          chatDivRef.current.innerText = transcript;
        }
      };

      speechRecognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      setRecognition(speechRecognition);
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  useEffect(() => {
    if (currentProject?.id) {
      fetchChatMetadata(currentProject?.id, chatName);
    }
  }, [chatName]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    console.log("chatId useEffect", chatId, chatName, normalChat);
    if (chatId) fetchChatHistory(chatName);
    else if (!normalChat) {
      console.log("setting initial messages");
      setInitialMessages(chatName);
    } else {
      console.log("setting chat messages to empty array");
      dispatch(setChatMessages([]));
    }
  }, [chatId, chatName]);

  useEffect(() => {
    if (
      promptFromOverviewSection &&
      currentProject &&
      chatName &&
      input &&
      messages.length === 0
    ) {
      sendMessage(new Event("submit"));
    }
  }, [currentProject, chatName, input]);

  useEffect(() => {
    if (!currentProject?.id) fetchProjects(curProjectId);
    else setLoading(false);
  }, []);

  useEffect(() => {
    const sync = async () => {
      const chatLength = normalChat ? 0 : 1;
      if (messages.length > chatLength && botMessageCompleted) {
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

  useEffect(() => {
    if (botMessageCompleted && updateUserPersona) {
      userPersona(currentProject?.id);
    }
  }, [botMessageCompleted, updateUserPersona]);

  const fetchProjects = async (curProjectId: string) => {
    try {
      const response = await axios.get("/api/project/all");
      dispatch(setProjects(response?.data?.projects));
      const curProject = response?.data?.projects?.filter(
        (project: any) => project.id === curProjectId
      );
      if (!currentProject?.id) dispatch(setCurrentProject(curProject[0]));
      fetchChatMetadata(curProjectId, chatName);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (chatName: string) => {
    try {
      console.log("fetching chat history", chatId);
      const response = await axios.post("/api/chat/messages", { chatId });
      if (!response?.data?.chatHistory?.messages) {
        setInitialMessages(chatName);
      } else {
        console.log("setting chat messages in fetch chat history");
        dispatch(setChatMessages(response?.data?.chatHistory?.messages));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setInitialMessages = (chatName: string) => {
    console.log("setting chat messages in setInitialMessages");
    if (chatName === viewNames.IDENTIFY_A_NEED) {
      dispatch(setChatMessages([initialChatMessage["identifyANeed"]]));
    } else if (chatName === viewNames.VALIDATE_THE_NEED) {
      dispatch(setChatMessages([initialChatMessage["validateTheNeed"]]));
    } else if (chatName === viewNames.SOLUTION_IDEATION) {
      dispatch(setChatMessages([initialChatMessage["solutionIdeation"]]));
    } else if (chatName === viewNames.AUDIENCE_TARGETING) {
      dispatch(setChatMessages([initialChatMessage["audienceTargeting"]]));
    } else if (chatName === viewNames.MARKET_VALIDATION) {
      dispatch(setChatMessages([initialChatMessage["marketValidation"]]));
    } else if (chatName === viewNames.MVP_FEATURES) {
      dispatch(setChatMessages([initialChatMessage["mVPFeatures"]]));
    } else if (chatName === viewNames.MVP_DEVELOPMENT) {
      dispatch(setChatMessages([initialChatMessage["mVPDevelopment"]]));
    } else if (chatName === viewNames.MVP_LAUNCH) {
      dispatch(setChatMessages([initialChatMessage["mVPLaunch"]]));
    } else if (chatName === viewNames.POST_LAUNCH) {
      dispatch(setChatMessages([initialChatMessage["postLaunch"]]));
    } else {
      dispatch(setChatMessages([]));
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
      updateProjectCurrentPhase(chatName);
    } catch (err) {
      console.log(err);
    }
  };

  const userPersona = async (projectId: string) => {
    const response = await axios.post("/api/persona", {
      chatHistory: messages,
      projectId,
    });
    console.log(response?.data);
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
      console.log("fetching chat metadata", response?.data);
      const chatMetadata = {
        chatId: response?.data?.chatMetadata?.chatId ?? "",
        chatName: response?.data?.chatMetadata?.chatName ?? "",
        completed: response?.data?.chatMetadata?.completed ?? false,
      };
      dispatch(setChatMetadata(chatMetadata));
      setStepCompleted(response?.data?.chatMetadata?.completed);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChatInput = () => {
    if (chatDivRef.current) {
      let htmlString = chatDivRef.current.innerHTML;
      htmlString = htmlString.replace(/&nbsp;/g, "");
      setInput(htmlString);
    }
  };

  const updateProjectCurrentPhase = async (chatName: string) => {
    try {
      await axios.patch("/api/project/updateProgress", {
        chatName,
        projectId: currentProject?.id,
      });
    } catch (error) {
      console.error("Failed to update project progress:", error);
    }
  };

  const markStepAsCompleted = async (chatId: string) => {
    try {
      setStepCompleted(true);
      axios.patch("/api/chat/metadata", { chatId });
      toast.success("Step successfully completed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        style: {
          backgroundColor: "rgba(168, 240, 187)",
          color: "var(--charcoal)",
          borderRadius: "8px",
        },
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async (
    e: any,
    generateRedditSummary: boolean = false,
    postUrl: string = ""
  ) => {
    e.preventDefault();
    recognition?.stop();
    setIsListening(false);
    setBotMessageCompleted(false);
    setUpdateSummary(false);
    setErrorMessage(null);
    if (!generateRedditSummary && !input) return;
    dispatch(
      updateChatMessages({
        user: generateRedditSummary ? "generate reddit post summary" : input,
        bot: "",
      })
    );
    setInput("");

    let history = [];

    for (const message of messages) {
      history.push({ role: "user", parts: [{ text: message.user }] });
      history.push({ role: "model", parts: [{ text: message.bot }] });
    }

    const prompt = generateRedditSummary
      ? "generate reddit post summary"
      : input;
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
          includeProjectHistory,
          projectId: currentProjectIdQueryParam,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || "An unexpected error occured. Please try again"
        );
      }

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
            markStepAsCompleted(chatId);
            chunkedMessage = chunkedMessage?.replace("UPDATE_SUMMARY", "");
          }

          if (chunkedMessage?.includes("UPDATE_USER_PERSONA")) {
            setUpdateUserPersona(true);
            chunkedMessage = chunkedMessage?.replace("UPDATE_USER_PERSONA", "");
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
      console.log(typeof err);
      const errorMessage =
        (err as Error)?.message || "An unknown error occurred.";
      if (errorMessage.includes("StreamError")) {
        setErrorMessage(errorMessage);
        if (messages.length > 0) {
          const currentMessages = messages.slice(0, messages.length + 1);
          console.log("setting chat messages in error message");
          dispatch(setChatMessages(currentMessages));
        }
      } else {
        setErrorMessage("An unexpected Error occured . Please try again.");
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {showConfetti && <Confetti />}
      <ToastContainer />
      <div className="flex items-center m-4 justify-between fixed top-0 left-0 right-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-primary flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H3m0 0l6-6m-6 6l6 6"
            />
          </svg>
          {!normalChat &&
            `Return to ${
              phaseNamesMapping[chatName as keyof typeof phaseNamesMapping]
            }`}
        </button>
        <div className="flex justify-center items-center text-lg font-bold">
          {phaseNamesMapping[chatName as keyof typeof phaseNamesMapping] ??
            params.slug[1].replace(/%20/g, " ")}
          {stepCompleted && <FaCheck className="ml-2 text-green-500" />}
        </div>
      </div>
      <div className="mx-auto max-h-[85vh] mt-12 overflow-y-auto">
        <div
          id="chatContainer"
          className="mx-auto flex w-1/2 flex-col justify-content space-y-6"
        >
          {messages.map((msg, index) => (
            <div key={index} className="space-y-6">
              {(index !== 0 || normalChat) && (
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
        {stepCompleted && chatName !== viewNames.POST_LAUNCH && (
          <div className="bg-veryLightPrimary p-4 flex justify-between rounded-md items-center mb-2">
            <span className="text-md text-charcoal">
              Great job! You've completed this phase.
            </span>
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-darkPrimary transition-all duration-300 ease-in-out"
              onClick={() => {
                router.push(
                  `/chat/${currentProject?.id}/${
                    Object.keys(phaseNamesMapping)[
                      Object.keys(phaseNamesMapping).indexOf(chatName) + 1
                    ]
                  }`
                );
              }}
            >
              Next phase →
            </button>
          </div>
        )}
        <form onSubmit={sendMessage} className="shadow-sm relative">
          <div className="relative editable">
            <div
              ref={chatDivRef}
              contentEditable
              data-placeholder={`${
                isListening ? "Listening..." : "Type your message here..."
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  sendMessage(e);
                } else if (e.key === "Enter" && e.shiftKey) {
                  pageEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onInput={handleChatInput}
              className="bg-chatInput border pr-12 border-gray-300 text-md rounded-lg focus:outline-none focus:border-gray-400 focus:border w-full p-2.5"
            ></div>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-16 top-3 ${
              isListening ? "text-red-500" : "text-primary"
            }`}
          >
            <IoMicOutline size={24} />
          </button>
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
          Makerhub can make mistakes. Please check important information.
        </span>
        <div className="mb-4" ref={pageEndRef}></div>
      </div>
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-1/2 mx-auto"
          role="alert"
        >
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
