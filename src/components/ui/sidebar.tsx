"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Columns2, Cross, X } from "lucide-react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-row justify-between text-lg font-semibold border-b border-gray-700">
          <div>Navigation</div>
        </div>
        <ul className="mt-4 space-y-2 px-4">
          <li>
            <Link
              href="/people"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Users
            </Link>
          </li>
          <li>
            <Link href="/event" className="block p-2 rounded hover:bg-gray-700">
              Event
            </Link>
          </li>
          <li>
            <Link
              href="/donation"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Donation
            </Link>
          </li>
          <li>
            <Link
              href="/survey"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Survey
            </Link>
          </li>
          <li>
            <Link
              href="/response"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Response
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
