"use client";

import React from "react";

const NavbarAnchor = ({ href, text }: { href: string; text: string }) => {
  return (
    <a
      href={href}
      className="hover:text-primary text-md"
      onClick={(e) => {
        e.preventDefault();
        document?.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {text}
    </a>
  );
};

export default NavbarAnchor;
