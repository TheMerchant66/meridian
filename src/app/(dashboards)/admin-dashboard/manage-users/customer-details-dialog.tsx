"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, CreditCard, Mail, MapPin, Phone, X, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { api } from "@/api/axios"
import { format } from "date-fns"
import { AccountStatus } from "@/lib/enums/accountStatus.enum"
import { TransactionType } from "@/lib/enums/transactionType.enum"
import { IUserWithId } from "@/lib/models/user.model"
import { ITransactionPopulated } from "@/lib/models/transaction.model"
import toast from "react-hot-toast"

interface Props {
  customer: IUserWithId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [transactionsEnabled, setTransactionsEnabled] = useState(customer?.allowTransfer || false)
  const [accountStatus, setAccountStatus] = useState(customer?.accountStatus || AccountStatus.ACTIVE)
  const [transactions, setTransactions] = useState<ITransactionPopulated[]>([])
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (open && customer) {
      setTransactionsEnabled(customer.allowTransfer || false)
      setAccountStatus(customer.accountStatus || AccountStatus.ACTIVE)
      fetchUserDetails()
    }
  }, [open, customer])

  useEffect(() => {
    return () => {
      setTransactions([])
      setIsLoading(false)
    }
  }, [])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTransactions([])
      setIsLoading(false)
    }
    onOpenChange(newOpen)
  }

  const fetchUserDetails = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/admin/users/${customer._id}/transactions`);
      console.log("This is the response", response);
      setTransactions(response.data.transactions);
    } catch (error: any) {
      console.log("This is the error", error)
      toast.error(error.response?.data?.message || "Failed to get transactions. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await api.post(`/admin/users/${customer._id}/transfer-status`, {
        allowTransfer: !transactionsEnabled,
      })
      setTransactionsEnabled(response.data.user.allowTransfer)
      setAccountStatus(response.data.user.accountStatus)
      toast.success(response.data.message || "Transaction status updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update transaction status.");
    } finally {
      setIsLoading(false)
    }
  }

  if (!customer || !open) return null

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case AccountStatus.ACTIVE:
        return "default"
      case AccountStatus.SUSPENDED:
        return "secondary"
      case AccountStatus.PENDING:
        return "outline"
      case AccountStatus.CLOSED:
        return "destructive"
      default:
        return "outline"
    }
  }

  const fullName = `${customer.firstName} ${customer.lastName}`

  const totalBalance =
    (customer.checkingAccount.balance || 0) +
    (customer.loanAccount.balance || 0) +
    (customer.investmentAccount.balance || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => handleOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{customer.firstName[0]}{customer.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{fullName}</h2>
              <p className="text-sm text-muted-foreground">Customer ID: {customer._id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Contact-Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-x-4">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-x-4">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-x-4">
                      <MapPin className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm">{customer.address}, {customer.city}, {customer.state} {customer.postalCode}, {customer.country}</span>
                    </div>
                    {customer.plainPassword && <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Password: {showPassword ? customer.plainPassword : '••••••••'}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-2 p-0 h-auto"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </Button>
                      </span>
                    </div>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Balance:</span>
                      <span className="font-medium">
                        ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account Level:</span>
                      <span className="font-medium capitalize">{customer.accountLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span className="font-medium">{format(new Date(customer.createdAt), "PPP")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Transactions:</span>
                      <span className="font-medium">{transactions.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account No:</span>
                      <span className="font-medium">{customer.checkingAccount.accountNumber}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="transactions-status">Transactions congestive
                        Transactions Status</Label>
                      <div className="text-sm text-muted-foreground">
                        {transactionsEnabled
                          ? "Customer can perform transactions"
                          : "Customer transactions are disabled"}
                      </div>
                    </div>
                    <Switch
                      id="transactions-status"
                      checked={transactionsEnabled}
                      onCheckedChange={handleToggleTransactions}
                      disabled={isLoading || accountStatus === AccountStatus.CLOSED}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="account-status">Account Status</Label>
                      <div className="text-sm text-muted-foreground">
                        {accountStatus === AccountStatus.ACTIVE
                          ? "Account is active and operational"
                          : `Account is ${accountStatus}`}
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(accountStatus)}>
                      {accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accounts" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Accounts</CardTitle>
                  <CardDescription>All accounts associated with this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Checking Account</div>
                        <div className="text-sm text-muted-foreground">Checking Account</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${customer.checkingAccount.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Checking
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Loan Account</div>
                        <div className="text-sm text-muted-foreground">Loan Account</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${customer.loanAccount.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Loan
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Investment Account</div>
                        <div className="text-sm text-muted-foreground">Investment Account</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${customer.investmentAccount.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Investment
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Last {transactions.length} transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-full border bg-background p-2">
                          {transaction.type === TransactionType.WITHDRAWAL ? (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          ) : transaction.type === TransactionType.DEPOSIT ? (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-yellow-500 rotate-45" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{transaction.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(transaction.createdAt), "PPP")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${transaction.type === TransactionType.DEPOSIT ? "text-green-500" : "text-red-500"}`}
                        >
                          {transaction.type === TransactionType.DEPOSIT ? "+" : "-"}$
                          {transaction.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="mt-1">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>

          <Button>Contact Customer</Button>
        </div>
      </div>
    </div>
  )
}