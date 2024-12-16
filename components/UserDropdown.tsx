"use client";
import React from "react";

const UserDropdown = () => {
  return (
    <section className="bg-white rounded-md shadow-lg p-2 mx-2 h-max z-10 relative">
      <span className="px-2 py-2 border-none text-sm text-gray-400 rounded-md w-full text-left">
        anuragkt20@gmail.com
      </span>

      <button
        type="submit"
        onClick={async () => {
          await fetch("/api/auth/logout", {
            method: "POST",
          });
          window.location.href = "/";
        }}
        className="px-2 py-2 border-none text-sm  hover:bg-gray-100 rounded-md w-full text-left"
      >
        Logout
      </button>
    </section>
  );
};

export default UserDropdown;
