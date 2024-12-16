"use client";
import React, { useState, useEffect } from "react";
import Overview from "./Overview";
import Summary from "./Summary";
import { PhaseItemOverviewProps } from "./Overview";
import { useAppSelector } from "@/lib/hooks";
import UserPersona from "@/components/UserPersona";
import { viewNames } from "@/components/Static";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";

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
  const router = useRouter();
  const [progress, setProgress] = useState<
    "completed" | "in-progress" | "not-started"
  >("not-started");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("phases use effect");
    const fetchChatMetadata = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`/api/chat/metadata/`, {
          projectId: curProjectId,
          chatName: chatName,
        });
        console.log(res.data);
        setProgress(
          res?.data?.chatMetadata?.completed
            ? "completed"
            : res?.data?.chatMetadata
            ? "in-progress"
            : "not-started"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchChatMetadata();
  }, [currentViewId, curProjectId]);

  return (
    <div className="flex flex-col text-darkCharcoal space-y-6 justify-content mx-4 lg:mx-20">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="flex items-center font-bold ml-2 xl:ml-0 text-3xl lg:text-4xl">
            {heading}
          </h1>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <Overview items={items} />
            {items.some((item) => item.special) && (
              <Overview items={items} specialTools />
            )}
          </div>
          <div className="flex items-center justify-center p-4">
            <button
              className="flex max-w-fit justify-between bg-primary items-center transition hover:bg-darkPrimary text-white font-bold py-3 px-6 lg:py-4 lg:px-8 rounded-lg relative"
              onClick={() => {
                router.push(`/chat/${curProjectId}/${chatName}`);
              }}
            >
              {progress === "not-started"
                ? "Begin Phase"
                : progress === "completed"
                ? "View Phase"
                : "Continue Phase"}
            </button>
          </div>
          <Summary />
          {currentViewId === viewNames.AUDIENCE_TARGETING && <UserPersona />}
        </>
      )}
    </div>
  );
};

export default Phases;
