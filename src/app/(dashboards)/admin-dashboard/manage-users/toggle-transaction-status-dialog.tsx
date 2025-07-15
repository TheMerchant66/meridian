"use client"

import { useState } from "react"
import { AlertTriangle, Check, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { api } from "@/api/axios"
import { AccountStatus } from "@/lib/enums/accountStatus.enum"
import { IUserWithId } from "@/lib/models/user.model"

interface Props {
  customer: IUserWithId
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ToggleTransactionStatusDialog({ customer, open, onOpenChange }: Props) {
  const [transactionsEnabled, setTransactionsEnabled] = useState(customer?.allowTransfer || false)
  const [duration, setDuration] = useState("temporary")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!customer) return null

  const durationText = duration === "permanent" ? "permanently" : "temporarily"
  const fullName = `${customer.firstName} ${customer.lastName}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.post(`/users/${customer._id}/transfer-status`, {
        allowTransfer: transactionsEnabled,
        notes: `Duration: ${duration}, Reason: ${reason}`,
      })

      toast({
        title: "Success",
        description: `Transactions ${transactionsEnabled ? "enabled" : "disabled"} ${durationText} for ${fullName}.`,
      })

      onOpenChange(false)
      resetForm()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update transaction status",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTransactionsEnabled(customer.allowTransfer)
    setDuration("temporary")
    setReason("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Transaction Status
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{customer.firstName}{customer.lastName}</AvatarFallback>
            </Avatar>
            <span>
              {fullName} (ID: {customer._id})
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {customer.accountStatus === AccountStatus.CLOSED && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Account is blocked</AlertTitle>
              <AlertDescription>
                This customer's account is currently closed. Enabling transactions will not work until the account status is changed.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="transaction-status" className="text-base">
                Transaction Status
              </Label>
              <Switch
                id="transaction-status"
                checked={transactionsEnabled}
                onCheckedChange={setTransactionsEnabled}
                disabled={customer.accountStatus === AccountStatus.CLOSED || isSubmitting}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {transactionsEnabled
                ? "Allow this customer to perform transactions"
                : "Block all transactions for this customer"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <RadioGroup value={duration} onValueChange={setDuration} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="temporary" id="temporary" />
                <Label htmlFor="temporary">Temporary (until manually changed)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="permanent" id="permanent" />
                <Label htmlFor="permanent">Permanent (requires approval to reverse)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for change</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for changing transaction status"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center gap-2">
              {transactionsEnabled ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">Enabling Transactions</h4>
                    <p className="text-sm text-muted-foreground">
                      Customer will be able to make deposits, withdrawals, and transfers.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="font-medium">Disabling Transactions</h4>
                    <p className="text-sm text-muted-foreground">
                      All transaction attempts will be rejected automatically.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || customer.accountStatus === AccountStatus.CLOSED}
              variant={transactionsEnabled ? "default" : "destructive"}
            >
              {isSubmitting
                ? "Processing..."
                : transactionsEnabled
                ? "Enable Transactions"
                : "Disable Transactions"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}