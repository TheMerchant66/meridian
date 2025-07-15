"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/api/axios"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MdPerson, MdEmail, MdInfo, MdArrowBack } from "react-icons/md"
import Logo from "./common/Logo"

// Define schema for forgot password
const ForgotPasswordSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
})

type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true)
    try {
      const response = await api.post("/auth/forgot-password", data)
      toast.success(response.data.message || "Password reset instructions sent to your email!")
      setIsSubmitted(true)
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message || "Request failed. Please try again.")
      } else if (error.response && error.response.data) {
        const backendErrors = error.response.data
        Object.values(backendErrors).forEach((err: any) => {
          toast.error(err[0])
        })
      } else {
        toast.error("Request failed. Please try again.")
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
          Forgot <br />
          Password?
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your account number and email to receive password reset instructions
        </p>
      </div>

      {!isSubmitted ? (
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
              {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex w-full sm:w-fit mt-10 bg-zinc-900 rounded-xl px-10 py-5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
          >
            {isLoading ? "Processing..." : "Reset Password"}
          </Button>

          <Link
            href="/login"
            className="flex items-center gap-2 text-muted-foreground text-sm mt-4 hover:text-zinc-900 transition-colors duration-300 ease-out w-fit"
          >
            <MdArrowBack size={16} />
            Back to login
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 w-full animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-300">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 flex flex-col gap-2">
            <h3 className="font-medium text-green-800">Check your email</h3>
            <p className="text-green-700 text-sm">
              We've sent password reset instructions to your email. Please check your inbox and spam folder.
            </p>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full sm:w-fit bg-zinc-900 text-white rounded-xl px-10 py-5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
          >
            Return to Login
          </Link>
        </div>
      )}

      <div className="bg-muted/50 rounded-lg px-2 py-2.5 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-500 mt-6">
        <MdInfo size={16} className="text-red-400" />
        <p className="text-muted-foreground text-[13px] md:text-sm">Never share your account details with anyone</p>
      </div>
    </form>
  )
}