"use client"

import { useState, useEffect } from "react"
import { DollarSign, Plus, Minus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/api/axios"
import { IUserWithId } from "@/lib/models/user.model"
import toast from "react-hot-toast"

interface Props {
  customer: IUserWithId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBalanceDialog({ customer, open, onOpenChange }: Props) {
  const [amount, setAmount] = useState("")
  const [operation, setOperation] = useState("add")
  const [accountType, setAccountType] = useState("checkingAccount")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])

  if (!customer || !open) return null

  const getCurrentBalance = () => {
    switch (accountType) {
      case "checkingAccount":
        return customer.checkingAccount.balance
      case "loanAccount":
        return customer.loanAccount.balance
      case "investmentAccount":
        return customer.investmentAccount.balance
      default:
        return 0
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const amountValue = parseFloat(amount)
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Amount must be a valid number greater than 0")
      }

      const currentBalance = getCurrentBalance()
      let updatedBalance = currentBalance

      if (operation === "add") {
        updatedBalance = currentBalance + amountValue
      } else if (operation === "subtract") {
        updatedBalance = currentBalance - amountValue
        if (updatedBalance < 0) {
          throw new Error("Cannot subtract more than the current balance")
        }
      }

      const response = await api.post(`/admin/users/${customer._id}/balance`, {
        accountType,
        balance: updatedBalance,
      })

      toast.success(response.data.message || "Balance updated successfully");
      onOpenChange(false)
    } catch (error: any) {
      console.log("This is the error", error)
      toast.error(error.response?.data?.message || "Balance update failed. Please try again.");
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setAmount("")
    setOperation("add")
    setAccountType("checkingAccount")
    setReason("")
    setIsSubmitting(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const fullName = `${customer.firstName} ${customer.lastName}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative z-50 w-full max-w-[500px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Edit Customer Balance</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{customer.firstName[0]}{customer.lastName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {fullName} (ID: {customer._id})
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-balance">Current Balance</Label>
            <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
              ${getCurrentBalance().toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <RadioGroup id="operation" value={operation} onValueChange={setOperation} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add" className="flex items-center">
                  <Plus className="mr-1 h-4 w-4 text-green-500" />
                  Add funds
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtract" id="subtract" />
                <Label htmlFor="subtract" className="flex items-center">
                  <Minus className="mr-1 h-4 w-4 text-red-600" />
                  Subtract funds
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-type">Select Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType} required>
              <SelectTrigger id="account-type">
                <SelectValue placeholder="Select an account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkingAccount">Checking Account</SelectItem>
                <SelectItem value="loanAccount">Loan Account</SelectItem>
                <SelectItem value="investmentAccount">Investment Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for adjustment</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for this balance adjustment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Update Balance"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}