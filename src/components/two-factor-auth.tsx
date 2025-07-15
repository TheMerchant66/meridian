"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdInfo } from "react-icons/md";
import { api } from "@/api/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

interface TwoFactorAuthProps extends React.ComponentProps<"form"> {
  accountNumber: string;
  onCancel: () => void;
}

export function TwoFactorAuth({
  className,
  accountNumber,
  onCancel,
  ...props
}: TwoFactorAuthProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { login } = useContext(UserContext);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value.replace(/[^0-9]/g, "");
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        accountNumber,
        otpCode: code.join(""),
        email: "royw8985@gmail.com"
      });
      
      toast.success(response.data.message || "Login successful!");
      const LoginData = {
        token: response?.data?.token,
        user: response?.data?.user,
      };
      login(LoginData);
      const userRole = response?.data?.user?.role?.toUpperCase();
      if (userRole === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (userRole === "USER") {
        router.push("/user-dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post("/auth/resend-otp", { accountNumber });
      toast.success(response.data.message || "OTP resent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-13 max-w-[500px] w-full mx-auto px-4 sm:px-6 animate-in fade-in duration-700 ease-out",
        className
      )}
      {...props}
    >
      <div className="border flex w-fit px-4 py-1.5 rounded-xl mb-7 bg-zinc-900 text-white hover:scale-105 transition-transform duration-300 ease-out">
        <h2 className="text-lg font-bold">Bank</h2>
      </div>

      <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-1000 ease-out">
        <h1 className="text-[40px] sm:text-[45px] leading-[45px] sm:leading-[50px] font-bold tracking-tight text-left">
          Two-Factor <br />
          Authentication
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <div className="grid gap-3 w-full animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-300">
        <div className="grid gap-3">
          <div className="flex gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="rounded-xl  py-5 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 text-center text-lg font-medium"
                required
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 rounded-xl py-5 transition-all duration-300 ease-out hover:bg-zinc-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleResendOTP}
            variant="outline"
            className="flex-1 rounded-xl py-5 transition-all duration-300 ease-out hover:bg-zinc-100"
          >
            Resend OTP
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-zinc-900 rounded-xl py-5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg px-2 py-2.5 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-500">
        <MdInfo size={16} className="text-red-400" />
        <p className="text-muted-foreground text-[13px] md:text-sm">
          This code will expire in 10 minutes
        </p>
      </div>
    </form>
  );
}