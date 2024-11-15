import React, { ReactNode } from "react";
import { FaLightbulb, FaTools } from "react-icons/fa";

export interface PhaseItemOverviewProps {
  icon: ReactNode;
  heading: string;
  desc: string;
  special: boolean;
}

const Overview = ({
  items,
  specialTools = false,
}: {
  items: PhaseItemOverviewProps[];
  specialTools?: boolean;
}) => {
  return (
    <div className="px-6 py-8 max-w-md flex flex-col space-y-6 bg-gray-50 shadow-md rounded-xl justify-content">
      <div className="flex gap-2 items-center">
        <span className="text-primary">
          {specialTools ? <FaTools size={28} /> : <FaLightbulb size={28} />}
        </span>
        <h3 className="text-2xl font-medium">
          {specialTools ? "Special Tools" : "What to expect"}
        </h3>
      </div>
      <div className="flex flex-col space-y-4">
        {items
          .filter(
            (item) =>
              (item.special && specialTools) || (!item.special && !specialTools)
          )
          .map((item, index) => {
            return (
              <Points
                key={index}
                heading={item.heading}
                description={item.desc}
                icon={item.icon}
              />
            );
          })}
      </div>
    </div>
  );
};

const Points = ({
  heading,
  description,
  icon,
}: {
  heading: string;
  description: string;
  icon: ReactNode;
}) => {
  return (
    <div className="flex space-x-4 items-center">
      <div className="flex items-center justify-center rounded-lg w-12 h-12 min-w-12 min-h-12 border border-1 border-gray-300">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-medium">{heading}</span>
        <span className="text-sm">{description}</span>
      </div>
    </div>
  );
};

export default Overview;
export { Points };
