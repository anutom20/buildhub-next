import Image from "next/image";
import React from "react";
import UserPersonaImage from "../public/images/persona_placeholder.png";
import { FaUser } from "react-icons/fa6";

const UserPersona: React.FC = () => {
  const personaPresent = true;

  if (!personaPresent) {
    return (
      <div className="shadow-lg rounded-xl flex flex-col p-6 space-y-3 bg-gray-50 w-full">
        <div className="flex gap-2 items-center">
          <div className="text-primary">
            <FaUser size={24} />
          </div>
          <h1 className="text-2xl font-medium">User Persona</h1>
        </div>
        <p className="text-md">
          <i>Your user Persona will appear here after completion.</i>
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-row bg-[#faf7fd] shadow-md rounded-lg shadow-lg w-full mx-auto relative">
      {/* Sidebar */}
      <div className="w-1/3 flex flex-col items-center p-6 rounded-l-lg">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
          <Image
            src={UserPersonaImage}
            alt="Sarah Mitchell"
            className="w-full h-full object-cover"
          />
        </div>
        <blockquote className="italic text-center text-gray-700 mb-6">
          "I'm tired of being sold the latest diet fad. I just want
          straightforward facts about what actually works."
        </blockquote>
        <div className="text-center text-gray-800">
          <p className="font-bold">Age</p>
          <p>38</p>
          <p className="font-bold mt-4">Occupation</p>
          <p>Marketing Project Manager</p>
        </div>
        <div className="flex flex-wrap justify-center mt-4">
          <span className="px-3 py-1 bg-lightPrimary text-white rounded-full text-sm m-1">
            Health-conscious
          </span>
          <span className="px-3 py-1 bg-lightPrimary text-white rounded-full text-sm m-1">
            Tech-savvy
          </span>
          <span className="px-3 py-1 bg-lightPrimary text-white rounded-full text-sm m-1">
            Analytical
          </span>
        </div>
        <div className="mt-6 f">
          <p className="font-bold">Where you'll find Sarah Mitchell</p>
          <ul className="list-disc list-inside text-gray-600 flex flex-col justify-start">
            <li>Instagram fitness communities</li>
            <li>Facebook health groups</li>
            <li>YouTube wellness channels</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6 bg-gray-50 rounded-r-lg">
        <h2 className="text-2xl font-bold text-primary">USER PERSONA</h2>
        <h3 className="text-xl font-bold mt-4">Sarah Mitchell</h3>
        <div className="mt-6">
          <h4 className="text-lg font-bold">About</h4>
          <p className="text-gray-700 mt-2">
            Sarah is a busy professional who faces conflicting diet advice
            online, impacting her health and appearance. She’s overwhelmed by
            the stream of new diet trends and is looking for a reliable way to
            navigate the health space.
          </p>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-bold">Problem</h4>
          <p className="text-gray-700 mt-2">
            Cannot distinguish between reliable diet information and marketing
            trends on social media.
          </p>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-bold">Goals</h4>
          <ul className="list-disc list-inside text-gray-700">
            <li>Achieve sustainable weight management</li>
            <li>Improve overall fitness</li>
            <li>Find trustworthy nutrition advice</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserPersona;
