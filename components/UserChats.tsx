import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import CreateChatModal from "./modal/CreateChatModal";
import Spinner from "./Spinner";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

const UserChats = ({
  showCreateChatModal,
  setShowCreateChatModal,
}: {
  showCreateChatModal: boolean;
  setShowCreateChatModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [chats, setChats] = useState<
    { date: string; time: string; title: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const router = useRouter();

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
      setChats(formattedChats);
    } catch (err) {
      console.error("Error fetching chat metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllChatMetadata();
  }, [currentProject?.id]);

  const cancelModal = () => {
    setShowCreateChatModal(false);
  };

  if (loading) {
    return <Spinner />;
  }

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 w-4/5 mx-auto">
      <h1 className="text-4xl text-darkCharcoal font-bold mb-4">Your chats</h1>
      <div className="flex flex-row justify-between space-x-4 items-center">
        <div className="flex flex-row items-center w-[80%] relative">
          <FaSearch
            size={18}
            className="absolute left-3 top-5 transform -translate-y-1/2 text-darkCharcoal"
          />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full p-2 pl-10 mb-4 border border-gray-300 rounded focus:outline-none focus:border-primary ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="bg-primary text-white px-6 hover:bg-darkPrimary py-2 rounded mb-4"
          onClick={() => setShowCreateChatModal(true)}
        >
          {windowWidth < 768
            ? "+"
            : windowWidth < 1024
            ? "+ New"
            : "+ New chat"}
        </button>
      </div>
      {filteredChats.length === 0 && (
        <p className="text-center text-gray-500">No chats found</p>
      )}
      {filteredChats
        .reduce(
          (
            acc: {
              date: string;
              chats: { date: string; time: string; title: string }[];
            }[],
            chat,
            index
          ) => {
            const lastGroup = acc[acc.length - 1];
            if (!lastGroup || lastGroup.date !== chat.date) {
              acc.push({ date: chat.date, chats: [chat] });
            } else {
              lastGroup.chats.push(chat);
            }
            return acc;
          },
          []
        )
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split("/").map(Number);
          const [dayB, monthB, yearB] = b.date.split("/").map(Number);
          return (
            new Date(yearB, monthB - 1, dayB).getTime() -
            new Date(yearA, monthA - 1, dayA).getTime()
          );
        })
        .map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4 space-y-2">
            <h2 className="text-md text-darkCharcoal font-semibold">
              {group.date}
            </h2>
            {group.chats.map((chat, chatIndex) => (
              <div
                key={chatIndex}
                className="flex justify-between items-center p-4 bg-white shadow rounded hover:shadow-md cursor-pointer"
                onClick={() => {
                  router.push(`/chat/${currentProject?.id}/${chat.title}`);
                }}
              >
                <div className="flex items-center space-x-2">
                  <IoChatbubblesOutline size={24} className="text-primary" />
                  <span className="text-darkCharcoal">{chat.title}</span>
                </div>
                <span className="text-charcoal">{chat.time}</span>
              </div>
            ))}
          </div>
        ))}
      {showCreateChatModal && <CreateChatModal cancelModal={cancelModal} />}
    </div>
  );
};

export default UserChats;
