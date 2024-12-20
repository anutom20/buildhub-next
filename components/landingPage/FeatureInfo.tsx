import React from "react";

const FeatureInfo = ({
  header,
  title,
  description,
  selected,
}: {
  header: string;
  title: string;
  description: string;
  selected: boolean;
}) => {
  return (
    <div className={`bg-transparent p-6`}>
      <span
        className={`text-xs font-semibold mr-2 px-3 py-1 rounded-xl ${
          !selected ? "bg-gray-500 text-white" : "bg-gray-700 text-white"
        }`}
      >
        {header}
      </span>
      <h2
        className={`text-3xl font-bold mt-2 ${
          !selected ? "text-gray-500" : "text-darkCharcoal"
        }`}
      >
        {title}
      </h2>
      <p className={`mt-2 ${!selected ? "text-gray-500" : "text-gray-700"}`}>
        {description}
      </p>
    </div>
  );
};

export default FeatureInfo;
