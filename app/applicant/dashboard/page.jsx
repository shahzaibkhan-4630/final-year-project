"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import ApplicantSidebarLayout from "@/layout/ApplicantSidebarLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Clock4,
  CircleCheckBig,
  CircleX,
  Search,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  MessageSquare,
  ExternalLink,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [loading, setLoading] = useState(true);

  // API Stats State
  const [apiStats, setApiStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  // Dialogs
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [messageDialog, setMessageDialog] = useState(false);
  const [viewJobDialog, setViewJobDialog] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all applied jobs
  const getAllJobsApplied = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/applied`,
        { withCredentials: true }
      );

      // The response is directly an array, not wrapped in a 'jobs' property
      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      console.log("Jobs Data:", jobsData); // Debug log

      // Transform API data to match component structure
      const transformedJobs = jobsData.map((job) => ({
        id: job.id,
        jobTitle: job.jobTitle,
        company: job.company_name || "Company",
        company_name: job.company_name || "Company",
        companyLogo: job.jobTitle
          ? job.jobTitle.substring(0, 2).toUpperCase()
          : "JB",
        location:
          `${job.city || ""}${job.city && job.area ? ", " : ""}${
            job.area || ""
          }`.trim() || "Location not specified",
        jobType: job.workMode || "Not specified",
        appliedDate: job.created_at
          ? new Date(job.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        updatedDate: job.updated_at
          ? new Date(job.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        salary: job.salaryEstimate || "Not disclosed",
        status: job.applicationStatus
          ? job.applicationStatus.charAt(0).toUpperCase() +
            job.applicationStatus.slice(1).toLowerCase()
          : "Pending",
        jobDescription: job.jobMainDetails || "No description available",
        requirements: job.lookingFor
          ? [job.lookingFor]
          : ["Requirements not specified"],
        responsibilities: job.jobMainDetails
          ? job.jobMainDetails
              .split(".")
              .filter((s) => s.trim())
              .slice(0, 5)
              .map((s) => s.trim())
          : ["Responsibilities not specified"],
        skills: job.toolsTech
          ? job.toolsTech
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        benefits: [
          job.benefits && "Benefits Package",
          job.medical && "Medical Insurance",
          job.paidLeaves && "Paid Leaves",
        ].filter(Boolean),
        experienceDetail: job.experienceDetail || "",
        applications: job.applications || 0,
        rawData: job,
      }));

      console.log("Transformed Jobs:", transformedJobs); // Debug log

      setApplications(transformedJobs);

      // Calculate stats
      const stats = {
        total: transformedJobs.length,
        pending: transformedJobs.filter(
          (job) => job.status.toLowerCase() === "pending"
        ).length,
        accepted: transformedJobs.filter(
          (job) => job.status.toLowerCase() === "accepted"
        ).length,
        rejected: transformedJobs.filter(
          (job) => job.status.toLowerCase() === "rejected"
        ).length,
      };

      setApiStats(stats);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllJobsApplied();
  }, []);

  // Get status counts
  const getStatusCount = (status) => {
    if (status === "All") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter((app) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        app.jobTitle.toLowerCase().includes(searchLower) ||
        app.company.toLowerCase().includes(searchLower) ||
        app.company_name.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower) ||
        (app.skills &&
          app.skills.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          ));

      // Status filter
      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    if (sortBy === "Newest First") {
      filtered.sort((a, b) => {
        const dateA = a.rawData?.created_at
          ? new Date(a.rawData.created_at)
          : new Date(0);
        const dateB = b.rawData?.created_at
          ? new Date(b.rawData.created_at)
          : new Date(0);
        return dateB - dateA;
      });
    } else if (sortBy === "Oldest First") {
      filtered.sort((a, b) => {
        const dateA = a.rawData?.created_at
          ? new Date(a.rawData.created_at)
          : new Date(0);
        const dateB = b.rawData?.created_at
          ? new Date(b.rawData.created_at)
          : new Date(0);
        return dateA - dateB;
      });
    } else if (sortBy === "Recently Updated") {
      filtered.sort((a, b) => {
        const dateA = a.rawData?.updated_at
          ? new Date(a.rawData.updated_at)
          : new Date(0);
        const dateB = b.rawData?.updated_at
          ? new Date(b.rawData.updated_at)
          : new Date(0);
        return dateB - dateA;
      });
    }

    return filtered;
  }, [applications, searchQuery, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedApplications.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredAndSortedApplications.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  // Handlers
  const handleMessageCompany = (application) => {
    setSelectedApplication(application);
    setMessageDialog(true);
  };

  const sendMessage = () => {
    console.log(
      "Sending message:",
      message,
      "to",
      selectedApplication.company_name
    );
    alert(`Message sent to ${selectedApplication.company_name}!`);
    setMessageDialog(false);
    setMessage("");
    setSelectedApplication(null);
  };

  const handleViewJob = (application) => {
    setSelectedApplication(application);
    setViewJobDialog(true);
  };

  const getStatusColor = (status) => {
    if (!status) return "border-gray-400 text-gray-400";

    switch (status.toLowerCase()) {
      case "pending":
        return "border-yellow-500 text-yellow-500";
      case "active":
        return "border-blue-500 text-blue-500";
      case "accepted":
        return "border-green-500 text-green-500";
      case "rejected":
        return "border-red-500 text-red-500";
      default:
        return "border-gray-400 text-gray-400";
    }
  };

  return (
    <ApplicantSidebarLayout>
      <div className="bg-[#27282F] mt-20 md:mt-0 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="flex flex-col text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl font-bold font-dm-sans text-white">
              MY APPLICATIONS
            </h1>
            <p className="text-sm font-[Poppins] mt-1 font-normal text-white">
              Track and manage your job applications
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-6">
        <Card className="bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#BEC1CA]">
              Total Applications
            </CardTitle>
            <Send className="h-6 w-6 text-[#BEC1CA]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#BEC1CA]">
              {apiStats.total}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#BEC1CA]">
              Pending
            </CardTitle>
            <Clock4 className="h-6 w-6 text-[#BEC1CA]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#BEC1CA]">
              {apiStats.pending}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#BEC1CA]">
              Accepted
            </CardTitle>
            <CircleCheckBig className="h-6 w-6 text-[#BEC1CA]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#BEC1CA]">
              {apiStats.accepted}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-[#BEC1CA]">
              Rejected
            </CardTitle>
            <CircleX className="h-6 w-6 text-[#BEC1CA]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#BEC1CA]">
              {apiStats.rejected}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Sort Section */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search Jobs, Companies or Skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[#2a2d35] border-none text-white placeholder:text-gray-400 h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-gray-600"
            />
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px] bg-[#2a2d35] border-none text-white h-12 rounded-lg focus:ring-1 focus:ring-gray-600">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2d35] border-gray-700 text-white">
              <SelectItem
                value="Newest First"
                className="focus:bg-gray-700 focus:text-white"
              >
                Newest First
              </SelectItem>
              <SelectItem
                value="Oldest First"
                className="focus:bg-gray-700 focus:text-white"
              >
                Oldest First
              </SelectItem>
              <SelectItem
                value="Recently Updated"
                className="focus:bg-gray-700 focus:text-white"
              >
                Recently Updated
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap gap-3">
          <Badge
            variant="outline"
            className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
              statusFilter === "All"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-gray-500 hover:border-white"
            }`}
            onClick={() => setStatusFilter("All")}
          >
            All ({getStatusCount("All")})
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
              statusFilter === "Pending"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-gray-500 hover:border-white"
            }`}
            onClick={() => setStatusFilter("Pending")}
          >
            Pending ({getStatusCount("Pending")})
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
              statusFilter === "Active"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-gray-500 hover:border-white"
            }`}
            onClick={() => setStatusFilter("Active")}
          >
            Active ({getStatusCount("Active")})
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
              statusFilter === "Accepted"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-gray-500 hover:border-white"
            }`}
            onClick={() => setStatusFilter("Accepted")}
          >
            Accepted ({getStatusCount("Accepted")})
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
              statusFilter === "Rejected"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-gray-500 hover:border-white"
            }`}
            onClick={() => setStatusFilter("Rejected")}
          >
            Rejected ({getStatusCount("Rejected")})
          </Badge>
        </div>

        {/* Applications List */}
        <div className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Loading applications...</p>
            </div>
          ) : currentApplications.length > 0 ? (
            currentApplications.map((application) => (
              <div
                key={application.id}
                className="bg-[#2a2d35] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Company Logo */}
                  <div className="flex shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center bg-[#1a1d25] text-white font-semibold text-lg">
                      {application.companyLogo}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">
                          {application.jobTitle}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`w-fit bg-transparent ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-300">
                        {application.company_name}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{application.jobType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Applied: {application.appliedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Updated: {application.updatedDate}</span>
                      </div>
                    </div>

                    {/* Salary and Experience */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <span>{application.salary}</span>
                      </div>
                      {application.experienceDetail && (
                        <div className="flex items-center gap-2">
                          <Clock4 className="h-4 w-4 text-gray-400" />
                          <span>
                            Experience: {application.experienceDetail}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {application.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {application.skills.slice(0, 5).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-[#1a1d25] text-gray-300 border-gray-600"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {application.skills.length > 5 && (
                          <Badge
                            variant="outline"
                            className="bg-[#1a1d25] text-gray-400 border-gray-600"
                          >
                            +{application.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessageCompany(application)}
                        className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Company
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewJob(application)}
                        className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Job Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">
                No applications found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAndSortedApplications.length > itemsPerPage && (
          <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredAndSortedApplications.length)} of{" "}
              {filteredAndSortedApplications.length} applications
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                          ? "bg-white text-black border-white"
                          : "bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white"
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
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Job Details Dialog */}
      <Dialog open={viewJobDialog} onOpenChange={setViewJobDialog}>
        <DialogContent className="bg-[#1a1d25] border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center bg-[#2a2d35] text-white font-semibold">
                {selectedApplication?.companyLogo}
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {selectedApplication?.jobTitle}
                </DialogTitle>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedApplication?.company_name}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{selectedApplication?.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{selectedApplication?.jobType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>{selectedApplication?.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(selectedApplication?.status)}`}
                >
                  {selectedApplication?.status}
                </Badge>
              </div>
            </div>

            {/* Experience Required */}
            {selectedApplication?.experienceDetail && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Experience Required
                </h3>
                <p className="text-gray-300 text-sm">
                  {selectedApplication.experienceDetail}
                </p>
              </div>
            )}

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Job Description
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedApplication?.jobDescription}
              </p>
            </div>

            {/* Looking For */}
            {selectedApplication?.requirements &&
              selectedApplication.requirements[0] !==
                "Requirements not specified" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {selectedApplication?.requirements?.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-300 text-sm"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Responsibilities */}
            {selectedApplication?.responsibilities &&
              selectedApplication.responsibilities[0] !==
                "Responsibilities not specified" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {selectedApplication?.responsibilities?.map(
                      (resp, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-300 text-sm"
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* Skills */}
            {selectedApplication?.skills &&
              selectedApplication.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Required Skills & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication?.skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-[#2a2d35] text-gray-300 border-gray-600"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Benefits */}
            {selectedApplication?.benefits &&
              selectedApplication.benefits.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Benefits
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication?.benefits?.map((benefit, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-500/10 text-green-400 border-green-500/50"
                      >
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Application Info */}
            <div className="bg-[#2a2d35] rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-white">
                Your Application
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <div>Applied: {selectedApplication?.appliedDate}</div>
                <div>Updated: {selectedApplication?.updatedDate}</div>
                {selectedApplication?.applications > 0 && (
                  <div className="col-span-2">
                    Total Applications: {selectedApplication.applications}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => setViewJobDialog(false)}
              variant="outline"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setViewJobDialog(false);
                handleMessageCompany(selectedApplication);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Company Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent className="bg-[#1a1d25] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Message {selectedApplication?.company_name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Send a message regarding your application for{" "}
              {selectedApplication?.jobTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="bg-[#2a2d35] border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-600 resize-none"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => {
                setMessageDialog(false);
                setMessage("");
              }}
              variant="outline"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ApplicantSidebarLayout>
  );
};

export default Dashboard;
