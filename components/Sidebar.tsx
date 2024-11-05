"use client";
import ProjectDropdown from "./ProjectDropdown";
import React, { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import { IoChevronDownOutline } from "react-icons/io5";
import {
  phasesSectionItems,
  otherSectionItems,
  mainSectionItems,
} from "@/components/static";

import User from "./User";
import { useClickOutside } from "@/hooks/useClickOutside";
import CreateProjectModal from "./modal/CreateProjectModal";
import { toast } from "react-toastify";
import axios from "axios";

import {
  setCurrentProject,
  setProjects,
} from "@/lib/features/project/projectSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

type Sidebar = {
  user: any;
};
const Sidebar: React.FC<Sidebar> = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showCreateProjectModal, setShowCreateProjectModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const currentProject = useAppSelector((state) => {
    return state.project.currentProject;
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchAllProjects();
  }, [currentProject]);

  const fetchAllProjects = async () => {
    try {
      const response = await axios.get("/api/project/all");
      if (!currentProject?.name)
        dispatch(setCurrentProject(response?.data?.projects?.[0]));
      dispatch(setProjects(response?.data?.projects));
      console.log(response?.data?.projects);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch projects!");
    } finally {
      setLoading(false);
    }
  };

  const cancelModal = () => setShowCreateProjectModal(false);
  const openModal = () => setShowCreateProjectModal(true);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setShowDropdown(false));

  if (loading) return <div>Loading...</div>;

  return (
    <section className="w-[340px] min-h-screen h-full flex flex-col bg-ivory-100 shadow-md relative">
      <div className="p-4 flex justify-between">
        <h2 className="text-primary font-semibold text-xl">Makerhub</h2>
        <div className="flex items-center">
          <div className="flex items-center justify-center align w-6 h-6 rounded-full border border-2 text-primary font-bold text-sm">
            5
          </div>
        </div>
      </div>
      <div ref={dropdownRef}>
        <div
          className="px-2 rounded-md text-darkCharcoal font-medium bg-lightBg hover:bg-darkBg transition cursor-pointer h-10 mx-2 flex flex-row justify-between items-center"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span>{currentProject?.name}</span>
          <div className={`transition ${showDropdown ? "rotate-180" : ""}`}>
            {<IoChevronDownOutline />}
          </div>
        </div>
        <div className="absolute top-[6.5rem]">
          {showDropdown && (
            <ProjectDropdown
              openModal={openModal}
              setShowDropdown={setShowDropdown}
            />
          )}
        </div>
      </div>
      <div className="max-h-[42vw] overflow-y-auto">
        <Menu heading="Main" items={mainSectionItems} />
        <Menu heading="Phases" items={phasesSectionItems} />
        <Menu heading="Other" items={otherSectionItems} />
      </div>
      <User image={user?.image} name={user?.name} email={user?.email} />
      {showCreateProjectModal && (
        <CreateProjectModal cancelModal={cancelModal} />
      )}
    </section>
  );
};

export default Sidebar;
