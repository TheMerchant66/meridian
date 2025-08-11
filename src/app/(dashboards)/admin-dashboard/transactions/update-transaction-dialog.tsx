"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm, type FieldError } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Coins, CreditCard, Globe, Loader2 } from "lucide-react"
import { api } from "@/api/axios"
import { TransactionStatus, TransactionType } from "@/lib/enums/transactionType.enum"
import { format } from "date-fns"
import type { ITransactionPopulated } from "@/lib/models/transaction.model"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast";

const emptyToUndef = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v)

const BaseTransactionUpdateSchema = z.object({
    amount: z
        .preprocess((v) => (v === "" || v === null ? undefined : typeof v === "string" ? Number(v) : v), z
            .number({ invalid_type_error: "Amount must be a number" })
            .positive("Amount must be greater than 0")
            .optional()
        ),
    status: z.nativeEnum(TransactionStatus).optional(),
    notes: z.preprocess(emptyToUndef, z.string().max(500, "Notes cannot exceed 500 characters").optional()),
    paymentMethod: z.preprocess(emptyToUndef, z.string().max(50, "Payment method cannot exceed 50 characters").optional()),
    recipient: z.preprocess(emptyToUndef, z.string().max(100, "Recipient cannot exceed 100 characters").optional()),
})

const CryptoUpdateSchema = BaseTransactionUpdateSchema.extend({
    type: z.literal(TransactionType.CRYPTO_DEPOSIT),
    cryptoDetails: z
        .object({
            network: z.preprocess(emptyToUndef, z.string().min(1, "Network is required").optional()),
            walletAddress: z.preprocess(emptyToUndef, z.string().min(1, "Wallet address is required").optional()),
            proofOfPayment: z.preprocess(emptyToUndef, z.string().url("Enter a valid URL").optional()),
        })
        .partial()
        .optional(),
})

const ChequeUpdateSchema = BaseTransactionUpdateSchema.extend({
    type: z.literal(TransactionType.CHEQUE_DEPOSIT),
    chequeDetails: z
        .object({
            chequeNumber: z.preprocess(emptyToUndef, z.string().min(1, "Cheque number is required").optional()),
            date: z.preprocess(emptyToUndef, z.string().optional()),
            description: z.preprocess(emptyToUndef, z.string().optional()),
            frontImage: z.preprocess(emptyToUndef, z.string().url("Enter a valid URL").optional()),
            backImage: z.preprocess(emptyToUndef, z.string().url("Enter a valid URL").optional()),
        })
        .partial()
        .optional(),
})

const TransferUpdateSchema = BaseTransactionUpdateSchema.extend({
    type: z.literal(TransactionType.TRANSFER),
    transferDetails: z
        .object({
            accountName: z.preprocess(emptyToUndef, z.string().min(1, "Account name is required").optional()),
            accountNumber: z.preprocess(emptyToUndef, z.string().min(1, "Account number is required").optional()),
            bankName: z.preprocess(emptyToUndef, z.string().min(1, "Bank name is required").optional()),
            country: z.preprocess(emptyToUndef, z.string().min(1, "Country is required").optional()),
            swiftCode: z.preprocess(emptyToUndef, z.string().min(1, "SWIFT code is required").optional()),
            iban: z.preprocess(emptyToUndef, z.string().optional()),
            bankAddress: z.preprocess(emptyToUndef, z.string().min(1, "Bank address is required").optional()),
            description: z.preprocess(emptyToUndef, z.string().optional()),
        })
        .partial()
        .optional(),
})

const TransactionUpdateSchema = z.discriminatedUnion("type", [
    CryptoUpdateSchema,
    ChequeUpdateSchema,
    TransferUpdateSchema,
])

export type TransactionUpdateFormData = z.infer<typeof TransactionUpdateSchema>
export type Discriminant = TransactionUpdateFormData["type"]

interface Props {
    transaction: ITransactionPopulated
    open: boolean
    onOpenChange: (open: boolean) => void
    onTransactionUpdated: (updatedTransaction: ITransactionPopulated) => void
}

const toYMD = (d?: string | number | Date | null) => {
    if (!d) return ""
    const dt = d instanceof Date ? d : new Date(d)
    if (Number.isNaN(dt.getTime())) return ""
    return format(dt, "yyyy-MM-dd")
}

const isPlainObject = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v)

const pruneEmpty = (obj: any): any => {
    if (!isPlainObject(obj)) return obj
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined || v === null || v === "") continue
        if (isPlainObject(v)) {
            const child = pruneEmpty(v)
            if (Object.keys(child).length > 0) out[k] = child
        } else if (Array.isArray(v)) {
            const arr = v.map(pruneEmpty).filter((x) => x !== undefined)
            if (arr.length) out[k] = arr
        } else {
            out[k] = v
        }
    }
    return out
}

const buildPatchFromDirty = (dirty: any, values: any) => {
    const patch: any = {}
    const walk = (d: any, v: any, target: any) => {
        if (!d) return
        for (const key of Object.keys(d)) {
            const isDirty = d[key]
            const val = v?.[key]
            if (isPlainObject(isDirty)) {
                target[key] = target[key] || {}
                walk(isDirty, val, target[key])
                if (isPlainObject(target[key]) && Object.keys(target[key]).length === 0) delete target[key]
            } else if (isDirty === true) {
                target[key] = val
            }
        }
    }
    walk(dirty, values, patch)
    return pruneEmpty(patch)
}

export function UpdateTransactionDialog({ transaction, open, onOpenChange, onTransactionUpdated }: Props) {
    const initialType = transaction.type as Discriminant

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [formData, setFormData] = useState<TransactionUpdateFormData | null>(null)
    const [activeTab, setActiveTab] = useState<Discriminant>(initialType)
    const [pendingPatch, setPendingPatch] = useState<any>(null);

    const countries = useMemo(
        () => [
            { code: "US", name: "United States" },
            { code: "GB", name: "United Kingdom" },
            { code: "CA", name: "Canada" },
            { code: "DE", name: "Germany" },
            { code: "NG", name: "Nigeria" },
            { code: "AE", name: "United Arab Emirates" },
            { code: "FR", name: "France" },
            { code: "NL", name: "Netherlands" },
            { code: "SG", name: "Singapore" },
            { code: "AU", name: "Australia" },
        ],
        []
    )

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        getValues,
        formState: { errors, isDirty, dirtyFields },
    } = useForm<TransactionUpdateFormData>({
        resolver: zodResolver(TransactionUpdateSchema),
        defaultValues: {
            type: initialType,
            amount: transaction.amount,
            status: transaction.status as TransactionStatus,
            notes: transaction.notes || "",
            paymentMethod: transaction.paymentMethod || "",
            recipient: transaction.recipient || "",
            ...(initialType === TransactionType.CRYPTO_DEPOSIT && {
                cryptoDetails: transaction.cryptoDetails,
            }),
            ...(initialType === TransactionType.CHEQUE_DEPOSIT && {
                chequeDetails: {
                    ...transaction.chequeDetails,
                    date: toYMD(transaction.chequeDetails?.date),
                },
            }),
            ...(initialType === TransactionType.TRANSFER && {
                transferDetails: transaction.transferDetails,
            }),
        },
        mode: "onChange",
    })

    // Keep discriminant in sync with selected tab
    useEffect(() => {
        setValue("type", activeTab)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])

    // Reset when dialog opens / transaction changes
    useEffect(() => {
        if (!open) return
        const t = transaction.type as Discriminant
        reset({
            type: t,
            amount: transaction.amount,
            status: transaction.status as TransactionStatus,
            notes: transaction.notes || "",
            paymentMethod: transaction.paymentMethod || "",
            recipient: transaction.recipient || "",
            ...(t === TransactionType.CRYPTO_DEPOSIT && { cryptoDetails: transaction.cryptoDetails }),
            ...(t === TransactionType.CHEQUE_DEPOSIT && {
                chequeDetails: { ...transaction.chequeDetails, date: toYMD(transaction.chequeDetails?.date) },
            }),
            ...(t === TransactionType.TRANSFER && { transferDetails: transaction.transferDetails }),
        })
        setActiveTab(t)
        setShowConfirmation(false)
        setFormData(null)
    }, [open, transaction, reset])

    const handleClose = () => {
        if (isSubmitting) return
        reset()
        setShowConfirmation(false)
        setFormData(null)
        onOpenChange(false)
    }

    // Simple error getter for nested paths
    const fieldError = (path: string): FieldError | undefined => {
        const parts = path.split(".")
        let cur: any = errors
        for (const p of parts) {
            if (cur == null) return undefined
            cur = cur[p]
        }
        return cur as FieldError | undefined
    }



    // Submit -> review step. Build a minimal patch and store for confirmation
    const onSubmit = (data: TransactionUpdateFormData) => {
        const values = pruneEmpty(data);
        const patch = buildPatchFromDirty(dirtyFields, values);
        if (activeTab !== initialType || !!values.cryptoDetails || !!values.chequeDetails || !!values.transferDetails) {
            patch.type = activeTab;
        }
        if (Object.keys(patch).length === 0) {
            toast.success("No changes to save.");
            return;
        }
        setPendingPatch(patch);
        setFormData(values as TransactionUpdateFormData);
        setShowConfirmation(true);
    };

    const confirmUpdate = async () => {
        if (!pendingPatch) return;
        setIsSubmitting(true);
        try {
            const response = await api.put(`/transactions/${transaction._id}`, pendingPatch);
            toast.success("Update succesful.");
            onTransactionUpdated(response.data.transaction);
            handleClose();
        } catch (error: any) {
            console.log("This is the error", error);
            toast.error("Couldn't update the transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    const currencyCode = transaction?.currency?.name || "USD"
    const formatCurrency = (amount?: number) =>
        typeof amount === "number"
            ? new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(amount)
            : "—"

    if (!transaction || !open) return null

    // For subtle UI changes
    const currentStatus = watch("status")

    const renderTransactionTypeDetails = () => {
        switch (activeTab) {
            case TransactionType.CRYPTO_DEPOSIT:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Crypto Details <span className="text-muted-foreground font-normal">(all optional)</span></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="network">Network <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Input id="network" placeholder="e.g. Ethereum, BNB Smart Chain" {...register("cryptoDetails.network")} />
                                {fieldError("cryptoDetails.network") && (
                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("cryptoDetails.network")?.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="walletAddress">Wallet Address <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Input id="walletAddress" placeholder="0x..." {...register("cryptoDetails.walletAddress")} />
                                {fieldError("cryptoDetails.walletAddress") && (
                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("cryptoDetails.walletAddress")?.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="proofOfPayment">Proof of Payment (URL) <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Input id="proofOfPayment" placeholder="https://..." {...register("cryptoDetails.proofOfPayment")} />
                            </div>
                        </CardContent>
                    </Card>
                )

            case TransactionType.CHEQUE_DEPOSIT:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Cheque Details <span className="text-muted-foreground font-normal">(all optional)</span></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="chequeNumber">Cheque Number <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Input id="chequeNumber" {...register("chequeDetails.chequeNumber")} />
                                    {fieldError("chequeDetails.chequeNumber") && (
                                        <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("chequeDetails.chequeNumber")?.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Cheque Date <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Input id="date" type="date" {...register("chequeDetails.date")} />
                                    {fieldError("chequeDetails.date") && (
                                        <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("chequeDetails.date")?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Textarea id="description" placeholder="What is this cheque for?" {...register("chequeDetails.description")} />
                                {fieldError("chequeDetails.description") && (
                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("chequeDetails.description")?.message}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Front Image URL <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Input {...register("chequeDetails.frontImage")} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Back Image URL <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Input {...register("chequeDetails.backImage")} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            case TransactionType.TRANSFER:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Transfer Details <span className="text-muted-foreground font-normal">(all optional)</span></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accountName">Account Holder Name <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Input id="accountName" {...register("transferDetails.accountName")} />
                                    {fieldError("transferDetails.accountName") && (
                                        <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("transferDetails.accountName")?.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber">Account Number <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Input id="accountNumber" {...register("transferDetails.accountNumber")} />
                                    {fieldError("transferDetails.accountNumber") && (
                                        <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("transferDetails.accountNumber")?.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bankName">Bank Name <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Input id="bankName" {...register("transferDetails.bankName")} />
                                {fieldError("transferDetails.bankName") && (
                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("transferDetails.bankName")?.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Select
                                        onValueChange={(value) => setValue("transferDetails.country", value)}
                                        defaultValue={transaction.transferDetails?.country}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldError("transferDetails.country") && (
                                        <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("transferDetails.country")?.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="swiftCode">SWIFT Code <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                    <Input id="swiftCode" {...register("transferDetails.swiftCode")} />
                                    {fieldError("transferDetails.swiftCode") && (
                                        <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("transferDetails.swiftCode")?.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="iban">IBAN <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Input id="iban" {...register("transferDetails.iban")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bankAddress">Bank Address <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Textarea id="bankAddress" {...register("transferDetails.bankAddress")} />
                                {fieldError("transferDetails.bankAddress") && (
                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{fieldError("transferDetails.bankAddress")?.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Transfer Purpose <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                <Textarea id="description" placeholder="Add a note for the transfer" {...register("transferDetails.description")} />
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    const renderConfirmationDetails = () => {
        if (!formData) return null
        const countriesMap = Object.fromEntries(countries.map((c) => [c.code, c.name]))

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm text-gray-600">Transaction Type</Label>
                        <p className="font-semibold capitalize">
                            {formData.type === TransactionType.CRYPTO_DEPOSIT
                                ? "Crypto Deposit"
                                : formData.type === TransactionType.CHEQUE_DEPOSIT
                                    ? "Cheque Deposit"
                                    : "Transfer"}
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm text-gray-600">Amount</Label>
                        <p className="font-semibold">{formatCurrency(formData.amount)}</p>
                    </div>
                    <div>
                        <Label className="text-sm text-gray-600">Status</Label>
                        <p className="font-semibold capitalize">{formData.status ? String(formData.status).toLowerCase() : "—"}</p>
                    </div>
                    <div>
                        <Label className="text-sm text-gray-600">Payment Method</Label>
                        <p className="font-semibold">{formData.paymentMethod || "—"}</p>
                    </div>
                    <div>
                        <Label className="text-sm text-gray-600">Recipient</Label>
                        <p className="font-semibold">{formData.recipient || "—"}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="text-sm text-gray-600">Notes</Label>
                        <p className="font-semibold">{formData.notes || "—"}</p>
                    </div>
                </div>

                <Separator />

                {formData.type === TransactionType.CRYPTO_DEPOSIT && formData.cryptoDetails && (
                    <div className="space-y-3">
                        <h4 className="font-semibold">Crypto Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label className="text-sm text-gray-600">Network</Label>
                                <p className="font-semibold">{formData.cryptoDetails.network || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Wallet Address</Label>
                                <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded">{formData.cryptoDetails.walletAddress || "—"}</p>
                            </div>
                            {formData.cryptoDetails.proofOfPayment && (
                                <div className="md:col-span-2">
                                    <Label className="text-sm text-gray-600">Proof of Payment</Label>
                                    <p className="text-sm break-all">{formData.cryptoDetails.proofOfPayment}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {formData.type === TransactionType.CHEQUE_DEPOSIT && formData.chequeDetails && (
                    <div className="space-y-3">
                        <h4 className="font-semibold">Cheque Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label className="text-sm text-gray-600">Cheque Number</Label>
                                <p className="font-semibold">{formData.chequeDetails.chequeNumber || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Date</Label>
                                <p className="font-semibold">{formData.chequeDetails.date ? format(new Date(formData.chequeDetails.date), "PPP") : "—"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-sm text-gray-600">Description</Label>
                                <p className="text-sm">{formData.chequeDetails.description || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Front Image URL</Label>
                                <p className="text-sm break-all">{formData.chequeDetails.frontImage || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Back Image URL</Label>
                                <p className="text-sm break-all">{formData.chequeDetails.backImage || "—"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {formData.type === TransactionType.TRANSFER && formData.transferDetails && (
                    <div className="space-y-3">
                        <h4 className="font-semibold">Transfer Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label className="text-sm text-gray-600">Account Name</Label>
                                <p className="font-semibold">{formData.transferDetails.accountName || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Account Number</Label>
                                <p className="font-semibold">{formData.transferDetails.accountNumber || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Bank Name</Label>
                                <p className="font-semibold">{formData.transferDetails.bankName || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">Country</Label>
                                <p className="font-semibold">{countriesMap[formData.transferDetails.country ?? ""] || "—"}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600">SWIFT Code</Label>
                                <p className="font-semibold">{formData.transferDetails.swiftCode || "—"}</p>
                            </div>
                            {formData.transferDetails.iban && (
                                <div>
                                    <Label className="text-sm text-gray-600">IBAN</Label>
                                    <p className="font-semibold">{formData.transferDetails.iban}</p>
                                </div>
                            )}
                            <div className="md:col-span-2">
                                <Label className="text-sm text-gray-600">Bank Address</Label>
                                <p className="font-semibold">{formData.transferDetails.bankAddress || "—"}</p>
                            </div>
                            {formData.transferDetails.description && (
                                <div className="md:col-span-2">
                                    <Label className="text-sm text-gray-600">Transfer Purpose</Label>
                                    <p className="text-sm">{formData.transferDetails.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        {showConfirmation ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Coins className="h-5 w-5" />}
                        <h2 className="text-lg font-semibold">{showConfirmation ? "Review Changes" : "Update Transaction"}</h2>
                    </div>
                    <span className="text-sm text-muted-foreground">ID: {transaction._id?.slice?.(-8) || "—"}</span>
                </div>

                <div className="p-6">
                    {!showConfirmation ? (
                        <div className="space-y-6">
                            <Tabs value={String(activeTab)} onValueChange={(value) => setActiveTab(value as Discriminant)}>
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value={String(TransactionType.CRYPTO_DEPOSIT)} className="flex items-center space-x-2">
                                        <Coins className="h-4 w-4" />
                                        <span>Crypto</span>
                                    </TabsTrigger>
                                    <TabsTrigger value={String(TransactionType.CHEQUE_DEPOSIT)} className="flex items-center space-x-2">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Cheque</span>
                                    </TabsTrigger>
                                    <TabsTrigger value={String(TransactionType.TRANSFER)} className="flex items-center space-x-2">
                                        <Globe className="h-4 w-4" />
                                        <span>Transfer</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Transaction Information <span className="text-muted-foreground font-normal">(all optional)</span></CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="amount">Amount <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        step="0.01"
                                                        className="pl-8"
                                                        defaultValue={transaction.amount}
                                                        {...register("amount", { valueAsNumber: true })}
                                                    />
                                                </div>
                                                {errors.amount && (
                                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.amount.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="status">Status <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                                <Select onValueChange={(value) => setValue("status", value as TransactionStatus)} defaultValue={transaction.status as TransactionStatus}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(TransactionStatus).map((status) => (
                                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.status.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="paymentMethod">Payment Method <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                                <Input id="paymentMethod" placeholder="Credit Card, Bank Transfer, etc." defaultValue={transaction.paymentMethod || ""} {...register("paymentMethod")} />
                                                {errors.paymentMethod && (
                                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.paymentMethod.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="recipient">Recipient <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                                <Input id="recipient" placeholder="Recipient name or account" defaultValue={transaction.recipient || ""} {...register("recipient")} />
                                                {errors.recipient && (
                                                    <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.recipient.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Notes <span className="text-xs text-muted-foreground">(optional)</span></Label>
                                            <Textarea id="notes" placeholder="Additional transaction details" defaultValue={transaction.notes || ""} {...register("notes")} />
                                            {errors.notes && (
                                                <p className="text-red-500 text-sm flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.notes.message}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {renderTransactionTypeDetails()}

                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5">Current Status: {currentStatus || transaction.status}</span>
                                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5">Original Amount: {formatCurrency(transaction.amount)}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Review Changes</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-700">Review Transaction Changes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">{renderConfirmationDetails()}</CardContent>
                            </Card>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>Back to Edit</Button>
                                <Button onClick={confirmUpdate} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Confirm Changes</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
