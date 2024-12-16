"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { IoChevronDownOutline } from "react-icons/io5";
import UserDropdown from "./UserDropdown";
import { useClickOutside } from "@/hooks/useClickOutside";

type User = {
  image: string;
  name: string;
  email: string;
};
const User: React.FC<User> = ({ image, name, email }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setShowDropdown(false));
  return (
    <div
      className="flex flex-start shadow-md cursor-pointer items-center hover:shadow-xl rounded-lg bg-lightBg px-2 py-4 h-16 mx-4 mb-2 relative"
      onClick={() => setShowDropdown(!showDropdown)}
      ref={dropdownRef}
    >
      <Image
        src={image}
        className="rounded-full object-cover"
        height={32}
        width={32}
        alt="User image"
      />
      <div className="flex flex-col ml-4">
        <span className="text-md font-semibold">{name?.split(" ")[0]}</span>
        <span className="text-xs text-gray-400">{email}</span>
      </div>
      <div className="absolute top-2 right-2 text-gray-400">
        <IoChevronDownOutline size={12} />
      </div>
      {showDropdown && (
        <div className="absolute -top-20">
          <UserDropdown />
        </div>
      )}
    </div>
  );
};

export default User;
