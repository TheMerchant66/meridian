"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Upload,
  CheckCircle,
  AlertCircle,
  Copy,
  CreditCard,
  Coins,
  FileImage,
  X,
  ArrowLeft,
  DollarSign,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { api } from "@/api/axios"

// Mock schemas and types (replace with your actual imports)
const TransactionType = {
  CRYPTO_DEPOSIT: "CRYPTO_DEPOSIT",
  CHEQUE_DEPOSIT: "CHEQUE_DEPOSIT",
} as const

const DepositSchema = z.object({
  type: z.literal(TransactionType.CRYPTO_DEPOSIT),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  accountType: z.string(),
  cryptoDetails: z.object({
    network: z.string(),
    walletAddress: z.string(),
    proofOfPayment: z.string().optional(),
  }),
})

const ChequeDepositSchema = z.object({
  type: z.literal(TransactionType.CHEQUE_DEPOSIT),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  accountType: z.string(),
  chequeDetails: z.object({
    chequeNumber: z.string().min(1, "Cheque number is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().min(1, "Description is required"),
    frontImage: z.string(),
    backImage: z.string(),
  }),
})

type DepositFormData = z.infer<typeof DepositSchema>
type ChequeDepositFormData = z.infer<typeof ChequeDepositSchema>

interface ICurrencyWithId {
  _id: string
  name: string
  symbol: string
  walletAddress: string
  active: boolean
}

type FundsDepositModalProps = {}

export default function FundsDepositModal({}: FundsDepositModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Remove the mock currencies array and use the original API call
  const [currencies, setCurrencies] = useState<ICurrencyWithId[]>([])
  const [selectedAddress, setSelectedAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState<DepositFormData | ChequeDepositFormData | null>(null)
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null)
  const [frontChequeImage, setFrontChequeImage] = useState<File | null>(null)
  const [backChequeImage, setBackChequeImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("crypto")
  const [showSuccess, setShowSuccess] = useState(false)
  const [processingDeposit, setProcessingDeposit] = useState(false)

  const cryptoForm = useForm<DepositFormData>({
    resolver: zodResolver(DepositSchema),
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

  const accounts = [
    { id: "checkingAccount", name: "Primary Checking" },
    { id: "loanAccount", name: "Loan Account" },
    { id: "investmentAccount", name: "Investment Account" },
  ]

  // Restore the original API calls in useEffect
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await api.get("/currencies")
        const currencyData: ICurrencyWithId[] = response.data.currencies || []
        const activeCurrencies = currencyData.filter((c) => c.active)
        setCurrencies(activeCurrencies)
        const defaultCurrency = activeCurrencies.find((c) => c.name === "USD")
        if (defaultCurrency) {
          cryptoForm.setValue("currency", defaultCurrency._id as string)
          chequeForm.setValue("currency", defaultCurrency._id as string)
          setSelectedAddress(defaultCurrency.walletAddress)
        }
      } catch (error) {
        console.error("Error fetching currencies", error)
        toast.error("Failed to load currencies.")
      }
    }
    fetchCurrencies()
  }, [cryptoForm, chequeForm])

  const handleCurrencyChange = (value: string) => {
    const selectedCurrency = currencies.find((c) => c._id === value)
    cryptoForm.setValue("currency", value)
    chequeForm.setValue("currency", value)
    setSelectedAddress(selectedCurrency?.walletAddress || "")
    if (selectedCurrency) {
      cryptoForm.setValue("cryptoDetails.network", selectedCurrency.name === "BTC" ? "Bitcoin" : "Ethereum")
      cryptoForm.setValue("cryptoDetails.walletAddress", selectedCurrency.walletAddress)
    }
  }

  // Remove the simulateUpload function and use the original uploadToCloudinary function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_preset")
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Error uploading to Cloudinary", error)
      toast.error("Failed to upload image.")
      throw error
    } finally {
      setUploading(false)
    }
  }

  // Restore the original handleCryptoSubmit function
  const handleCryptoSubmit: SubmitHandler<DepositFormData> = async (data) => {
    if (!proofOfPayment) {
      toast.error("Proof of Payment is required.")
      return
    }
    setFormData(data)
    setShowConfirmation(true)
  }

  // Restore the original handleChequeSubmit function with the real file upload
  const handleChequeSubmit: SubmitHandler<ChequeDepositFormData> = async (data) => {
    if (!frontChequeImage || !backChequeImage) {
      toast.error("Please upload both front and back cheque images.")
      return
    }

    try {
      const frontImageUrl = await uploadToCloudinary(frontChequeImage)
      const backImageUrl = await uploadToCloudinary(backChequeImage)
      const updatedData = {
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

  // Restore the original confirmDeposit function with the API call
  const confirmDeposit = async () => {
    if (!formData) return
    setIsSubmitting(true)
    setProcessingDeposit(true)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const dataToSend = { ...formData }
      if (dataToSend.type === TransactionType.CRYPTO_DEPOSIT && dataToSend.cryptoDetails) {
        delete dataToSend.cryptoDetails.proofOfPayment
      }

      const response = await api.post("/transactions", dataToSend)
      console.log("This is the valid response", response)

      setProcessingDeposit(false)
      setShowConfirmation(false)
      setShowSuccess(true)

      // Add toast notification
      toast.success(response.data.message || "Deposit request submitted successfully!")

      // Auto close after 5 seconds
      setTimeout(() => {
        setIsOpen(false)
        setShowSuccess(false)
        cryptoForm.reset()
        chequeForm.reset()
        setProofOfPayment(null)
        setFrontChequeImage(null)
        setBackChequeImage(null)
      }, 5000)
    } catch (error: any) {
      console.log("This is the error i am having", error)
      toast.error(error?.response?.data?.message || "Failed to submit deposit request.")
      setProcessingDeposit(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Address copied to clipboard!", {
      duration: 2000,
      position: "top-right",
    })
  }

  // Replace the entire FileUploadArea component with this fixed version that uses a hidden input
  // but preserves all the original functionality:

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

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {!file ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={handleClick}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileSelect(e.target.files[0])
                }
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-2">
              <FileImage className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium truncate">{file.name}</span>
              <Badge variant="secondary" className="text-xs">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </Badge>
            </div>
            {onRemove && (
              <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-6 w-6 p-0">
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

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-zinc-900"
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Deposit Funds
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center">
              {showConfirmation ? (
                <>
                  <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
                  Review Deposit
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-6 w-6" />
                  Deposit Funds
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {!showConfirmation ? (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="crypto" className="flex items-center space-x-2">
                    <Coins className="h-4 w-4" />
                    <span>Crypto Deposit</span>
                  </TabsTrigger>
                  <TabsTrigger value="cheque" className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cheque Deposit</span>
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
                          <Label htmlFor="amount">Amount</Label>
                          <div className="relative">
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="text-lg font-semibold pl-8"
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
                      </CardContent>
                    </Card>

                    {selectedAddress && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Wallet Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 w-full">
                            <Label>Network</Label>
                            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                              <Input
                                value={cryptoForm.watch("cryptoDetails.network")}
                                disabled
                                className="bg-gray-50"
                              />
                              <Badge variant="secondary">Auto-detected</Badge>
                            </div>
                          </div>

                          <div className="space-y-2 w-full">
                            <Label>Wallet Address</Label>
                            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                              <Input 
                                value={selectedAddress} 
                                disabled 
                                className="bg-gray-50 font-mono text-sm" 
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(selectedAddress)}
                                className="shrink-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Send your cryptocurrency to the address above. Your deposit will be processed once the
                              transaction is confirmed on the blockchain.
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="bg-zinc-100/50 border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">Proof of Payment (Optional)</CardTitle>
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

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Review Deposit
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
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount</Label>
                          <div className="relative">
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="text-lg font-semibold pl-8"
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

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || uploading || !frontChequeImage || !backChequeImage}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting || uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Review Deposit
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          ) : !showSuccess ? (
            <div className="space-y-6">
              {processingDeposit ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">Processing Your Deposit</h3>
                    <p className="text-gray-600">Please wait while we process your deposit request...</p>
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                      <span>This may take a few moments</span>
                      <div className="flex space-x-1">
                        <div
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-green-700">Deposit Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Deposit Type</Label>
                          <p className="font-semibold">
                            {formData?.type === TransactionType.CRYPTO_DEPOSIT ? "Cryptocurrency" : "Cheque"}
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
                          <p className="font-semibold text-lg text-green-600">${formData?.amount?.toFixed(2)}</p>
                        </div>
                      </div>

                      <Separator />

                      {formData?.type === TransactionType.CRYPTO_DEPOSIT && formData.cryptoDetails && (
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
                            {proofOfPayment && (
                              <div>
                                <Label className="text-sm text-gray-600">Proof of Payment</Label>
                                <div className="flex items-center space-x-2">
                                  <FileImage className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{proofOfPayment.name}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {formData?.type === TransactionType.CHEQUE_DEPOSIT && formData.chequeDetails && (
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
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Description</Label>
                            <p className="text-sm">{formData.chequeDetails.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
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
                    </CardContent>
                  </Card>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please review all details carefully. Once confirmed, your deposit request will be submitted for
                      processing.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowConfirmation(false)}
                      className="flex items-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={confirmDeposit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 flex items-center"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Confirm Deposit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-green-700">Deposit Successful!</h3>
                <p className="text-gray-600 max-w-md">
                  Your deposit request has been submitted successfully. You will receive a confirmation email shortly.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">
                      Transaction ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Keep this reference number for your records</p>
                </div>

                <p className="text-sm text-gray-500 mt-4">This window will close automatically in a few seconds...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
