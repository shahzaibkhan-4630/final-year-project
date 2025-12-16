"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Mail,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CompanySidebarLayout from "@/layout/CompanySidebarLayout";
import axios from "axios";
import { toast } from "sonner";

const JobsApplications = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState("All Jobs");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 3;

  // Dialog states
  const [actionDialog, setActionDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Fetch job applications from API
  const fetchJobApplication = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/applicants`,
        { withCredentials: true }
      );

      // Transform API data to match the component structure
      const transformedData = response.data.map((item) => {
        const applicant = item.applicant;
        return {
          id: applicant.id,
          name: applicant.username || "N/A",
          status: determineStatus(item),
          appliedFor: item.jobTitle || "N/A",
          experience: item.experienceDetail || "N/A",
          email: applicant.email || "N/A",
          location: `${item.city || "N/A"}, ${item.area || ""}`.trim(),
          phone: "N/A", // Not available in API response
          appliedDate: formatDate(item.created_at),
          skills: item.toolsTech ? parseSkills(item.toolsTech) : [],
          hasResume: !!applicant.resume,
          jobId: item.id,
          applicationDetails: item,
        };
      });

      setApplications(transformedData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch Job Applications");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine application status (removed 'reviewed')
  const determineStatus = (item) => {
    if (item.accepted && item.accepted.length > 0) {
      return "accepted";
    } else if (item.rejected && item.rejected.length > 0) {
      return "rejected";
    } else {
      return "new";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to parse skills from toolsTech string
  const parseSkills = (toolsTech) => {
    if (!toolsTech) return [];
    // Split by comma and clean up
    return toolsTech
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  };

  useEffect(() => {
    fetchJobApplication();
  }, []);

  // Get unique job titles for dropdown
  const jobTitles = useMemo(() => {
    const titles = [
      "All Jobs",
      ...new Set(applications.map((app) => app.appliedFor).filter(Boolean)),
    ];
    return titles;
  }, [applications]);

  // Get status counts (removed 'reviewed')
  const getStatusCount = (status) => {
    if (status === "All") return applications.length;
    return applications.filter(
      (app) => app.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        app.name.toLowerCase().includes(searchLower) ||
        app.appliedFor.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower) ||
        app.skills.some((skill) => skill.toLowerCase().includes(searchLower));

      // Job filter
      const matchesJob =
        selectedJob === "All Jobs" || app.appliedFor === selectedJob;

      // Status filter
      const matchesStatus =
        statusFilter === "All" ||
        app.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [applications, searchQuery, selectedJob, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedJob, statusFilter]);

  // ACTION HANDLERS

  const handleViewResume = async (application) => {
    try {
      // Use applicant id (application.id) for the API call
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/viewResume/${application.id}`,
        {
          withCredentials: true,
          responseType: "blob", // Important: if the API returns a file directly
        }
      );

      console.log(response.data);

      // Check if response is a blob (PDF file)
      if (response.data instanceof Blob) {
        // Create a blob URL and open it
        const fileURL = URL.createObjectURL(response.data);
        window.open(fileURL, "_blank");
      } else {
        // If response contains a URL string
        const resumeUrl =
          response.data.resumeUrl || response.data.url || response.data;

        if (resumeUrl && typeof resumeUrl === "string") {
          window.open(resumeUrl, "_blank");
        } else {
          toast.error("Resume URL not found");
        }
      }
    } catch (error) {
      console.error("Error fetching resume:", error);

      // Properly access error.response.status
      if (error.response?.status === 404) {
        toast.error("Resume not found for this applicant");
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized access");
      } else {
        toast.error("Failed to load resume");
      }
    }
  };

  // 2. Accept Handler
  const handleAccept = (application) => {
    setSelectedApplication(application);
    setActionType("accept");
    setActionDialog(true);
  };

  // 3. Reject Handler
  const handleReject = (application) => {
    setSelectedApplication(application);
    setActionType("reject");
    setActionDialog(true);
  };

  // Confirm action (Accept/Reject)
  const confirmAction = async () => {
    if (!selectedApplication || !actionType) return;

    const newStatus = actionType === "accept" ? "accepted" : "rejected";

    try {
      setProcessingAction(true);

      // Make API call to update status
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/modifier/${selectedApplication.jobId}`,
        {
          applicantId: selectedApplication.id,
          status: actionType === "accept" ? "accept" : "reject",
        },
        { withCredentials: true }
      );

      // Update local state on successful API response
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? { ...app, status: newStatus }
            : app
        )
      );

      toast.success(
        `${selectedApplication.name}'s application has been ${newStatus}!`
      );

      // Close dialog and reset
      setActionDialog(false);
      setSelectedApplication(null);
      setActionType(null);
    } catch (error) {
      console.error("Failed to process application:", error);

      // Handle specific error messages from API if available
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to process application. Please try again.";

      toast.error(errorMessage);

      // Do not update local state on error
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getInitials = (name) => {
    if (!name || name === "N/A") return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <CompanySidebarLayout>
        <div className="min-h-screen text-white p-6 mt-20 md:mt-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading applications...</p>
          </div>
        </div>
      </CompanySidebarLayout>
    );
  }

  return (
    <CompanySidebarLayout>
      <div className="min-h-screen text-white p-6 mt-20 md:mt-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-dm-sans">
            JOB APPLICATIONS
          </h1>
          <p className="text-gray-400 text-lg font-dm-sans">
            Review and manage candidates applications
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search Jobs, Companies or Skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[#2a2d35] border-none text-white placeholder:text-gray-400 h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-gray-600 font-dm-sans"
            />
          </div>
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-full md:w-[200px] bg-[#2a2d35] border-none text-white h-12 rounded-lg focus:ring-1 focus:ring-gray-600 font-dm-sans">
              <SelectValue placeholder="All Jobs" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2d35] border-gray-700 text-white font-dm-sans">
              {jobTitles.map((job) => (
                <SelectItem
                  key={job}
                  value={job}
                  className="focus:bg-gray-700 focus:text-white font-dm-sans"
                >
                  {job}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter Badges (removed 'Reviewed') */}
        <div className="flex flex-wrap gap-3 mb-6 font-dm-sans">
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
              statusFilter === "New"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-gray-500 hover:border-white"
            }`}
            onClick={() => setStatusFilter("New")}
          >
            New ({getStatusCount("New")})
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
        <div className="space-y-4 font-dm-sans">
          {currentApplications.length > 0 ? (
            currentApplications.map((application) => (
              <div
                key={application.id}
                className="bg-[#2a2d35] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center bg-[#1a1d25] text-white font-semibold text-lg">
                      {getInitials(application.name)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        {application.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`w-fit ${getStatusBadgeColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </Badge>
                    </div>

                    {/* Job Info */}
                    <div className="space-y-1">
                      <p className="text-gray-300">
                        Applied for: {application.appliedFor}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {application.experience}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{application.location}</span>
                      </div>
                      {application.phone !== "N/A" && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{application.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{application.appliedDate}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {application.skills.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Key Skills:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {application.skills
                            .slice(0, 5)
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-[#3a3d45] text-gray-300 border-gray-600"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {application.skills.length > 5 && (
                            <Badge
                              variant="outline"
                              className="bg-[#3a3d45] text-gray-300 border-gray-600"
                            >
                              +{application.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons (removed 'Mark as Reviewed') */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {application.hasResume && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResume(application)}
                          className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Resume
                        </Button>
                      )}
                      {application.status.toLowerCase() === "new" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(application)}
                            className="bg-green-600 hover:bg-green-700 text-white border-none"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(application)}
                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
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
        {filteredApplications.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700 font-dm-sans">
            <div className="text-sm text-white">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Accept/Reject Confirmation Dialog */}
      <Dialog open={actionDialog} onOpenChange={setActionDialog}>
        <DialogContent className="bg-[#1a1d25] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {actionType === "accept"
                ? "Accept Application"
                : "Reject Application"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to {actionType} {selectedApplication?.name}
              &apos;s application for {selectedApplication?.appliedFor}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-400">
              {actionType === "accept"
                ? "The candidate will receive an acceptance notification and the status will be updated to 'Accepted'."
                : "The candidate will receive a rejection notification and the status will be updated to 'Rejected'."}
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => setActionDialog(false)}
              variant="outline"
              disabled={processingAction}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={processingAction}
              className={
                actionType === "accept"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {processingAction ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>{actionType === "accept" ? "Yes, Accept" : "Yes, Reject"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanySidebarLayout>
  );
};

export default JobsApplications;
