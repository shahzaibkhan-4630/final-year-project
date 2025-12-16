"use client";
import React, { useContext, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Brain, Menu, X, User } from "lucide-react";
import { navLinks } from "../constants";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/auth/users/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        router.push("/");
      }
    } catch (error) {
      toast(error.response?.data?.message || "Something went wrong");
    }
  };

  const dashboardRoute = useMemo(() => {
    if (userData?.role === "employee") return "/applicant/dashboard";
    if (userData?.role === "employer") return "/company/dashboard";
  }, [userData?.role]);

  return (
    <>
      <nav className="px-4 py-6 border-b-2 border-white">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-1.5">
              <Brain className="w-8 h-8 text-[#DDDFFF]" />
              <span className="text-[#DDDFFF] font-dm-sans font-bold text-lg">
                TALENT FORGE
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:block">
            <ul className="flex gap-10">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={
                      pathname === link.href
                        ? "text-[#c3c4dc] font-dm-sans"
                        : "text-[#DDDFFF] font-dm-sans"
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Buttons */}
          <div>
            {!userData ? (
              <div className="hidden lg:flex gap-3">
                <Link href="/login">
                  <Button className="bg-[#DDDFFF] hover:bg-[#c3c4dc] text-black font-dm-sans font-extrabold px-8 rounded-md cursor-pointer">
                    LOGIN
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#DDDFFF] hover:bg-[#c3c4dc] text-black font-dm-sans font-extrabold px-8 rounded-md cursor-pointer">
                    SIGN UP
                  </Button>
                </Link>
              </div>
            ) : (
              // user profile
              <div className="hidden lg:flex relative group">
                <div className="flex items-center gap-4">
                  <p className="text-[#DDDFFF] font-dm-sans font-semibold">
                    Hi, {userData.username || userData.companyName}
                  </p>
                  <div className="w-12 h-12 rounded-full bg-[#DDDFFF] flex items-center justify-center cursor-pointer">
                    {userData.profileImage ? (
                      <img
                        src={userData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-6 h-6 text-black" />
                    )}
                  </div>
                </div>

                {/* Profile Modal */}
                <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                  {/* Profile Header */}
                  <div className="flex flex-col items-center pt-8 pb-4 px-6 border-b border-gray-900">
                    <div className="w-12 h-12 rounded-full bg-[#DDDFFF] flex items-center justify-center mb-4">
                      {userData.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-black" />
                      )}
                    </div>
                    <h3 className="text-black font-dm-sans font-bold text-xl mb-1.5">
                      {userData.username || userData.companyName}
                    </h3>
                    <p className="text-black font-dm-sans text-sm">
                      {userData.email || userData.companyEmail}
                    </p>
                  </div>

                  {/* Modal Buttons */}
                  <div className="p-6 space-y-2">
                    <Link href={dashboardRoute}>
                      <Button className="w-full bg-[#DDDFFF] hover:bg-[#c3c4dc] text-black font-dm-sans font-bold py-4 px-6 rounded-lg transition-colors duration-200 cursor-pointer mb-2.5">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      onClick={logout}
                      className="w-full bg-[#DDDFFF] hover:bg-[#c3c4dc] text-black font-dm-sans font-bold py-4 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-[#DDDFFF] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-black border-r-2 border-white transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between p-6 border-b-2 border-white">
            <Link href="/" className="flex items-center gap-1.5">
              <Brain className="w-8 h-8 text-[#DDDFFF]" />
              <span className="text-[#DDDFFF] font-dm-sans font-bold text-lg">
                TALENT FORGE
              </span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-[#DDDFFF] focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Mobile Links */}
          <ul className="flex flex-col gap-6 px-6 mt-6 pb-6 border-b-2 border-white">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className={
                    pathname === link.href
                      ? "text-[#DDDFFF] font-dm-sans text-lg"
                      : "text-[#DDDFFF] font-dm-sans text-lg"
                  }
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Buttons */}
          <div className="py-6 px-4">
            {!userData ? (
              <div className="flex flex-col gap-3 px-6 mt-8">
                <Link href="/login">
                  <Button className="bg-[#DDDFFF] hover:bg-[#DDDFFF] text-black font-dm-sans font-extrabold px-8 py-3 rounded-md cursor-pointer w-full">
                    LOGIN
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#DDDFFF] hover:bg-[#DDDFFF] text-black font-dm-sans font-extrabold px-8 py-3 rounded-md cursor-pointer w-full">
                    SIGN UP
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4 cursor-pointer">
                  <p className="text-[#DDDFFF] font-dm-sans text-lg">
                    {userData.username || userData.companyName}
                  </p>
                  <div
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-12 h-12 rounded-full bg-[#DDDFFF] flex items-center justify-center cursor-pointer"
                  >
                    {userData.profileImage ? (
                      <img
                        src={userData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-black" />
                    )}
                  </div>
                </div>
                {/* Profile Modal when profileOpen is true */}
                {profileOpen && (
                  <div className="p-4 bg-white rounded-md border ">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#DDDFFF] flex items-center justify-center cursor-pointer">
                        {userData.profileImage ? (
                          <img
                            src={userData.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-black" />
                        )}
                      </div>
                      <p className="text-black font-dm-sans">
                        {userData.email || userData.companyEmail}
                      </p>
                      <div className="w-full h-[3px] bg-black rounded" />
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <Link href={dashboardRoute}>
                        <Button className="w-full bg-[#DDDFFF] hover:bg-[#c3c4dc] text-black font-dm-sans font-bold py-4 px-6 rounded-lg transition-colors duration-200 cursor-pointer">
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        onClick={logout}
                        className="w-full bg-[#DDDFFF] hover:bg-[#c3c4dc] text-black font-dm-sans font-bold py-4 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
