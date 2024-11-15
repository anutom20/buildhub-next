"use client";
import React from "react";
import Overview from "./Overview";
import Summary from "./Summary";
import { PhaseItemOverviewProps } from "./Overview";
import { useAppSelector } from "@/lib/hooks";
import UserPersona from "@/components/UserPersona";
import { viewNames } from "@/components/Static";

const Phases = ({
  heading,
  items,
  chatName,
  curProjectId,
}: {
  heading: string;
  chatName: string;
  items: PhaseItemOverviewProps[];
  curProjectId: string;
}) => {
  const currentViewId = useAppSelector((state) => state.general.currentViewId);
  return (
    <div className="flex flex-col text-darkCharcoal space-y-6 justify-content mx-20">
      <h1 className="flex items-center font-bold text-4xl">{heading}</h1>
      <div className="flex flex-row gap-8">
        <Overview items={items} />
        {items.some((item) => item.special) && (
          <Overview items={items} specialTools />
        )}
      </div>
      <div className="flex items-center justify-center p-4">
        <button
          className="flex max-w-fit justify-between bg-primary items-center transition hover:bg-darkPrimary text-white font-bold py-4 px-8 rounded-lg relative"
          onClick={() => {
            window.location.href = `/chat/${curProjectId}/${chatName}`;
          }}
        >
          View Phase
        </button>
      </div>
      <Summary />
      {currentViewId === viewNames.AUDIENCE_TARGETING && <UserPersona />}
    </div>
  );
};

export default Phases;
