"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { TwoFactorAuth } from "@/components/two-factor-auth";
import LoginForm from "@/components/login-form";
import { useState } from "react";

export default function LoginPage() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");

  const handleLoginSuccess = (accountNumber: string) => {
    setAccountNumber(accountNumber);
    setShowTwoFactor(true);
  };

  const handleCancel = () => {
    setShowTwoFactor(false);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[23rem]">
            {showTwoFactor ? (
              <TwoFactorAuth accountNumber={accountNumber} onCancel={handleCancel} />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 rounded-2xl m-5 relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/print.webp"
            alt="Image"
            className="max-w-full max-h-full object-contain dark:brightness-[0.2] dark:grayscale scale-50"
          />
        </div>
      </div>
    </div>
  );
}