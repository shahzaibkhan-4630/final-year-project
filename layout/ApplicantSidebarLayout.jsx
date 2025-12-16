"use client";
import { ApplicantNavItems } from "@/constants";
import { AppContext } from "@/context/AppContext";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

const ApplicantSidebarLayout = ({ children }) => {
  const { userData } = useContext(AppContext);
  const router = useRouter();
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const [MobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block bg-[#27282F] border-r-2 border-white shadow-md transition-all duration-300 ${
            SidebarOpen ? "w-72" : "w-18"
          } p-4`}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div
                className={`flex items-center ${
                  SidebarOpen ? "justify-between" : "justify-center"
                }`}
              >
                {SidebarOpen && (
                  <h1 className="text-lg font-semibold font-[Poppins] text-white">
                    {userData.username}
                  </h1>
                )}
                <button
                  className="cursor-pointer"
                  onClick={() => setSidebarOpen(!SidebarOpen)}
                >
                  {SidebarOpen ? (
                    <X className="text-white" />
                  ) : (
                    <Menu className="text-white" />
                  )}
                </button>
              </div>

              <ul className="mt-7 space-y-2">
                {ApplicantNavItems.map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded-md w-full text-left font-[Poppins] ${
                      pathname === item.href
                        ? "bg-[#CAC5FE] text-black"
                        : "hover:bg-[#CAC5FE] text-white hover:text-black transition-all duration-200"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 relative group"
                    >
                      {/* Normal label (when sidebar is open) */}
                      <item.icon />
                      {SidebarOpen && (
                        <span className="text-[15px]">{item.label}</span>
                      )}

                      {/* Tooltip (when sidebar is closed) */}
                      {!SidebarOpen && (
                        <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded bg-[#CAC5FE] text-black opacity-0 group-hover:opacity-100 whitespace-nowrap text-[15px] z-50">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t">
              <Link
                href="/"
                className="flex items-center justify-between space-x-2 p-2 rounded-md text-white hover:bg-[#CAC5FE] hover:text-black w-full text-left cursor-pointer transition-all duration-200"
              >
                {SidebarOpen && (
                  <span className="text-[17px]">{userData.username}</span>
                )}
                <LogOut />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-grid-pattern p-4 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Top Navbar */}

      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#27282F] shadow-md flex justify-between items-center p-4 h-16 z-20">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="text-white"
        >
          <Menu size={24} />
        </button>
        <span className="text-lg font-medium text-white">
          {userData.username}
        </span>
      </div>

      {/* Mobile Sidebar */}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#27282F] overflow-y-auto shadow-md transform transition-transform duration-300 ${
          MobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full justify-between p-4">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-medium text-white">
                {userData.username}
              </h1>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="text-white" />
              </button>
            </div>

            <ul className="mt-7 space-y-5">
              {ApplicantNavItems.map((item, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-2 p-2 rounded-md w-full text-left font-[Poppins] ${
                    pathname === item.href
                      ? "bg-[#CAC5FE] text-black"
                      : "hover:bg-[#CAC5FE] hover:text-black text-white transition-all duration-200"
                  }`}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2"
                  >
                    <item.icon />
                    <span className="text-[15px]">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/"
              className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-gray-200 hover:text-black w-full text-left cursor-pointer"
            >
              <span className="text-[17px] text-white">
                {userData.username}
              </span>
              <LogOut className="text-white" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantSidebarLayout;
