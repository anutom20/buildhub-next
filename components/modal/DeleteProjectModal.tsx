"use client";
import axios from "axios";
import React from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { setCurrentProject } from "@/lib/features/project/projectSlice";
import { useAppDispatch } from "@/lib/hooks";

type DeleteProjectModal = {
  cancelModal: () => void;
  projectName: string;
  projectId: string;
};

const DeleteProjectModal: React.FC<DeleteProjectModal> = ({
  cancelModal,
  projectName,
  projectId,
}) => {
  const dispatch = useAppDispatch();

  const deleteSingleProject = async (projectId: string) => {
    let toastId;
    try {
      toastId = toast.info(`deleting the project ${projectName}`);
      cancelModal();
      await axios.delete(`/api/project/delete?projectId=${projectId}`);
      toast.dismiss(toastId);
      toast.success(`${projectName} project deleted successfully`);
      dispatch(setCurrentProject({ name: "", id: "" }));
    } catch (err) {
      console.log(err);
      toast.dismiss(toastId);
      toast.error("Failed to delete the project");
    }
  };

  return (
    <section className="z-30 bg-opacity-50 bg-black backdrop-blur-sm fixed w-full h-full inset-0 flex justify-center items-center">
      <div className="bg-background shadow-lg p-8 rounded-lg pr-12 flex flex-col w-fit space-y-3 relative">
        <h1 className="font-bold text-2xl">Delete Project</h1>

        <div className="flex flex-col justify-center space-y-3">
          <span className="text-md">
            Do you really want to delete {`"${projectName}"`} project ?
          </span>
          <div className="flex items-center justify-end gap-4">
            <button
              className="bg-darkBg hover:bg-hoverBg rounded-md px-4 py-2"
              onClick={cancelModal}
            >
              Cancel
            </button>
            <button
              className="bg-primary rounded-md px-4 py-2  hover:bg-darkPrimary text-white"
              onClick={() => deleteSingleProject(projectId)}
            >
              Delete
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

export default DeleteProjectModal;
