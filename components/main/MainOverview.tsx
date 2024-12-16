import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoArrowUpCircle, IoChatbubbleOutline } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import CreateChatModal from "../modal/CreateChatModal";
import axios from "axios";
import { setCurrentViewId } from "@/lib/features/general/generalSlice";
import { phaseNamesMapping, phasesSectionItems, viewNames } from "../Static";
import { isFulfilled } from "@reduxjs/toolkit";
import Spinner from "../Spinner";

const MainOverview = ({ name }: { name: string }) => {
  const [input, setInput] = useState("");
  const currentHour = new Date().getHours();

  const dispatch = useAppDispatch();

  const currentViewId = useAppSelector((state) => state.general.currentViewId);

  console.log("currentViewId", currentViewId);

  const router = useRouter();

  const [openCreateChatModal, setOpenCreateChatModal] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("");

  let greeting = `Good evening ${name.split(" ")[0]}`;
  let icon = <FaSun size={32} className="text-orange-500 inline" />;
  if (currentHour < 12) {
    greeting = `Good morning ${name.split(" ")[0]}`;
    icon = <FaSun size={32} className="text-orange-500 inline" />;
  } else if (currentHour < 16) {
    greeting = `Good afternoon ${name.split(" ")[0]}`;
    icon = <FaSun size={32} className="text-yellow-500 inline" />;
  } else if (currentHour >= 16 && currentHour < 20) {
    greeting = `Good evening ${name.split(" ")[0]}`;
    icon = <FaSun size={32} className="text-orange-500 inline" />;
  } else {
    greeting = `Good evening ${name.split(" ")[0]}`;
    icon = <FaMoon size={32} className="text-blue-500 inline" />;
  }

  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  const [recentChats, setRecentChats] = useState<
    {
      date: string;
      time: string;
      title: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);

  const fetchAllChatMetadata = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/chat/metadata/normalChats", {
        params: {
          projectId: currentProject?.id,
        },
      });
      const data = await response.data;
      const formattedChats = data.normalChats.map(
        (chat: { chatName: string; createdAt: string }) => {
          const createdAt = new Date(chat.createdAt);
          const date = createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const time = createdAt.toLocaleTimeString();
          return {
            date,
            time,
            title: chat.chatName,
          };
        }
      );
      const reversedChats = formattedChats.reverse();
      setRecentChats(reversedChats);
    } catch (err) {
      console.error("Error fetching chat metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectCurrentPhase = async () => {
    const response = await axios.get("/api/project/getProgress", {
      params: {
        projectId: currentProject?.id,
      },
    });
    const data = await response.data;
    setCurrentPhase(data?.currentPhase);
  };

  useEffect(() => {
    fetchAllChatMetadata();
  }, [currentProject?.id]);

  useEffect(() => {
    fetchProjectCurrentPhase();
  }, [currentProject?.id]);

  const timeAgo = (date: string, time: string): string => {
    if (!date || !time) return "";
    const now = new Date();
    const [day, month, year] = date?.split("/").map(Number);
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const chatDateTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      seconds
    );
    const secondsElapsed = Math.floor(
      (now.getTime() - chatDateTime.getTime()) / 1000
    );
    let interval = Math.floor(secondsElapsed / 31536000);

    if (interval >= 1) {
      return `${interval} year${interval === 1 ? "" : "s"} ago`;
    }
    interval = Math.floor(secondsElapsed / 2592000);
    if (interval >= 1) {
      return `${interval} month${interval === 1 ? "" : "s"} ago`;
    }
    interval = Math.floor(secondsElapsed / 86400);
    if (interval >= 1) {
      return `${interval} day${interval === 1 ? "" : "s"} ago`;
    }
    interval = Math.floor(secondsElapsed / 3600);
    if (interval >= 1) {
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;
    }
    interval = Math.floor(secondsElapsed / 60);
    if (interval >= 1) {
      return `${interval} minute${interval === 1 ? "" : "s"} ago`;
    }
    return "just now";
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="p-10 bg-background h-screen w-full lg:w-2/3 flex flex-col items-center mt-20 mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
          <div className="text-2xl sm:text-3xl lg:text-4xl text-darkCharcoal font-bold">
            {greeting}
          </div>
          <div className="mt-2">{icon}</div>
        </div>
        <div className="relative w-full h-36">
          <textarea
            placeholder="How can Makerhub help you today?"
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-md lg:text-base h-full p-4 rounded-xl border border-gray-300 shadow-md focus:outline-none resize-none"
          ></textarea>
          <button
            type="submit"
            className="absolute right-5 top-24 sm:top-2"
            onClick={() => {
              setOpenCreateChatModal(true);
            }}
            disabled={input ? false : true}
          >
            <IoArrowUpCircle
              className={`${
                input ? "text-primary" : "text-lightPrimary"
              } transition-all duration-300 ease-in-out`}
              size={32}
            />
          </button>
        </div>

        <div className="mt-10 w-full flex flex-col lg:flex-row gap-4 relative">
          <div className="flex flex-col gap-1 w-full lg:w-1/2">
            <h2 className="text-sm font-bold mb-4">
              <GrFormNext className="inline text-darkCharcoal" /> Current Phase
            </h2>
            <div
              className="border border-gray-300 rounded-lg p-4 h-fit space-y-2 cursor-pointer"
              onClick={() => {
                dispatch(setCurrentViewId(currentPhase));
              }}
            >
              {
                phasesSectionItems.find((item) => item.name === currentPhase)
                  ?.icon
              }
              <p className="text-md">
                {
                  phaseNamesMapping[
                    currentPhase as keyof typeof phaseNamesMapping
                  ]
                }
              </p>
              <p className="text-gray-500 text-sm">Click to continue</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-1/2">
            <h2 className="text-sm font-bold mb-4">
              <IoChatbubbleOutline className="inline text-darkCharcoal" /> Your
              recent chats
            </h2>
            <div className="flex flex-col space-y-4">
              {recentChats?.length === 0 ? (
                <div className="border border-gray-300 rounded-lg p-4 h-fit space-y-2 cursor-pointer">
                  <IoChatbubbleOutline
                    size={18}
                    className="text-darkCharcoal"
                  />
                  <p className="text-md">No recent chats</p>
                </div>
              ) : (
                recentChats.slice(0, 2).map((chat, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 h-fit space-y-2 cursor-pointer"
                    onClick={() =>
                      router.push(`/chat/${currentProject?.id}/${chat.title}`)
                    }
                  >
                    <IoChatbubbleOutline
                      size={18}
                      className="text-darkCharcoal"
                    />
                    <p className="text-md">{chat.title}</p>
                    <p className="text-gray-500 text-sm">
                      {timeAgo(chat.date, chat.time)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <span
            className="text-sm font-bold mb-4 absolute right-5 text-charcoal cursor-pointer"
            onClick={() => dispatch(setCurrentViewId(viewNames.CHATS))}
          >
            View all <GrFormNext className="inline" />
          </span>
        </div>
      </div>
      {openCreateChatModal && (
        <CreateChatModal
          cancelModal={() => setOpenCreateChatModal(false)}
          initialPrompt={input}
        />
      )}
    </>
  );
};

export default MainOverview;
