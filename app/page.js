import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useContext } from "react";
import { features, stats } from "@/constants";
import { AppContext } from "@/context/AppContext";

const Page = () => {

  return (
    <>
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto text-center w-full">
          {/* Main Heading */}
          <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
            Your AI Career Coach for Professional Success
          </h1>

          {/* Subheading */}
          <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
            <Button className="bg-white hover:bg-gray-100 text-black font-dm-sans font-bold text-sm sm:text-base md:text-lg rounded-lg transition-colors duration-200 px-8 sm:px-10 md:px-12 py-5 sm:py-6 w-full sm:w-auto cursor-pointer">
              Get Started
            </Button>
            <Button className="bg-transparent hover:bg-white/10 text-white font-dm-sans font-bold text-sm sm:text-base md:text-lg rounded-lg border-2 border-white transition-colors duration-200 px-8 sm:px-10 md:px-12 py-5 sm:py-6 cursor-pointer w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Title */}
          <h2 className="text-[#BEC1CA] font-dm-sans font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-12 sm:mb-16 md:mb-20 px-2">
            Powerful Features for Your Career Growth
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black border border-[#939393] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center hover:border-gray-500 transition-all duration-300 hover:shadow-lg hover:shadow-gray-800/50"
              >
                {/* Icon */}
                <div className="mb-5 sm:mb-6 md:mb-8 flex items-center justify-center">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-white font-dm-sans font-bold text-lg sm:text-xl mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#848484] font-dm-sans text-sm sm:text-base text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section - Why Thousands Choose Us */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Title */}
          <h2 className="text-[#BEC1CA] font-dm-sans font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-12 sm:mb-16 md:mb-20 px-2">
            Why Thousands Choose Us
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                {/* Stat Value */}
                <h3 className="text-white font-dm-sans font-bold text-4xl sm:text-5xl mb-4 sm:mb-6">
                  {stat.value}
                </h3>

                {/* Stat Label */}
                <p className="text-[#999696] font-dm-sans text-base sm:text-lg md:text-xl">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Ready To Accelerate */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="max-w-5xl mx-auto w-full text-center">
          {/* CTA Heading */}
          <h2 className="text-[#BEC1CA] font-dm-sans font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 px-2">
            Ready To Accelerate Your Career?
          </h2>

          {/* CTA Description */}
          <p className="text-[#999696] font-dm-sans text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4 sm:px-6">
            Join thousands of professionals who are advancing their career with
            AI-powered guidance.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center px-4">
            <Button className="bg-[#DDDFFF] hover:bg-[#DDDFFF] text-black font-dm-sans font-bold text-sm sm:text-base md:text-lg rounded-lg transition-colors duration-200 px-8 sm:px-10 md:w-1/2 py-5 sm:py-6 w-full sm:w-auto cursor-pointer flex items-center gap-2">
              Start your Journey Today
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
