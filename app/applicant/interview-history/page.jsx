"use client";
import ApplicantSidebarLayout from "@/layout/ApplicantSidebarLayout";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trophy,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";

const InterviewHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [interviewHistory, setInterviewHistory] = useState(null);
  const questionsPerPage = 10;

  const getMyHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/getMyHistory`,
        { withCredentials: true }
      );
    //   console.log(response.data);
      setInterviewHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load interview history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyHistory();
  }, []);

  // Calculate pagination
  const totalQuestions =
    interviewHistory && Array.isArray(interviewHistory)
      ? interviewHistory.length
      : 0;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions =
    interviewHistory && Array.isArray(interviewHistory)
      ? interviewHistory.slice(startIndex, endIndex)
      : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Calculate overall statistics
  const correctAnswers =
    interviewHistory && Array.isArray(interviewHistory)
      ? interviewHistory.filter((q) => q.correctAnswer === q.userChoice).length
      : 0;
  const totalAnswered =
    interviewHistory && Array.isArray(interviewHistory)
      ? interviewHistory.length
      : 0;
  const accuracy =
    totalAnswered > 0 ? ((correctAnswers / totalAnswered) * 100).toFixed(1) : 0;

  return (
    <ApplicantSidebarLayout>
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-white font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                YOUR INTERVIEW HISTORY
              </h1>
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#B2AC61]" />
            </div>
            <p className="text-gray-400 font-dm-sans text-base sm:text-lg">
              Review your performance and see where you can improve.
            </p>
          </div>

          {/* Statistics Cards */}
          {!loading && interviewHistory && interviewHistory.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <p className="text-gray-400 text-sm font-dm-sans mb-2">
                  Total Questions
                </p>
                <p className="text-white text-3xl font-bold font-dm-sans">
                  {totalAnswered}
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <p className="text-gray-400 text-sm font-dm-sans mb-2">
                  Correct Answers
                </p>
                <p className="text-green-500 text-3xl font-bold font-dm-sans">
                  {correctAnswers}
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <p className="text-gray-400 text-sm font-dm-sans mb-2">
                  Accuracy
                </p>
                <p className="text-[#B2AC61] text-3xl font-bold font-dm-sans">
                  {accuracy}%
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B2AC61]"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && (!interviewHistory || interviewHistory.length === 0) && (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl font-dm-sans font-semibold mb-2">
                No Interview History Yet
              </h3>
              <p className="text-gray-400 font-dm-sans">
                Complete some interviews to see your history here.
              </p>
            </div>
          )}

          {/* Interview History Questions */}
          {!loading && currentQuestions.length > 0 && (
            <div className="space-y-6">
              {currentQuestions.map((item, index) => {
                const questionNumber = startIndex + index + 1;
                const isCorrect = item.correctAnswer === item.userChoice;

                return (
                  <div
                    key={index}
                    className="bg-black border border-gray-800 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-gray-700"
                  >
                    {/* Question Header */}
                    <div className="mb-6">
                      <h2 className="text-white font-dm-sans text-lg sm:text-xl font-semibold mb-4">
                        Question {questionNumber} of {totalQuestions}
                      </h2>
                      <p className="text-white font-dm-sans text-base sm:text-lg leading-relaxed">
                        {item.question}
                      </p>
                    </div>

                    {/* User Answer */}
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className="text-gray-400 font-dm-sans text-sm">
                            Your Answer:{" "}
                          </span>
                          <span
                            className={`font-dm-sans text-base ${
                              isCorrect ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {item.userChoice || "Not answered"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-gray-400 font-dm-sans text-sm">
                            Correct Answer:{" "}
                          </span>
                          <span className="text-white font-dm-sans text-base">
                            {item.correctAnswer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-gray-400 font-dm-sans text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, totalQuestions)} of{" "}
                {totalQuestions} questions
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-dm-sans transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      // Show ellipsis
                      const showEllipsisBefore =
                        page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter =
                        page === currentPage + 2 &&
                        currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span
                            key={page}
                            className="px-2 text-gray-500 font-dm-sans"
                          >
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-dm-sans transition-all duration-200 ${
                            currentPage === page
                              ? "bg-[#B2AC61] text-black font-semibold"
                              : "bg-gray-800 text-white hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-dm-sans transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ApplicantSidebarLayout>
  );
};

export default InterviewHistory;
