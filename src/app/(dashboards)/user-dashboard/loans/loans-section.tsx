"use client";

import React, { useState, useEffect, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, CreditCard, DollarSign, BarChart3, Clock, CheckCircle2, ArrowUpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { api } from "@/api/axios";
import { LoanPaymentSchema, LoanPaymentFormData, CreditLimitUpdateSchema, CreditLimitUpdateFormData } from "@/utils/schemas/schemas";
import { TransactionType } from "@/lib/enums/transactionType.enum";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ICurrencyWithId } from "@/lib/models/currency.model";
import { ILoan } from "@/lib/models/loan.model";
import { UserContext } from "@/contexts/UserContext";
import { AccountLevel } from "@/lib/enums/role.enum";

interface LoanPaymentModalProps {
  loan: ILoan;
  currencies: ICurrencyWithId[];
  onSuccess: () => void;
}

function LoanPaymentModal({ loan, currencies, onSuccess }: LoanPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<LoanPaymentFormData | null>(null);

  const form = useForm<LoanPaymentFormData>({
    resolver: zodResolver(LoanPaymentSchema),
    defaultValues: {
      type: TransactionType.LOAN_PAYMENT,
      amount: loan.nextPaymentAmount,
      currency: "",
      accountType: "checkingAccount",
      loanId: loan._id,
    },
  });

  const accounts = [
    { id: "checkingAccount", name: "Primary Checking" },
    { id: "loanAccount", name: "Loan Account" },
    { id: "investmentAccount", name: "Investment Account" },
  ];

  useEffect(() => {
    const defaultCurrency = currencies.find((c) => c.name === "USD");
    if (defaultCurrency) {
      form.setValue("currency", defaultCurrency._id as string);
    }
  }, [currencies, form]);

  const handleSubmit: SubmitHandler<LoanPaymentFormData> = async (data) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    if (!formData) return;
    setIsSubmitting(true);

    try {
      const response = await api.post("/transactions", formData);
      toast.success(response.data.message || "Payment submitted successfully!");
      setOpen(false);
      setShowConfirmation(false);
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Payment submission error:", error);
      toast.error(error?.response?.data?.message || "Failed to submit payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-red-700 hover:bg-red-900">
          
          Make Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle>Make Loan Payment</DialogTitle>
              <DialogDescription>Enter payment details for {loan.name}.</DialogDescription>
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
                <Select
                  onValueChange={(value) => form.setValue("currency", value)}
                  defaultValue={form.getValues("currency")}
                >
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Review Payment
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Payment</DialogTitle>
              <DialogDescription>Review payment details before confirming.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Loan:</span>
                  <span className="font-medium">{loan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">From:</span>
                  <span className="font-medium">
                    {accounts.find((a) => a.id === formData?.accountType)?.name}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-medium">${formData?.amount.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
                Back
              </Button>
              <Button onClick={confirmPayment} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Payment
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreditLimitUpdateForm({ currentLimit, onSubmit, onCancel }: {
  currentLimit: number;
  onSubmit: (data: CreditLimitUpdateFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<CreditLimitUpdateFormData>({
    resolver: zodResolver(CreditLimitUpdateSchema),
    defaultValues: {
      requestedLimit: currentLimit + 5000,
      reason: "",
      additionalInfo: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: SubmitHandler<CreditLimitUpdateFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/transactions/credit-limit", data);
      onSubmit(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current-limit">Current Limit</Label>
            <Input id="current-limit" value={`$${currentLimit.toLocaleString()}`} disabled className="bg-muted mt-2" />
          </div>
          <div>
            <Label htmlFor="requested-limit">Requested Limit</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="requested-limit"
                type="number"
                {...form.register("requestedLimit", { valueAsNumber: true })}
                className="pl-7"
                min={currentLimit + 1000}
                step={1000}
              />
            </div>
            {form.formState.errors.requestedLimit && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.requestedLimit.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="reason" className="mb-2">Reason for Increase</Label>
          <Select onValueChange={(value) => form.setValue("reason", value)}>
            <SelectTrigger id="reason" className="w-full">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="large_purchase">Planning a large purchase</SelectItem>
              <SelectItem value="debt_consolidation">Debt consolidation</SelectItem>
              <SelectItem value="emergency_fund">Building emergency fund</SelectItem>
              <SelectItem value="business_expenses">Business expenses</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.reason && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.reason.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="additional-info" className="mb-2">Additional Information (Optional)</Label>
          <Textarea
            id="additional-info"
            placeholder="Please provide any additional details about your request"
            {...form.register("additionalInfo")}
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit Request
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreditLimitUpdateSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
        <ArrowUpCircle className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-semibold text-center">Limit Increase Requested</h3>
      <p className="text-center text-muted-foreground max-w-md">
        Your credit limit increase request has been submitted successfully. We'll review your request and notify you of
        the decision within 3-5 business days.
      </p>
      <Button onClick={onClose} className="mt-4">
        Close
      </Button>
    </div>
  );
}

export function LoansSection() {
  const [loans, setLoans] = useState<ILoan[]>([]);
  const { user } = useContext(UserContext);
  const [selectedLoan, setSelectedLoan] = useState<ILoan | null>(null);

  const maxCreditLimit = {
    [AccountLevel.PLATINUM]: 100000,
    [AccountLevel.GOLD]: 75000,
    [AccountLevel.RUBY]: 50000,
    [AccountLevel.REGULAR]: 25000,
  };


  const total = maxCreditLimit[user?.accountLevel || AccountLevel.REGULAR];
  const available = total - (user?.loanAccount.creditLimit || 0);
  const usedCredit = total - available;
  const utilization = total > 0 ? usedCredit / total : 0;

  const [creditLimit, setCreditLimit] = useState({ available: usedCredit, total: total, utilization: utilization });
  const [isUpdateLimitOpen, setIsUpdateLimitOpen] = useState(false);
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [currencies, setCurrencies] = useState<ICurrencyWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [loansResponse, currenciesResponse] = await Promise.all([
          api.get("/loans"),
          api.get("/currencies"),
        ]);
        const fetchedLoans: ILoan[] = loansResponse.data.loans || [];
        setLoans(fetchedLoans);
        if (fetchedLoans.length > 0) {
          setSelectedLoan(fetchedLoans[0]);
        }
        const activeCurrencies = (currenciesResponse.data.currencies || []).filter((c: ICurrencyWithId) => c.active);
        setCurrencies(activeCurrencies);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load loans data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLimitUpdateSubmit = (data: CreditLimitUpdateFormData) => {
    setIsRequestSubmitted(true);
    toast.success(`Your request for a limit increase to $${data.requestedLimit.toLocaleString()} has been submitted.`);
  };

  const closeUpdateLimitModal = () => {
    setIsUpdateLimitOpen(false);
    setTimeout(() => setIsRequestSubmitted(false), 300);
  };

  const handlePaymentSuccess = async () => {
    try {
      const loansResponse = await api.get("/loans");
      setLoans(loansResponse.data.loans || []);
      const updatedLoan = loansResponse.data.loans.find((l: ILoan) => l._id === selectedLoan?._id);
      if (updatedLoan) {
        setSelectedLoan(updatedLoan);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh loans data.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="w-full mx-auto space-y-6 sm:space-y-8">
      <div className="px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">EasyMonie Loans</h1>
        <p className="text-muted-foreground text-sm">Easy loans for your every need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <CardTitle className="text-lg">Available Credit Limit</CardTitle>
                <CardDescription>Revolving credit available across all your loans</CardDescription>
              </div>
              <Dialog open={isUpdateLimitOpen} onOpenChange={setIsUpdateLimitOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Update Limit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isRequestSubmitted ? "Request Submitted" : "Request Credit Limit Increase"}
                    </DialogTitle>
                    {!isRequestSubmitted && (
                      <DialogDescription>
                        Fill out the form below to request an increase to your credit limit.
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  {isRequestSubmitted ? (
                    <CreditLimitUpdateSuccess onClose={closeUpdateLimitModal} />
                  ) : (
                    <CreditLimitUpdateForm
                      currentLimit={creditLimit.total || 0}
                      onSubmit={handleLimitUpdateSubmit}
                      onCancel={closeUpdateLimitModal}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Available Credit</p>
                {creditLimit.available && <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                  ${creditLimit.available.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>}
                {creditLimit.total && <p className="text-sm text-muted-foreground">
                  of ${creditLimit.total.toLocaleString("en-US", { minimumFractionDigits: 2 })} total limit
                </p>}
              </div>
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Credit Utilization</span>
                  <span className="font-medium">{creditLimit.utilization}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${creditLimit.utilization}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 py-3 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground">
              Good credit utilization is typically below 30% of your total available credit.
            </p>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden bg-gradient-to-br from-red-50 to-red-100 border-0">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <CardTitle className="text-lg text-[#370202]"><span className="py-1.5 px-4 rounded-lg text-zinc-600 font-semibold bg-red-200 ">OUTSTANDINGS</span></CardTitle>
              
              </div>
              <LoanPaymentModal 
                loan={loans[0] || {
                  _id: "default",
                  name: "No Active Loans",
                  type: "Personal",
                  status: "none",
                  currentBalance: 0,
                  monthlyPayment: 0,
                  nextPaymentAmount: 0,
                  nextPaymentDate: new Date().toISOString(),
                  progress: 0,
                  paymentsMade: 0,
                  paymentsRemaining: 0,
                  originalAmount: 0,
                  interestRate: 0,
                  term: 0,
                  startDate: new Date().toISOString(),
                  endDate: new Date().toISOString(),
                  lender: "EasyMonie",
                  accountNumber: "N/A",
                  recentPayments: []
                }} 
                currencies={currencies} 
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex flex-col gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Due This Month</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-700">
                  ${loans.reduce((sum, loan) => sum + (loan.status === "current" ? loan.nextPaymentAmount : 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Across {loans.filter(loan => loan.status === "current").length} active loans
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {loans.filter(loan => loan.status === "current").map(loan => (
                  <div key={loan._id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div>
                      <p className="font-medium">{loan.name}</p>
                      <p className="text-sm text-muted-foreground">Due {new Date(loan.nextPaymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${loan.nextPaymentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                      <LoanPaymentModal loan={loan} currencies={currencies} onSuccess={handlePaymentSuccess} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t py-3 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground">
              Make payments before the due date to maintain a good credit score.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* <Carousel className="w-full">
        <CarouselContent className="-ml-2 sm:-ml-4">
          {loans.map((loan) => (
            <CarouselItem key={loan._id} className="pl-2 sm:pl-4 md:basis-1/2">
              <Card
                className={`border pb-0 overflow-hidden transition-all hover:shadow-md cursor-pointer ${selectedLoan?._id === loan._id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                onClick={() => setSelectedLoan(loan)}
              >
                <CardHeader className="pb-2 pt-2 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <CardTitle className="text-base sm:text-lg">{loan.name}</CardTitle>
                      <CardDescription>{loan.type} Loan</CardDescription>
                    </div>
                    <Badge variant={loan.status === "current" ? "outline" : "destructive"} className="capitalize w-fit">
                      {loan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-xl sm:text-2xl font-bold">
                        ${loan.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-muted-foreground">Monthly Payment</p>
                      <p className="text-lg font-semibold">
                        ${loan.monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Paid off</span>
                      <span>{loan.progress}%</span>
                    </div>
                    <Progress value={loan.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{loan.paymentsMade} payments made</span>
                      <span>{loan.paymentsRemaining} remaining</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="py-4 bg-muted/50 px-4 sm:px-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Next payment:{" "}
                      {new Date(loan.nextPaymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 translate-x-0 hover:bg-primary/90" />
          <CarouselNext className="static translate-y-0 translate-x-0 hover:bg-primary/90" />
        </div>
      </Carousel> */}

      {selectedLoan && (
        <div className="space-y-6 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">{selectedLoan.name} Details</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <BarChart3 className="h-4 w-4" />
                Amortization
              </Button>
              <LoanPaymentModal loan={selectedLoan} currencies={currencies} onSuccess={handlePaymentSuccess} />
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg">Loan Summary</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Original Amount</p>
                        <p className="text-lg font-semibold">
                          ${selectedLoan.originalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                        <p className="text-xl font-bold">
                          ${selectedLoan.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                        <p className="text-lg font-semibold">{selectedLoan.interestRate}%</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                        <p className="text-lg font-semibold">
                          ${selectedLoan.monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Loan Term</p>
                        <p className="text-lg font-semibold">{selectedLoan.term} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Maturity Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(selectedLoan.endDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg">Next Payment</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(selectedLoan.nextPaymentDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Due</p>
                        <p className="text-lg font-semibold">
                          ${selectedLoan.nextPaymentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <LoanPaymentModal loan={selectedLoan} currencies={currencies} onSuccess={handlePaymentSuccess} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg">Recent Payments</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-4">
                    {selectedLoan.recentPayments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Payment {payment.status}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold">
                            ${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full gap-2">
                      <Clock className="h-4 w-4" />
                      View Payment History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg">Loan Information</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                      <div>
                        <p className="text-sm text-muted-foreground">Lender</p>
                        <p className="font-medium">{selectedLoan.lender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-medium">{selectedLoan.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">
                          {new Date(selectedLoan.startDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-medium">
                          {new Date(selectedLoan.endDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Type</p>
                        <p className="font-medium">{selectedLoan.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Status</p>
                        <Badge
                          variant={selectedLoan.status === "current" ? "outline" : "destructive"}
                          className="mt-1 capitalize"
                        >
                          {selectedLoan.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <CreditCard className="h-4 w-4" />
                        Manage Autopay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}