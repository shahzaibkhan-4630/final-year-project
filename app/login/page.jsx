"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import axios from "axios";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});

const Login = () => {
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Option 1: Send as JSON (RECOMMENDED for login)
      const response = await axios.post(
        `${backendUrl}/auth/users/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsLoggedin(true);
        await getUserData(); // Use await if getUserData is async
        toast.success(response.data.message || "Login successful!");

        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-[580px] px-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl bg-[#1A1C20] border-[#4B4D4F]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center font-dm-sans text-[#D6E0FF]">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center font-dm-sans text-[#D6E0FF] text-sm sm:text-base">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            {/* Email Field */}
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

            {/* Password Field */}
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
                  placeholder="Enter your password"
                  className="bg-[#2A2C30] border-[#4B4D4F] text-[#D6E0FF] placeholder:text-[#7A7C7F] font-dm-sans text-sm sm:text-base h-10 sm:h-11 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D6E0FF] hover:text-[#CAC5FE] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs sm:text-sm font-dm-sans">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 sm:py-6 bg-[#CAC5FE] hover:bg-[#B8B3ED] text-black font-[Poppins] font-semibold rounded-full transition-colors text-base mt-2"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-[#D6E0FF] font-dm-sans text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#CAC5FE] hover:text-[#B8B3ED] font-semibold hover:underline transition-colors"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
