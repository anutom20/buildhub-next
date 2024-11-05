import { setChatSummary } from "@/lib/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import Markdown from "react-markdown";

const Summary = () => {
  const summary = useAppSelector((state) => state.chat.summary);
  const currentViewId = useAppSelector((state) => state.general.currentViewId);
  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getChatSummary();
  }, [currentViewId, currentProject?.id]);

  const getChatSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/chat/summary?chatName=${currentViewId}&projectId=${currentProject?.id}`
      );
      dispatch(setChatSummary(response?.data?.summary?.summary));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="shadow-lg rounded-xl flex flex-col p-6 space-y-3 bg-lightBg w-full">
      <div className="flex gap-2 items-center">
        <div className="text-primary">
          <CgNotes size={24} />
        </div>
        <h1 className="text-2xl font-medium">Summary</h1>
      </div>
      <p className="text-md">
        {loading ? (
          <i>Loading...</i>
        ) : summary ? (
          <Markdown>{summary}</Markdown>
        ) : (
          <i>The summary for this phase will appear here.</i>
        )}
      </p>
    </div>
  );
};

export default Summary;
