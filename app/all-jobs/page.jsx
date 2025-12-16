// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Search,
//   MapPin,
//   Clock,
//   Eye,
//   Bookmark,
//   ChevronDown,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import axios from "axios";

// const AllJobs = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [selectedType, setSelectedType] = useState("All Types");
//   const [selectedLocation, setSelectedLocation] = useState("All Locations");
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [allJobs, setAllJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const ApplyOnJob = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/apply`)
//     } catch (error) {}
//   };

//   // Fetch jobs from API
//   const getAllJobs = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/getAll`
//       );

//       console.log(response.data);

//       if (response.data && response.data.success && response.data.data) {
//         setAllJobs(response.data.data);
//       } else {
//         setError("Failed to load jobs");
//       }
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//       setError("Failed to load jobs. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllJobs();
//   }, []);

//   // Extract unique job types from API data
//   const jobTypes = [
//     "All Types",
//     ...new Set(allJobs.map((job) => job.workMode).filter(Boolean)),
//   ];

//   // Extract unique locations from API data
//   const locations = [
//     "All Locations",
//     ...new Set(
//       allJobs
//         .map((job) => {
//           if (job.workMode === "Remote") return "Remote";
//           return job.city && job.area
//             ? `${job.city}, ${job.area}`
//             : job.city || job.area;
//         })
//         .filter(Boolean)
//     ),
//   ];

//   const handleSaveJob = (jobId) => {
//     setSavedJobs((prev) =>
//       prev.includes(jobId)
//         ? prev.filter((id) => id !== jobId)
//         : [...prev, jobId]
//     );
//   };

//   const handleViewDetail = (job) => {
//     setSelectedJob(job);
//     setIsDialogOpen(true);
//   };

//   // Format salary display
//   const formatSalary = (salary) => {
//     if (!salary) return "Competitive";
//     return `${salary.toLocaleString()}`;
//   };

//   // Format time posted
//   const formatTimePosted = (postedBy) => {
//     if (!postedBy) return "Recently";
//     const daysAgo = Math.floor(
//       (Date.now() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//     );
//     return `${postedBy} days ago`;
//   };

//   // Get location display
//   const getLocationDisplay = (job) => {
//     if (job.workMode === "Remote") return "Remote";
//     if (job.workMode === "Onsite" && job.city && job.area) {
//       return `${job.city}, ${job.area}`;
//     }
//     return job.city || job.area || "Location TBD";
//   };

//   // Parse skills from toolsTech string
//   const parseSkills = (toolsTech) => {
//     if (!toolsTech) return [];
//     // If it's already an array, return it
//     if (Array.isArray(toolsTech)) return toolsTech;
//     // If it's a string, try to parse it or split by common delimiters
//     try {
//       const parsed = JSON.parse(toolsTech);
//       return Array.isArray(parsed) ? parsed : [toolsTech];
//     } catch {
//       // Split by comma, semicolon, or pipe
//       return toolsTech
//         .split(/[,;|]/)
//         .map((s) => s.trim())
//         .filter(Boolean);
//     }
//   };

//   // Filter jobs based on search, type, and location
//   const filteredJobs = allJobs.filter((job) => {
//     const matchesSearch =
//       searchQuery === "" ||
//       job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.lookingFor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       parseSkills(job.toolsTech).some((skill) =>
//         skill.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//     const matchesType =
//       selectedType === "All Types" || job.workMode === selectedType;

//     const jobLocation = getLocationDisplay(job);
//     const matchesLocation =
//       selectedLocation === "All Locations" ||
//       jobLocation === selectedLocation ||
//       (selectedLocation === "Remote" && job.workMode === "Remote");

//     return matchesSearch && matchesType && matchesLocation;
//   });

//   // Parse responsibilities from jobMainDetails
//   const parseResponsibilities = (jobMainDetails) => {
//     if (!jobMainDetails) return [];
//     // Split by newlines or bullet points
//     const items = jobMainDetails
//       .split(/\n|•|\\n/)
//       .map((item) => item.trim())
//       .filter((item) => item.length > 0);
//     return items.length > 0 ? items : [jobMainDetails];
//   };

//   // Parse requirements if available from backend
//   const parseRequirements = (requirements) => {
//     if (!requirements) return [];
//     // If it's an array, return it
//     if (Array.isArray(requirements)) return requirements;
//     // If it's a string, split by newlines or bullet points
//     const items = requirements
//       .split(/\n|•|\\n/)
//       .map((item) => item.trim())
//       .filter((item) => item.length > 0);
//     return items;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-[#848484] font-dm-sans text-lg">
//           Loading jobs...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-[#848484] font-dm-sans text-lg mb-4">{error}</p>
//           <Button
//             onClick={getAllJobs}
//             className="bg-[#DDDFFF] hover:bg-white text-black font-dm-sans font-semibold text-base px-8 py-6 rounded-md cursor-pointer"
//           >
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black">
//       {/* Search Section */}
//       <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
//         <div className="max-w-7xl mx-auto">
//           {/* Search Bar */}
//           <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
//             {/* Main Search Input */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#848484] z-10" />
//               <Input
//                 type="text"
//                 placeholder="Search Jobs, Companies or Skills..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-[#27282F] text-white placeholder-[#848484] font-dm-sans text-base pl-12 pr-4 py-6 rounded-md border-[#2A2A2A] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#3A3A3A]"
//               />
//             </div>

//             {/* Filter Buttons */}
//             <div className="flex gap-4">
//               {/* Job Type Dropdown */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="flex-1 lg:flex-none bg-[#27282F] text-white hover:bg-[#3A3A3A] hover:text-white border-[#2A2A2A] font-dm-sans text-base rounded-md"
//                   >
//                     {selectedType}
//                     <ChevronDown className="ml-2 w-4 h-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="bg-[#27282F] border-[#2A2A2A] text-white">
//                   {jobTypes.map((type) => (
//                     <DropdownMenuItem
//                       key={type}
//                       onClick={() => setSelectedType(type)}
//                       className="font-dm-sans text-base hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] focus:text-white cursor-pointer"
//                     >
//                       {type}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {/* Location Dropdown */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="flex-1 lg:flex-none bg-[#27282F] text-white hover:bg-[#3A3A3A] hover:text-white border-[#2A2A2A] font-dm-sans text-base rounded-md"
//                   >
//                     {selectedLocation}
//                     <ChevronDown className="ml-2 w-4 h-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="bg-[#27282F] border-[#2A2A2A] text-white">
//                   {locations.map((location) => (
//                     <DropdownMenuItem
//                       key={location}
//                       onClick={() => setSelectedLocation(location)}
//                       className="font-dm-sans text-base hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] focus:text-white cursor-pointer"
//                     >
//                       {location}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="mb-6">
//             <p className="text-[#848484] font-dm-sans text-sm">
//               Showing {filteredJobs.length} jobs
//             </p>
//           </div>

//           {/* Job Listings */}
//           <div className="space-y-6">
//             {filteredJobs.length > 0 ? (
//               filteredJobs.map((job) => (
//                 <div
//                   key={job.id}
//                   className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 hover:border-[#3A3A3A] transition-all duration-300"
//                 >
//                   <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Left Section - Company Icon */}
//                     <div className="flex shrink-0">
//                       <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-[#27282F]">
//                         {job.companyLogo ? (
//                           <Image
//                             src={job.companyLogo}
//                             alt={job.jobTitle || "Company"}
//                             width={40}
//                             height={40}
//                             className="w-10 h-10 object-contain"
//                             onError={(e) => {
//                               e.target.style.display = "none";
//                               e.target.nextSibling.style.display = "flex";
//                             }}
//                           />
//                         ) : null}
//                         <div
//                           className="w-full h-full items-center justify-center text-[#BEC1CA] font-dm-sans font-bold text-xl"
//                           style={{ display: job.companyLogo ? "none" : "flex" }}
//                         >
//                           {job.jobTitle?.charAt(0).toUpperCase() || "J"}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Middle Section - Job Details */}
//                     <div className="flex-1 min-w-0">
//                       {/* Title and Job Type */}
//                       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-[#BEC1CA] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
//                             {job.jobTitle || "Job Title"}
//                           </h3>
//                           <p className="text-[#848484] font-dm-sans text-base">
//                             {job.experienceDetail || "Experience Level"}
//                           </p>
//                         </div>
//                         <Badge
//                           variant="outline"
//                           className="text-[#BEC1CA] font-dm-sans text-sm border-[#2A2A2A] bg-transparent hover:bg-transparent px-4 py-1.5 rounded-lg w-fit"
//                         >
//                           {job.workMode || "Full Time"}
//                         </Badge>
//                       </div>

//                       {/* Location, Salary, Time */}
//                       <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 text-[#848484] font-dm-sans text-sm sm:text-base">
//                         <div className="flex items-center gap-2">
//                           <MapPin className="w-4 h-4 flex shrink-0" />
//                           <span>{getLocationDisplay(job)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span>{formatSalary(job.salaryEstimate)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4 flex shrink-0" />
//                           <span>{formatTimePosted(job.posted_by)}</span>
//                         </div>
//                       </div>

//                       {/* Description */}
//                       <p className="text-[#848484] font-dm-sans text-sm sm:text-base leading-relaxed mb-5">
//                         {job.lookingFor || "No description available"}
//                       </p>

//                       {/* Skills Tags */}
//                       <div className="flex flex-wrap gap-2 sm:gap-3">
//                         {parseSkills(job.toolsTech)
//                           .slice(0, 5)
//                           .map((skill, idx) => (
//                             <Badge
//                               key={idx}
//                               variant="outline"
//                               className="bg-[#27282F] text-[#BEC1CA] font-dm-sans text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-[#2A2A2A] hover:bg-[#27282F]"
//                             >
//                               {skill}
//                             </Badge>
//                           ))}
//                       </div>
//                     </div>

//                     {/* Right Section - Action Buttons */}
//                     <div className="flex lg:flex-col gap-3 lg:items-end justify-start lg:justify-start shrink-0">
//                       <Button
//                         onClick={() => handleViewDetail(job)}
//                         variant="outline"
//                         className="flex-1 sm:flex-none bg-transparent text-[#BEC1CA] hover:bg-[#27282F] hover:text-white border-[#2A2A2A] font-dm-sans text-sm px-5 py-5 rounded-lg whitespace-nowrap cursor-pointer"
//                       >
//                         <Eye className="mr-2 w-4 h-4" />
//                         View Detail
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => handleSaveJob(job.id)}
//                         className={`flex-1 sm:flex-none bg-transparent hover:bg-[#27282F] border-[#2A2A2A] font-dm-sans text-sm px-5 py-5 rounded-lg whitespace-nowrap cursor-pointer ${
//                           savedJobs.includes(job.id)
//                             ? "text-[#DDDFFF] border-[#DDDFFF]"
//                             : "text-[#BEC1CA] hover:text-white"
//                         }`}
//                       >
//                         <Bookmark
//                           className={`mr-2 w-4 h-4 ${
//                             savedJobs.includes(job.id) ? "fill-current" : ""
//                           }`}
//                         />
//                         Save Job
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-16">
//                 <p className="text-[#848484] font-dm-sans text-lg">
//                   No jobs found matching your criteria
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Job Detail Modal */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
//           {selectedJob && (
//             <>
//               <DialogHeader>
//                 <div className="flex items-start gap-4 mb-4">
//                   <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-[#27282F]">
//                     {selectedJob.companyLogo ? (
//                       <Image
//                         src={selectedJob.companyLogo}
//                         alt={selectedJob.jobTitle || "Company"}
//                         width={40}
//                         height={40}
//                         className="w-10 h-10 object-contain"
//                         onError={(e) => {
//                           e.target.style.display = "none";
//                           e.target.nextSibling.style.display = "flex";
//                         }}
//                       />
//                     ) : null}
//                     <div
//                       className="w-full h-full items-center justify-center text-[#BEC1CA] font-dm-sans font-bold text-2xl"
//                       style={{
//                         display: selectedJob.companyLogo ? "none" : "flex",
//                       }}
//                     >
//                       {selectedJob.jobTitle?.charAt(0).toUpperCase() || "J"}
//                     </div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <DialogTitle className="text-[#BEC1CA] font-dm-sans font-bold text-2xl sm:text-3xl mb-2">
//                       {selectedJob.jobTitle || "Job Title"}
//                     </DialogTitle>
//                     <DialogDescription className="text-[#848484] font-dm-sans text-lg">
//                       {selectedJob.experienceDetail || "Experience Level"}
//                     </DialogDescription>
//                   </div>
//                 </div>
//               </DialogHeader>

//               <div className="space-y-6 mt-6">
//                 {/* Job Info */}
//                 <div className="flex flex-wrap gap-3 pb-6 border-b border-[#2A2A2A]">
//                   <div className="flex items-center gap-2 text-[#848484]">
//                     <MapPin className="w-4 h-4 flex shrink-0" />
//                     <span className="font-dm-sans text-sm">
//                       {getLocationDisplay(selectedJob)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-[#848484]">
//                     <span className="font-dm-sans text-sm">
//                       {formatSalary(selectedJob.salaryEstimate)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-[#848484]">
//                     <Clock className="w-4 h-4 flex shrink-0" />
//                     <span className="font-dm-sans text-sm">
//                       {formatTimePosted(selectedJob.posted_by)}
//                     </span>
//                   </div>
//                   <Badge
//                     variant="outline"
//                     className="text-[#BEC1CA] font-dm-sans text-sm px-3 py-1 bg-transparent border-[#2A2A2A] rounded-lg hover:bg-transparent"
//                   >
//                     {selectedJob.workMode || "Full Time"}
//                   </Badge>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
//                     About the Role
//                   </h4>
//                   <p className="text-[#848484] font-dm-sans text-sm leading-relaxed">
//                     {selectedJob.lookingFor || "No description available"}
//                   </p>
//                 </div>

//                 {/* Responsibilities */}
//                 {selectedJob.jobMainDetails && (
//                   <div>
//                     <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
//                       Responsibilities
//                     </h4>
//                     <ul className="space-y-2">
//                       {parseResponsibilities(selectedJob.jobMainDetails).map(
//                         (item, idx) => (
//                           <li
//                             key={idx}
//                             className="text-[#848484] font-dm-sans text-sm flex gap-3"
//                           >
//                             <span className="text-[#DDDFFF] mt-1 flex shrink-0">
//                               •
//                             </span>
//                             <span>{item}</span>
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Requirements */}
//                 {selectedJob.requirements &&
//                   parseRequirements(selectedJob.requirements).length > 0 && (
//                     <div>
//                       <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
//                         Requirements
//                       </h4>
//                       <ul className="space-y-2">
//                         {parseRequirements(selectedJob.requirements).map(
//                           (item, idx) => (
//                             <li
//                               key={idx}
//                               className="text-[#848484] font-dm-sans text-sm flex gap-3"
//                             >
//                               <span className="text-[#DDDFFF] mt-1 flex shrink-0">
//                                 •
//                               </span>
//                               <span>{item}</span>
//                             </li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   )}

//                 {/* Skills */}
//                 {selectedJob.toolsTech && (
//                   <div>
//                     <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
//                       Required Skills
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {parseSkills(selectedJob.toolsTech).map((skill, idx) => (
//                         <Badge
//                           key={idx}
//                           variant="outline"
//                           className="bg-[#27282F] text-[#BEC1CA] font-dm-sans text-sm px-4 py-2 rounded-lg border-[#2A2A2A] hover:bg-[#27282F]"
//                         >
//                           {skill}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Additional Info */}
//                 <div className="grid grid-cols-2 gap-4 p-4 bg-[#27282F] rounded-lg">
//                   {selectedJob.benefits && (
//                     <div>
//                       <p className="text-[#848484] font-dm-sans text-xs mb-1">
//                         Benefits
//                       </p>
//                       <p className="text-[#BEC1CA] font-dm-sans text-sm">
//                         {selectedJob.benefits ? "Included" : "Not Specified"}
//                       </p>
//                     </div>
//                   )}
//                   {selectedJob.medical && (
//                     <div>
//                       <p className="text-[#848484] font-dm-sans text-xs mb-1">
//                         Medical
//                       </p>
//                       <p className="text-[#BEC1CA] font-dm-sans text-sm">
//                         {selectedJob.medical ? "Included" : "Not Specified"}
//                       </p>
//                     </div>
//                   )}
//                   {selectedJob.paidLeaves && (
//                     <div>
//                       <p className="text-[#848484] font-dm-sans text-xs mb-1">
//                         Paid Leaves
//                       </p>
//                       <p className="text-[#BEC1CA] font-dm-sans text-sm">
//                         {selectedJob.paidLeaves ? "Included" : "Not Specified"}
//                       </p>
//                     </div>
//                   )}
//                   {selectedJob.applications !== undefined && (
//                     <div>
//                       <p className="text-[#848484] font-dm-sans text-xs mb-1">
//                         Applications
//                       </p>
//                       <p className="text-[#BEC1CA] font-dm-sans text-sm">
//                         {selectedJob.applications}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Apply Button */}
//                 <div className="flex gap-3 pt-6 border-t border-[#2A2A2A]">
//                   <Button className="flex-1 bg-[#DDDFFF] hover:bg-white text-black font-dm-sans font-semibold text-base px-8 py-6 rounded-md cursor-pointer">
//                     Apply Now
//                   </Button>
//                   <Button
//                     onClick={() => handleSaveJob(selectedJob.id)}
//                     variant="outline"
//                     className={`bg-transparent border-[#2A2A2A] font-dm-sans text-base px-6 py-6 rounded-md cursor-pointer ${
//                       savedJobs.includes(selectedJob.id)
//                         ? "text-[#DDDFFF] border-[#DDDFFF] hover:bg-[#27282F] hover:text-[#DDDFFF]"
//                         : "text-[#BEC1CA] hover:text-white hover:bg-[#27282F]"
//                     }`}
//                   >
//                     <Bookmark
//                       className={`w-5 h-5 ${
//                         savedJobs.includes(selectedJob.id) ? "fill-current" : ""
//                       }`}
//                     />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AllJobs;

"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Eye,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import axios from "axios";

const AllJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ApplyOnJob = async (jobId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/apply/${jobId}`
      );

      // Handle success response
      console.log("Application successful:", response.data);
      alert("Successfully applied for the job!");

      // Optionally refresh jobs list
      await getAllJobs();
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for the job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs from API
  const getAllJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/getAll`
      );

      console.log(response.data);

      if (response.data && response.data.success && response.data.data) {
        setAllJobs(response.data.data);
      } else {
        setError("Failed to load jobs");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  // Extract unique job types from API data
  const jobTypes = [
    "All Types",
    ...new Set(allJobs.map((job) => job.workMode).filter(Boolean)),
  ];

  // Extract unique locations from API data
  const locations = [
    "All Locations",
    ...new Set(
      allJobs
        .map((job) => {
          if (job.workMode === "Remote") return "Remote";
          return job.city && job.area
            ? `${job.city}, ${job.area}`
            : job.city || job.area;
        })
        .filter(Boolean)
    ),
  ];

  const handleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleViewDetail = (job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return "Competitive";
    return `${salary.toLocaleString()}`;
  };

  // Format time posted
  const formatTimePosted = (postedBy) => {
    if (!postedBy) return "Recently";
    const daysAgo = Math.floor(
      (Date.now() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${postedBy} days ago`;
  };

  // Get location display
  const getLocationDisplay = (job) => {
    if (job.workMode === "Remote") return "Remote";
    if (job.workMode === "Onsite" && job.city && job.area) {
      return `${job.city}, ${job.area}`;
    }
    return job.city || job.area || "Location TBD";
  };

  // Parse skills from toolsTech string
  const parseSkills = (toolsTech) => {
    if (!toolsTech) return [];
    // If it's already an array, return it
    if (Array.isArray(toolsTech)) return toolsTech;
    // If it's a string, try to parse it or split by common delimiters
    try {
      const parsed = JSON.parse(toolsTech);
      return Array.isArray(parsed) ? parsed : [toolsTech];
    } catch {
      // Split by comma, semicolon, or pipe
      return toolsTech
        .split(/[,;|]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  };

  // Filter jobs based on search, type, and location
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.lookingFor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parseSkills(job.toolsTech).some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType =
      selectedType === "All Types" || job.workMode === selectedType;

    const jobLocation = getLocationDisplay(job);
    const matchesLocation =
      selectedLocation === "All Locations" ||
      jobLocation === selectedLocation ||
      (selectedLocation === "Remote" && job.workMode === "Remote");

    return matchesSearch && matchesType && matchesLocation;
  });

  // Parse responsibilities from jobMainDetails
  const parseResponsibilities = (jobMainDetails) => {
    if (!jobMainDetails) return [];
    // Split by newlines or bullet points
    const items = jobMainDetails
      .split(/\n|•|\\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return items.length > 0 ? items : [jobMainDetails];
  };

  // Parse requirements if available from backend
  const parseRequirements = (requirements) => {
    if (!requirements) return [];
    // If it's an array, return it
    if (Array.isArray(requirements)) return requirements;
    // If it's a string, split by newlines or bullet points
    const items = requirements
      .split(/\n|•|\\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#848484] font-dm-sans text-lg">
          Loading jobs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#848484] font-dm-sans text-lg mb-4">{error}</p>
          <Button
            onClick={getAllJobs}
            className="bg-[#DDDFFF] hover:bg-white text-black font-dm-sans font-semibold text-base px-8 py-6 rounded-md cursor-pointer"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Search Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
            {/* Main Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#848484] z-10" />
              <Input
                type="text"
                placeholder="Search Jobs, Companies or Skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#27282F] text-white placeholder-[#848484] font-dm-sans text-base pl-12 pr-4 py-6 rounded-md border-[#2A2A2A] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#3A3A3A]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-4">
              {/* Job Type Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 lg:flex-none bg-[#27282F] text-white hover:bg-[#3A3A3A] hover:text-white border-[#2A2A2A] font-dm-sans text-base rounded-md"
                  >
                    {selectedType}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#27282F] border-[#2A2A2A] text-white">
                  {jobTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className="font-dm-sans text-base hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] focus:text-white cursor-pointer"
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Location Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 lg:flex-none bg-[#27282F] text-white hover:bg-[#3A3A3A] hover:text-white border-[#2A2A2A] font-dm-sans text-base rounded-md"
                  >
                    {selectedLocation}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#27282F] border-[#2A2A2A] text-white">
                  {locations.map((location) => (
                    <DropdownMenuItem
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                      className="font-dm-sans text-base hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] focus:text-white cursor-pointer"
                    >
                      {location}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-[#848484] font-dm-sans text-sm">
              Showing {filteredJobs.length} jobs
            </p>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 hover:border-[#3A3A3A] transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Company Icon */}
                    <div className="flex shrink-0">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-[#27282F]">
                        {job.companyLogo ? (
                          <Image
                            src={job.companyLogo}
                            alt={job.jobTitle || "Company"}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full items-center justify-center text-[#BEC1CA] font-dm-sans font-bold text-xl"
                          style={{ display: job.companyLogo ? "none" : "flex" }}
                        >
                          {job.jobTitle?.charAt(0).toUpperCase() || "J"}
                        </div>
                      </div>
                    </div>

                    {/* Middle Section - Job Details */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Job Type */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#BEC1CA] font-dm-sans font-semibold text-xl sm:text-2xl mb-1">
                            {job.jobTitle || "Job Title"}
                          </h3>
                          <p className="text-[#848484] font-dm-sans text-base">
                            {job.experienceDetail || "Experience Level"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[#BEC1CA] font-dm-sans text-sm border-[#2A2A2A] bg-transparent hover:bg-transparent px-4 py-1.5 rounded-lg w-fit"
                        >
                          {job.workMode || "Full Time"}
                        </Badge>
                      </div>

                      {/* Location, Salary, Time */}
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 text-[#848484] font-dm-sans text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex shrink-0" />
                          <span>{getLocationDisplay(job)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{formatSalary(job.salaryEstimate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex shrink-0" />
                          <span>{formatTimePosted(job.posted_by)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[#848484] font-dm-sans text-sm sm:text-base leading-relaxed mb-5">
                        {job.lookingFor || "No description available"}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {parseSkills(job.toolsTech)
                          .slice(0, 5)
                          .map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-[#27282F] text-[#BEC1CA] font-dm-sans text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-[#2A2A2A] hover:bg-[#27282F]"
                            >
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex lg:flex-col gap-3 lg:items-end justify-start lg:justify-start shrink-0">
                      <Button
                        onClick={() => handleViewDetail(job)}
                        variant="outline"
                        className="flex-1 sm:flex-none bg-transparent text-[#BEC1CA] hover:bg-[#27282F] hover:text-white border-[#2A2A2A] font-dm-sans text-sm px-5 py-5 rounded-lg whitespace-nowrap cursor-pointer"
                      >
                        <Eye className="mr-2 w-4 h-4" />
                        View Detail
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSaveJob(job.id)}
                        className={`flex-1 sm:flex-none bg-transparent hover:bg-[#27282F] border-[#2A2A2A] font-dm-sans text-sm px-5 py-5 rounded-lg whitespace-nowrap cursor-pointer ${
                          savedJobs.includes(job.id)
                            ? "text-[#DDDFFF] border-[#DDDFFF]"
                            : "text-[#BEC1CA] hover:text-white"
                        }`}
                      >
                        <Bookmark
                          className={`mr-2 w-4 h-4 ${
                            savedJobs.includes(job.id) ? "fill-current" : ""
                          }`}
                        />
                        Save Job
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-[#848484] font-dm-sans text-lg">
                  No jobs found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-[#27282F]">
                    {selectedJob.companyLogo ? (
                      <Image
                        src={selectedJob.companyLogo}
                        alt={selectedJob.jobTitle || "Company"}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full items-center justify-center text-[#BEC1CA] font-dm-sans font-bold text-2xl"
                      style={{
                        display: selectedJob.companyLogo ? "none" : "flex",
                      }}
                    >
                      {selectedJob.jobTitle?.charAt(0).toUpperCase() || "J"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-[#BEC1CA] font-dm-sans font-bold text-2xl sm:text-3xl mb-2">
                      {selectedJob.jobTitle || "Job Title"}
                    </DialogTitle>
                    <DialogDescription className="text-[#848484] font-dm-sans text-lg">
                      {selectedJob.experienceDetail || "Experience Level"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Job Info */}
                <div className="flex flex-wrap gap-3 pb-6 border-b border-[#2A2A2A]">
                  <div className="flex items-center gap-2 text-[#848484]">
                    <MapPin className="w-4 h-4 flex shrink-0" />
                    <span className="font-dm-sans text-sm">
                      {getLocationDisplay(selectedJob)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#848484]">
                    <span className="font-dm-sans text-sm">
                      {formatSalary(selectedJob.salaryEstimate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#848484]">
                    <Clock className="w-4 h-4 flex shrink-0" />
                    <span className="font-dm-sans text-sm">
                      {formatTimePosted(selectedJob.posted_by)}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[#BEC1CA] font-dm-sans text-sm px-3 py-1 bg-transparent border-[#2A2A2A] rounded-lg hover:bg-transparent"
                  >
                    {selectedJob.workMode || "Full Time"}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
                    About the Role
                  </h4>
                  <p className="text-[#848484] font-dm-sans text-sm leading-relaxed">
                    {selectedJob.lookingFor || "No description available"}
                  </p>
                </div>

                {/* Responsibilities */}
                {selectedJob.jobMainDetails && (
                  <div>
                    <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
                      Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {parseResponsibilities(selectedJob.jobMainDetails).map(
                        (item, idx) => (
                          <li
                            key={idx}
                            className="text-[#848484] font-dm-sans text-sm flex gap-3"
                          >
                            <span className="text-[#DDDFFF] mt-1 flex shrink-0">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {selectedJob.requirements &&
                  parseRequirements(selectedJob.requirements).length > 0 && (
                    <div>
                      <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {parseRequirements(selectedJob.requirements).map(
                          (item, idx) => (
                            <li
                              key={idx}
                              className="text-[#848484] font-dm-sans text-sm flex gap-3"
                            >
                              <span className="text-[#DDDFFF] mt-1 flex shrink-0">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Skills */}
                {selectedJob.toolsTech && (
                  <div>
                    <h4 className="text-[#BEC1CA] font-dm-sans font-semibold text-lg mb-3">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parseSkills(selectedJob.toolsTech).map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-[#27282F] text-[#BEC1CA] font-dm-sans text-sm px-4 py-2 rounded-lg border-[#2A2A2A] hover:bg-[#27282F]"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#27282F] rounded-lg">
                  {selectedJob.benefits && (
                    <div>
                      <p className="text-[#848484] font-dm-sans text-xs mb-1">
                        Benefits
                      </p>
                      <p className="text-[#BEC1CA] font-dm-sans text-sm">
                        {selectedJob.benefits ? "Included" : "Not Specified"}
                      </p>
                    </div>
                  )}
                  {selectedJob.medical && (
                    <div>
                      <p className="text-[#848484] font-dm-sans text-xs mb-1">
                        Medical
                      </p>
                      <p className="text-[#BEC1CA] font-dm-sans text-sm">
                        {selectedJob.medical ? "Included" : "Not Specified"}
                      </p>
                    </div>
                  )}
                  {selectedJob.paidLeaves && (
                    <div>
                      <p className="text-[#848484] font-dm-sans text-xs mb-1">
                        Paid Leaves
                      </p>
                      <p className="text-[#BEC1CA] font-dm-sans text-sm">
                        {selectedJob.paidLeaves ? "Included" : "Not Specified"}
                      </p>
                    </div>
                  )}
                  {selectedJob.applications !== undefined && (
                    <div>
                      <p className="text-[#848484] font-dm-sans text-xs mb-1">
                        Applications
                      </p>
                      <p className="text-[#BEC1CA] font-dm-sans text-sm">
                        {selectedJob.applications}
                      </p>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="flex gap-3 pt-6 border-t border-[#2A2A2A]">
                  <Button
                    onClick={() => ApplyOnJob(selectedJob.id)}
                    disabled={loading}
                    className="flex-1 bg-[#DDDFFF] hover:bg-white text-black font-dm-sans font-semibold text-base px-8 py-6 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Applying..." : "Apply Now"}
                  </Button>
                  <Button
                    onClick={() => handleSaveJob(selectedJob.id)}
                    variant="outline"
                    className={`bg-transparent border-[#2A2A2A] font-dm-sans text-base px-6 py-6 rounded-md cursor-pointer ${
                      savedJobs.includes(selectedJob.id)
                        ? "text-[#DDDFFF] border-[#DDDFFF] hover:bg-[#27282F] hover:text-[#DDDFFF]"
                        : "text-[#BEC1CA] hover:text-white hover:bg-[#27282F]"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        savedJobs.includes(selectedJob.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllJobs;
