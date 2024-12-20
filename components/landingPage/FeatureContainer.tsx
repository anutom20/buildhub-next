"use client";

import { useState } from "react";
import FeatureInfo from "./FeatureInfo";
import Image from "next/image";
import ChatImage from "@/public/images/chat.png";
import PersonaImage from "@/public/images/persona.png";
import phasesImage from "@/public/images/phases.png";
const FeatureContainer = () => {
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  return (
    <div className="flex row gap-4 w-3/4 mx-auto mt-6">
      <div className="flex flex-col gap-44 w-full">
        {[
          {
            header: "Intelligence",
            title: "Intelligent AI following a proven process",
            description:
              "The Makerhub AI has been designed to build successful products through a proven process.",
            image: ChatImage,
          },
          {
            header: "Persona",
            title: "Understanding Your Ideal Customer",
            description:
              "Makerhub AI helps you create detailed user personas to better understand and target your ideal customers, ensuring your product meets their needs and preferences.",
            image: PersonaImage,
          },
          {
            header: "Phases",
            title: "Step-by-Step Product Development",
            description:
              "Makerhub AI guides you through different phases of product development, from ideation to launch, ensuring each step is executed flawlessly.",
            image: phasesImage,
          },
        ].map((feature, index) => (
          <div
            className="w-full flex flex-row justify-between"
            key={index}
            onMouseEnter={() => setSelectedFeatureIndex(index)}
          >
            <FeatureInfo
              header={feature.header}
              title={feature.title}
              description={feature.description}
              selected={selectedFeatureIndex === index}
            />
            <div className="hidden lg:block bg-white p-2 rounded-xl shadow-md h-fit">
              <Image
                src={feature.image}
                width={index === 2 ? 400 : 1000}
                height={index === 2 ? 400 : 1000}
                alt="Feature"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureContainer;
