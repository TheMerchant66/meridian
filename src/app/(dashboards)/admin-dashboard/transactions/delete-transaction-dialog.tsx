"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, Trash2 } from "lucide-react"
import { api } from "@/api/axios"
import { toast } from "@/components/ui/use-toast"
import { ITransaction } from "@/lib/models/transaction.model"

interface Props {
  transaction: ITransaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionDeleted: (id: string) => void;
}

export function DeleteTransactionDialog({ transaction, open, onOpenChange, onTransactionDeleted }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  const handleConfirmDelete = async () => {
    setIsSubmitting(true)
    try {
      await api.delete(`/transactions/${transaction._id}`)
      toast({
        title: "Success",
        description: "Transaction deleted successfully"
      })
      onTransactionDeleted(transaction._id)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete transaction"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!transaction || !open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />
      <div className="relative z-20 w-full max-w-md bg-white rounded-lg shadow-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </div>
              <div className="p-3 bg-gray-100 rounded-md">
                <div className="font-semibold">Transaction ID: {transaction._id}</div>
                <div>Type: {transaction.type}</div>
                <div>Amount: ${transaction.amount.toLocaleString()}</div>
                <div>Status: {transaction.status}</div>
              </div>
              <div className="flex items-center gap-2 text-yellow-600 bg-yellow-100 p-2 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>This will permanently remove the transaction from the system.</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}