"use client";
import React, { useState, useEffect } from "react";
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

const InterviewResult = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const questionsPerPage = 10;
  const router = useRouter();

  // Load results from sessionStorage on component mount
  useEffect(() => {
    try {
      const storedResults = sessionStorage.getItem("interviewResults");
      const storedQuestions = sessionStorage.getItem("interviewQuestions");

      if (!storedResults) {
        toast.error(
          "No interview results found. Please complete an interview first."
        );
        router.push("/interview");
        return;
      }

      const resultsData = JSON.parse(storedResults);
      const questionsData = storedQuestions
        ? JSON.parse(storedQuestions)
        : null;

      // console.log("Results data:", resultsData);
      // console.log("Questions data:", questionsData);

      // Validate the results data structure
      if (resultsData.score === undefined && resultsData.score !== 0) {
        toast.error(
          "Invalid results format. Please complete an interview again."
        );
        router.push("/interview");
        return;
      }

      // If we have both results and original questions, enhance the results with actual answer text
      if (resultsData.questions && questionsData) {
        const enhancedQuestions = resultsData.questions.map((result) => {
          // Find the corresponding question in the original questions data
          const questionKey = `Q${result.id}`;
          const answerKey = `A${result.id}`;

          // console.log(`Processing question ${result.id}:`, result);

          if (questionsData[questionKey] && questionsData[answerKey]) {
            const options = questionsData[answerKey];

            // console.log(`Options for question ${result.id}:`, options);
            // console.log(
            //   `userChoice: ${result.userChoice}, correctAnswer: ${result.correctAnswer}`
            // );

            // Get the actual text for user's choice and correct answer
            // The backend might send 1-based indices (1,2,3,4) or the actual text
            let userChoiceText = result.userChoice;
            let correctAnswerText = result.correctAnswer;

            // If userChoice is a number (string or number type), get the text from options
            if (
              typeof result.userChoice === "number" ||
              !isNaN(result.userChoice)
            ) {
              userChoiceText =
                options[result.userChoice] ||
                options[String(result.userChoice)] ||
                result.userChoice;
            }

            // If correctAnswer is a number (string or number type), get the text from options
            if (
              typeof result.correctAnswer === "number" ||
              !isNaN(result.correctAnswer)
            ) {
              correctAnswerText =
                options[result.correctAnswer] ||
                options[String(result.correctAnswer)] ||
                result.correctAnswer;
            }

            // Re-evaluate if the answer is correct by comparing the actual text
            // This handles cases where backend might have incorrect isCorrect flag
            const isActuallyCorrect =
              userChoiceText?.toString().trim().toLowerCase() ===
              correctAnswerText?.toString().trim().toLowerCase();

            // console.log(
            //   `Question ${result.id}: userChoiceText="${userChoiceText}", correctAnswerText="${correctAnswerText}", isActuallyCorrect=${isActuallyCorrect}`
            // );

            return {
              ...result,
              userChoiceText,
              correctAnswerText,
              isCorrect: isActuallyCorrect, // Override with correct comparison
            };
          }

          return result;
        });

        // Recalculate the score based on corrected isCorrect values
        const correctCount = enhancedQuestions.filter(
          (q) => q.isCorrect
        ).length;
        const newScore = Math.round(
          (correctCount / enhancedQuestions.length) * 100
        );

        resultsData.questions = enhancedQuestions;
        resultsData.correctAnswers = correctCount;
        resultsData.score = newScore;

        console.log("Enhanced results:", resultsData);
      }

      setResults(resultsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading results:", error);
      toast.error("Failed to load results. Please try again.");
      router.push("/interview");
    }
  }, [router]);

  // Calculate pagination
  const totalPages = results?.questions
    ? Math.ceil(results.questions.length / questionsPerPage)
    : 0;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = results?.questions
    ? results.questions.slice(indexOfFirstQuestion, indexOfLastQuestion)
    : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetakeInterview = () => {
    // Clear all session data
    sessionStorage.removeItem("interviewQuestions");
    sessionStorage.removeItem("interviewAnswers");
    sessionStorage.removeItem("interviewResults");

    // Navigate back to interview preparation
    router.push("/interview");
  };

  const handleBackToDashboard = () => {
    // Navigate to dashboard (adjust route as needed)
    router.push("/dashboard");
  };

  const handleBackToPreparation = () => {
    // Clear session data and go back to interview page
    sessionStorage.removeItem("interviewQuestions");
    sessionStorage.removeItem("interviewAnswers");
    sessionStorage.removeItem("interviewResults");
    router.push("/interview");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-dm-sans">
          Loading results...
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-dm-sans">
          No results available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToPreparation}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-8 sm:mb-12 font-dm-sans"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">
            Back To Interview Preparation
          </span>
        </button>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-white font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              MOCK INTERVIEW RESULTS
            </h1>
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#B2AC61]" />
          </div>
          <p className="text-gray-400 font-dm-sans text-base sm:text-lg">
            Review your performance and see where you can improve.
          </p>
        </div>

        {/* Score Section */}
        {/* <div className="mb-8 sm:mb-12">
          <div className="text-center mb-4">
            <span className="text-white font-dm-sans font-bold text-5xl sm:text-6xl md:text-7xl">
              {results.score}%
            </span>
          </div>
          <div className="w-full bg-[#5B5B5B] rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${results.score}%` }}
            />
          </div>
        </div> */}

        {/* Improvement Tip */}
        {/* {results.improvementTip && (
          <div className="bg-[#1F1F1F] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12">
            <h3 className="text-white font-dm-sans font-semibold text-lg sm:text-xl mb-3">
              Improvement Tip:
            </h3>
            <p className="text-gray-400 font-dm-sans text-sm sm:text-base leading-relaxed">
              {results.improvementTip}
            </p>
          </div>
        )} */}

        {/* Questions Results */}
        {results.questions && results.questions.length > 0 && (
          <>
            <div className="space-y-6">
              {currentQuestions.map((q, index) => (
                <div
                  key={q.id || index}
                  className="border border-[#FFFFFF] rounded-2xl p-6 sm:p-8"
                >
                  {/* Question Header */}
                  <div className="mb-4">
                    <h3 className="text-white font-dm-sans font-semibold text-base sm:text-lg mb-3">
                      Question {indexOfFirstQuestion + index + 1} of{" "}
                      {results.questions.length}
                    </h3>
                    <p className="text-white font-dm-sans text-sm sm:text-base mb-4">
                      {q.question}
                    </p>
                  </div>

                  {/* User Answer */}
                  <div className="mb-3">
                    <div className="flex items-start gap-2">
                      {q.correctAnswer === q.userChoice ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-gray-400 font-dm-sans text-sm">
                          Your Answer:{" "}
                        </span>
                        <span
                          className={`font-dm-sans text-sm sm:text-base ${
                            q.correctAnswer === q.userChoice
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {q.userChoice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Correct Answer (if wrong) */}
                  {!q.isCorrect && (q.correctAnswerText || q.correctAnswer) && (
                    <div className="mb-3">
                      <span className="text-gray-400 font-dm-sans text-sm">
                        Correct Answer:{" "}
                      </span>
                      <span className="text-white font-dm-sans text-sm sm:text-base">
                        {q.correctAnswerText || q.correctAnswer}
                      </span>
                    </div>
                  )}

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <span className="text-gray-400 font-dm-sans text-sm">
                        Explanation:{" "}
                      </span>
                      <span className="text-gray-300 font-dm-sans text-sm">
                        {q.explanation}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <div className="flex items-center justify-between border border-gray-800 rounded-xl p-4 sm:p-6 bg-linear-to-r from-[#0A0A0A] to-[#151515]">
                  {/* Previous Button */}
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    variant="ghost"
                    className="text-white font-dm-sans hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all px-4 sm:px-6 py-2 sm:py-3 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  {/* Page Indicator */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`transition-all duration-300 rounded-full ${
                              currentPage === page
                                ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-[#CAC5FE]"
                                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-600 hover:bg-gray-500"
                            }`}
                            aria-label={`Go to page ${page}`}
                          />
                        )
                      )}
                    </div>
                    <span className="text-gray-400 font-dm-sans text-xs sm:text-sm whitespace-nowrap">
                      {currentPage} / {totalPages}
                    </span>
                  </div>

                  {/* Next Button */}
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="ghost"
                    className="text-white font-dm-sans hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all px-4 sm:px-6 py-2 sm:py-3 cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link href="/interview">
            <Button
              className="bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold px-8 sm:px-12 py-5 sm:py-6 rounded-xl text-base sm:text-lg font-dm-sans cursor-pointer w-full sm:w-auto"
            >
              Retake Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
