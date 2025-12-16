"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Brain, Database, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// Updated Zod validation schema
const formSchema = z.object({
  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title is too long"),
  experienceLevel: z
    .number()
    .min(0, "Experience level must be at least 0")
    .max(50, "Experience level cannot exceed 50"),
  interviewDifficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select an interview difficulty level",
  }),
  toolsTech: z.string().min(2, "Please enter at least one tool or technology"),
  jobDescription: z.string().optional(),
  focusAreas: z.string().optional(),
});

const Interview = () => {
  const router = useRouter();
  const [isLoadingDatabase, setIsLoadingDatabase] = useState(false);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      toolsTech: "",
      experienceLevel: 0,
      interviewDifficulty: "",
      jobDescription: "",
      focusAreas: "",
    },
  });

  const handleFetchFromDatabase = async () => {
    setIsLoadingDatabase(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/getData`,
        { withCredentials: true }
      );

      const data = response.data.data;

      // Map API response to form fields
      if (data.job_title) {
        form.setValue("jobTitle", data.job_title, { shouldValidate: true });
      }

      if (data.tools_used && Array.isArray(data.tools_used)) {
        // Convert array to comma-separated string
        const toolsString = data.tools_used.join(", ");
        form.setValue("toolsTech", toolsString, { shouldValidate: true });
      }

      if (data.experience_level !== undefined) {
        form.setValue("experienceLevel", Number(data.experience_level), {
          shouldValidate: true,
        });
      }

      // Set default difficulty if not provided by API
      if (data.interviewDifficulty) {
        form.setValue("interviewDifficulty", data.interviewDifficulty, {
          shouldValidate: true,
        });
      }

      if (data.jobDescription) {
        form.setValue("jobDescription", data.jobDescription, {
          shouldValidate: true,
        });
      }

      if (data.focusAreas) {
        form.setValue("focusAreas", data.focusAreas, {
          shouldValidate: true,
        });
      }

      toast.success("Data fetched from database successfully!");
    } catch (error) {
      console.error("Error fetching from database:", error);
      toast.error("Failed to fetch data from database. Please try again.");
    } finally {
      setIsLoadingDatabase(false);
    }
  };

  const handleFetchFromGemini = async () => {
    setIsLoadingGemini(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/autofill`,
        { withCredentials: true }
      );

      const data = response.data.data;

      // Map API response to form fields
      if (data.job_title) {
        form.setValue("jobTitle", data.job_title, { shouldValidate: true });
      }

      if (data.tools_used && Array.isArray(data.tools_used)) {
        // Convert array to comma-separated string
        const toolsString = data.tools_used.join(", ");
        form.setValue("toolsTech", toolsString, { shouldValidate: true });
      }

      if (data.experience_level !== undefined) {
        form.setValue("experienceLevel", Number(data.experience_level), {
          shouldValidate: true,
        });
      }

      // Set default difficulty if not provided by API
      if (data.interviewDifficulty) {
        form.setValue("interviewDifficulty", data.interviewDifficulty, {
          shouldValidate: true,
        });
      }

      if (data.jobDescription) {
        form.setValue("jobDescription", data.jobDescription, {
          shouldValidate: true,
        });
      }

      if (data.focusAreas) {
        form.setValue("focusAreas", data.focusAreas, {
          shouldValidate: true,
        });
      }

      toast.success("Data fetched from Gemini successfully!");
    } catch (error) {
      console.error("Error fetching from Gemini:", error);
      toast.error("Failed to fetch data from Gemini. Please try again.");
    } finally {
      setIsLoadingGemini(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/generate-questions`,
        data
      );

      // Store the questions data in sessionStorage for the interview-questions page
      if (response.data.success && response.data.data) {
        sessionStorage.setItem(
          "interviewQuestions",
          JSON.stringify(response.data.data)
        );

        toast.success("Interview setup completed successfully!");

        // Navigate to interview questions page
        router.push("/interview-questions");
      } else {
        toast.error("Failed to generate questions. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto text-center w-full">
          {/* Main Heading */}
          <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
            Get Interview Ready With AI - Powered Practice & Feedback
          </h1>

          {/* Subheading */}
          <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
            Practice Real Interview questions & get Instant feedback
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
            <Button
              onClick={() => {
                // Scroll to form section
                const formSection = document.getElementById("interview-form");
                if (formSection) {
                  formSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-white hover:bg-gray-100 text-black font-dm-sans font-bold text-sm sm:text-base md:text-lg rounded-lg transition-colors duration-200 px-8 sm:px-10 md:px-12 py-5 sm:py-6 w-full sm:w-auto cursor-pointer"
            >
              Start An Interview
              <ArrowDown className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div
        id="interview-form"
        className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16"
      >
        <div className="w-full max-w-3xl">
          {/* Logo and Title */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-[#DDDFFF]" />
              <span className="text-[#DDDFFF] font-dm-sans font-bold text-md">
                TALENT FORGE
              </span>
            </div>
            <h1 className="text-[#DDDFFF] text-2xl sm:text-3xl lg:text-4xl font-semibold font-dm-sans">
              Start Your Interview Preparation
            </h1>
          </div>

          {/* Form Container with Gradient Background */}
          <div
            className="rounded-3xl p-6 sm:p-8 lg:p-10"
            style={{
              background: "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
            }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Fetch Buttons Section */}
                <div>
                  <Label className="block text-[#D6E0FF] text-sm mb-3 font-dm-sans">
                    Autofill form fields
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      onClick={handleFetchFromDatabase}
                      disabled={
                        isLoadingDatabase || isLoadingGemini || isSubmitting
                      }
                      className="w-full bg-[#2A2D35] hover:bg-[#353942] text-white font-dm-sans font-medium py-6 rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Database className="w-5 h-5 mr-2" />
                      {isLoadingDatabase
                        ? "Fetching..."
                        : "Fetch from Database"}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleFetchFromGemini}
                      disabled={
                        isLoadingDatabase || isLoadingGemini || isSubmitting
                      }
                      className="w-full bg-[#2A2D35] hover:bg-[#353942] text-white font-dm-sans font-medium py-6 rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isLoadingGemini ? "Fetching..." : "Fetch from Gemini"}
                    </Button>
                  </div>
                </div>

                {/* Job Title */}
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
                        Job Title
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="E.g, Frontend Developer, Full Stack Engineer, Data Scientist"
                          className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CAC5FE] transition-colors font-dm-sans border-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                {/* Experience Level (Number Wise) */}
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
                        Years Of Experience
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="5"
                          min="0"
                          max="50"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CAC5FE] transition-colors font-dm-sans border-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                {/* Interview Difficulty Level using select options*/}
                <FormField
                  control={form.control}
                  name="interviewDifficulty"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
                        Interview Difficulty Level
                      </Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#CAC5FE] transition-colors font-dm-sans border-0">
                            <SelectValue placeholder="Select difficulty level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                {/* Tools & Tech */}
                <FormField
                  control={form.control}
                  name="toolsTech"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
                        Tools & Tech (Enter the Main Technologies you&apos;ll be
                        interviewed on (comma-separated))
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="E.g, React, Node.JS, AWS, Docker"
                          className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CAC5FE] transition-colors font-dm-sans border-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                {/* Job Description */}
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
                        Job Description (Optional)
                      </Label>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="Paste the Job Description or list specific skills/requirements mentioned by the company... This helps tailor questions to match the actual job requirements"
                          className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CAC5FE] transition-colors resize-none font-dm-sans border-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                {/* Focus Areas */}
                <FormField
                  control={form.control}
                  name="focusAreas"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
                        Focus Areas (Optional)
                      </Label>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="e.g Data Structures, System Design. Specific topics you want to practice"
                          className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CAC5FE] transition-colors resize-none font-dm-sans border-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    isLoadingDatabase || isLoadingGemini || isSubmitting
                  }
                  className="w-full bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold py-4 rounded-xl transition-all duration-200 transform font-dm-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Generating Questions..." : "Start Interview"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Interview;
