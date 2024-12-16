import React, { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useAppSelector } from "@/lib/hooks";
import Spinner from "./Spinner";

const CentralContextBank = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/contextBank?projectId=${currentProject?.id}`
        );
        setSummary(response.data.centralContextBank);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [currentProject?.id]);

  if (loading) return <Spinner />;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Central Context Bank</h1>
      {loading ? (
        <p>Loading...</p>
      ) : summary ? (
        <Markdown className="markdown">{summary}</Markdown>
      ) : (
        <p>No summary available.</p>
      )}
    </div>
  );
};

export default CentralContextBank;
