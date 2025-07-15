"use client"

import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Edit2 } from "lucide-react"
import { api } from "@/api/axios"
import { toast } from "@/components/ui/use-toast"
import { ITransactionPopulated } from "@/lib/models/transaction.model"
import { TransactionStatus, TransactionType } from "@/lib/enums/transactionType.enum"
import { AccountType } from "@/lib/enums/role.enum"

const UpdateTransactionSchema = z.object({
    amount: z.number().min(0, "Amount must be positive"),
    status: z.enum([TransactionStatus.PROCESSING, TransactionStatus.IN_PROGRESS, TransactionStatus.COMPLETED, TransactionStatus.CANCELLED]),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
    paymentMethod: z.string().max(50, "Payment method cannot exceed 50 characters").optional(),
    recipient: z.string().max(100, "Recipient cannot exceed 100 characters").optional(),
})

type UpdateTransactionFormData = z.infer<typeof UpdateTransactionSchema>

interface Props {
    transaction: ITransactionPopulated;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTransactionUpdated: (updatedTransaction: ITransactionPopulated) => void;
}

export function UpdateTransactionDialog({ transaction, open, onOpenChange, onTransactionUpdated }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [formData, setFormData] = useState<UpdateTransactionFormData | null>(null)

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UpdateTransactionFormData>({
        resolver: zodResolver(UpdateTransactionSchema),
        defaultValues: {
            amount: transaction.amount,
            status: transaction.status as TransactionStatus,
            notes: transaction.notes || '',
            paymentMethod: transaction.paymentMethod || '',
            recipient: transaction.recipient || '',
        }
    })

    useEffect(() => {
        if (open) {
            reset({
                amount: transaction.amount,
                status: transaction.status as TransactionStatus,
                notes: transaction.notes || '',
                paymentMethod: transaction.paymentMethod || '',
                recipient: transaction.recipient || '',
            })
            setShowConfirmation(false)
            setFormData(null)
        }
    }, [open, transaction, reset])

    const handleClose = () => {
        if (isSubmitting) return
        reset()
        setShowConfirmation(false)
        setFormData(null)
        onOpenChange(false)
    }

    const onSubmit: SubmitHandler<UpdateTransactionFormData> = async (data) => {
        setFormData(data)
        setShowConfirmation(true)
    }

    const confirmUpdate = async () => {
        if (!formData) return
        setIsSubmitting(true)
        try {
            const response = await api.put(`/transactions/${transaction._id}`, formData)
            toast({
                title: "Success",
                description: "Transaction updated successfully"
            })
            onTransactionUpdated(response.data.transaction)
            setShowConfirmation(false)
            setTimeout(() => {
                handleClose()
            }, 1000)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to update transaction"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    if (!transaction || !open) return null

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
                            <Edit2 className="h-5 w-5" />
                        )}
                        <h2 className="text-lg font-semibold">
                            {showConfirmation ? "Review Changes" : "Update Transaction"}
                        </h2>
                    </div>
                    <span className="text-sm text-muted-foreground">ID: {transaction._id}</span>
                </div>
                <div className="p-6">
                    {!showConfirmation ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Transaction Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                {...register("amount", { valueAsNumber: true })}
                                            />
                                            {errors.amount && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.amount.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                onValueChange={(value) => setValue("status", value as TransactionStatus)}
                                                defaultValue={transaction.status}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(TransactionStatus).map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.status && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.status.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="paymentMethod">Payment Method</Label>
                                            <Input id="paymentMethod" {...register("paymentMethod")} />
                                            {errors.paymentMethod && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.paymentMethod.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="recipient">Recipient</Label>
                                            <Input id="recipient" {...register("recipient")} />
                                            {errors.recipient && (
                                                <p className="text-red-500 text-sm flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {errors.recipient.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input id="notes" {...register("notes")} />
                                        {errors.notes && (
                                            <p className="text-red-500 text-sm flex items-center">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.notes.message}
                                            </p>
                                        )}
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
                                    <CardTitle className="text-lg text-green-700">Review Transaction Changes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm text-gray-600">Amount</Label>
                                            <p className="font-semibold">{formatCurrency(formData?.amount || 0)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Status</Label>
                                            <p className="font-semibold">{formData?.status}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Payment Method</Label>
                                            <p className="font-semibold">{formData?.paymentMethod || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Recipient</Label>
                                            <p className="font-semibold">{formData?.recipient || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">Notes</Label>
                                            <p className="font-semibold">{formData?.notes || 'N/A'}</p>
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
    )
}