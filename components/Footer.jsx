import React from "react";
import Link from "next/link";
import { Brain, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <div className="text-[#DDDFFF] px-4 py-6 border-t-2 border-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4">
        {/* Logo */}
        <div className="order-1 md:order-1">
          <Link href="/" className="flex items-center gap-1.5">
            <Brain className="w-8 h-8 text-[#DDDFFF]" />
            <span className="text-[#DDDFFF] font-dm-sans font-bold text-md">
              TALENT FORGE
            </span>
          </Link>
        </div>
        {/* Copyright */}
        <div className="order-3 md:order-2">
          <p className="text-[#DDDFFF] font-dm-sans font-medium text-md text-center md:text-left">
            © 2025 TALENT FORGE. All Rights Reserved.
          </p>
        </div>
        {/* Social Icons */}
        <div className="order-2 md:order-3">
          <div className="flex items-center gap-5">
            <Link href="https://www.instagram.com/" target="_blank">
              <Instagram className="w-5 h-5 text-[#DDDFFF]" />
            </Link>
            <Link href="https://www.linkedin.com/" target="_blank">
              <Linkedin className="w-5 h-5 text-[#DDDFFF]" />
            </Link>
            <Link href="https://www.twitter.com/" target="_blank">
              <Twitter className="w-5 h-5 text-[#DDDFFF]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
