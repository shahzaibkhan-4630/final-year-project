"use client";
import {
  ArrowRight,
  Code2,
  Layers,
  Megaphone,
  PieChart,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { featuredJobs, latestJobs } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Jobs = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const scrollContainerRef = useRef(null);

  const handleSearch = () => {
    console.log("Searching for:", { keyword, location });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Latest jobs data

  return (
    <>
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto text-center w-full">
          <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
            Explore Over 7,000+ Jobs Opportunities
          </h1>
          <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
            A platform tailored for passionate job seekers interested in
            startups or big-tech companies. Find your next career opportunity
            and connect with like-minded individuals.
          </p>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 bg-[#27282F] rounded-2xl overflow-hidden shadow-2xl p-2">
              <div className="flex items-center flex-1 px-4 sm:px-6 py-4 sm:py-6">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white mr-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent text-white placeholder-[#9CA3AF] font-dm-sans text-lg sm:text-xl outline-none w-full"
                />
              </div>
              <div className="hidden sm:block w-px bg-[#52575E] h-12 self-center"></div>
              <div className="flex items-center flex-1 px-4 sm:px-6 py-4 sm:py-6">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white mr-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent text-white placeholder-[#9CA3AF] font-dm-sans text-lg sm:text-xl outline-none w-full"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#DDDFFF] hover:bg-white text-black font-dm-sans font-semibold text-lg sm:text-xl px-10 sm:px-16 py-4 rounded-xl transition-all duration-200 m-1 sm:m-0"
              >
                Search
              </button>
            </div>
          </div>
          <div className="text-[#9EABCD] font-dm-sans text-base sm:text-lg px-4 sm:px-6">
            Tags: Digital Marketer, UX Designer, Data Analyst
          </div>
        </div>
      </div>

      {/* Explore By Category Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl text-center mb-12 sm:mb-16">
            Explore By Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto mb-8">
            <div className="bg-black border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4 mb-3">
                <Layers className="w-10 h-10 text-[#DDDFFF] shrink-0" />
                <div>
                  <h3 className="text-[#DDDFFF] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
                    Design
                  </h3>
                  <p className="text-[#848484] font-dm-sans text-sm sm:text-base">
                    235 Jobs Available
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4 mb-3">
                <PieChart className="w-10 h-10 text-[#DDDFFF] shrink-0" />
                <div>
                  <h3 className="text-[#DDDFFF] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
                    Analyst
                  </h3>
                  <p className="text-[#848484] font-dm-sans text-sm sm:text-base">
                    235 Jobs Available
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4 mb-3">
                <Megaphone className="w-10 h-10 text-[#DDDFFF] shrink-0" />
                <div>
                  <h3 className="text-[#DDDFFF] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
                    Marketing
                  </h3>
                  <p className="text-[#848484] font-dm-sans text-sm sm:text-base">
                    235 Jobs Available
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4 mb-3">
                <Code2 className="w-10 h-10 text-[#DDDFFF] shrink-0" />
                <div>
                  <h3 className="text-[#DDDFFF] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
                    Programmer
                  </h3>
                  <p className="text-[#848484] font-dm-sans text-sm sm:text-base">
                    235 Jobs Available
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-center gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto">
            <div className="bg-black border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer lg:w-[280px]">
              <div className="flex items-start gap-4 mb-3">
                <Megaphone className="w-10 h-10 text-[#DDDFFF] shrink-0" />
                <div>
                  <h3 className="text-[#DDDFFF] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
                    Marketing
                  </h3>
                  <p className="text-[#848484] font-dm-sans text-sm sm:text-base">
                    235 Jobs Available
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer lg:w-[280px]">
              <div className="flex items-start gap-4 mb-3">
                <Code2 className="w-10 h-10 text-[#DDDFFF] shrink-0" />
                <div>
                  <h3 className="text-[#DDDFFF] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
                    Programmer
                  </h3>
                  <p className="text-[#848484] font-dm-sans text-sm sm:text-base">
                    235 Jobs Available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Recruiting Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8">
            Start Recruiting Now
          </h2>
          <p className="text-[#848484] font-dm-sans text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4">
            Are you ready to take recruitment efforts to the next level? Our
            Platform offers a seamless and efficient way to get your job
            listings in front of top talent
          </p>
          <button className="bg-[#DDDFFF] hover:bg-white text-black font-dm-sans font-semibold text-base sm:text-lg px-8 sm:px-18 py-3 rounded-xl transition-all duration-200 inline-flex items-center gap-2">
            Sign Up Now <ArrowRight />
          </button>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 sm:mb-16">
            <h2 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl">
              Featured Jobs
            </h2>
            <Link href="/all-jobs" className="text-[#BEC1CA] font-dm-sans font-medium text-base sm:text-lg hover:text-white transition-colors inline-flex items-center gap-2 cursor-pointer">
              Browse All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredJobs.map((job, idx) => (
              <div
                key={idx}
                className="border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-start justify-center overflow-hidden">
                    <Image
                      src={job.icon}
                      alt={job.title}
                      width={100}
                      height={100}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-[#848484] font-dm-sans text-sm border border-[#2A2A2A] px-3 py-1 rounded-full">
                    FULL TIME
                  </span>
                </div>
                <h3 className="text-[#BEC1CA] font-dm-sans font-semibold text-xl sm:text-2xl mb-3">
                  {job.title}
                </h3>
                <p className="text-[#848484] font-dm-sans text-sm sm:text-base mb-6 leading-relaxed">
                  Join our team as an Email Marketing Specialist and lead our
                  digital outreach efforts.
                </p>
                <button className="text-[#BEC1CA] font-dm-sans font-medium text-sm hover:text-white transition-colors inline-flex items-center gap-2 cursor-pointer">
                  More Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Latest Jobs Post Carousel Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 sm:mb-16">
            <h2 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl">
              Latest Jobs Post
            </h2>
            <Link
              href="/all-jobs"
              className="text-[#BEC1CA] font-dm-sans font-medium text-base sm:text-lg hover:text-white transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Browse All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="relative">
            {/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
            <button
              onClick={() => scroll("left")}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 items-center justify-center bg-[#27282F] hover:bg-[#3A3A3A] rounded-full transition-all duration-200 text-white cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 items-center justify-center bg-[#27282F] hover:bg-[#3A3A3A] rounded-full transition-all duration-200 text-white cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div
                className="flex gap-5 sm:gap-6 pb-4"
                style={{ width: "max-content" }}
              >
                {latestJobs.map((job, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300 cursor-pointer w-[280px] sm:w-[320px] lg:w-[360px] shrink-0"
                  >
                    {/* Top Section with Job Info */}
                    <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                      <div>
                        <p className="text-[#848484] font-dm-sans mb-1">
                          JOB TYPE
                        </p>
                        <p className="text-white font-dm-sans font-medium">
                          {job.jobType}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#848484] font-dm-sans mb-1">
                          SALARY
                        </p>
                        <p className="text-white font-dm-sans font-medium">
                          {job.salary}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#848484] font-dm-sans mb-1">
                          APPLY BEFORE
                        </p>
                        <p className="text-white font-dm-sans font-medium">
                          {job.applyBefore}
                        </p>
                      </div>
                    </div>

                    {/* Icon and Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                        <Image
                          src={job.icon}
                          alt={job.company}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <h3 className="text-[#BEC1CA] font-dm-sans font-semibold text-xl">
                        {job.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-[#848484] font-dm-sans text-sm mb-6 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-[#2A2A2A] mb-4"></div>

                    {/* Footer with Location and Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#848484]">
                        <MapPin className="w-4 h-4" />
                        <span className="font-dm-sans text-sm">
                          {job.location}
                        </span>
                      </div>
                      <button className="text-[#BEC1CA] font-dm-sans font-medium text-sm hover:text-white transition-colors inline-flex items-center gap-2 cursor-pointer">
                        More Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
