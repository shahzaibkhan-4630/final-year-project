"use client";
import { Toaster } from "@/components/ui/sonner";

export default function CompanyLayout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
