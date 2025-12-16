// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Upload, X, Brain } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// // Zod validation schema
// const formSchema = z.object({
//   jobTitle: z
//     .string()
//     .min(2, "Job title must be at least 2 characters")
//     .max(100, "Job title is too long"),
//   toolsTech: z.string().min(2, "Please enter at least one tool or technology"),
//   experienceLevel: z
//     .number()
//     .min(1, "Experience level must be at least 1")
//     .max(10, "Experience level cannot exceed 10"),
//   experienceDetail: z
//     .string()
//     .min(
//       10,
//       "Please provide more detailed experience (at least 10 characters)"
//     ),
//   selfDescription: z
//     .string()
//     .min(50, "Self description must be at least 50 characters")
//     .max(1000, "Self description is too long"),
//   resume: z
//     .instanceof(File, { message: "Please upload a resume" })
//     .refine(
//       (file) => file.size <= 10 * 1024 * 1024,
//       "File size must be less than 10MB"
//     )
//     .refine(
//       (file) =>
//         ["application/pdf", "image/png", "image/jpeg"].includes(file.type),
//       "Only PDF, PNG, or JPG files are allowed"
//     ),
// });

// const ResumeAnalysis = () => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       jobTitle: "",
//       toolsTech: "",
//       experienceLevel: 5,
//       experienceDetail: "",
//       selfDescription: "",
//     },
//   });

//   const onSubmit = (data) => {
//     console.log("Form submitted:", data);
//     alert("Resume submitted successfully! Check console for data.");
//     form.reset();
//     setUploadedFile(null);
//   };

//   const handleFileChange = (file) => {
//     if (file) {
//       setUploadedFile(file);
//       form.setValue("resume", file, { shouldValidate: true });
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     handleFileChange(file);
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     form.setValue("resume", null);
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
//         <div className="max-w-5xl mx-auto text-center w-full">
//           {/* Main Heading */}
//           <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
//             Smart Feedback For Your Dream Job
//           </h1>

//           {/* Subheading */}
//           <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
//             Drop your resume for an ATS score and improvement tips.
//           </p>
//         </div>
//       </div>

//       {/* Form Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16">
//         <div className="w-full max-w-3xl">
//           {/* Logo and Title */}
//           <div className="text-center mb-8 sm:mb-10">
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <Brain className="w-8 h-8 text-[#DDDFFF]" />
//               <span className="text-[#DDDFFF] font-dm-sans font-bold text-md">
//                 TALENT FORGE
//               </span>
//             </div>
//             <h1 className="text-[#DDDFFF] text-2xl sm:text-3xl lg:text-4xl font-semibold font-dm-sans">
//               Get Your ATS Resume Score
//             </h1>
//           </div>

//           {/* Form Container with Gradient Background */}
//           <div
//             className="rounded-3xl p-6 sm:p-8 lg:p-10"
//             style={{
//               background: "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
//             }}
//           >
//             <Form {...form}>
//               <div className="space-y-6">
//                 {/* Job Title */}
//                 <FormField
//                   control={form.control}
//                   name="jobTitle"
//                   render={({ field }) => (
//                     <FormItem>
//                       <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                         Job Title
//                       </Label>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           type="text"
//                           placeholder="Full Stack Developer"
//                           className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none transition-colors font-dm-sans border-0"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs mt-1" />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Tools & Tech */}
//                 <FormField
//                   control={form.control}
//                   name="toolsTech"
//                   render={({ field }) => (
//                     <FormItem>
//                       <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                         Tools & Tech
//                       </Label>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           type="text"
//                           placeholder="Github, Node, Forklift, Biotech, etc."
//                           className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none transition-colors font-dm-sans border-0"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs mt-1" />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Experience Level (Number Wise) */}
//                 <FormField
//                   control={form.control}
//                   name="experienceLevel"
//                   render={({ field }) => (
//                     <FormItem>
//                       <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                         Level Of Experience (Number wise)
//                       </Label>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           type="number"
//                           placeholder="5 (on a scale 10)"
//                           min="1"
//                           max="10"
//                           onChange={(e) =>
//                             field.onChange(parseInt(e.target.value) || 0)
//                           }
//                           className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none transition-colors font-dm-sans border-0"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs mt-1" />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Experience Level (Job Detail Wise) */}
//                 <FormField
//                   control={form.control}
//                   name="experienceDetail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                         Level Of Experience (Job Detail Wise)
//                       </Label>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           type="text"
//                           placeholder="3 years as backend dev at xyz, 5 years as Teacher at ABC"
//                           className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none transition-colors font-dm-sans border-0"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs mt-1" />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Self Description/Capabilities */}
//                 <FormField
//                   control={form.control}
//                   name="selfDescription"
//                   render={({ field }) => (
//                     <FormItem>
//                       <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                         Self Description/Capabilities
//                       </Label>
//                       <FormControl>
//                         <Textarea
//                           {...field}
//                           rows="6"
//                           placeholder="Write a clear & concise Self description with responsibilities & expectations..."
//                           className="w-full bg-[#27282F] rounded-lg px-4 py-3 text-white placeholder-white focus:outline-none transition-colors resize-none font-dm-sans border-0"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs mt-1" />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Upload Resume */}
//                 <div>
//                   <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                     Upload Resume
//                   </Label>
//                   <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     className={`relative bg-[#2A2D35] border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors ${
//                       isDragging
//                         ? "border-blue-500 bg-[#2F3340]"
//                         : "border-gray-600"
//                     }`}
//                   >
//                     {uploadedFile ? (
//                       <div className="flex items-center justify-between bg-[#1F2229] rounded-lg p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-[#2A2D35] p-2 rounded">
//                             <Upload className="w-5 h-5 text-gray-400" />
//                           </div>
//                           <div className="text-left">
//                             <p className="text-white text-sm font-medium truncate max-w-xs">
//                               {uploadedFile.name}
//                             </p>
//                             <p className="text-gray-400 text-xs">
//                               {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={removeFile}
//                           className="text-gray-400 hover:text-red-400 transition-colors"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="mb-4 flex justify-center">
//                           <div className="bg-[#3A3D45] rounded-full p-4">
//                             <Upload className="w-8 h-8 text-gray-400" />
//                           </div>
//                         </div>
//                         <p className="text-white text-base mb-2">
//                           <label className="cursor-pointer text-white hover:text-gray-300 underline">
//                             Click to upload
//                             <input
//                               type="file"
//                               accept=".pdf,.png,.jpg,.jpeg"
//                               onChange={(e) =>
//                                 handleFileChange(e.target.files[0])
//                               }
//                               className="hidden"
//                             />
//                           </label>{" "}
//                           or drag and drop
//                         </p>
//                         <p className="text-gray-400 text-sm">
//                           PDF, PNG or JPG (max. 10MB)
//                         </p>
//                       </>
//                     )}
//                   </div>
//                   {form.formState.errors.resume && (
//                     <p className="text-red-400 text-xs mt-1">
//                       {form.formState.errors.resume.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   onClick={form.handleSubmit(onSubmit)}
//                   type="button"
//                   className="w-full bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold py-4 rounded-xl transition-all duration-200 transform font-dm-sans cursor-pointer"
//                 >
//                   Save & Analyze Resume
//                 </Button>
//               </div>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResumeAnalysis;

// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Upload, X, Brain } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// // Simplified Zod validation schema - only resume field
// const formSchema = z.object({
//   resume: z
//     .instanceof(File, { message: "Please upload a resume" })
//     .refine(
//       (file) => file.size <= 10 * 1024 * 1024,
//       "File size must be less than 10MB"
//     )
//     .refine(
//       (file) =>
//         ["application/pdf", "image/png", "image/jpeg"].includes(file.type),
//       "Only PDF, PNG, or JPG files are allowed"
//     ),
// });

// const ResumeAnalysis = () => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {},
//   });

//   // const onSubmit = (data) => {
//   //   console.log("Form submitted:", data);
//   //   alert("Resume submitted successfully! Check console for data.");
//   //   form.reset();
//   //   setUploadedFile(null);
//   // };

//   const onSubmit = async (data) => {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/analyze`,
//       data
//     );
//   };

//   const handleFileChange = (file) => {
//     if (file) {
//       setUploadedFile(file);
//       form.setValue("resume", file, { shouldValidate: true });
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     handleFileChange(file);
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     form.setValue("resume", null);
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
//         <div className="max-w-5xl mx-auto text-center w-full">
//           {/* Main Heading */}
//           <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
//             Smart Feedback For Your Dream Job
//           </h1>

//           {/* Subheading */}
//           <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
//             Drop your resume for an ATS score and improvement tips.
//           </p>
//         </div>
//       </div>

//       {/* Form Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16">
//         <div className="w-full max-w-3xl">
//           {/* Logo and Title */}
//           <div className="text-center mb-8 sm:mb-10">
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <Brain className="w-8 h-8 text-[#DDDFFF]" />
//               <span className="text-[#DDDFFF] font-dm-sans font-bold text-md">
//                 TALENT FORGE
//               </span>
//             </div>
//             <h1 className="text-[#DDDFFF] text-2xl sm:text-3xl lg:text-4xl font-semibold font-dm-sans">
//               Get Your ATS Resume Score
//             </h1>
//           </div>

//           {/* Form Container with Gradient Background */}
//           <div
//             className="rounded-3xl p-6 sm:p-8 lg:p-10"
//             style={{
//               background: "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
//             }}
//           >
//             <Form {...form}>
//               <div className="space-y-6">
//                 {/* Upload Resume */}
//                 <div>
//                   <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                     Upload Resume
//                   </Label>
//                   <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     className={`relative bg-[#2A2D35] border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors ${
//                       isDragging
//                         ? "border-blue-500 bg-[#2F3340]"
//                         : "border-gray-600"
//                     }`}
//                   >
//                     {uploadedFile ? (
//                       <div className="flex items-center justify-between bg-[#1F2229] rounded-lg p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-[#2A2D35] p-2 rounded">
//                             <Upload className="w-5 h-5 text-gray-400" />
//                           </div>
//                           <div className="text-left">
//                             <p className="text-white text-sm font-medium truncate max-w-xs">
//                               {uploadedFile.name}
//                             </p>
//                             <p className="text-gray-400 text-xs">
//                               {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={removeFile}
//                           className="text-gray-400 hover:text-red-400 transition-colors"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="mb-4 flex justify-center">
//                           <div className="bg-[#3A3D45] rounded-full p-4">
//                             <Upload className="w-8 h-8 text-gray-400" />
//                           </div>
//                         </div>
//                         <p className="text-white text-base mb-2">
//                           <label className="cursor-pointer text-white hover:text-gray-300 underline">
//                             Click to upload
//                             <input
//                               type="file"
//                               accept=".pdf,.png,.jpg,.jpeg"
//                               onChange={(e) =>
//                                 handleFileChange(e.target.files[0])
//                               }
//                               className="hidden"
//                             />
//                           </label>{" "}
//                           or drag and drop
//                         </p>
//                         <p className="text-gray-400 text-sm">
//                           PDF, PNG or JPG (max. 10MB)
//                         </p>
//                       </>
//                     )}
//                   </div>
//                   {form.formState.errors.resume && (
//                     <p className="text-red-400 text-xs mt-1">
//                       {form.formState.errors.resume.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   onClick={form.handleSubmit(onSubmit)}
//                   type="button"
//                   className="w-full bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold py-4 rounded-xl transition-all duration-200 transform font-dm-sans cursor-pointer"
//                 >
//                   Save & Analyze Resume
//                 </Button>
//               </div>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResumeAnalysis;

// Working version without showing result
// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Upload, X, Brain, Loader2 } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// // Simplified Zod validation schema - only resume field
// const formSchema = z.object({
//   resume: z
//     .instanceof(File, { message: "Please upload a resume" })
//     .refine(
//       (file) => file.size <= 10 * 1024 * 1024,
//       "File size must be less than 10MB"
//     )
//     .refine(
//       (file) =>
//         ["application/pdf", "image/png", "image/jpeg"].includes(file.type),
//       "Only PDF, PNG, or JPG files are allowed"
//     ),
// });

// const ResumeAnalysis = () => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {},
//   });

//   const onSubmit = async (data) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setSuccess(false);

//       // Create FormData to send file
//       const formData = new FormData();
//       formData.append("resume", data.resume);

//       // Make API request
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/analyze`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       // Handle success
//       console.log("Resume analysis response:", response.data);
//       setSuccess(true);

//       // Optional: Reset form after successful submission
//       setTimeout(() => {
//         form.reset();
//         setUploadedFile(null);
//         setSuccess(false);
//       }, 3000);
//     } catch (err) {
//       // Handle error
//       console.error("Error analyzing resume:", err);

//       if (err.response) {
//         // Server responded with error
//         setError(
//           err.response.data?.message || `Server error: ${err.response.status}`
//         );
//       } else if (err.request) {
//         // Request made but no response
//         setError("Network error. Please check your connection and try again.");
//       } else {
//         // Other errors
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileChange = (file) => {
//     if (file) {
//       setUploadedFile(file);
//       form.setValue("resume", file, { shouldValidate: true });
//       setError(null);
//       setSuccess(false);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       handleFileChange(file);
//     }
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     form.setValue("resume", null);
//     setError(null);
//     setSuccess(false);
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
//         <div className="max-w-5xl mx-auto text-center w-full">
//           {/* Main Heading */}
//           <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
//             Smart Feedback For Your Dream Job
//           </h1>

//           {/* Subheading */}
//           <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
//             Drop your resume for an ATS score and improvement tips.
//           </p>
//         </div>
//       </div>

//       {/* Form Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16">
//         <div className="w-full max-w-3xl">
//           {/* Logo and Title */}
//           <div className="text-center mb-8 sm:mb-10">
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <Brain className="w-8 h-8 text-[#DDDFFF]" />
//               <span className="text-[#DDDFFF] font-dm-sans font-bold text-md">
//                 TALENT FORGE
//               </span>
//             </div>
//             <h1 className="text-[#DDDFFF] text-2xl sm:text-3xl lg:text-4xl font-semibold font-dm-sans">
//               Get Your ATS Resume Score
//             </h1>
//           </div>

//           {/* Form Container with Gradient Background */}
//           <div
//             className="rounded-3xl p-6 sm:p-8 lg:p-10"
//             style={{
//               background: "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
//             }}
//           >
//             <Form {...form}>
//               <div className="space-y-6">
//                 {/* Success Message */}
//                 {success && (
//                   <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
//                     <p className="text-green-400 text-sm font-dm-sans text-center">
//                       ✓ Resume submitted successfully! Analysis in progress...
//                     </p>
//                   </div>
//                 )}

//                 {/* Error Message */}
//                 {error && (
//                   <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
//                     <p className="text-red-400 text-sm font-dm-sans text-center">
//                       {error}
//                     </p>
//                   </div>
//                 )}

//                 {/* Upload Resume */}
//                 <div>
//                   <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                     Upload Resume
//                   </Label>
//                   <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     className={`relative bg-[#2A2D35] border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors ${
//                       isDragging
//                         ? "border-blue-500 bg-[#2F3340]"
//                         : "border-gray-600"
//                     }`}
//                   >
//                     {uploadedFile ? (
//                       <div className="flex items-center justify-between bg-[#1F2229] rounded-lg p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-[#2A2D35] p-2 rounded">
//                             <Upload className="w-5 h-5 text-gray-400" />
//                           </div>
//                           <div className="text-left">
//                             <p className="text-white text-sm font-medium truncate max-w-xs">
//                               {uploadedFile.name}
//                             </p>
//                             <p className="text-gray-400 text-xs">
//                               {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={removeFile}
//                           disabled={isLoading}
//                           className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="mb-4 flex justify-center">
//                           <div className="bg-[#3A3D45] rounded-full p-4">
//                             <Upload className="w-8 h-8 text-gray-400" />
//                           </div>
//                         </div>
//                         <p className="text-white text-base mb-2">
//                           <label className="cursor-pointer text-white hover:text-gray-300 underline">
//                             Click to upload
//                             <input
//                               type="file"
//                               accept=".pdf,.png,.jpg,.jpeg"
//                               onChange={(e) =>
//                                 handleFileChange(e.target.files[0])
//                               }
//                               disabled={isLoading}
//                               className="hidden"
//                             />
//                           </label>{" "}
//                           or drag and drop
//                         </p>
//                         <p className="text-gray-400 text-sm">
//                           PDF, PNG or JPG (max. 10MB)
//                         </p>
//                       </>
//                     )}
//                   </div>
//                   {form.formState.errors.resume && (
//                     <p className="text-red-400 text-xs mt-1">
//                       {form.formState.errors.resume.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   onClick={form.handleSubmit(onSubmit)}
//                   type="button"
//                   disabled={isLoading || !uploadedFile}
//                   className="w-full bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold py-4 rounded-xl transition-all duration-200 transform font-dm-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Analyzing Resume...
//                     </span>
//                   ) : (
//                     "Save & Analyze Resume"
//                   )}
//                 </Button>
//               </div>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResumeAnalysis;

// Most Working Code
// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Upload,
//   X,
//   Brain,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   XCircle,
// } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// // Simplified Zod validation schema - only resume field
// const formSchema = z.object({
//   resume: z
//     .instanceof(File, { message: "Please upload a resume" })
//     .refine(
//       (file) => file.size <= 10 * 1024 * 1024,
//       "File size must be less than 10MB"
//     )
//     .refine(
//       (file) =>
//         ["application/pdf", "image/png", "image/jpeg"].includes(file.type),
//       "Only PDF, PNG, or JPG files are allowed"
//     ),
// });

// const ResumeAnalysis = () => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState(null);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {},
//   });

//   // Function to parse the Gemini response text
//   const parseGeminiResponse = (responseText) => {
//     // Safety check - ensure responseText is a string
//     if (!responseText || typeof responseText !== "string") {
//       console.error("Invalid response text:", responseText);
//       return {
//         additions: "No additions data available.",
//         changes: "No changes data available.",
//         removals: "No removals data available.",
//       };
//     }

//     const sections = {
//       additions: "",
//       changes: "",
//       removals: "",
//     };

//     try {
//       // Split by numbered sections
//       const additionsMatch = responseText.match(
//         /1\.\s*\*\*Additions:\*\*(.*?)(?=2\.\s*\*\*Changes:\*\*|$)/s
//       );
//       const changesMatch = responseText.match(
//         /2\.\s*\*\*Changes:\*\*(.*?)(?=3\.\s*\*\*Removals:\*\*|$)/s
//       );
//       const removalsMatch = responseText.match(
//         /3\.\s*\*\*Removals:\*\*(.*?)$/s
//       );

//       if (additionsMatch && additionsMatch[1]) {
//         sections.additions = additionsMatch[1].trim();
//       }
//       if (changesMatch && changesMatch[1]) {
//         sections.changes = changesMatch[1].trim();
//       }
//       if (removalsMatch && removalsMatch[1]) {
//         sections.removals = removalsMatch[1].trim();
//       }

//       // If no sections were found, return the whole text
//       if (!sections.additions && !sections.changes && !sections.removals) {
//         sections.additions = responseText;
//       }
//     } catch (parseError) {
//       console.error("Error parsing response:", parseError);
//       sections.additions = responseText;
//     }

//     return sections;
//   };

//   const onSubmit = async (data) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setSuccess(false);
//       setAnalysisResult(null);

//       // Create FormData to send file
//       const formData = new FormData();
//       formData.append("resume", data.resume);

//       // Make API request
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/analyze`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       // Handle success
//       console.log("Resume analysis response:", response.data);
//       setSuccess(true);

//       // Store the analysis result with proper validation
//       if (response.data?.gemini_response?.changes) {
//         const changesText =
//           typeof response.data.gemini_response.changes === "object"
//             ? response.data.gemini_response.changes.changes
//             : response.data.gemini_response.changes;

//         setAnalysisResult(parseGeminiResponse(changesText));
//       } else {
//         // Fallback if response structure is different
//         setAnalysisResult({
//           additions: "Analysis completed successfully.",
//           changes: "Please check the console for full response details.",
//           removals: "",
//         });
//       }
//     } catch (err) {
//       // Handle error
//       console.error("Error analyzing resume:", err);

//       if (err.response) {
//         // Server responded with error
//         setError(
//           err.response.data?.message || `Server error: ${err.response.status}`
//         );
//       } else if (err.request) {
//         // Request made but no response
//         setError("Network error. Please check your connection and try again.");
//       } else {
//         // Other errors
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileChange = (file) => {
//     if (file) {
//       setUploadedFile(file);
//       form.setValue("resume", file, { shouldValidate: true });
//       setError(null);
//       setSuccess(false);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       handleFileChange(file);
//     }
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     form.setValue("resume", null);
//     setError(null);
//     setSuccess(false);
//     setAnalysisResult(null);
//   };

//   const handleNewAnalysis = () => {
//     form.reset();
//     setUploadedFile(null);
//     setSuccess(false);
//     setAnalysisResult(null);
//     setError(null);
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
//         <div className="max-w-5xl mx-auto text-center w-full">
//           {/* Main Heading */}
//           <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
//             Smart Feedback For Your Dream Job
//           </h1>

//           {/* Subheading */}
//           <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
//             Drop your resume for an ATS score and improvement tips.
//           </p>
//         </div>
//       </div>

//       {/* Form Section */}
//       <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16">
//         <div className="w-full max-w-3xl">
//           {/* Logo and Title */}
//           <div className="text-center mb-8 sm:mb-10">
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <Brain className="w-8 h-8 text-[#DDDFFF]" />
//               <span className="text-[#DDDFFF] font-dm-sans font-bold text-md">
//                 TALENT FORGE
//               </span>
//             </div>
//             <h1 className="text-[#DDDFFF] text-2xl sm:text-3xl lg:text-4xl font-semibold font-dm-sans">
//               Get Your ATS Resume Score
//             </h1>
//           </div>

//           {/* Form Container with Gradient Background */}
//           <div
//             className="rounded-3xl p-6 sm:p-8 lg:p-10"
//             style={{
//               background: "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
//             }}
//           >
//             <Form {...form}>
//               <div className="space-y-6">
//                 {/* Success Message */}
//                 {success && (
//                   <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
//                     <p className="text-green-400 text-sm font-dm-sans text-center">
//                       ✓ Resume analyzed successfully! Check the results below.
//                     </p>
//                   </div>
//                 )}

//                 {/* Error Message */}
//                 {error && (
//                   <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
//                     <p className="text-red-400 text-sm font-dm-sans text-center">
//                       {error}
//                     </p>
//                   </div>
//                 )}

//                 {/* Upload Resume */}
//                 <div>
//                   <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
//                     Upload Resume
//                   </Label>
//                   <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     className={`relative bg-[#2A2D35] border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors ${
//                       isDragging
//                         ? "border-blue-500 bg-[#2F3340]"
//                         : "border-gray-600"
//                     }`}
//                   >
//                     {uploadedFile ? (
//                       <div className="flex items-center justify-between bg-[#1F2229] rounded-lg p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-[#2A2D35] p-2 rounded">
//                             <Upload className="w-5 h-5 text-gray-400" />
//                           </div>
//                           <div className="text-left">
//                             <p className="text-white text-sm font-medium truncate max-w-xs">
//                               {uploadedFile.name}
//                             </p>
//                             <p className="text-gray-400 text-xs">
//                               {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={removeFile}
//                           disabled={isLoading}
//                           className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="mb-4 flex justify-center">
//                           <div className="bg-[#3A3D45] rounded-full p-4">
//                             <Upload className="w-8 h-8 text-gray-400" />
//                           </div>
//                         </div>
//                         <p className="text-white text-base mb-2">
//                           <label className="cursor-pointer text-white hover:text-gray-300 underline">
//                             Click to upload
//                             <input
//                               type="file"
//                               accept=".pdf,.png,.jpg,.jpeg"
//                               onChange={(e) =>
//                                 handleFileChange(e.target.files[0])
//                               }
//                               disabled={isLoading}
//                               className="hidden"
//                             />
//                           </label>{" "}
//                           or drag and drop
//                         </p>
//                         <p className="text-gray-400 text-sm">
//                           PDF, PNG or JPG (max. 10MB)
//                         </p>
//                       </>
//                     )}
//                   </div>
//                   {form.formState.errors.resume && (
//                     <p className="text-red-400 text-xs mt-1">
//                       {form.formState.errors.resume.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <Button
//                   onClick={form.handleSubmit(onSubmit)}
//                   type="button"
//                   disabled={isLoading || !uploadedFile}
//                   className="w-full bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold py-4 rounded-xl transition-all duration-200 transform font-dm-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Analyzing Resume...
//                     </span>
//                   ) : (
//                     "Save & Analyze Resume"
//                   )}
//                 </Button>
//               </div>
//             </Form>
//           </div>

//           {/* Analysis Results Section */}
//           {analysisResult && (
//             <div className="mt-8 space-y-6">
//               {/* New Analysis Button */}
//               <div className="flex justify-end">
//                 <Button
//                   onClick={handleNewAnalysis}
//                   type="button"
//                   className="bg-[#2A2D35] hover:bg-[#3A3D45] text-white font-dm-sans px-6 py-2 rounded-lg transition-colors"
//                 >
//                   Analyze New Resume
//                 </Button>
//               </div>

//               {/* Results Header */}
//               <div className="text-center mb-6">
//                 <h2 className="text-[#DDDFFF] text-2xl sm:text-3xl font-semibold font-dm-sans mb-2">
//                   Resume Analysis Results
//                 </h2>
//                 <p className="text-[#848484] text-sm font-dm-sans">
//                   Here are the suggested improvements for your resume
//                 </p>
//               </div>

//               {/* Additions Section */}
//               {analysisResult.additions && (
//                 <div
//                   className="rounded-2xl p-6 sm:p-8"
//                   style={{
//                     background:
//                       "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
//                   }}
//                 >
//                   <div className="flex items-start gap-3 mb-4">
//                     <div className="bg-green-500/20 p-2 rounded-lg">
//                       <CheckCircle className="w-6 h-6 text-green-400" />
//                     </div>
//                     <div>
//                       <h3 className="text-green-400 text-lg font-semibold font-dm-sans mb-1">
//                         Additions
//                       </h3>
//                       <p className="text-[#848484] text-sm font-dm-sans">
//                         Content to add to improve your resume
//                       </p>
//                     </div>
//                   </div>
//                   <div className="bg-[#2A2D35] rounded-lg p-4">
//                     <p className="text-[#D6E0FF] text-sm font-dm-sans leading-relaxed whitespace-pre-wrap">
//                       {analysisResult.additions}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Changes Section */}
//               {analysisResult.changes && (
//                 <div
//                   className="rounded-2xl p-6 sm:p-8"
//                   style={{
//                     background:
//                       "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
//                   }}
//                 >
//                   <div className="flex items-start gap-3 mb-4">
//                     <div className="bg-blue-500/20 p-2 rounded-lg">
//                       <AlertCircle className="w-6 h-6 text-blue-400" />
//                     </div>
//                     <div>
//                       <h3 className="text-blue-400 text-lg font-semibold font-dm-sans mb-1">
//                         Changes
//                       </h3>
//                       <p className="text-[#848484] text-sm font-dm-sans">
//                         Modifications to enhance your resume
//                       </p>
//                     </div>
//                   </div>
//                   <div className="bg-[#2A2D35] rounded-lg p-4">
//                     <p className="text-[#D6E0FF] text-sm font-dm-sans leading-relaxed whitespace-pre-wrap">
//                       {analysisResult.changes}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Removals Section */}
//               {analysisResult.removals && (
//                 <div
//                   className="rounded-2xl p-6 sm:p-8"
//                   style={{
//                     background:
//                       "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
//                   }}
//                 >
//                   <div className="flex items-start gap-3 mb-4">
//                     <div className="bg-red-500/20 p-2 rounded-lg">
//                       <XCircle className="w-6 h-6 text-red-400" />
//                     </div>
//                     <div>
//                       <h3 className="text-red-400 text-lg font-semibold font-dm-sans mb-1">
//                         Removals
//                       </h3>
//                       <p className="text-[#848484] text-sm font-dm-sans">
//                         Content to remove from your resume
//                       </p>
//                     </div>
//                   </div>
//                   <div className="bg-[#2A2D35] rounded-lg p-4">
//                     <p className="text-[#D6E0FF] text-sm font-dm-sans leading-relaxed whitespace-pre-wrap">
//                       {analysisResult.removals}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResumeAnalysis;

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Upload,
  X,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

// Simplified Zod validation schema - only resume field
const formSchema = z.object({
  resume: z
    .instanceof(File, { message: "Please upload a resume" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    )
    .refine(
      (file) =>
        ["application/pdf", "image/png", "image/jpeg"].includes(file.type),
      "Only PDF, PNG, or JPG files are allowed"
    ),
});

const ResumeAnalysis = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // Function to format text with proper spacing and bullet points
  const formatText = (text) => {
    if (!text) return "";

    // Replace numbered items (1., 2., 3.) with proper line breaks
    let formatted = text.replace(/(\d+\.\s*\*\*[^*]+\*\*:)/g, "\n\n$1");

    // Add line breaks before bullet points or numbered lists within sections
    formatted = formatted.replace(/\s+(?=\d+\.)/g, "\n\n");

    // Clean up any multiple consecutive line breaks
    formatted = formatted.replace(/\n{3,}/g, "\n\n");

    return formatted.trim();
  };

  // Function to parse the Gemini response text
  const parseGeminiResponse = (responseText) => {
    // Safety check - ensure responseText is a string
    if (!responseText || typeof responseText !== "string") {
      console.error("Invalid response text:", responseText);
      return {
        additions: "No additions data available.",
        changes: "No changes data available.",
        removals: "No removals data available.",
      };
    }

    const sections = {
      additions: "",
      changes: "",
      removals: "",
    };

    try {
      // Split by numbered sections (1., 2., 3.)
      const additionsMatch = responseText.match(
        /1\.\s*\*\*Additions:\*\*(.*?)(?=2\.\s*\*\*Changes:\*\*|$)/s
      );
      const changesMatch = responseText.match(
        /2\.\s*\*\*Changes:\*\*(.*?)(?=3\.\s*\*\*Removals:\*\*|$)/s
      );
      const removalsMatch = responseText.match(
        /3\.\s*\*\*Removals:\*\*(.*?)$/s
      );

      if (additionsMatch && additionsMatch[1]) {
        sections.additions = formatText(additionsMatch[1]);
      }
      if (changesMatch && changesMatch[1]) {
        sections.changes = formatText(changesMatch[1]);
      }
      if (removalsMatch && removalsMatch[1]) {
        sections.removals = formatText(removalsMatch[1]);
      }

      // If no sections were found, return the whole text
      if (!sections.additions && !sections.changes && !sections.removals) {
        sections.additions = formatText(responseText);
      }
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      sections.additions = formatText(responseText);
    }

    return sections;
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setAnalysisResult(null);

      // Create FormData to send file
      const formData = new FormData();
      formData.append("resume", data.resume);

      // Make API request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      console.log("Resume analysis response:", response.data);
      setSuccess(true);

      // Store the analysis result with proper validation
      if (response.data?.gemini_response?.changes) {
        const changesText =
          typeof response.data.gemini_response.changes === "object"
            ? response.data.gemini_response.changes.changes
            : response.data.gemini_response.changes;

        setAnalysisResult(parseGeminiResponse(changesText));
      } else {
        // Fallback if response structure is different
        setAnalysisResult({
          additions: "Analysis completed successfully.",
          changes: "Please check the console for full response details.",
          removals: "",
        });
      }
    } catch (err) {
      // Handle error
      console.error("Error analyzing resume:", err);

      if (err.response) {
        // Server responded with error
        setError(
          err.response.data?.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      setUploadedFile(file);
      form.setValue("resume", file, { shouldValidate: true });
      setError(null);
      setSuccess(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    form.setValue("resume", null);
    setError(null);
    setSuccess(false);
    setAnalysisResult(null);
  };

  const handleNewAnalysis = () => {
    form.reset();
    setUploadedFile(null);
    setSuccess(false);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[calc(100vh-80px)]">
        <div className="max-w-5xl mx-auto text-center w-full">
          {/* Main Heading */}
          <h1 className="text-[#BEC1CA] font-dm-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 sm:mb-8 px-2">
            Smart Feedback For Your Dream Job
          </h1>

          {/* Subheading */}
          <p className="text-[#848484] font-dm-sans text-base sm:text-xl mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 sm:px-6">
            Drop your resume for an ATS score and improvement tips.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16">
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
              Get Your ATS Resume Score
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
              <div className="space-y-6">
                {/* Success Message */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                    <p className="text-green-400 text-sm font-dm-sans text-center">
                      ✓ Resume analyzed successfully! Check the results below.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm font-dm-sans text-center">
                      {error}
                    </p>
                  </div>
                )}

                {/* Upload Resume */}
                <div>
                  <Label className="block text-[#D6E0FF] text-sm mb-2 font-dm-sans">
                    Upload Resume
                  </Label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative bg-[#2A2D35] border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors ${
                      isDragging
                        ? "border-blue-500 bg-[#2F3340]"
                        : "border-gray-600"
                    }`}
                  >
                    {uploadedFile ? (
                      <div className="flex items-center justify-between bg-[#1F2229] rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#2A2D35] p-2 rounded">
                            <Upload className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-white text-sm font-medium truncate max-w-xs">
                              {uploadedFile.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          disabled={isLoading}
                          className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex justify-center">
                          <div className="bg-[#3A3D45] rounded-full p-4">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                        <p className="text-white text-base mb-2">
                          <label className="cursor-pointer text-white hover:text-gray-300 underline">
                            Click to upload
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) =>
                                handleFileChange(e.target.files[0])
                              }
                              disabled={isLoading}
                              className="hidden"
                            />
                          </label>{" "}
                          or drag and drop
                        </p>
                        <p className="text-gray-400 text-sm">
                          PDF, PNG or JPG (max. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                  {form.formState.errors.resume && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.resume.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  type="button"
                  disabled={isLoading || !uploadedFile}
                  className="w-full bg-[#CAC5FE] hover:bg-[#CAC5FE]/90 text-black font-semibold py-4 rounded-xl transition-all duration-200 transform font-dm-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Resume...
                    </span>
                  ) : (
                    "Save & Analyze Resume"
                  )}
                </Button>
              </div>
            </Form>
          </div>

          {/* Analysis Results Section */}
          {analysisResult && (
            <div className="mt-8 space-y-6">
              {/* New Analysis Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleNewAnalysis}
                  type="button"
                  className="bg-[#2A2D35] hover:bg-[#3A3D45] text-white font-dm-sans px-6 py-2 rounded-lg transition-colors"
                >
                  Analyze New Resume
                </Button>
              </div>

              {/* Results Header */}
              <div className="text-center mb-6">
                <h2 className="text-[#DDDFFF] text-2xl sm:text-3xl font-semibold font-dm-sans mb-2">
                  Resume Analysis Results
                </h2>
                <p className="text-[#848484] text-sm font-dm-sans">
                  Here are the suggested improvements for your resume
                </p>
              </div>

              {/* Additions Section */}
              {analysisResult.additions && (
                <div
                  className="rounded-2xl p-6 sm:p-8"
                  style={{
                    background:
                      "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-green-400 text-lg font-semibold font-dm-sans mb-1">
                        Additions
                      </h3>
                      <p className="text-[#848484] text-sm font-dm-sans">
                        Content to add to improve your resume
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#2A2D35] rounded-lg p-5 sm:p-6">
                    <div className="text-[#E1E4F0] text-sm sm:text-base font-dm-sans leading-loose space-y-3">
                      {analysisResult.additions.split("\n").map((line, index) =>
                        line.trim() ? (
                          <p key={index} className="mb-3">
                            {line.trim()}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Changes Section */}
              {analysisResult.changes && (
                <div
                  className="rounded-2xl p-6 sm:p-8"
                  style={{
                    background:
                      "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-blue-400 text-lg font-semibold font-dm-sans mb-1">
                        Changes
                      </h3>
                      <p className="text-[#848484] text-sm font-dm-sans">
                        Modifications to enhance your resume
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#2A2D35] rounded-lg p-5 sm:p-6">
                    <div className="text-[#E1E4F0] text-sm sm:text-base font-dm-sans leading-loose space-y-3">
                      {analysisResult.changes.split("\n").map((line, index) =>
                        line.trim() ? (
                          <p key={index} className="mb-3">
                            {line.trim()}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Removals Section */}
              {analysisResult.removals && (
                <div
                  className="rounded-2xl p-6 sm:p-8"
                  style={{
                    background:
                      "linear-gradient(160deg, #1A1C20 0%, #08090D 100%)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-red-500/20 p-2 rounded-lg flex-shrink-0">
                      <XCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-red-400 text-lg font-semibold font-dm-sans mb-1">
                        Removals
                      </h3>
                      <p className="text-[#848484] text-sm font-dm-sans">
                        Content to remove from your resume
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#2A2D35] rounded-lg p-5 sm:p-6">
                    <div className="text-[#E1E4F0] text-sm sm:text-base font-dm-sans leading-loose space-y-3">
                      {analysisResult.removals.split("\n").map((line, index) =>
                        line.trim() ? (
                          <p key={index} className="mb-3">
                            {line.trim()}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeAnalysis;
