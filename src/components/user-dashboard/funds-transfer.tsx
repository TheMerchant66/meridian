"use client";

import React, { useState, useEffect, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransferFormData, TransferSchema } from "@/utils/schemas/schemas";
import { api } from "@/api/axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TransactionStatus, TransactionType } from "@/lib/enums/transactionType.enum";
import { Loader2, Globe, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ICurrencyWithId } from "@/lib/models/currency.model";
import { UserContext } from "@/contexts/UserContext";

export default function FundsTransferModal() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [formData, setFormData] = useState<TransferFormData | null>(null);
  const [currencies, setCurrencies] = useState<ICurrencyWithId[]>([]);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(TransferSchema),
    defaultValues: {
      status: TransactionStatus.COMPLETED,
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
      password: "",
    },
  });

  const accounts = [
    { id: "checkingAccount", name: "Primary Checking" },
    { id: "loanAccount", name: "Loan Account" },
    { id: "investmentAccount", name: "Investment Account" },
  ];

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
    { code: "PH", name: "Philippines" }
  ];

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await api.get("/currencies");
        const currencyData: ICurrencyWithId[] = response.data.currencies || [];
        const activeCurrencies = currencyData.filter((c) => c.active);
        setCurrencies(activeCurrencies);
        const defaultCurrency = activeCurrencies.find((c) => c.name === "USD");
        if (defaultCurrency) {
          form.setValue("currency", defaultCurrency._id as string);
        }
      } catch (error) {
        console.error("Error fetching currencies", error);
        toast.error("Failed to load currencies.");
      }
    };
    fetchCurrencies();
  }, [form]);

  const handleCurrencyChange = (value: string) => {
    form.setValue("currency", value);
  };

  const handleSubmit: SubmitHandler<TransferFormData> = async (data) => {
    if (!user?.allowTransfer) {
      setErrorCode("TXN_007");
      setErrorMessage("Your account is not authorized to make international transfers. Please contact support.");
      setShowError(true);
      return;
    }
    setFormData(data);
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    if (!formData) return;
    setIsSubmitting(true);

    try {
      const response = await api.post("/transactions", formData);
      setShowConfirmation(false);
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Transfer submission error:", error);
      setErrorCode(error?.response?.data?.code || "TXN_008");
      setErrorMessage(error?.response?.data?.message || "Failed to submit transfer request.");
      setShowConfirmation(false);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setShowConfirmation(false);
    setShowSuccess(false);
    setShowError(false);
    setErrorCode("");
    setErrorMessage("");
    setFormData(null);
    form.reset();
    setOpen(false);
  };

  const fee = 45.0;
  const totalAmount = formData?.amount ? formData.amount + fee : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full">
          <Globe className="h-4 w-4" />
          Transfers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {!showConfirmation && !showSuccess && !showError ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                International Transfer
              </DialogTitle>
              <DialogDescription>
                Send money internationally to beneficiaries worldwide with secure SWIFT transfers.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">From Account</Label>
                <Select
                  onValueChange={(value) => form.setValue("accountType", value as any)}
                  defaultValue="checkingAccount"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.accountType && (
                  <p className="text-red-500 text-xs">{form.formState.errors.accountType.message}</p>
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
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.currency && (
                  <p className="text-red-500 text-xs">{form.formState.errors.currency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...form.register("amount", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {form.formState.errors.amount && (
                  <p className="text-red-500 text-xs">{form.formState.errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  International Beneficiary Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      {...form.register("transferDetails.accountName")}
                      placeholder="John Doe"
                    />
                    {form.formState.errors.transferDetails?.accountName && (
                      <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.accountName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      {...form.register("transferDetails.accountNumber")}
                      placeholder="1234567890"
                    />
                    {form.formState.errors.transferDetails?.accountNumber && (
                      <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.accountNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    {...form.register("transferDetails.bankName")}
                    placeholder="Deutsche Bank AG"
                  />
                  {form.formState.errors.transferDetails?.bankName && (
                    <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.bankName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      onValueChange={(value) => form.setValue("transferDetails.country", value)}
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
                    {form.formState.errors.transferDetails?.country && (
                      <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.country.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT Code</Label>
                    <Input
                      id="swiftCode"
                      {...form.register("transferDetails.swiftCode")}
                      placeholder="DEUTDEFF"
                    />
                    {form.formState.errors.transferDetails?.swiftCode && (
                      <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.swiftCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN (if applicable)</Label>
                  <Input
                    id="iban"
                    {...form.register("transferDetails.iban")}
                    placeholder="DE89 3704 0044 0532 0130 00"
                  />
                  {form.formState.errors.transferDetails?.iban && (
                    <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.iban.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAddress">Bank Address</Label>
                  <Textarea
                    id="bankAddress"
                    {...form.register("transferDetails.bankAddress")}
                    placeholder="Bank's full address..."
                    className="resize-none"
                    rows={2}
                  />
                  {form.formState.errors.transferDetails?.bankAddress && (
                    <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.bankAddress.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Transfer Purpose (Optional)</Label>
                  <Textarea
                    id="description"
                    {...form.register("transferDetails.description")}
                    placeholder="e.g., Payment for services, family support, business transaction..."
                    className="resize-none"
                    rows={2}
                  />
                  {form.formState.errors.transferDetails?.description && (
                    <p className="text-red-500 text-xs">{form.formState.errors.transferDetails.description.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="Enter your password"
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
                )}
              </div>

              {form.watch("amount") > 0 && (
                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="flex justify-between text-sm">
                    <span>Transfer amount:</span>
                    <span>${form.watch("amount").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>International transfer fee:</span>
                    <span>${fee.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total amount:</span>
                    <span>${(form.watch("amount") + fee).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Exchange rates and additional correspondent bank fees may apply
                  </p>
                </div>
              )}

              <div className="rounded-lg border p-3 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 text-blue-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Important Notice</span>
                </div>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• International transfers typically take 1-3 business days</li>
                  <li>• Exchange rates are determined at the time of processing</li>
                  <li>• Additional fees may be charged by correspondent banks</li>
                  <li>• Ensure all beneficiary details are accurate to avoid delays</li>
                </ul>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Review Transfer
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confirm International Transfer
              </DialogTitle>
              <DialogDescription>Please review the transfer details before confirming.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">From:</span>
                  <span className="font-medium">{accounts.find((a) => a.id === formData?.accountType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">To:</span>
                  <span className="font-medium">{formData?.transferDetails.accountName}</span>
                </div>

                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">International Beneficiary:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Account:</span>
                      <p className="font-medium">{formData?.transferDetails.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bank:</span>
                      <p className="font-medium">{formData?.transferDetails.bankName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SWIFT:</span>
                      <p className="font-medium">{formData?.transferDetails.swiftCode}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Country:</span>
                      <p className="font-medium">{countries.find((c) => c.code === formData?.transferDetails.country)?.name}</p>
                    </div>
                    {formData?.transferDetails.iban && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">IBAN:</span>
                        <p className="font-medium">{formData.transferDetails.iban}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Bank Address:</span>
                      <p className="font-medium">{formData?.transferDetails.bankAddress}</p>
                    </div>
                  </div>
                </div>

                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transfer Amount:</span>
                  <span className="font-medium">${formData?.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">International Fee:</span>
                  <span className="font-medium">${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Debit:</span>
                  <span>${totalAmount.toFixed(2)} USD</span>
                </div>
                {formData?.transferDetails.description && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground">Transfer Purpose:</span>
                      <p className="mt-1">{formData.transferDetails.description}</p>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Password:</span>
                  <span className="font-medium">••••••••</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                This international transfer will be processed and cannot be reversed.
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
                Back
              </Button>
              <Button onClick={confirmTransfer} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Transfer
              </Button>
            </DialogFooter>
          </>
        ) : showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                International Transfer Initiated
              </DialogTitle>
              <DialogDescription>Your international transfer has been successfully initiated.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-green-50 border-green-200">
                <div className="text-center space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <h3 className="font-semibold text-green-900">Transfer Initiated</h3>
                  <p className="text-sm text-green-700">
                    ${totalAmount.toFixed(2)} USD has been debited from your account for international transfer.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono">INTL-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Processing
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Delivery:</span>
                  <span>1-3 business days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span>{formData?.transferDetails.accountName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destination:</span>
                  <span>{countries.find((c) => c.code === formData?.transferDetails.country)?.name}</span>
                </div>
              </div>

              <div className="rounded-lg border p-3 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 text-blue-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">What happens next?</span>
                </div>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• Your transfer is being processed through the SWIFT network</li>
                  <li>• You'll receive email updates on the transfer status</li>
                  <li>• The recipient will be notified once funds are available</li>
                  <li>• Contact support if you need to track or modify this transfer</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetModal}>
                New Transfer
              </Button>
              <Button onClick={resetModal}>Done</Button>
            </DialogFooter>
          </>
        ) : showError ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Transfer Failed
              </DialogTitle>
              <DialogDescription>Your international transfer could not be processed at this time.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-red-50 border-red-200">
                <div className="text-center space-y-2">
                  <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
                  <h3 className="font-semibold text-red-900">Transfer Failed</h3>
                  <p className="text-sm text-red-700">
                    We were unable to process your transfer of ${totalAmount.toFixed(2)} USD.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Error Code:</span>
                  <span className="font-mono text-red-600">{errorCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="destructive">Failed</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attempted Amount:</span>
                  <span>${totalAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span>{formData?.transferDetails.accountName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destination:</span>
                  <span>{countries.find((c) => c.code === formData?.transferDetails.country)?.name}</span>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Error Details</span>
                </div>
                <p className="text-sm text-amber-700 mb-3">{errorMessage}</p>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-amber-800">What you can do:</h4>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Check your account balance and transfer limits</li>
                    <li>• Verify all beneficiary details are correct</li>
                    <li>• Try again in a few minutes</li>
                    <li>• Contact support if the issue persists</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Need Help?</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Our support team is available 24/7 to help resolve transfer issues.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Phone Support:</span>
                    <span className="font-medium text-blue-800">1-800-BANK-HELP</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Email Support:</span>
                    <span className="font-medium text-blue-800">transfers@bank.com</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Live Chat:</span>
                    <Button variant="outline" size="sm" className="h-6">
                      Start Chat
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-blue-600 mt-3">
                  Reference Error Code: <span className="font-mono">{errorCode}</span> when contacting support
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowError(false)}>
                Try Again
              </Button>
              <Button onClick={resetModal}>Close</Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}