"use client";
import axios from "axios";
import React, { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setCurrentProject } from "@/lib/features/project/projectSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

type ProjectDropdown = {
  openModal: () => void;
  setShowDropdown: React.Dispatch<SetStateAction<boolean>>;
};

const ProjectDropdown: React.FC<ProjectDropdown> = ({
  openModal,
  setShowDropdown,
}) => {
  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );
  const projects = useAppSelector((state) => state.project.projects);
  const dispatch = useAppDispatch();
  return (
    <section className="bg-darkBg rounded-lg shadow-lg p-2 mx-2 h-max z-10 relative">
      <button
        className="px-2 py-1 border-none text-primary hover:bg-hoverBg rounded-md w-full text-left"
        onClick={openModal}
      >
        Create new project
      </button>

      <hr className="border-gray-500 mt-1" />

      <div>
        {projects?.length > 1 && (
          <div>
            <h1 className="text-sm px-2 py-1 text-charcoal font-semibold">
              Projects
            </h1>

            {projects.map((item, index) => {
              return (
                <div
                  className="px-2 py-1 text-md cursor-pointer rounded-md hover:bg-hoverBg border-none"
                  onClick={() => {
                    dispatch(setCurrentProject(item));
                    setShowDropdown(false);
                  }}
                >
                  <span className="border-none">{item.name}</span>
                </div>
              );
            })}
            <hr className="border-gray-500 mt-1" />
          </div>
        )}
        <h1 className="text-sm px-2 py-1 text-charcoal font-semibold">
          {currentProject?.name}
        </h1>

        <button className="px-2 py-1 hover:bg-hoverBg border-none w-full rounded-md text-left">
          Invite Collaborator
        </button>
        <button className="px-2 py-1 hover:bg-hoverBg border-none w-full rounded-md text-left">
          Manage Access
        </button>
        <button className="px-2 py-1 hover:bg-hoverBg border-none w-full rounded-md text-left">
          Rename Project
        </button>
        <button className="px-2 py-1 hover:bg-hoverBg border-none w-full rounded-md text-left text-red-500">
          Delete Project
        </button>
      </div>
    </section>
  );
};

export default ProjectDropdown;
