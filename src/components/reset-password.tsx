"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/api/axios"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MdLock, MdInfo, MdVisibility, MdVisibilityOff } from "react-icons/md"
import Logo from "./common/Logo"

// Define schema for password reset
const ResetPasswordSchema = z
  .object({
    password: z.string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(35, { message: "Password should be less than 35 characters" })
      .refine(value => /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(value), {
        message: "Password must contain at least one uppercase letter and one symbol",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordData = z.infer<typeof ResetPasswordSchema>

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(ResetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new password reset link.")
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("/auth/reset-password", {
        password: data.password,
        token,
      })
      toast.success(response.data.message || "Password reset successful! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message || "Password reset failed. Please try again.")
      } else if (error.response && error.response.data) {
        const backendErrors = error.response.data
        Object.values(backendErrors).forEach((err: any) => {
          toast.error(err[0])
        })
      } else {
        toast.error("Password reset failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

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
          Reset <br />
          Password
        </h1>
        <p className="text-muted-foreground text-sm text-balance">Create a new secure password for your account</p>
      </div>

      <div className="grid gap-3 w-full animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-300">
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
              placeholder="New Password"
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out hover:text-zinc-900"
            >
              {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="relative group">
            <MdLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900"
              size={18}
            />
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="rounded-xl text-sm py-5 pl-10 pr-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              placeholder="Confirm New Password"
              error={errors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out hover:text-zinc-900"
            >
              {showConfirmPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="flex w-full sm:w-fit mt-10 bg-zinc-900 rounded-xl px-10 py-5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </Button>
      </div>

      <div className="bg-muted/50 rounded-lg px-2 py-2.5 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-500 mt-6">
        <MdInfo size={16} className="text-red-400" />
        <p className="text-muted-foreground text-[13px] md:text-sm">
          Create a strong password that you don't use elsewhere
        </p>
      </div>
    </form>
  )
}