"use client";

import { SignUpFormData, SignUpSchema } from "@/utils/schemas/schemas";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from "@/api/axios";
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdPerson, MdLock, MdVisibility, MdVisibilityOff, MdEmail, MdPhone, MdLocationOn, MdCalendarToday } from "react-icons/md";
import { Role } from "@/lib/enums/role.enum";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<SignUpFormData>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            role: Role.ADMIN
        }
    });

    const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/register", data);
            toast.success(response.data.message || "Registration successful!");
            reset();
            router.push('/admin-dashboard');
        } catch (error: any) {
            console.log("This is the error", error);
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message || "Registration failed. Please try again.");
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-13 max-w-[800px] w-full mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-700 ease-out">
            <div className="border flex w-fit px-4 py-1.5 rounded-xl mb-7 bg-zinc-900 text-white hover:scale-105 transition-transform duration-300 ease-out">
                <h2 className="text-lg font-bold">Register User</h2>
            </div>

            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-1000 ease-out">
                <h1 className="text-[40px] sm:text-[45px] leading-[45px] sm:leading-[50px] font-bold tracking-tight text-left">
                    Create An Account
                </h1>
                <p className="text-muted-foreground text-sm text-balance">
                   Register a new user
                </p>
            </div>

            <div className="grid gap-6 w-full animate-in slide-in-from-bottom-4 duration-1000 ease-out delay-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div className="relative group">
                        <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("firstName")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="First Name"
                            error={errors.firstName?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("lastName")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="Last Name"
                            error={errors.lastName?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("userName")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="Username"
                            error={errors.userName?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("email")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="email"
                            placeholder="Email Address"
                            error={errors.email?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="rounded-xl text-sm py-5 pl-10 pr-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            placeholder="Password"
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

                    <div className="relative group">
                        <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("dateOfBirth")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="date"
                            error={errors.dateOfBirth?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("phoneNumber")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="tel"
                            placeholder="Phone Number"
                            error={errors.phoneNumber?.message}
                        />
                    </div>

                    {/* Address Information */}
                    <div className="relative group">
                        <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("address")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="Address"
                            error={errors.address?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("city")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="City"
                            error={errors.city?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("state")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="State"
                            error={errors.state?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("postalCode")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="Postal Code"
                            error={errors.postalCode?.message}
                        />
                    </div>

                    <div className="relative group">
                        <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300 ease-out group-hover:text-zinc-900" size={18} />
                        <Input
                            {...register("country")}
                            className="rounded-xl text-sm py-5 pl-10 w-full transition-all duration-300 ease-out focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                            type="text"
                            placeholder="Country"
                            error={errors.country?.message}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer flex w-full sm:w-fit mt-6 bg-zinc-900 rounded-xl px-10 py-5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
                >
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
            </div>
        </form>
    );
} 