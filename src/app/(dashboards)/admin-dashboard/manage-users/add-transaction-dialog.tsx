"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, CheckCircle, AlertCircle, DollarSign, FileImage, X, ArrowLeft, Coins, CreditCard, Globe } from "lucide-react"
import { toast } from "react-hot-toast"
import { api } from "@/api/axios"
import { TransactionType, TransactionStatus } from "@/lib/enums/transactionType.enum"
import { IUserWithId } from "@/lib/models/user.model"
import { format } from "date-fns"

// Define schemas for each transaction type
const CryptoDepositSchema = z.object({
  type: z.literal(TransactionType.CRYPTO_DEPOSIT),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  accountType: z.enum(["checkingAccount", "investmentAccount"]),
  cryptoDetails: z.object({
    network: z.string().min(1, "Network is required"),
    walletAddress: z.string().min(1, "Wallet address is required"),
    proofOfPayment: z.string().optional(),
  }),
})

const ChequeDepositSchema = z.object({
  type: z.literal(TransactionType.CHEQUE_DEPOSIT),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  accountType: z.enum(["checkingAccount", "investmentAccount"]),
  chequeDetails: z.object({
    chequeNumber: z.string().min(1, "Cheque number is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().min(1, "Description is required"),
    frontImage: z.string().min(1, "Front image is required"),
    backImage: z.string().min(1, "Back image is required"),
  }),
})

const TransferSchema = z.object({
  type: z.literal(TransactionType.TRANSFER),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  accountType: z.enum(["checkingAccount", "investmentAccount"]),
  transferDetails: z.object({
    accountName: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    bankName: z.string().min(1, "Bank name is required"),
    country: z.string().min(1, "Country is required"),
    swiftCode: z.string().min(1, "SWIFT code is required"),
    iban: z.string().optional(),
    bankAddress: z.string().min(1, "Bank address is required"),
    description: z.string().optional(),
  }),
})

// Define specific types for each form
type CryptoDepositFormData = z.infer<typeof CryptoDepositSchema>
type ChequeDepositFormData = z.infer<typeof ChequeDepositSchema>
type TransferFormData = z.infer<typeof TransferSchema>

// Union type for form data
type TransactionFormData = CryptoDepositFormData | ChequeDepositFormData | TransferFormData

interface ICurrencyWithId {
  _id: string
  name: string
  symbol: string
  walletAddress: string
  active: boolean
}

interface Props {
  customer: IUserWithId
  retailerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTransactionDialog({ customer, retailerId, open, onOpenChange }: Props) {
  const [activeTab, setActiveTab] = useState("crypto")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currencies, setCurrencies] = useState<ICurrencyWithId[]>([])
  const [selectedAddress, setSelectedAddress] = useState("")
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null)
  const [frontChequeImage, setFrontChequeImage] = useState<File | null>(null)
  const [backChequeImage, setBackChequeImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState<TransactionFormData | null>(null)
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(undefined)

  const cryptoForm = useForm<CryptoDepositFormData>({
    resolver: zodResolver(CryptoDepositSchema),
    defaultValues: {
      type: TransactionType.CRYPTO_DEPOSIT,
      amount: 0,
      currency: "",
      accountType: "checkingAccount",
      cryptoDetails: { network: "", walletAddress: "", proofOfPayment: "" },
    },
  })

  const chequeForm = useForm<ChequeDepositFormData>({
    resolver: zodResolver(ChequeDepositSchema),
    defaultValues: {
      type: TransactionType.CHEQUE_DEPOSIT,
      amount: 0,
      currency: "",
      accountType: "checkingAccount",
      chequeDetails: { chequeNumber: "", date: "", description: "", frontImage: "", backImage: "" },
    },
  })

  const transferForm = useForm<TransferFormData>({
    resolver: zodResolver(TransferSchema),
    defaultValues: {
      type: TransactionType.TRANSFER,
      amount: 0,
      currency: "",
      accountType: "checkingAccount",
      transferDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        country: "",
        swiftCode: "",
        iban: "",
        bankAddress: "",
        description: "",
      },
    },
  })

  const accounts = [
    { id: "checkingAccount", name: "Checking Account" },
    { id: "loanAccount", name: "Loan Account" },
    { id: "investmentAccount", name: "Investment Account" },
  ]

  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "NZ", name: "New Zealand" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "SG", name: "Singapore" },
    { code: "CH", name: "Switzerland" },
    { code: "NL", name: "Netherlands" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "BE", name: "Belgium" },
    { code: "AT", name: "Austria" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "FI", name: "Finland" },
    { code: "IE", name: "Ireland" },
    { code: "LU", name: "Luxembourg" },
    { code: "PT", name: "Portugal" },
    { code: "GR", name: "Greece" },
    { code: "PL", name: "Poland" },
    { code: "CZ", name: "Czech Republic" },
    { code: "HU", name: "Hungary" },
    { code: "SK", name: "Slovakia" },
    { code: "RO", name: "Romania" },
    { code: "BG", name: "Bulgaria" },
    { code: "HR", name: "Croatia" },
    { code: "SI", name: "Slovenia" },
    { code: "EE", name: "Estonia" },
    { code: "LV", name: "Latvia" },
    { code: "LT", name: "Lithuania" },
    { code: "CY", name: "Cyprus" },
    { code: "MT", name: "Malta" },
    { code: "IS", name: "Iceland" },
    { code: "HK", name: "Hong Kong" },
    { code: "KR", name: "South Korea" },
    { code: "TW", name: "Taiwan" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "QA", name: "Qatar" },
    { code: "KW", name: "Kuwait" },
    { code: "BH", name: "Bahrain" },
    { code: "OM", name: "Oman" },
    { code: "IL", name: "Israel" },
    { code: "TR", name: "Turkey" },
    { code: "ZA", name: "South Africa" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "AR", name: "Argentina" },
    { code: "CL", name: "Chile" },
    { code: "CO", name: "Colombia" },
    { code: "PE", name: "Peru" },
    { code: "IN", name: "India" },
    { code: "CN", name: "China" },
    { code: "RU", name: "Russia" },
    { code: "ID", name: "Indonesia" },
    { code: "MY", name: "Malaysia" },
    { code: "TH", name: "Thailand" },
    { code: "VN", name: "Vietnam" },
    { code: "PH", name: "Philippines" },
  ]

  // Reset all state when dialog opens
  useEffect(() => {
    if (open) {
      setActiveTab("crypto")
      setShowConfirmation(false)
      setShowSuccess(false)
      setProofOfPayment(null)
      setFrontChequeImage(null)
      setBackChequeImage(null)
      setUploading(false)
      setUploadProgress(0)
      setFormData(null)
      setSelectedAddress("")
      setTransactionDate(undefined)

      cryptoForm.reset({
        type: TransactionType.CRYPTO_DEPOSIT,
        amount: 0,
        currency: "",
        accountType: "checkingAccount",
        cryptoDetails: { network: "", walletAddress: "", proofOfPayment: "" },
      })
      chequeForm.reset({
        type: TransactionType.CHEQUE_DEPOSIT,
        amount: 0,
        currency: "",
        accountType: "checkingAccount",
        chequeDetails: { chequeNumber: "", date: "", description: "", frontImage: "", backImage: "" },
      })
      transferForm.reset({
        type: TransactionType.TRANSFER,
        amount: 0,
        currency: "",
        accountType: "checkingAccount",
        transferDetails: {
          accountName: "",
          accountNumber: "",
          bankName: "",
          country: "",
          swiftCode: "",
          iban: "",
          bankAddress: "",
          description: "",
        },
      })

      const fetchCurrencies = async () => {
        try {
          const response = await api.get("/currencies")
          const currencyData: ICurrencyWithId[] = response.data.currencies || []
          const activeCurrencies = currencyData.filter((c) => c.active)
          setCurrencies(activeCurrencies)
          const defaultCurrency = activeCurrencies.find((c) => c.name === "USD")
          if (defaultCurrency) {
            cryptoForm.setValue("currency", defaultCurrency._id)
            chequeForm.setValue("currency", defaultCurrency._id)
            transferForm.setValue("currency", defaultCurrency._id)
            setSelectedAddress(defaultCurrency.walletAddress)
            cryptoForm.setValue("cryptoDetails.network", defaultCurrency.name === "BTC" ? "Bitcoin" : "Ethereum")
            cryptoForm.setValue("cryptoDetails.walletAddress", defaultCurrency.walletAddress)
          }
        } catch (error) {
          toast.error("Failed to load currencies.")
        }
      }
      fetchCurrencies()
    }
  }, [open, cryptoForm, chequeForm, transferForm])

  const cleanup = useCallback(() => {
    setActiveTab("crypto")
    setShowConfirmation(false)
    setShowSuccess(false)
    setProofOfPayment(null)
    setFrontChequeImage(null)
    setBackChequeImage(null)
    setUploading(false)
    setUploadProgress(0)
    setFormData(null)
    setSelectedAddress("")
    setTransactionDate(undefined)
    cryptoForm.reset()
    chequeForm.reset()
    transferForm.reset()
  }, [cryptoForm, chequeForm, transferForm])

  const handleClose = useCallback(() => {
    if (isSubmitting || uploading) return
    cleanup()
    onOpenChange(false)
  }, [isSubmitting, uploading, cleanup, onOpenChange])

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) handleClose()
  }, [handleClose])

  const handleCurrencyChange = (value: string) => {
    const selectedCurrency = currencies.find((c) => c._id === value)
    cryptoForm.setValue("currency", value)
    chequeForm.setValue("currency", value)
    transferForm.setValue("currency", value)
    setSelectedAddress(selectedCurrency?.walletAddress || "")
    if (selectedCurrency) {
      cryptoForm.setValue("cryptoDetails.network", selectedCurrency.name === "BTC" ? "Bitcoin" : "Ethereum")
      cryptoForm.setValue("cryptoDetails.walletAddress", selectedCurrency.walletAddress)
    }
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_preset")
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      toast.error("Failed to upload image.")
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleCryptoSubmit: SubmitHandler<CryptoDepositFormData> = async (data) => {
    if (!proofOfPayment) {
      toast.error("Proof of Payment is required.")
      return
    }
    const updatedData: CryptoDepositFormData = {
      ...data,
      cryptoDetails: {
        ...data.cryptoDetails,
        proofOfPayment: await uploadToCloudinary(proofOfPayment),
      },
    }
    setFormData(updatedData)
    setShowConfirmation(true)
  }

  const handleChequeSubmit: SubmitHandler<ChequeDepositFormData> = async (data) => {
    if (!frontChequeImage || !backChequeImage) {
      toast.error("Please upload both front and back cheque images.")
      return
    }
    try {
      const frontImageUrl = await uploadToCloudinary(frontChequeImage)
      const backImageUrl = await uploadToCloudinary(backChequeImage)
      const updatedData: ChequeDepositFormData = {
        ...data,
        chequeDetails: {
          ...data.chequeDetails,
          frontImage: frontImageUrl,
          backImage: backImageUrl,
        },
      }
      setFormData(updatedData)
      setShowConfirmation(true)
    } catch (error) {
      // Error handled in uploadToCloudinary
    }
  }

  const handleTransferSubmit: SubmitHandler<TransferFormData> = async (data) => {
    if (!customer.allowTransfer) {
      toast.error("Transfers are disabled for this customer.")
      return
    }
    setFormData(data)
    setShowConfirmation(true)
  }

  const confirmTransaction = async () => {
    if (!formData) return
    if (!transactionDate) {
      toast.error("Transaction date is required.")
      return
    }
    setIsSubmitting(true)
    try {
      const response = await api.post(`/admin/users/${retailerId}/transactions`, {
        userId: customer._id,
        ...formData,
        status: TransactionStatus.PROCESSING,
        createdAt: transactionDate.toISOString(),
      })
      setShowConfirmation(false)
      setShowSuccess(true)
      toast.success(`Transaction submitted successfully!`)
      setTimeout(() => {
        resetForm()
        onOpenChange(false)
      }, 5000)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit transaction.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    cryptoForm.reset()
    chequeForm.reset()
    transferForm.reset()
    setActiveTab("crypto")
    setShowConfirmation(false)
    setShowSuccess(false)
    setProofOfPayment(null)
    setFrontChequeImage(null)
    setBackChequeImage(null)
    setFormData(null)
    setSelectedAddress("")
    setTransactionDate(undefined)
  }

  const FileUploadArea = ({
    onFileSelect,
    accept = "image/*",
    label,
    file,
    onRemove,
  }: {
    onFileSelect: (file: File) => void
    accept?: string
    label: string
    file?: File | null
    onRemove?: () => void
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0])
        e.target.value = ''
      }
    }

    useEffect(() => {
      return () => {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }, [])

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {!file ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={handleClick}
          >
            <FileImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-2">
              <FileImage className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium truncate">{file.name}</span>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = ''
                  onRemove()
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-xs text-gray-500 text-center">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>
    )
  }

  if (!customer || !open) return null

  const currentBalance = customer[formData?.accountType || "checkingAccount"].balance
  const isDebit = formData?.type === TransactionType.TRANSFER
  const newBalance = isDebit
    ? currentBalance - (formData?.amount || 0)
    : currentBalance + (formData?.amount || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => {
          if (!isSubmitting && !uploading) onOpenChange(false)
        }}
      />
      <div className="relative z-50 w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            {showConfirmation ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : showSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <DollarSign className="h-5 w-5" />
            )}
            <h2 className="text-lg font-semibold">
              {showConfirmation ? "Review Transaction" : showSuccess ? "Transaction Successful" : "Add New Transaction"}
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
          {!showConfirmation && !showSuccess ? (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="crypto" className="flex items-center space-x-2">
                    <Coins className="h-4 w-4" />
                    <span>Crypto Deposit</span>
                  </TabsTrigger>
                  <TabsTrigger value="cheque" className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cheque Deposit</span>
                  </TabsTrigger>
                  <TabsTrigger value="transfer" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Transfer</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="crypto" className="space-y-6">
                  <form onSubmit={cryptoForm.handleSubmit(handleCryptoSubmit)} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Account & Currency</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="accountType">Deposit to Account</Label>
                            <Select
                              onValueChange={(value) => cryptoForm.setValue("accountType", value as any)}
                              defaultValue="checkingAccount"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {cryptoForm.formState.errors.accountType && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {cryptoForm.formState.errors.accountType.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select onValueChange={handleCurrencyChange} defaultValue="">
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency._id} value={currency._id}>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono">{currency.symbol}</span>
                                      <span>{currency.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {cryptoForm.formState.errors.currency && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {cryptoForm.formState.errors.currency.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <div className="relative">
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-8"
                              {...cryptoForm.register("amount", { valueAsNumber: true })}
                            />
                            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                          {cryptoForm.formState.errors.amount && (
                            <p className="text-red-500 text-sm flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {cryptoForm.formState.errors.amount.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transactionDate">Transaction Date</Label>
                          <Input
                            id="transactionDate"
                            type="datetime-local"
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : undefined
                              setTransactionDate(date)
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    {selectedAddress && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Wallet Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Network</Label>
                            <Input
                              value={cryptoForm.watch("cryptoDetails.network")}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Wallet Address</Label>
                            <Input
                              value={selectedAddress}
                              disabled
                              className="bg-gray-50 font-mono text-sm"
                            />
                          </div>
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Send cryptocurrency to the address above. The deposit will be processed once confirmed on the blockchain.
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    )}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Proof of Payment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FileUploadArea
                          label="Upload Transaction Receipt"
                          file={proofOfPayment}
                          onFileSelect={(file) => {
                            setProofOfPayment(file)
                            cryptoForm.setValue("cryptoDetails.proofOfPayment", file.name)
                          }}
                          onRemove={() => {
                            setProofOfPayment(null)
                            cryptoForm.setValue("cryptoDetails.proofOfPayment", "")
                          }}
                        />
                      </CardContent>
                    </Card>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting || uploading}>
                        {isSubmitting || uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Review Transaction
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="cheque" className="space-y-6">
                  <form onSubmit={chequeForm.handleSubmit(handleChequeSubmit)} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Account & Currency</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="accountType">Deposit to Account</Label>
                            <Select
                              onValueChange={(value) => chequeForm.setValue("accountType", value as any)}
                              defaultValue="checkingAccount"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {chequeForm.formState.errors.accountType && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {chequeForm.formState.errors.accountType.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select onValueChange={handleCurrencyChange} defaultValue="">
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency._id} value={currency._id}>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono">{currency.symbol}</span>
                                      <span>{currency.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {chequeForm.formState.errors.currency && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {chequeForm.formState.errors.currency.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <div className="relative">
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-8"
                              {...chequeForm.register("amount", { valueAsNumber: true })}
                            />
                            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                          {chequeForm.formState.errors.amount && (
                            <p className="text-red-500 text-sm flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {chequeForm.formState.errors.amount.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transactionDate">Transaction Date</Label>
                          <Input
                            id="transactionDate"
                            type="datetime-local"
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : undefined
                              setTransactionDate(date)
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cheque Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="chequeNumber">Cheque Number</Label>
                            <Input
                              id="chequeNumber"
                              placeholder="e.g., 001234"
                              {...chequeForm.register("chequeDetails.chequeNumber")}
                            />
                            {chequeForm.formState.errors.chequeDetails?.chequeNumber && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {chequeForm.formState.errors.chequeDetails.chequeNumber.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date">Cheque Date</Label>
                            <Input id="date" type="date" {...chequeForm.register("chequeDetails.date")} />
                            {chequeForm.formState.errors.chequeDetails?.date && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {chequeForm.formState.errors.chequeDetails.date.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Brief description of the deposit..."
                            {...chequeForm.register("chequeDetails.description")}
                          />
                          {chequeForm.formState.errors.chequeDetails?.description && (
                            <p className="text-red-500 text-sm flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {chequeForm.formState.errors.chequeDetails.description.message}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cheque Images</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FileUploadArea
                            label="Front of Cheque"
                            file={frontChequeImage}
                            onFileSelect={(file) => {
                              setFrontChequeImage(file)
                              chequeForm.setValue("chequeDetails.frontImage", file.name)
                            }}
                            onRemove={() => {
                              setFrontChequeImage(null)
                              chequeForm.setValue("chequeDetails.frontImage", "")
                            }}
                          />
                          <FileUploadArea
                            label="Back of Cheque"
                            file={backChequeImage}
                            onFileSelect={(file) => {
                              setBackChequeImage(file)
                              chequeForm.setValue("chequeDetails.backImage", file.name)
                            }}
                            onRemove={() => {
                              setBackChequeImage(null)
                              chequeForm.setValue("chequeDetails.backImage", "")
                            }}
                          />
                        </div>
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Please ensure both sides of the cheque are clearly visible and all information is legible.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || uploading || !frontChequeImage || !backChequeImage}
                      >
                        {isSubmitting || uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Review Transaction
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="transfer" className="space-y-6">
                  <form onSubmit={transferForm.handleSubmit(handleTransferSubmit)} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Account & Currency</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="accountType">From Account</Label>
                            <Select
                              onValueChange={(value) => transferForm.setValue("accountType", value as any)}
                              defaultValue="checkingAccount"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {transferForm.formState.errors.accountType && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {transferForm.formState.errors.accountType.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select onValueChange={handleCurrencyChange} defaultValue="">
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency._id} value={currency._id}>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono">{currency.symbol}</span>
                                      <span>{currency.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {transferForm.formState.errors.currency && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {transferForm.formState.errors.currency.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <div className="relative">
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-8"
                              {...transferForm.register("amount", { valueAsNumber: true })}
                            />
                            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                          {transferForm.formState.errors.amount && (
                            <p className="text-red-500 text-sm flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {transferForm.formState.errors.amount.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transactionDate">Transaction Date</Label>
                          <Input
                            id="transactionDate"
                            type="datetime-local"
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : undefined
                              setTransactionDate(date)
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">International Beneficiary Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="accountName">Account Holder Name</Label>
                            <Input
                              id="accountName"
                              {...transferForm.register("transferDetails.accountName")}
                              placeholder="John Doe"
                            />
                            {transferForm.formState.errors.transferDetails?.accountName && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {transferForm.formState.errors.transferDetails.accountName.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input
                              id="accountNumber"
                              {...transferForm.register("transferDetails.accountNumber")}
                              placeholder="1234567890"
                            />
                            {transferForm.formState.errors.transferDetails?.accountNumber && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {transferForm.formState.errors.transferDetails.accountNumber.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            {...transferForm.register("transferDetails.bankName")}
                            placeholder="Bank Name"
                          />
                          {transferForm.formState.errors.transferDetails?.bankName && (
                            <p className="text-red-500 text-sm flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {transferForm.formState.errors.transferDetails.bankName.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                              onValueChange={(value) => transferForm.setValue("transferDetails.country", value)}
                              defaultValue=""
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
                            {transferForm.formState.errors.transferDetails?.country && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {transferForm.formState.errors.transferDetails.country.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="swiftCode">SWIFT Code</Label>
                            <Input
                              id="swiftCode"
                              {...transferForm.register("transferDetails.swiftCode")}
                              placeholder="DEUTDEFF"
                            />
                            {transferForm.formState.errors.transferDetails?.swiftCode && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {transferForm.formState.errors.transferDetails.swiftCode.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="iban">IBAN (Optional)</Label>
                          <Input
                            id="iban"
                            {...transferForm.register("transferDetails.iban")}
                            placeholder="DE89 3704 0044 0532 0130 00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankAddress">Bank Address</Label>
                          <Textarea
                            id="bankAddress"
                            {...transferForm.register("transferDetails.bankAddress")}
                            placeholder="Bank's full address..."
                            className="resize-none"
                            rows={2}
                          />
                          {transferForm.formState.errors.transferDetails?.bankAddress && (
                            <p className="text-red-500 text-sm flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {transferForm.formState.errors.transferDetails.bankAddress.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Transfer Purpose (Optional)</Label>
                          <Textarea
                            id="description"
                            {...transferForm.register("transferDetails.description")}
                            placeholder="e.g., Payment for services..."
                            className="resize-none"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Review Transaction
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          ) : showConfirmation ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Transaction Type</Label>
                      <p className="font-semibold">
                        {formData?.type === TransactionType.CRYPTO_DEPOSIT
                          ? "Crypto Deposit"
                          : formData?.type === TransactionType.CHEQUE_DEPOSIT
                            ? "Cheque Deposit"
                            : "Transfer"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Account</Label>
                      <p className="font-semibold">{accounts.find((a) => a.id === formData?.accountType)?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Currency</Label>
                      <p className="font-semibold">{currencies.find((c) => c._id === formData?.currency)?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Amount</Label>
                      <p className={`font-semibold text-lg ${isDebit ? "text-red-500" : "text-green-600"}`}>
                        {isDebit ? "-" : "+"}${formData?.amount?.toFixed(2)}
                      </p>
                    </div>
                    {transactionDate && (
                      <div>
                        <Label className="text-sm text-gray-600">Transaction Date</Label>
                        <p className="font-semibold">{format(new Date(transactionDate), 'PPP')}</p>
                      </div>
                    )}
                  </div>
                  <Separator />
                  {formData?.type === TransactionType.CRYPTO_DEPOSIT && "cryptoDetails" in formData && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Crypto Details</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-sm text-gray-600">Network</Label>
                          <p className="font-mono text-sm">{formData.cryptoDetails.network}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Wallet Address</Label>
                          <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded">
                            {formData.cryptoDetails.walletAddress}
                          </p>
                        </div>
                        {formData.cryptoDetails.proofOfPayment && (
                          <div>
                            <Label className="text-sm text-gray-600">Proof of Payment</Label>
                            <div className="flex items-center space-x-2">
                              <FileImage className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{proofOfPayment?.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {formData?.type === TransactionType.CHEQUE_DEPOSIT && "chequeDetails" in formData && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Cheque Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm text-gray-600">Cheque Number</Label>
                          <p className="font-semibold">{formData.chequeDetails.chequeNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Date</Label>
                          <p className="font-semibold">{format(new Date(formData.chequeDetails.date), "PPP")}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm text-gray-600">Description</Label>
                          <p className="text-sm">{formData.chequeDetails.description}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Front Image</Label>
                          <div className="flex items-center space-x-2">
                            <FileImage className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{frontChequeImage?.name}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Back Image</Label>
                          <div className="flex items-center space-x-2">
                            <FileImage className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{backChequeImage?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {formData?.type === TransactionType.TRANSFER && "transferDetails" in formData && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Transfer Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm text-gray-600">Account Name</Label>
                          <p className="font-semibold">{formData.transferDetails.accountName}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Account Number</Label>
                          <p className="font-semibold">{formData.transferDetails.accountNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Bank Name</Label>
                          <p className="font-semibold">{formData.transferDetails.bankName}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Country</Label>
                          <p className="font-semibold">
                            {countries.find((c) => c.code === formData.transferDetails.country)?.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">SWIFT Code</Label>
                          <p className="font-semibold">{formData.transferDetails.swiftCode}</p>
                        </div>
                        {formData.transferDetails.iban && (
                          <div>
                            <Label className="text-sm text-gray-600">IBAN</Label>
                            <p className="font-semibold">{formData.transferDetails.iban}</p>
                          </div>
                        )}
                        <div className="col-span-2">
                          <Label className="text-sm text-gray-600">Bank Address</Label>
                          <p className="font-semibold">{formData.transferDetails.bankAddress}</p>
                        </div>
                        {formData.transferDetails.description && (
                          <div className="col-span-2">
                            <Label className="text-sm text-gray-600">Transfer Purpose</Label>
                            <p className="text-sm">{formData.transferDetails.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <Separator />
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Current Balance</span>
                      <span className="font-medium">
                        ${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Transaction Amount</span>
                      <span className={`font-medium ${isDebit ? "text-red-500" : "text-green-600"}`}>
                        {isDebit ? "-" : "+"}${formData?.amount?.toFixed(2)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">New Balance</span>
                      <span className="font-bold text-lg">
                        ${newBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  {newBalance < 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Warning: This transaction will result in a negative balance.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
                  Back to Edit
                </Button>
                <Button onClick={confirmTransaction} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Confirm Transaction
                </Button>
              </div>
            </div>
          ) : showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <h2 className="text-2xl font-bold text-green-700">Transaction Submitted Successfully!</h2>
              <p className="text-gray-600 text-center max-w-md">
                The transaction has been processed and will be reflected in the customer's account shortly.
              </p>
              <Button onClick={() => {
                resetForm()
                onOpenChange(false)
              }}>
                Close
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}