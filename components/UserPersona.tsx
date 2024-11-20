import Image from "next/image";
import React, { useEffect, useState } from "react";
import UserPersonaImage from "../public/images/persona_placeholder.png";
import { FaUser } from "react-icons/fa6";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";

interface UserPersonaProps {
  quote: string;
  age: string;
  occupation: string;
  tags: string;
  socials: string;
  about: string;
  problem: string;
  goals: string;
}

const UserPersona: React.FC = () => {
  const [personaPresent, setPersonaPresent] = useState<boolean>(false);
  const [userPersona, setUserPersona] = useState<UserPersonaProps>({
    quote: "",
    age: "",
    occupation: "",
    tags: "",
    socials: "",
    about: "",
    problem: "",
    goals: "",
  });

  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  console.log(personaPresent);

  useEffect(() => {
    if (currentProject?.id) fetchUserPersona(currentProject?.id);
  }, [currentProject?.id]);

  const fetchUserPersona = async (projectId: string) => {
    try {
      const response = await axios.get(`/api/persona?projectId=${projectId}`);
      console.log(response?.data);
      if (response?.data?.userPersona) {
        setUserPersona(response?.data?.userPersona);
        setPersonaPresent(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
            alt="John Doe"
            className="w-full h-full object-cover"
          />
        </div>
        <blockquote className="italic text-center text-gray-700 mb-6">
          {userPersona.quote}
        </blockquote>
        <div className="text-center text-gray-800">
          <p className="font-bold">Age</p>
          <p>{userPersona.age}</p>
          <p className="font-bold mt-4">Occupation</p>
          <p>{userPersona.occupation}</p>
        </div>
        <div className="flex flex-wrap justify-center mt-4">
          {userPersona.tags?.split(",").map((tag, index) => {
            return (
              <span
                key={index}
                className="px-3 py-1 bg-lightPrimary text-white rounded-full text-sm m-1"
              >
                {tag}
              </span>
            );
          })}
        </div>
        <div className="mt-6 f">
          <p className="font-bold">Where you'll find John Doe</p>
          <ul className="list-disc list-inside text-gray-600 flex flex-col justify-start">
            {userPersona.socials?.split(",").map((social, index) => {
              return <li key={index}>{social}</li>;
            })}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6 bg-gray-50 rounded-r-lg">
        <h2 className="text-2xl font-bold text-primary">USER PERSONA</h2>
        <h3 className="text-xl font-bold mt-4">John Doe</h3>
        <div className="mt-6">
          <h4 className="text-lg font-bold">About</h4>
          <p className="text-gray-700 mt-2">{userPersona?.about}</p>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-bold">Problem</h4>
          <p className="text-gray-700 mt-2">{userPersona?.problem}</p>
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-bold">Goals</h4>
          <ul className="list-disc list-inside text-gray-700">
            {userPersona.goals?.split(",").map((goal, index) => {
              return <li key={index}>{goal}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserPersona;
