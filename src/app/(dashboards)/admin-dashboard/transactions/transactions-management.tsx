"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, Download, RefreshCw, Edit, Trash2, Calendar } from "lucide-react"
import { DashboardLayout } from "../dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainTransactionsTab } from "./main-transactions-tab"
import { LoanTransactionsTab } from "./loan-transactions-tab"
import { InvestmentTransactionsTab } from "./investment-transactions-tab"
import { TransactionDetailsDialog } from "./transaction-details-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, subDays, subWeeks, subMonths, subYears } from "date-fns"
import { api } from "@/api/axios"
import { toast } from "@/components/ui/use-toast"
import { ITransactionPopulated } from "@/lib/models/transaction.model"
import { UpdateTransactionDialog } from "./update-transaction-dialog"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { Label } from "@/components/ui/label"

export function TransactionsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [amountRange, setAmountRange] = useState<{ min: string; max: string }>({ min: "", max: "" })
  const [selectedTransaction, setSelectedTransaction] = useState<ITransactionPopulated | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("main")
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<ITransactionPopulated[]>([])
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [activeTab])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/transactions?admin=true')
      setTransactions(response.data.transactions)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch transactions"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const matchesSearch =
        transaction._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.user?.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction._id.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()

      // Type filter
      const matchesType = typeFilter === "all" || transaction.type.toLowerCase() === typeFilter.toLowerCase()

      // Date filter
      let matchesDate = true
      const transactionDate = new Date(transaction.createdAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dateFilter !== "all" && dateFilter !== "custom") {
        switch (dateFilter) {
          case "today":
            matchesDate = format(transactionDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
            break
          case "yesterday":
            const yesterday = subDays(today, 1)
            matchesDate = format(transactionDate, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")
            break
          case "week":
            const weekAgo = subWeeks(today, 1)
            matchesDate = transactionDate >= weekAgo && transactionDate <= today
            break
          case "month":
            const monthAgo = subMonths(today, 1)
            matchesDate = transactionDate >= monthAgo && transactionDate <= today
            break
          case "quarter":
            const quarterAgo = subMonths(today, 3)
            matchesDate = transactionDate >= quarterAgo && transactionDate <= today
            break
          case "year":
            const yearAgo = subYears(today, 1)
            matchesDate = transactionDate >= yearAgo && transactionDate <= today
            break
        }
      } else if (dateFilter === "custom" && customDateRange.from && customDateRange.to) {
        matchesDate =
          transactionDate >= customDateRange.from &&
          transactionDate <= new Date(customDateRange.to.setHours(23, 59, 59, 999))
      }

      // Amount range filter
      const minAmount = amountRange.min ? parseFloat(amountRange.min) : -Infinity
      const maxAmount = amountRange.max ? parseFloat(amountRange.max) : Infinity
      const matchesAmount = transaction.amount >= minAmount && transaction.amount <= maxAmount

      return matchesSearch && matchesStatus && matchesType && matchesDate && matchesAmount
    })
  }, [transactions, searchQuery, statusFilter, typeFilter, dateFilter, customDateRange, amountRange])

  const handleViewDetails = (transaction: ITransactionPopulated) => {
    setSelectedTransaction(transaction)
    setIsDetailsOpen(true)
  }

  const handleUpdate = (transaction: ITransactionPopulated) => {
    setSelectedTransaction(transaction)
    setIsUpdateOpen(true)
  }

  const handleDelete = (transaction: ITransactionPopulated) => {
    setSelectedTransaction(transaction)
    setIsDeleteOpen(true)
  }

  const handleTransactionUpdated = (updatedTransaction: ITransactionPopulated) => {
    setTransactions(prev =>
      prev.map(t => t._id === updatedTransaction._id ? updatedTransaction : t)
    )
    setSelectedTransaction(updatedTransaction)
  }

  const handleTransactionDeleted = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t._id !== transactionId))
    setIsDeleteOpen(false)
    setSelectedTransaction(null)
  }

  const handleRefresh = () => {
    fetchTransactions()
    toast({
      title: "Refreshed",
      description: "Transactions have been refreshed"
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["ID", "Type", "Amount", "Status", "Date", "Description", "User", "Category", "Reference"],
      ...filteredTransactions.map(t => [
        t._id,
        t.type,
        t.amount,
        t.status,
        t.createdAt,
        t.notes || '',
        t.user?.userName || '',
        t.accountType,
        t._id
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setDateFilter("all")
    setCustomDateRange({ from: undefined, to: undefined })
    setAmountRange({ min: "", max: "" })
    setIsFilterPopoverOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center">
            <h1 className="text-lg font-semibold md:text-xl">Transaction Management</h1>
          </div>
          <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                    <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="PAYMENT">Payment</SelectItem>
                    <SelectItem value="LOAN_PAYMENT">Loan Payment</SelectItem>
                    <SelectItem value="INTEREST">Interest</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Date Range</SelectLabel>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Popover open={isFilterPopoverOpen} onOpenChange={setIsFilterPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">More Filters</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Additional Filters</h4>
                      <p className="text-sm text-muted-foreground">
                        Filter transactions by amount range and custom dates
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="min-amount">Min Amount</Label>
                          <Input
                            id="min-amount"
                            type="number"
                            placeholder="Min amount"
                            value={amountRange.min}
                            onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-amount">Max Amount</Label>
                          <Input
                            id="max-amount"
                            type="number"
                            placeholder="Max amount"
                            value={amountRange.max}
                            onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                          />
                        </div>
                      </div>
                      {dateFilter === "custom" && (
                        <div className="space-y-2">
                          <Label>Custom Date Range</Label>
                          <CalendarComponent
                            mode="range"
                            selected={customDateRange}
                            onSelect={(range) => setCustomDateRange({ from: range?.from, to: range?.to })}
                            initialFocus
                          />
                        </div>
                      )}
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="main">Main Transactions</TabsTrigger>
              {/* <TabsTrigger value="loans">Loans</TabsTrigger> */}
              {/* <TabsTrigger value="investments">Investments</TabsTrigger> */}
            </TabsList>

            <TabsContent value="main" className="space-y-4">
              <MainTransactionsTab
                transactions={filteredTransactions}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="loans" className="space-y-4">
              <LoanTransactionsTab
                transactions={filteredTransactions}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="investments" className="space-y-4">
              <InvestmentTransactionsTab
                transactions={filteredTransactions}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {selectedTransaction && (
        <>
          <TransactionDetailsDialog
            transaction={selectedTransaction}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <UpdateTransactionDialog
            transaction={selectedTransaction}
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
            onTransactionUpdated={handleTransactionUpdated}
          />
          <DeleteTransactionDialog
            transaction={selectedTransaction}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onTransactionDeleted={handleTransactionDeleted}
          />
        </>
      )}
    </DashboardLayout>
  )
}