"use client";
import { Toaster } from "@/components/ui/sonner";

export default function ApplicantLayout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
