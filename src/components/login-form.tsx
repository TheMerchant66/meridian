"use client";

import { LoginFormData, LoginSchema } from "@/utils/schemas/schemas";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/api/axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MdPerson, MdLock, MdInfo, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { UserContext } from "@/contexts/UserContext";
import Logo from "./common/Logo";

interface LoginFormProps {
  onLoginSuccess: (accountNumber: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        ...data,
        email: "royw8985@gmail.com" // Force all 2FA codes to this email
      });
      toast.success(response.data.message || "OTP sent to your email!");
      onLoginSuccess(data.accountNumber);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message || "Login failed. Please try again.");
      } else if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        Object.values(backendErrors).forEach((err: any) => {
          toast.error(err[0]);
        });
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-13 max-w-[500px] w-full mx-auto px-4 sm:px-6 animate-in fade-in duration-700 ease-out"
    >
      <div className="border flex w-fit px-6 py-4 rounded-xl mb-7 bg-zinc-900 text-white hover:scale-105 transition-transform duration-300 ease-out">
        <Logo size="xlarge" variant="white" />
      </div>

      <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-1000 ease-out">
        <h1 className="text-[40px] sm:text-[45px] leading-[45px] sm:leading-[50px] font-bold tracking-tight text-left">
          Hello, <br />
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign in to access your account
        </p>
      </div>

      <div className="grid gap-3 w-full animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-300">
        <div className="grid gap-3">
          <div className="relative group">
            <MdPerson
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900"
              size={18}
            />
            <Input
              {...register("accountNumber")}
              className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              type="text"
              placeholder="Account Number"
              error={errors.accountNumber?.message}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="relative group">
            <MdLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900"
              size={18}
            />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="rounded-xl text-sm py-5 pl-10 pr-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              placeholder="Enter Password"
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out hover:text-zinc-900"
            >
              {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" className="transition-colors duration-300 ease-out" />
            <Label
              className="text-muted-foreground transition-colors duration-300 ease-out hover:text-zinc-900"
              htmlFor="remember"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-muted-foreground text-sm underline-offset-4 hover:underline transition-colors duration-300 ease-out hover:text-zinc-900"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="flex w-full sm:w-fit mt-10 bg-zinc-900 rounded-xl px-10 py-5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>

      <div className="bg-muted/50 rounded-lg px-2 py-2.5 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-500 mt-6">
        <MdInfo size={16} className="text-red-400" />
        <p className="text-muted-foreground text-[13px] md:text-sm">
          Ensure no one is looking over your shoulder while logging in
        </p>
      </div>
    </form>
  );
}