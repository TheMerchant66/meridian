"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, CheckCircle, AlertCircle, User } from "lucide-react";
import { api } from "@/api/axios";
import { AccountStatus } from "@/lib/enums/accountStatus.enum";
import { AccountLevel, Role } from "@/lib/enums/role.enum";
import { IUserWithId } from "@/lib/models/user.model";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// Validation schema for user update
const UpdateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name cannot exceed 50 characters"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters"),
    userName: z.string().min(3, "Username must be at least 3 characters").max(30, "Username cannot exceed 30 characters"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    dateOfBirth: z.string().optional(),
    phoneNumber: z.string().regex(/^\+?[\d\s-]{7,15}$/, "Phone number must be a valid format (7-15 digits)").optional(),
    address: z.string().max(100, "Address cannot exceed 100 characters").optional(),
    city: z.string().max(50, "City cannot exceed 50 characters").optional(),
    state: z.string().max(50, "State cannot exceed 50 characters").optional(),
    postalCode: z.string().max(10, "Postal code cannot exceed 10 characters").optional(),
    country: z.string().max(50, "Country cannot exceed 50 characters").optional(),
    role: z.enum([Role.ADMIN, Role.USER], { errorMap: () => ({ message: "Invalid role selected" }) }),
    accountLevel: z.enum([AccountLevel.GOLD, AccountLevel.PLATINUM, AccountLevel.REGULAR, AccountLevel.RUBY], {
        errorMap: () => ({ message: "Invalid account level selected" }),
    }),
    accountStatus: z.enum([AccountStatus.ACTIVE, AccountStatus.SUSPENDED, AccountStatus.PENDING, AccountStatus.CLOSED], {
        errorMap: () => ({ message: "Invalid account status selected" }),
    }),
    allowTransfer: z.boolean(),
    verified: z.boolean(),
    checkingAccount: z
        .object({
            accountNumber: z
                .string()
                .regex(/^\d{8,16}$/, "Account number must be 8-16 digits")
                .optional(),
            balance: z.number().min(0, "Balance cannot be negative").optional().nullable(),
            cardNumber: z
                .string()
                .regex(/^\d{16}$/, "Card number must be 16 digits")
                .optional(),
            expirationDate: z.string().optional().nullable(),
            cvc: z
                .string()
                .regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits")
                .optional(),
        })
        .optional(),
});

type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;

interface Props {
    customer: IUserWithId;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserUpdated: (updatedUser: IUserWithId) => void;
}

export function EditUserDialog({ customer, open, onOpenChange, onUserUpdated }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState<UpdateUserFormData | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UpdateUserFormData>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            userName: customer.userName,
            email: customer.email,
            dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : undefined,
            phoneNumber: customer.phoneNumber || '',
            address: customer.address || '',
            city: customer.city || '',
            state: customer.state || '',
            postalCode: customer.postalCode || '',
            country: customer.country || '',
            role: customer.role,
            accountLevel: customer.accountLevel,
            accountStatus: customer.accountStatus,
            allowTransfer: customer.allowTransfer,
            verified: customer.verified,
            checkingAccount: {
                accountNumber: customer.checkingAccount?.accountNumber || '',
                balance: customer.checkingAccount?.balance || null,
                cardNumber: customer.checkingAccount?.cardNumber || '',
                expirationDate: customer.checkingAccount?.expirationDate
                    ? new Date(customer.checkingAccount.expirationDate).toISOString().split('T')[0]
                    : undefined,
                cvc: customer.checkingAccount?.cvc || '',
            },
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                firstName: customer.firstName,
                lastName: customer.lastName,
                userName: customer.userName,
                email: customer.email,
                dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : undefined,
                phoneNumber: customer.phoneNumber || '',
                address: customer.address || '',
                city: customer.city || '',
                state: customer.state || '',
                postalCode: customer.postalCode || '',
                country: customer.country || '',
                role: customer.role,
                accountLevel: customer.accountLevel,
                accountStatus: customer.accountStatus,
                allowTransfer: customer.allowTransfer,
                verified: customer.verified,
                checkingAccount: {
                    accountNumber: customer.checkingAccount?.accountNumber || '',
                    balance: customer.checkingAccount?.balance || null,
                    cardNumber: customer.checkingAccount?.cardNumber || '',
                    expirationDate: customer.checkingAccount?.expirationDate
                        ? new Date(customer.checkingAccount.expirationDate).toISOString().split('T')[0]
                        : undefined,
                    cvc: customer.checkingAccount?.cvc || '',
                },
            });
            setShowConfirmation(false);
            setFormData(null);
        }
    }, [open, customer, reset]);

    const handleClose = () => {
        if (isSubmitting) return;
        reset();
        setShowConfirmation(false);
        setFormData(null);
        onOpenChange(false);
    };

    const onSubmit: SubmitHandler<UpdateUserFormData> = async (data) => {
        setFormData(data);
        setShowConfirmation(true);
    };

    const confirmUpdate = async () => {
        if (!formData) return;
        setIsSubmitting(true);
        try {
            const response = await api.put(`/admin/users/${customer._id}`, {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
                checkingAccount: {
                    ...formData.checkingAccount,
                    expirationDate: formData.checkingAccount?.expirationDate
                        ? new Date(formData.checkingAccount.expirationDate).toISOString()
                        : undefined,
                    balance: formData.checkingAccount?.balance || undefined,
                },
            });
            toast.success(`User details updated successfully`)
            onUserUpdated(response.data.user);
            setShowConfirmation(false);
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (error: any) {
            console.error("Update error:", error);
            toast.error(error?.response?.data?.message || "Failed to update user details.")
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!customer || !open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={handleClose}
            />
            <div className="relative z-50 w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        {showConfirmation ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                            <User className="h-5 w-5" />
                        )}
                        <h2 className="text-lg font-semibold">
                            {showConfirmation ? "Review Changes" : "Edit User Details"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{customer.firstName[0]}{customer.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <span>{customer.firstName} {customer.lastName} (ID: {customer._id})</span>
                    </div>
                </div>
                <div className="p-6">
                    {!showConfirmation ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" {...register("firstName")} />
                                            {errors.firstName && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.firstName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" {...register("lastName")} />
                                            {errors.lastName && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.lastName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="userName">Username</Label>
                                            <Input id="userName" {...register("userName")} />
                                            {errors.userName && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.userName.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" {...register("email")} />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                                            {errors.dateOfBirth && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.dateOfBirth.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input id="phoneNumber" {...register("phoneNumber")} />
                                            {errors.phoneNumber && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.phoneNumber.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Address Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" {...register("address")} />
                                        {errors.address && (
                                            <p className="text-red-500 text-sm flex items-center">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" {...register("city")} />
                                            {errors.city && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.city.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input id="state" {...register("state")} />
                                            {errors.state && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.state.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postalCode">Postal Code</Label>
                                            <Input id="postalCode" {...register("postalCode")} />
                                            {errors.postalCode && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.postalCode.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="country">Country</Label>
                                            <Input id="country" {...register("country")} />
                                            {errors.country && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.country.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Account Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Select
                                                onValueChange={(value) => setValue("role", value as Role)}
                                                defaultValue={customer.role}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(Role).map((role) => (
                                                        <SelectItem key={role} value={role}>
                                                            {role}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.role && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.role.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="accountLevel">Account Level</Label>
                                            <Select
                                                onValueChange={(value) => setValue("accountLevel", value as AccountLevel)}
                                                defaultValue={customer.accountLevel}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select account level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(AccountLevel).map((level) => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.accountLevel && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.accountLevel.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="accountStatus">Account Status</Label>
                                            <Select
                                                onValueChange={(value) => setValue("accountStatus", value as AccountStatus)}
                                                defaultValue={customer.accountStatus}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select account status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(AccountStatus).map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.accountStatus && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.accountStatus.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Account Permissions</Label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="allowTransfer"
                                                    {...register("allowTransfer")}
                                                />
                                                <Label htmlFor="allowTransfer">Allow Transfers</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="verified"
                                                    {...register("verified")}
                                                />
                                                <Label htmlFor="verified">Verified Account</Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Checking Account Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="checkingAccount.accountNumber">Account Number</Label>
                                            <Input id="checkingAccount.accountNumber" {...register("checkingAccount.accountNumber")} />
                                            {errors.checkingAccount?.accountNumber && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.checkingAccount.accountNumber.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="checkingAccount.balance">Balance</Label>
                                            <Input
                                                id="checkingAccount.balance"
                                                type="number"
                                                step="0.01"
                                                {...register("checkingAccount.balance", { valueAsNumber: true })}
                                            />
                                            {errors.checkingAccount?.balance && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.checkingAccount.balance.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="checkingAccount.cardNumber">Card Number</Label>
                                            <Input id="checkingAccount.cardNumber" {...register("checkingAccount.cardNumber")} />
                                            {errors.checkingAccount?.cardNumber && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.checkingAccount.cardNumber.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="checkingAccount.expirationDate">Expiration Date</Label>
                                            <Input
                                                id="checkingAccount.expirationDate"
                                                type="date"
                                                {...register("checkingAccount.expirationDate")}
                                            />
                                            {errors.checkingAccount?.expirationDate && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.checkingAccount.expirationDate.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="checkingAccount.cvc">CVC</Label>
                                            <Input id="checkingAccount.cvc" {...register("checkingAccount.cvc")} />
                                            {errors.checkingAccount?.cvc && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.checkingAccount.cvc.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Review Changes
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-700">Review User Changes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-gray-600">Full Name</Label>
                                            <p className="font-semibold">{formData?.firstName} {formData?.lastName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Username</Label>
                                            <p className="font-semibold">{formData?.userName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Email</Label>
                                            <p className="font-semibold">{formData?.email}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Date of Birth</Label>
                                            <p className="font-semibold">{formData?.dateOfBirth || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Phone Number</Label>
                                            <p className="font-semibold">{formData?.phoneNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Address</Label>
                                            <p className="font-semibold">{formData?.address || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">City</Label>
                                            <p className="font-semibold">{formData?.city || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">State</Label>
                                            <p className="font-semibold">{formData?.state || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Postal Code</Label>
                                            <p className="font-semibold">{formData?.postalCode || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Country</Label>
                                            <p className="font-semibold">{formData?.country || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Role</Label>
                                            <p className="font-semibold">{formData?.role}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Account Level</Label>
                                            <p className="font-semibold">{formData?.accountLevel}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Account Status</Label>
                                            <p className="font-semibold">{formData?.accountStatus}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Permissions</Label>
                                            <p className="font-semibold">
                                                {formData?.allowTransfer && "Allow Transfers, "}
                                                {formData?.verified && "Verified"}
                                                {!formData?.allowTransfer && !formData?.verified && "None"}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Account Number</Label>
                                            <p className="font-semibold">{formData?.checkingAccount?.accountNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Balance</Label>
                                            <p className="font-semibold">
                                                {formData?.checkingAccount?.balance != null
                                                    ? `$${formData.checkingAccount.balance.toFixed(2)}`
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Card Number</Label>
                                            <p className="font-semibold">{formData?.checkingAccount?.cardNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Expiration Date</Label>
                                            <p className="font-semibold">{formData?.checkingAccount?.expirationDate || "N/A"}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">CVC</Label>
                                            <p className="font-semibold">{formData?.checkingAccount?.cvc || "N/A"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
                                    Back to Edit
                                </Button>
                                <Button onClick={confirmUpdate} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Confirm Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}