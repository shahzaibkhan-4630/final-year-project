"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

const InterviewQuestions = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionsPerPage = 10; // Number of questions per page
  const router = useRouter();

  // Load questions from sessionStorage on component mount
  useEffect(() => {
    try {
      const storedQuestions = sessionStorage.getItem("interviewQuestions");

      if (!storedQuestions) {
        toast.error(
          "No interview questions found. Please start a new interview."
        );
        router.push("/interview");
        return;
      }

      const questionsData = JSON.parse(storedQuestions);

      // Transform the API response into an array format for easier rendering
      const transformedQuestions = [];

      // Count the number of questions (looking for Q1, Q2, etc.)
      let questionCount = 1;
      while (questionsData[`Q${questionCount}`]) {
        const questionKey = `Q${questionCount}`;
        const answerKey = `A${questionCount}`;
        const correctAnswerKey = `correctAnswer${questionCount}`;

        // Get the options object and convert it to an array
        const optionsObj = questionsData[answerKey];
        const optionsArray = Object.keys(optionsObj)
          .sort()
          .map((key) => optionsObj[key]);

        transformedQuestions.push({
          id: questionCount,
          question: questionsData[questionKey],
          options: optionsArray,
          correctAnswer: questionsData[correctAnswerKey] - 1, // Convert to 0-based index
        });

        questionCount++;
      }

      if (transformedQuestions.length === 0) {
        toast.error("Invalid question format. Please start a new interview.");
        router.push("/interview");
        return;
      }

      setQuestions(transformedQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("Failed to load questions. Please start a new interview.");
      router.push("/interview");
    }
  }, [router]);

  // Calculate pagination
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => selectedAnswers[q.id] === undefined
    );

    if (unansweredQuestions.length > 0) {
      toast.error(
        `Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the original questions data from sessionStorage
      const storedQuestions = sessionStorage.getItem("interviewQuestions");
      const questionsData = JSON.parse(storedQuestions);

      // Prepare the submission data with questions and selected options
      const submissionData = {
        questions: questionsData,
        selectedAnswers: selectedAnswers,
      };

      // console.log("Submitting data:", submissionData);

      // Make API call to submit answers
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/submitAns`,
        submissionData,
        { withCredentials: true }
      );

      // console.log("Full API Response:", response);
      // console.log("Response data:", response.data);
      // console.log("Response data type:", typeof response.data);
      // console.log("Is Array:", Array.isArray(response.data));

      let resultData = null;

      // Handle different response formats
      if (response.data) {
        // Case 1: Response is an array directly (your current case)
        if (Array.isArray(response.data)) {
          // console.log("Response is an array, processing...");

          // Transform array into expected format
          resultData = {
            questions: response.data,
            totalQuestions: response.data.length,
            correctAnswers: response.data.filter((q) => q.isCorrect).length,
            score: Math.round(
              (response.data.filter((q) => q.isCorrect).length /
                response.data.length) *
                100
            ),
          };

          // console.log("Transformed result data:", resultData);
        }
        // Case 2: response.data.data exists (wrapped format)
        else if (response.data.data) {
          resultData = response.data.data;
          // console.log("Using response.data.data format");
        }
        // Case 3: response.data has the result directly (object format)
        else if (response.data.score !== undefined || response.data.questions) {
          resultData = response.data;
          // console.log("Using direct response.data format");
        }
        // Case 4: response.data.success is true
        else if (response.data.success === true) {
          resultData = response.data;
          // console.log("Using success format");
        }
      }

      // If we got a 200 status and have some data, proceed
      if (response.status === 200 && resultData) {
        // console.log("Storing result data:", resultData);
        sessionStorage.setItem("interviewResults", JSON.stringify(resultData));

        toast.success("Interview submitted successfully!");

        // Small delay to ensure sessionStorage is written
        setTimeout(() => {
          router.push("/interview-result");
        }, 100);
      } else {
        console.error("No valid result data found");
        console.error("Response structure:", response);
        toast.error("Received unexpected response format. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting interview:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);

      // If we got a 200 status but axios threw an error, it might be a parsing issue
      if (error.response && error.response.status === 200) {
        // console.log("Got 200 status in error handler");

        // Try to handle the response data
        if (error.response.data) {
          let resultData = null;

          // Check if it's an array
          if (Array.isArray(error.response.data)) {
            console.log("Error response is an array");
            resultData = {
              questions: error.response.data,
              totalQuestions: error.response.data.length,
              correctAnswers: error.response.data.filter((q) => q.isCorrect)
                .length,
              score: Math.round(
                (error.response.data.filter((q) => q.isCorrect).length /
                  error.response.data.length) *
                  100
              ),
            };
          } else {
            resultData = error.response.data;
          }

          sessionStorage.setItem(
            "interviewResults",
            JSON.stringify(resultData)
          );
          toast.success("Interview submitted successfully!");

          setTimeout(() => {
            router.push("/interview-result");
          }, 100);
          return;
        }
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to submit interview. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToPreparation = () => {
    // Clear session data
    sessionStorage.removeItem("interviewQuestions");
    sessionStorage.removeItem("interviewAnswers");
    router.push("/interview");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-dm-sans">
          Loading questions...
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
          <h1 className="text-white font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
            MOCK INTERVIEW
          </h1>
          <p className="text-gray-400 font-dm-sans text-base sm:text-lg md:text-xl">
            Test Your Knowledge with industry-specific questions
          </p>
        </div>

        {/* Questions Container */}
        <div className="space-y-6">
          {currentQuestions.map((q, index) => (
            <div
              key={q.id}
              className="border border-gray-700 rounded-2xl p-6 sm:p-8"
            >
              {/* Question Header */}
              <div className="mb-6">
                <h3 className="text-white font-dm-sans font-semibold text-lg sm:text-xl mb-3">
                  Question {indexOfFirstQuestion + index + 1} of{" "}
                  {questions.length}
                </h3>
                <p className="text-white font-dm-sans text-base sm:text-lg">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <RadioGroup
                value={selectedAnswers[q.id]?.toString()}
                onValueChange={(value) =>
                  handleAnswerSelect(q.id, parseInt(value))
                }
                className="space-y-3"
              >
                {q.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-3 group"
                  >
                    <RadioGroupItem
                      value={optionIndex.toString()}
                      id={`q${q.id}-option${optionIndex}`}
                      className="border-gray-500 text-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label
                      htmlFor={`q${q.id}-option${optionIndex}`}
                      className="text-gray-300 font-dm-sans text-sm sm:text-base cursor-pointer group-hover:text-white transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
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

        {/* Submit Button - Show only on last page */}
        {currentPage === totalPages && (
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold px-12 sm:px-16 py-6 rounded-xl text-base sm:text-lg font-dm-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Interview"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions;
