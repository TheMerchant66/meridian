"use client"

import * as React from "react"
import { Calendar, Download, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for investment history
const transactionHistory = [
  {
    id: "tx-001",
    date: "2024-03-15",
    type: "buy",
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 5,
    price: 172.62,
    amount: 863.1,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
  {
    id: "tx-002",
    date: "2024-03-10",
    type: "dividend",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    shares: null,
    price: null,
    amount: 78.25,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
  {
    id: "tx-003",
    date: "2024-03-05",
    type: "sell",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 3,
    price: 406.22,
    amount: 1218.66,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
  {
    id: "tx-004",
    date: "2024-03-01",
    type: "deposit",
    symbol: null,
    name: null,
    shares: null,
    price: null,
    amount: 2000.0,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
  {
    id: "tx-005",
    date: "2024-02-20",
    type: "buy",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    shares: 5,
    price: 245.32,
    amount: 1226.6,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
  {
    id: "tx-006",
    date: "2024-02-15",
    type: "interest",
    symbol: null,
    name: null,
    shares: null,
    price: null,
    amount: 12.45,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
  {
    id: "tx-007",
    date: "2024-02-10",
    type: "buy",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 4,
    price: 142.65,
    amount: 570.6,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
  {
    id: "tx-008",
    date: "2024-02-01",
    type: "deposit",
    symbol: null,
    name: null,
    shares: null,
    price: null,
    amount: 2000.0,
    fees: 0.0,
    status: "completed",
    account: "Individual Brokerage",
  },
]

const taxDocuments = [
  {
    id: "doc-001",
    name: "1099-B (Proceeds from Broker Transactions)",
    year: 2023,
    dateAvailable: "2024-02-15",
    status: "available",
  },
  {
    id: "doc-002",
    name: "1099-DIV (Dividends and Distributions)",
    year: 2023,
    dateAvailable: "2024-02-15",
    status: "available",
  },
  {
    id: "doc-003",
    name: "1099-INT (Interest Income)",
    year: 2023,
    dateAvailable: "2024-02-15",
    status: "available",
  },
  {
    id: "doc-004",
    name: "1099-B (Proceeds from Broker Transactions)",
    year: 2022,
    dateAvailable: "2023-02-15",
    status: "available",
  },
  {
    id: "doc-005",
    name: "1099-DIV (Dividends and Distributions)",
    year: 2022,
    dateAvailable: "2023-02-15",
    status: "available",
  },
]

export function InvestmentHistory() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [transactionType, setTransactionType] = React.useState("all")
  const [dateRange, setDateRange] = React.useState("3m")

  // Filter transactions based on search, type, and date range
  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactionHistory]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tx) =>
          (tx.symbol && tx.symbol.toLowerCase().includes(query)) ||
          (tx.name && tx.name.toLowerCase().includes(query)) ||
          tx.type.toLowerCase().includes(query),
      )
    }

    // Filter by transaction type
    if (transactionType !== "all") {
      filtered = filtered.filter((tx) => tx.type === transactionType)
    }

    // Filter by date range
    const now = new Date()
    let cutoffDate = new Date()

    switch (dateRange) {
      case "1m":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
        cutoffDate = new Date(0) // Beginning of time
        break
    }

    filtered = filtered.filter((tx) => new Date(tx.date) >= cutoffDate)

    return filtered
  }, [searchQuery, transactionType, dateRange])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investment History</h1>
          <p className="text-muted-foreground">View your transaction history and tax documents</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="tax-documents">Tax Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Transaction History</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select value={transactionType} onValueChange={setTransactionType}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="dividend">Dividend</SelectItem>
                        <SelectItem value="interest">Interest</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">Last Month</SelectItem>
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="6m">Last 6 Months</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-3 px-4">Date</th>
                      <th className="text-left font-medium py-3 px-4">Type</th>
                      <th className="text-left font-medium py-3 px-4">Description</th>
                      <th className="text-right font-medium py-3 px-4">Shares</th>
                      <th className="text-right font-medium py-3 px-4">Price</th>
                      <th className="text-right font-medium py-3 px-4">Amount</th>
                      <th className="text-right font-medium py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            {new Date(transaction.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                transaction.type === "buy" ||
                                transaction.type === "deposit" ||
                                transaction.type === "dividend" ||
                                transaction.type === "interest"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                  : transaction.type === "sell" || transaction.type === "withdrawal"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                    : ""
                              }`}
                            >
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {transaction.symbol ? (
                              <div>
                                <div className="font-medium">{transaction.symbol}</div>
                                <div className="text-sm text-muted-foreground">{transaction.name}</div>
                              </div>
                            ) : (
                              <div className="font-medium capitalize">{transaction.type}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {transaction.shares ? transaction.shares : "-"}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {transaction.price ? `$${transaction.price.toFixed(2)}` : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-medium whitespace-nowrap">
                            <span
                              className={
                                transaction.type === "buy" || transaction.type === "withdrawal"
                                  ? "text-red-500"
                                  : transaction.type === "sell" ||
                                      transaction.type === "deposit" ||
                                      transaction.type === "dividend" ||
                                      transaction.type === "interest"
                                    ? "text-green-500"
                                    : ""
                              }
                            >
                              {transaction.type === "buy" || transaction.type === "withdrawal" ? "-" : "+"}$
                              {transaction.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Filter className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Download Confirmation</DropdownMenuItem>
                                  {transaction.type === "buy" || transaction.type === "sell" ? (
                                    <DropdownMenuItem>View Order</DropdownMenuItem>
                                  ) : null}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground">
                          No transactions found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactionHistory.length} transactions
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
              <CardDescription>Overview of your recent investment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Buys</p>
                  <p className="text-2xl font-bold text-red-500">
                    -$
                    {filteredTransactions
                      .filter((tx) => tx.type === "buy")
                      .reduce((sum, tx) => sum + tx.amount, 0)
                      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredTransactions.filter((tx) => tx.type === "buy").length} transactions
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Sells</p>
                  <p className="text-2xl font-bold text-green-500">
                    +$
                    {filteredTransactions
                      .filter((tx) => tx.type === "sell")
                      .reduce((sum, tx) => sum + tx.amount, 0)
                      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredTransactions.filter((tx) => tx.type === "sell").length} transactions
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dividends & Interest</p>
                  <p className="text-2xl font-bold text-green-500">
                    +$
                    {filteredTransactions
                      .filter((tx) => tx.type === "dividend" || tx.type === "interest")
                      .reduce((sum, tx) => sum + tx.amount, 0)
                      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredTransactions.filter((tx) => tx.type === "dividend" || tx.type === "interest").length}{" "}
                    payments
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Net Deposits</p>
                  <p className="text-2xl font-bold">
                    $
                    {(
                      filteredTransactions
                        .filter((tx) => tx.type === "deposit")
                        .reduce((sum, tx) => sum + tx.amount, 0) -
                      filteredTransactions
                        .filter((tx) => tx.type === "withdrawal")
                        .reduce((sum, tx) => sum + tx.amount, 0)
                    ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredTransactions.filter((tx) => tx.type === "deposit" || tx.type === "withdrawal").length}{" "}
                    transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-documents" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Tax Documents</CardTitle>
                  <CardDescription>Access your investment tax forms</CardDescription>
                </div>
                <Select defaultValue="2023">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Tax Year: {document.year} • Available:{" "}
                          {new Date(document.dateAvailable).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Tax documents are typically available by February 15th for the previous tax year. Please consult with a
                tax professional regarding your tax situation.
              </p>
            </CardFooter>
          </Card>

          <div className="mt-6 bg-muted/50 border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Need Help with Your Taxes?</h3>
            <p className="text-muted-foreground mb-4">
              We've partnered with trusted tax professionals who can help you maximize your investment tax benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="gap-2">
                Tax Resources
              </Button>
              <Button>Connect with Tax Pro</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
