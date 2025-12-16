"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Eye, EyeOff } from "lucide-react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";

// Validation schemas
const employeeSchema = z.object({
  profileImage: z
    .any()
    .refine((files) => files?.length === 1, "Profile image is required")
    .refine((files) => files?.[0]?.size <= 5000000, "Max file size is 5MB")
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files?.[0]?.type
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  username: z
    .string()
    .min(3, "User name must be at least 3 characters")
    .max(50, "User name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  skills: z
    .string()
    .min(3, "Skills must be at least 3 characters")
    .max(200, "Skills must be less than 200 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});

const employerSchema = z.object({
  profileImage: z
    .any()
    .refine((files) => files?.length === 1, "Profile image is required")
    .refine((files) => files?.[0]?.size <= 5000000, "Max file size is 5MB")
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files?.[0]?.type
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  companyEmail: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});

const Register = () => {
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [role, setRole] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(
      role === "Employee" ? employeeSchema : employerSchema
    ),
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setImagePreview(null);
    reset();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (data.profileImage?.[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      if (role === "Employee") {
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("skills", data.skills);
        formData.append("password", data.password);
        formData.append("role", "employee");
      } else if (role === "Employeer") {
        formData.append("companyName", data.companyName);
        formData.append("companyEmail", data.companyEmail);
        formData.append("password", data.password);
        formData.append("role", "employer");
      }

      const response = await axios.post(
        `${backendUrl}/auth/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Check the RESPONSE data, not form data
      if (response.data.success) {
        setIsLoggedin(true);
        await getUserData(); // Wait for user data to load
        toast.success(response.data.message || "Registration successful!");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:py-10">
      <Card className="w-full max-w-[400px] sm:max-w-md shadow-lg rounded-xl bg-[#1A1C20] border-[#4B4D4F]">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center font-dm-sans text-[#D6E0FF]">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center font-dm-sans text-[#D6E0FF] text-sm sm:text-base">
            {role ? `Register as ${role}` : "Select your role to get started"}
          </CardDescription>
        </CardHeader>

        {!role && (
          <CardContent className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 justify-center px-4 sm:px-6 pb-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-10 sm:px-14 py-5 sm:py-6 cursor-pointer bg-[#CAC5FE] hover:bg-[#CAC5FE] rounded-full text-black font-[Poppins] font-semibold text-base"
              onClick={() => handleRoleChange("Employee")}
            >
              Employee
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto px-10 sm:px-14 py-5 sm:py-6 cursor-pointer bg-[#CAC5FE] rounded-full hover:bg-[#CAC5FE] text-black font-[Poppins] font-semibold text-base"
              onClick={() => handleRoleChange("Employeer")}
            >
              Employeer
            </Button>
          </CardContent>
        )}

        {role && (
          <CardContent className="px-4 sm:px-6">
            <div
              className="flex items-center gap-1 cursor-pointer font-[Poppins] text-black mb-5 w-fit"
              onClick={() => handleRoleChange(null)}
            >
              <ArrowLeft size={20} color="#D6E0FF" />
              <span className="hover:underline font-dm-sans text-[#D6E0FF] text-sm sm:text-base">
                Go back
              </span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label
                  htmlFor="profileImage"
                  className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                >
                  Profile Image *
                </Label>
                <div className="flex flex-col items-center gap-3">
                  {imagePreview && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#CAC5FE] relative">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="w-full">
                    <label
                      htmlFor="profileImage"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-2 bg-[#2A2C30] border border-[#4B4D4F] rounded-lg cursor-pointer hover:bg-[#3A3C40] transition-colors"
                    >
                      <Upload size={18} color="#D6E0FF" />
                      <span className="text-[#D6E0FF] font-dm-sans text-sm">
                        Choose Image
                      </span>
                    </label>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register("profileImage", {
                        onChange: handleImageChange,
                      })}
                    />
                  </div>
                </div>
                {errors.profileImage && (
                  <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                    {errors.profileImage.message}
                  </p>
                )}
              </div>

              {/* Employee Fields */}
              {role === "Employee" && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                    >
                      User Name *
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your full name"
                      className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="skills"
                      className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                    >
                      Skills *
                    </Label>
                    <Input
                      id="skills"
                      type="text"
                      placeholder="e.g., React, Node.js, Python"
                      className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11"
                      {...register("skills")}
                    />
                    {errors.skills && (
                      <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                        {errors.skills.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                    >
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11 pr-10"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D6E0FF] hover:text-[#CAC5FE] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Employer Fields */}
              {role === "Employeer" && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                    >
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter company name"
                      className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11"
                      {...register("companyName")}
                    />
                    {errors.companyName && (
                      <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="companyEmail"
                      className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                    >
                      Company Email *
                    </Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="Enter company email"
                      className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11"
                      {...register("companyEmail")}
                    />
                    {errors.companyEmail && (
                      <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                        {errors.companyEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-[#D6E0FF] font-dm-sans text-sm sm:text-base"
                    >
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11 pr-10"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D6E0FF] hover:text-[#CAC5FE] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 sm:py-6 bg-[#CAC5FE] hover:bg-[#B8B3ED] text-black font-[Poppins] font-semibold rounded-full transition-colors text-base mt-2"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

              <p className="text-center text-[#D6E0FF] font-dm-sans text-sm">
                Already have an Account?{" "}
                <Link
                  href="/login"
                  className="text-[#CAC5FE] hover:text-[#B8B3ED] font-semibold hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Register;
