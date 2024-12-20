import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setChatMetadata } from "@/lib/features/chat/chatSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Router from "next/router";
import React, { useState } from "react";

const CreateChatModal: React.FC<{
  cancelModal: () => void;
  initialPrompt?: string | null;
}> = ({ cancelModal, initialPrompt = null }) => {
  const [name, setName] = useState("");
  const [useMemory, setUseMemory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );
  const dispatch = useAppDispatch();

  console.log("inside create chat modal");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(" ")) {
      setError("Name cannot contain spaces.");
    } else {
      setError(null);
    }
    setName(value);
  };

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
      <div className="bg-background p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create new chat</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-primary ring-1 ring-primary"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex items-center mb-4 accent-primary">
          <input
            type="checkbox"
            checked={useMemory}
            onChange={(e) => setUseMemory(e.target.checked)}
            className="mr-2"
          />
          <label>Use project memory</label>
        </div>
        <div className="flex justify-end">
          <button
            onClick={cancelModal}
            className="bg-gray-200 text-black py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!error) {
                window.location.href = `/chat/${
                  currentProject?.id
                }/${name}/${useMemory}?initialPrompt=${initialPrompt ?? ""}`;
                cancelModal();
                dispatch(setChatMetadata({ chatId: "", chatName: "" }));
              }
            }}
            className={`bg-primary hover:bg-darkPrimary text-white py-2 px-4 rounded ${
              error ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!!error}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
