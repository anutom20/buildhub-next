"use client";
import ProjectDropdown from "./ProjectDropdown";
import React, { useRef, useState } from "react";
import Menu from "./Menu";
import { IoChevronDownOutline } from "react-icons/io5";
import {
  phasesSectionItems,
  otherSectionItems,
  mainSectionItems,
} from "@/components/Static";

import User from "./User";
import { useClickOutside } from "@/hooks/useClickOutside";
import CreateProjectModal from "./modal/CreateProjectModal";
import { IoIosCloseCircleOutline } from "react-icons/io";
import DeleteProjectModal from "./modal/DeleteProjectModal";

type Sidebar = {
  user: any;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
};
import { useAppSelector } from "@/lib/hooks";

const Sidebar: React.FC<Sidebar> = ({ user, showSidebar, setShowSidebar }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showCreateProjectModal, setShowCreateProjectModal] =
    useState<boolean>(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] =
    useState<boolean>(false);

  const currentProject = useAppSelector((state) => {
    return state.project.currentProject;
  });

  const cancelModal = () => setShowCreateProjectModal(false);
  const cancelDeleteModal = () => setShowDeleteProjectModal(false);
  const openModal = () => setShowCreateProjectModal(true);
  const openDeleteModal = () => setShowDeleteProjectModal(true);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setShowDropdown(false));

  return (
    <section
      className={`w-[340px] ${
        showSidebar ? "block" : "hidden"
      } xl:block min-h-screen h-[100vh] overflow-y-auto flex flex-col bg-[#f9f9f9] shadow-md relative`}
    >
      <div className="p-4 flex justify-between">
        <h2 className="text-primary font-semibold text-xl">Makerhub</h2>
        <div
          className="absolute top-4 right-4 cursor-pointer block xl:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <IoIosCloseCircleOutline
            size={24}
            className="text-darkCharcoal font-bold"
          />
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
              openDeleteModal={openDeleteModal}
              setShowDropdown={setShowDropdown}
            />
          )}
        </div>
      </div>
      <div>
        <Menu heading="Main" items={mainSectionItems} />
        <Menu heading="Phases" items={phasesSectionItems} />
        <div className="mb-4 mt-4">
          <User image={user?.image} name={user?.name} email={user?.email} />
        </div>
      </div>
      {showCreateProjectModal && (
        <CreateProjectModal cancelModal={cancelModal} />
      )}
      {showDeleteProjectModal && (
        <DeleteProjectModal
          cancelModal={cancelDeleteModal}
          projectId={currentProject?.id}
          projectName={currentProject?.name}
        />
      )}
    </section>
  );
};

export default Sidebar;
