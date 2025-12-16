"use client";
import { Button } from "@/components/ui/button";
import CompanySidebarLayout from "@/layout/CompanySidebarLayout";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  ChartSpline,
  Users,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  jobTitle: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title must not exceed 100 characters"),
  toolsTech: z
    .string()
    .min(3, "Tools & Tech must be at least 3 characters")
    .max(200, "Tools & Tech must not exceed 200 characters"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  workMode: z.string().min(1, "Work mode is required"),
  salaryEstimate: z
    .string()
    .min(1, "Salary estimate is required")
    .max(100, "Salary estimate must not exceed 100 characters"),
  experienceDetail: z.string().min(1, "Experience detail is required"),
  jobMainDetails: z
    .string()
    .min(20, "Job details must be at least 20 characters")
    .max(2000, "Job details must not exceed 2000 characters"),
  lookingFor: z
    .string()
    .min(10, "This field must be at least 10 characters")
    .max(1000, "This field must not exceed 1000 characters"),
  benefits: z.boolean().default(false),
  paidLeaves: z.boolean().default(false),
  medical: z.boolean().default(false),
});

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Jobs");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJobId, setEditingJobId] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  });
  const itemsPerPage = 5;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      toolsTech: "",
      city: "",
      area: "",
      workMode: "",
      salaryEstimate: "",
      experienceDetail: "",
      jobMainDetails: "",
      lookingFor: "",
      benefits: false,
      paidLeaves: false,
      medical: false,
    },
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/getJobsById`,
        { withCredentials: true }
      );

      // Set the jobs data
      if (response.data && response.data.data) {
        const jobsData = response.data.data;
        setJobs(jobsData);

        // Update stats
        setStats({
          totalJobs: jobsData.length,
          activeJobs: jobsData.filter((job) => job.status === "Active").length,
          totalApplications: jobsData.reduce(
            (sum, job) => sum + (job.applications || 0),
            0
          ),
        });
      }
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const clearForm = () => {
    form.reset();
    setEditingJobId(null);
  };

  const handleOpenCreate = (isOpen) => {
    if (!isOpen) clearForm();
    setOpenDialog(isOpen);
  };

  const onSubmit = async (data) => {
    try {
      if (editingJobId) {
        // Update existing job
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/modifyById/${editingJobId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data) {
          toast.success("Job updated successfully!");
          handleOpenCreate(false);
          fetchJobs();
        }
      } else {
        // Create new job
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/create`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data) {
          toast.success("Job posted successfully!");
          handleOpenCreate(false);
          fetchJobs();
        }
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${editingJobId ? "update" : "post"} job. Please try again.`;
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/modifyById/${jobId}`,
          { withCredentials: true }
        );
        toast.success("Job deleted successfully!");
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        toast.error("Failed to delete job. Please try again.");
      }
    }
  };

  const handleEdit = async (jobId) => {
    try {
      // Find the job from the current jobs list
      const jobToEdit = jobs.find((job) => job.id === jobId);

      if (jobToEdit) {
        // Set the editing job ID
        setEditingJobId(jobId);

        // Populate the form with the job data
        form.reset({
          jobTitle: jobToEdit.jobTitle || "",
          toolsTech: jobToEdit.toolsTech || "",
          city: jobToEdit.city || "",
          area: jobToEdit.area || "",
          workMode: jobToEdit.workMode || "",
          salaryEstimate: jobToEdit.salaryEstimate || "",
          experienceDetail: jobToEdit.experienceDetail || "",
          jobMainDetails: jobToEdit.jobMainDetails || "",
          lookingFor: jobToEdit.lookingFor || "",
          benefits: jobToEdit.benefits || false,
          paidLeaves: jobToEdit.paidLeaves || false,
          medical: jobToEdit.medical || false,
        });

        // Open the dialog
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error loading job for edit:", error);
      toast.error("Failed to load job details. Please try again.");
    }
  };

  // Filter logic
  const getFilteredJobs = () => {
    if (selectedFilter === "All Jobs") return jobs;
    return jobs.filter((job) => job.status === selectedFilter);
  };

  const filteredJobs = getFilteredJobs();

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Get counts for filters
  const getFilterCount = (filter) => {
    if (filter === "All Jobs") return jobs.length;
    return jobs.filter((job) => job.status === filter).length;
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "border-green-500 text-green-500";
      case "Draft":
        return "border-gray-400 text-gray-400";
      case "Closed":
        return "border-red-500 text-red-500";
      default:
        return "border-gray-400 text-gray-400";
    }
  };

  return (
    <CompanySidebarLayout>
      <div className="bg-[#27282F] mt-20 md:mt-0 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="flex flex-col text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl font-bold font-dm-sans text-white">
              JOBS MANAGEMENT
            </h1>
            <p className="text-sm font-[Poppins] mt-1 font-normal text-white">
              Manage your job postings and track applications
            </p>
          </div>
          <div>
            <Button
              onClick={() => handleOpenCreate(true)}
              className="w-full sm:w-auto rounded-lg cursor-pointer bg-[#DDDFFF] hover:bg-[#DDDFFF]/90 transition-colors text-black font-dm-sans text-[15px]"
            >
              Post New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <Card className="bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#BEC1CA]">
              Total Jobs Posted
            </CardTitle>
            <Briefcase className="h-6 w-6 text-[#BEC1CA]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#BEC1CA]">
              {loading ? "..." : stats.totalJobs}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#BEC1CA]">
              Active Jobs
            </CardTitle>
            <ChartSpline className="h-6 w-6 text-[#BEC1CA]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#BEC1CA]">
              {loading ? "..." : stats.activeJobs}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#BEC1CA]">
              Total Applications
            </CardTitle>
            <Users className="h-6 w-6 text-[#BEC1CA]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#BEC1CA]">
              {loading ? "..." : stats.totalApplications}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Posted Jobs Section */}
      <div className="mt-8 space-y-4">
        {/* Section Header with Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white font-dm-sans">
            Posted Jobs
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`cursor-pointer px-4 py-1.5 rounded-full transition-colors font-dm-sans ${
                selectedFilter === "All Jobs"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-gray-500 hover:border-white"
              }`}
              onClick={() => handleFilterChange("All Jobs")}
            >
              All Jobs ({getFilterCount("All Jobs")})
            </Badge>
            <Badge
              variant="outline"
              className={`cursor-pointer px-4 py-1.5 rounded-full transition-colors font-dm-sans ${
                selectedFilter === "Active"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-gray-500 hover:border-white"
              }`}
              onClick={() => handleFilterChange("Active")}
            >
              Active ({getFilterCount("Active")})
            </Badge>
            <Badge
              variant="outline"
              className={`cursor-pointer px-4 py-1.5 rounded-full transition-colors font-dm-sans ${
                selectedFilter === "Closed"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-gray-500 hover:border-white"
              }`}
              onClick={() => handleFilterChange("Closed")}
            >
              Closed ({getFilterCount("Closed")})
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#27282F] rounded-lg border border-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-dm-sans">
              <thead>
                <tr className="border-b border-white">
                  <th className="text-left p-4 text-white font-medium">
                    Job Title
                  </th>
                  <th className="text-left p-4 text-white font-medium">
                    Location
                  </th>
                  <th className="text-left p-4 text-white font-medium">Type</th>
                  <th className="text-left p-4 text-white font-medium">
                    Status
                  </th>
                  <th className="text-left p-4 text-white font-medium">
                    Applications
                  </th>
                  <th className="text-left p-4 text-white font-medium">
                    Posted
                  </th>
                  <th className="text-left p-4 text-white font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-gray-400 text-sm"
                    >
                      Loading jobs...
                    </td>
                  </tr>
                ) : currentJobs.length > 0 ? (
                  currentJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-white hover:bg-[#33363e] transition-colors"
                    >
                      <td className="p-4 text-white">{job.jobTitle}</td>
                      <td className="p-4 text-white">
                        {job.city}, {job.area}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="border-gray-400 text-gray-300 bg-transparent"
                        >
                          {job.workMode || "Full-time"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`bg-transparent ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-white">
                        {job.applications || 0}
                      </td>
                      <td className="p-4 text-white">
                        {new Date(job.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(job.id)}
                            className="text-green-500 hover:text-green-400 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-gray-400 text-sm"
                    >
                      No jobs found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredJobs.length > itemsPerPage && (
            <div className="flex items-center justify-between p-4 border-t border-gray-700">
              <div className="text-sm text-white">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredJobs.length)} of{" "}
                {filteredJobs.length} jobs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white font-dm-sans disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] ${
                          currentPage === page
                            ? "bg-[#DDDFFF] text-black border-[#DDDFFF] cursor-pointer"
                            : "bg-transparent border-gray-600 text-white hover:bg-gray-700 cursor-pointer"
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={handleOpenCreate}>
        <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#1A1C20] border-gray-700">
          <DialogHeader>
            <div className="flex flex-col items-center gap-2">
              <DialogTitle className="text-white text-xl font-semibold">
                {editingJobId ? "EDIT JOB OPENING" : "POST A NEW JOB OPENING"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-4"
            >
              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#D6E0FF] text-sm">
                      Job Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Stack Developer"
                        {...field}
                        className="bg-[#2a2b35] border-none text-white placeholder:text-white focus-visible:ring-1 focus-visible:ring-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Tools & Tech */}
              <FormField
                control={form.control}
                name="toolsTech"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#D6E0FF] text-sm">
                      Tools & Tech
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Github, Node, ForkLift, Biotech, etc."
                        {...field}
                        className="bg-[#2a2b35] border-none text-white placeholder:text-white focus-visible:ring-1 focus-visible:ring-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* City Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#D6E0FF] text-sm">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          {...field}
                          className="bg-[#2a2b35] border-none text-white placeholder:text-white focus-visible:ring-1 focus-visible:ring-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#D6E0FF] text-sm">
                        Area
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Area"
                          {...field}
                          className="bg-[#2a2b35] border-none text-white placeholder:text-white focus-visible:ring-1 focus-visible:ring-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Three Column Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Onsite/Offsite/Remote - DROPDOWN */}
                <FormField
                  control={form.control}
                  name="workMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#D6E0FF] text-xs">
                        Onsite/Remote/Hybrid
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#2a2b35] border-none text-white focus:ring-1 focus:ring-white">
                            <SelectValue placeholder="Select work mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#2a2b35] border-gray-600">
                          <SelectItem
                            value="Onsite"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Onsite
                          </SelectItem>
                          <SelectItem
                            value="Remote"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Remote
                          </SelectItem>
                          <SelectItem
                            value="Hybrid"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Hybrid
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Salary Estimate */}
                <FormField
                  control={form.control}
                  name="salaryEstimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#D6E0FF] text-xs">
                        Salary Estimate
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="70,000-90,000 PKR"
                          {...field}
                          className="bg-[#2a2b35] border-none text-white placeholder:text-white focus-visible:ring-1 focus-visible:ring-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Level Of Experience (Job Detail Wise) - DROPDOWN */}
                <FormField
                  control={form.control}
                  name="experienceDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#D6E0FF] text-xs">
                        Level Of Experience
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#2a2b35] border-none text-white focus:ring-1 focus:ring-gray-600">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#2a2b35] border-gray-600">
                          <SelectItem
                            value="Entry Level"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Entry Level
                          </SelectItem>
                          <SelectItem
                            value="Junior"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Junior
                          </SelectItem>
                          <SelectItem
                            value="Mid-Level"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Mid-Level
                          </SelectItem>
                          <SelectItem
                            value="Senior"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Senior
                          </SelectItem>
                          <SelectItem
                            value="Lead"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Lead
                          </SelectItem>
                          <SelectItem
                            value="Principal"
                            className="text-white hover:bg-[#33363e] focus:bg-[#33363e]"
                          >
                            Principal
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Job Main Details */}
              <FormField
                control={form.control}
                name="jobMainDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#D6E0FF] text-sm">
                      Job Main Details
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Location, Time Frames, Responsibilities and Requirements"
                        {...field}
                        rows={4}
                        className="bg-[#2a2b35] border-none text-white placeholder:text-white focus-visible:ring-1 focus-visible:ring-gray-600 resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* What You Are Looking For In An Employee */}
              <FormField
                control={form.control}
                name="lookingFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#D6E0FF] text-sm">
                      What You Are Looking For In An Employee
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Punctual, Well Spoken, Good English etc..."
                        {...field}
                        rows={3}
                        className="bg-[#2a2b35] border-none text-white placeholder:text-white focus-visible:ring-1 focus-visible:ring-gray-600 resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Additional Details Section */}
              <div className="space-y-3">
                <FormLabel className="text-[#D6E0FF] text-sm">
                  Add More Details To Make Your Job Appear In More Searches
                </FormLabel>

                {/* Three Toggle Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Benefits */}
                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#D6E0FF] text-xs block mb-2">
                          Benefits
                        </FormLabel>
                        <FormControl>
                          <button
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                            className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                              field.value
                                ? "bg-[#DDDFFF] text-black"
                                : "bg-[#2a2b35] text-white"
                            }`}
                          >
                            {field.value ? "Yes" : "No"}
                          </button>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Paid Leaves */}
                  <FormField
                    control={form.control}
                    name="paidLeaves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#D6E0FF] text-xs block mb-2">
                          Paid Leaves
                        </FormLabel>
                        <FormControl>
                          <button
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                            className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                              field.value
                                ? "bg-[#DDDFFF] text-black"
                                : "bg-[#2a2b35] text-white"
                            }`}
                          >
                            {field.value ? "Yes" : "No"}
                          </button>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Medical */}
                  <FormField
                    control={form.control}
                    name="medical"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#D6E0FF] text-xs block mb-2">
                          Medical
                        </FormLabel>
                        <FormControl>
                          <button
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                            className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                              field.value
                                ? "bg-[#DDDFFF] text-black"
                                : "bg-[#2a2b35] text-white"
                            }`}
                          >
                            {field.value ? "Yes" : "No"}
                          </button>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-[#DDDFFF] hover:bg-[#DDDFFF]/90 text-black font-semibold py-6 rounded-lg transition-colors cursor-pointer"
              >
                {form.formState.isSubmitting
                  ? editingJobId
                    ? "Updating..."
                    : "Posting..."
                  : editingJobId
                  ? "Update Job"
                  : "Post Job"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </CompanySidebarLayout>
  );
};

export default Dashboard;
