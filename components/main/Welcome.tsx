import React from "react";
import { FaSun } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

const Welcome = () => {
  return (
    <div className="bg-white max-w-md shadow-lg flex flex-col text-darkCharcoal rounded-lg justify-content p-8 space-y-4">
      <div className="flex space-x-2 items-center">
        <h1 className="text-3xl font-bold">Good Morning , Anurag</h1>
        <div className="text-darkYellow">
          <FaSun size={28} />
        </div>
      </div>
      <h2 className="font-semibold text-xl">
        The next phase for <span className="text-primary">first project</span>{" "}
        is:
      </h2>
      <button className="flex max-w-fit justify-between bg-primary items-center transition hover:bg-darkPrimary text-white font-bold py-2 px-4 rounded-lg relative">
        Solution Ideation{" "}
        <div className="ml-2">
          <FaArrowRight />
        </div>
      </button>
    </div>
  );
};

export default Welcome;
