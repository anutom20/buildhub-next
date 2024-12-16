"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCurrentViewId } from "@/lib/features/general/generalSlice";
import axios from "axios";
import { FaCheck } from "react-icons/fa6";

type MenuItem = {
  icon: ReactNode;
  text: string;
  type: string;
  number: number;
  name: string;
};

const MenuItem: React.FC<MenuItem> = ({ icon, text, type, number, name }) => {
  const currentViewId = useAppSelector((state) => state.general.currentViewId);
  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );
  const dispatch = useAppDispatch();

  const [progress, setProgress] = useState<
    "completed" | "in-progress" | "not-started"
  >("not-started");

  console.log(currentViewId, progress);

  useEffect(() => {
    const fetchChatMetadata = async () => {
      const res = await axios.post(`/api/chat/metadata/`, {
        projectId: currentProject?.id,
        chatName: name,
      });
      console.log(res.data);
      setProgress(
        res?.data?.chatMetadata?.completed
          ? "completed"
          : res?.data?.chatMetadata
          ? "in-progress"
          : "not-started"
      );
    };
    fetchChatMetadata();
  }, [currentViewId, currentProject?.id]);
  return (
    <div
      id={name}
      onClick={() => dispatch(setCurrentViewId(name))}
      className={`${
        currentViewId === name
          ? "bg-veryLightPrimary"
          : "hover:bg-veryLightPrimary"
      } cursor-pointer flex justify-between px-2 py-1 relative rounded-md active:bg-red-500 transition w-full`}
    >
      <a className="flex justify-content items-center gap-2">
        <span>{icon}</span>
        <span>{text}</span>
      </a>
      {type === "Phases" && (
        <div className="flex items-center">
          <div
            className={`flex items-center text-center justify-center align w-4 h-4 rounded-full text-white text-[10px] ${
              progress === "in-progress" || progress === "completed"
                ? "bg-lightPrimary"
                : "bg-numbersBg"
            }`}
          >
            {progress === "completed" ? <FaCheck /> : number}
          </div>
        </div>
      )}
      {type === "Phases" && text !== "Post-launch actions" && (
        <div className=" w-px absolute top-[20px] bottom-[10px] right-[17px] text-gray-400">
          |
        </div>
      )}
    </div>
  );
};

export default MenuItem;
