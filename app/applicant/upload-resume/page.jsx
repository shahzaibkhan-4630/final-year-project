"use client";
import ApplicantSidebarLayout from "@/layout/ApplicantSidebarLayout";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UploadResume = () => {
  const [currentResume, setCurrentResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const selectedFile = watch("resume");

  // Fetch existing resume on component mount
  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    setIsLoading(true);
    setUploadStatus({ type: "", message: "" });

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/getResume`,
        {
          withCredentials: true,
        }
      );

      console.log("Resume fetch response:", response.data);

      if (response.data?.resume) {
        const resumeData = response.data.resume;

        if (resumeData.filename || resumeData.url || resumeData.key) {
          setCurrentResume(resumeData);
          console.log("Resume loaded successfully:", resumeData);
        } else {
          console.warn("Resume data incomplete:", resumeData);
          setCurrentResume(null);
        }
      } else {
        setCurrentResume(null);
        console.log("No resume found");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);

      if (error.response?.status === 404) {
        setCurrentResume(null);
        console.log("No resume exists (404)");
      } else {
        setUploadStatus({
          type: "error",
          message: "Failed to load resume. Please refresh the page.",
        });
        setCurrentResume(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.resume?.[0]) {
      setUploadStatus({
        type: "error",
        message: "Please select a file to upload",
      });
      return;
    }

    const file = data.resume[0];

    // If updating existing resume, show confirmation dialog
    if (currentResume) {
      setFileToUpdate(file);
      setShowUpdateDialog(true);
      return;
    }

    // Otherwise, proceed with upload
    await uploadResume(file);
  };

  const uploadResume = async (file) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({
        type: "error",
        message: "Please upload a PDF or Word document",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        type: "error",
        message: "File size must be less than 5MB",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: "", message: "" });

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/resume/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);

      setUploadStatus({
        type: "success",
        message: currentResume
          ? "Resume updated successfully!"
          : "Resume uploaded successfully!",
      });

      // Update current resume with response data
      if (response.data?.resume) {
        setCurrentResume(response.data.resume);
      }

      reset();
      setShowUpdateDialog(false);

      setTimeout(() => setUploadStatus({ type: "", message: "" }), 5000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload resume. Please try again.";
      setUploadStatus({
        type: "error",
        message: errorMessage,
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setFileToUpdate(null);
    }
  };

  const handleUpdate = async () => {
    if (fileToUpdate) {
      await uploadResume(fileToUpdate);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/resume/delete`,
        {
          withCredentials: true,
        }
      );

      setCurrentResume(null);
      setUploadStatus({
        type: "success",
        message: "Resume deleted successfully",
      });
      reset();
      setTimeout(() => setUploadStatus({ type: "", message: "" }), 5000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete resume";
      setUploadStatus({
        type: "error",
        message: errorMessage,
      });
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDownload = async () => {
    if (!currentResume?.url) {
      console.error("Resume data:", currentResume);

      setUploadStatus({
        type: "error",
        message:
          "Resume download URL is not available. Please try re-uploading your resume.",
      });

      setTimeout(() => setUploadStatus({ type: "", message: "" }), 5000);
      return;
    }

    try {
      const response = await axios.get(currentResume.url, {
        withCredentials: true,
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = currentResume.filename || "resume";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log("Downloaded resume successfully");
    } catch (error) {
      console.error("Download error:", error);
      setUploadStatus({
        type: "error",
        message:
          "Failed to download resume. The file may have been moved or deleted.",
      });

      setTimeout(() => setUploadStatus({ type: "", message: "" }), 5000);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (filename) => {
    if (!filename) return "📎";
    if (filename.endsWith(".pdf")) return "📄";
    if (filename.endsWith(".doc") || filename.endsWith(".docx")) return "📝";
    return "📎";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  // Clear file input when clicking the remove button
  const handleRemoveSelectedFile = () => {
    setValue("resume", null);
    // Reset the file input
    const fileInput = document.getElementById("resume-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <ApplicantSidebarLayout>
      <div className="bg-[#27282F] mt-20 md:mt-0 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
          <div className="flex flex-col text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl font-bold font-dm-sans text-white">
              UPLOAD YOUR RESUME
            </h1>
            <p className="text-sm font-[Poppins] mt-1 font-normal text-white">
              Uploading your resume will automatically attach it to all job
              applications and interviews you participate in.
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus.message && (
          <Alert
            className={`mb-6 ${
              uploadStatus.type === "success"
                ? "bg-green-900/20 border-green-500"
                : "bg-red-900/20 border-red-500"
            }`}
          >
            {uploadStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription
              className={
                uploadStatus.type === "success"
                  ? "text-green-300"
                  : "text-red-300"
              }
            >
              {uploadStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
            <span className="ml-3 text-white">Loading resume...</span>
          </div>
        ) : (
          <>
            {/* Current Resume Display - Only show if resume exists */}
            {currentResume && (
              <Card className="mb-6 bg-[#1F2028] border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl flex shrink-0">
                        {getFileIcon(currentResume.filename)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate text-sm sm:text-base">
                          {currentResume.filename || "Resume"}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {formatFileSize(currentResume.size)}
                          {currentResume.uploadedAt && (
                            <span className="ml-2">
                              • Uploaded {formatDate(currentResume.uploadedAt)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none bg-transparent border-blue-600 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none bg-transparent border-green-600 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                        onClick={() =>
                          document.getElementById("resume-upload")?.click()
                        }
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none bg-transparent border-red-600 text-red-500 hover:bg-red-900/20"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Form - Show when no resume exists OR when user wants to update */}
            {!currentResume && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="bg-[#1F2028] border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* File Input */}
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 text-center hover:border-gray-500 transition-colors">
                        <input
                          type="file"
                          id="resume-upload"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          {...register("resume", {
                            required: "Resume is required",
                          })}
                        />
                        <label
                          htmlFor="resume-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3" />
                          <p className="text-white font-semibold mb-1 text-sm sm:text-base">
                            Click to upload resume
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            PDF, DOC, or DOCX (Max 5MB)
                          </p>
                        </label>
                      </div>

                      {/* Selected File Preview */}
                      {selectedFile?.[0] && (
                        <div className="flex items-center gap-3 p-3 bg-[#27282F] rounded-lg border border-blue-500/30">
                          <FileText className="h-8 w-8 text-blue-400 flex shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {selectedFile[0].name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {formatFileSize(selectedFile[0].size)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveSelectedFile}
                            className="text-gray-400 hover:text-white hover:bg-gray-700 flex shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {errors.resume && (
                        <p className="text-red-500 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.resume.message}
                        </p>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isUploading || !selectedFile?.[0]}
                        className="w-full bg-[#CAC5FE] hover:bg-[#B4AEF5] text-black disabled:opacity-50 disabled:cursor-not-allowed font-dm-sans font-medium transition-colors"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            )}

            {/* Hidden file input for updates - accessible when resume exists */}
            {currentResume && (
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                className="hidden"
                {...register("resume")}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileToUpdate(e.target.files[0]);
                    setShowUpdateDialog(true);
                  }
                }}
              />
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2 flex items-center text-sm sm:text-base">
            <AlertCircle className="h-4 w-4 mr-2 text-blue-400" />
            Important Information
          </h3>
          <ul className="text-gray-300 text-xs sm:text-sm space-y-1 ml-6 list-disc">
            <li>Supported formats: PDF, DOC, DOCX</li>
            <li>Maximum file size: 5MB</li>
            <li>
              Your resume will be attached to all future applications
              automatically
            </li>
            <li>You can update your resume anytime by uploading a new file</li>
          </ul>
        </div>
      </div>

      {/* Update Confirmation Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="bg-[#1F2028] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Update Resume</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to replace your current resume with the new
              one? This action will update your resume for all applications.
            </DialogDescription>
          </DialogHeader>
          {fileToUpdate && (
            <div className="bg-[#27282F] p-3 rounded-lg">
              <p className="text-white text-sm font-medium mb-1">
                New file: {fileToUpdate.name}
              </p>
              <p className="text-gray-400 text-xs">
                Size: {formatFileSize(fileToUpdate.size)}
              </p>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowUpdateDialog(false);
                setFileToUpdate(null);
                // Clear the file input
                const fileInput = document.getElementById("resume-upload");
                if (fileInput) {
                  fileInput.value = "";
                }
              }}
              disabled={isUploading}
              className="w-full sm:w-auto bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUploading}
              className="w-full sm:w-auto bg-[#CAC5FE] hover:bg-[#B4AEF5] text-black"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Resume
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#1F2028] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete your resume? This action cannot be
              undone and will remove your resume from all applications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Resume
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ApplicantSidebarLayout>
  );
};

export default UploadResume;
