"use client";
import Sidebar from "@/components/Sidebar";
import MainSection from "@/components/MainSection";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  setCurrentProject,
  setProjects,
} from "@/lib/features/project/projectSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Spinner from "@/components/Spinner";
import { HiMenu } from "react-icons/hi";

const Main = ({ user }: { user: any }) => {
  const [loading, setLoading] = useState(true);
  const [showCreateChatModal, setShowCreateChatModal] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();

  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  const [showSidebar, setShowSidebar] = useState(false);
  const fetchAllProjects = async () => {
    try {
      const response = await axios.get("/api/project/all");
      if (!response?.data?.projects?.[0]) {
      }
      if (!currentProject?.id)
        dispatch(setCurrentProject(response?.data?.projects?.[0]));
      dispatch(setProjects(response?.data?.projects));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, [currentProject?.id, currentProject?.name]);

  if (loading) return <Spinner />;

  return (
    <main className="h-full flex flex-row border-l border-gray-300 relative">
      <div
        className={`xl:hidden flex items-center cursor-pointer mb-4 absolute top-4 left-4 ${
          showSidebar ? "hidden" : "block"
        }`}
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <HiMenu size={24} className="text-darkCharcoal font-bold" />
      </div>
      <div className="absolute xl:static top-0 left-0">
        <Sidebar
          user={user}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          showCreateChatModal={showCreateChatModal}
        />
      </div>
      <MainSection
        userName={user?.name}
        showCreateChatModal={showCreateChatModal}
        setShowCreateChatModal={setShowCreateChatModal}
      />
    </main>
  );
};

export default Main;
