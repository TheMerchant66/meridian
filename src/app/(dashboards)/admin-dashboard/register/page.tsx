"use client"
import { GalleryVerticalEnd } from "lucide-react"

import { TwoFactorAuth } from "@/components/two-factor-auth"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/admin-dashboard/register-form"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <RegisterForm />
            </div>
        </div>
    )
}
