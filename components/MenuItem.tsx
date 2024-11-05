"use client";
import React, { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCurrentViewId } from "@/lib/features/general/generalSlice";

type MenuItem = {
  icon: ReactNode;
  text: string;
  type: string;
  number: number;
  name: string;
};

const MenuItem: React.FC<MenuItem> = ({ icon, text, type, number, name }) => {
  const currentViewId = useAppSelector((state) => state.general.currentViewId);
  const dispatch = useAppDispatch();
  return (
    <div
      id={name}
      onClick={() => dispatch(setCurrentViewId(name))}
      className={`${
        currentViewId === name
          ? "bg-primary text-white"
          : "hover:bg-veryLightPrimary"
      } cursor-pointer flex justify-between px-2 py-1 relative rounded-md active:bg-red-500 transition w-full`}
    >
      <a href="#" className="flex justify-content items-center gap-2">
        <span>{icon}</span>
        <span>{text}</span>
      </a>
      {type === "Phases" && (
        <div className="flex items-center">
          <div className="flex items-center text-center justify-center align w-4 h-4 rounded-full bg-numbersBg text-white text-[10px]">
            {number}
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
