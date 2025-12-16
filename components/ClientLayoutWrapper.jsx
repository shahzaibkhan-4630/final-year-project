"use client";
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "./ui/sonner";
import { AppContextProvider } from "@/context/AppContext";

const ClientLayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const hiddenRoutes = ["/company", "/applicant"];
  const hideLayout = hiddenRoutes.some((route) => pathname.startsWith(route));
  return (
    <>
      <AppContextProvider>
        {!hideLayout && <Navbar />}
        {children}
        <Toaster />
        {!hideLayout && <Footer />}
      </AppContextProvider>
    </>
  );
};

export default ClientLayoutWrapper;
