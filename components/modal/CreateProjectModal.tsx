"use client";
import axios from "axios";
import React, { SetStateAction, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import {
  setCurrentProject,
  setProjects,
} from "@/lib/features/project/projectSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

type CreateProjectModal = {
  cancelModal: () => void;
};

const CreateProjectModal: React.FC<CreateProjectModal> = ({ cancelModal }) => {
  const [projectName, setProjectName] = useState<string>("");

  const projects = useAppSelector((state) => state.project.projects);

  const dispatch = useAppDispatch();

  const createNewProject = async () => {
    let toastId;
    try {
      const requestBody = { name: projectName };
      cancelModal();
      toastId = toast.info("🦄 creating new project!");
      const response = await axios.post("/api/project", requestBody);
      toast.dismiss(toastId);
      toast.success("New Project Created!");
      dispatch(
        setProjects([
          ...projects,
          { name: projectName, id: response?.data?.createdProject?.id },
        ])
      );
      dispatch(
        setCurrentProject({
          name: projectName,
          id: response?.data?.createdProject?.id,
        })
      );
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response.data.message ?? "error");
      console.log(err);
    }
  };

  return (
    <section className="z-30 bg-opacity-50 bg-black backdrop-blur-sm fixed w-full h-full inset-0 flex justify-center items-center">
      <div className="bg-background shadow-lg p-8 rounded-lg pr-12 flex flex-col w-fit space-y-3 relative">
        <h1 className="font-bold text-2xl">Create a new project</h1>

        <div className="flex flex-col justify-center space-y-3">
          <span className="text-md">
            What would you like to name your project ?
          </span>
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Type here..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <div className="flex items-center justify-end gap-4">
            <button
              className="bg-darkBg hover:bg-hoverBg rounded-md px-4 py-2"
              onClick={cancelModal}
            >
              Cancel
            </button>
            <button
              className="bg-primary rounded-md px-4 py-2  hover:bg-darkPrimary text-white"
              onClick={createNewProject}
            >
              Create
            </button>
          </div>
        </div>
        <div
          className="absolute right-2 top-0 cursor-pointer"
          onClick={cancelModal}
        >
          <RxCross2 size={16} />
        </div>
      </div>
    </section>
  );
};

export default CreateProjectModal;
