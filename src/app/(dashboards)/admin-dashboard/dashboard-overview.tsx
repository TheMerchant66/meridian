"use client";

import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChevronDown,
  CreditCard,
  DollarSign,
  Download,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "./dashboard-layout";
import { RevenueChart } from "./revenue-chart";
import { api } from "@/api/axios";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITransactionPopulated } from "@/lib/models/transaction.model";

interface DashboardMetrics {
  totalBalance: number;
  activeUsers: number;
  activeCards: number;
  pendingApprovals: number;
}

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<ITransactionPopulated[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );
  const [activityPageIndex, setActivityPageIndex] = useState(0);
  const [transactionsPageIndex, setTransactionsPageIndex] = useState(0);
  const pageSize = 10;

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersResponse, transactionsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/transactions?admin=true"),
      ]);

      console.log("This is the response for users", usersResponse);
      console.log(
        "This is the response for transactions",
        transactionsResponse
      );

      const users = usersResponse.data.users;
      const totalBalance = users.reduce((sum: number, user: any) => {
        const checkingBalance = user.checkingAccount?.balance || 0;
        const investmentBalance = user.investmentAccount?.balance || 0;
        const loanBalance = user.loanAccount?.balance || 0;
        return sum + checkingBalance + investmentBalance - loanBalance;
      }, 0);
      const activeUsers = users.filter(
        (user: any) => user.accountStatus === "ACTIVE"
      ).length;
      const activeCards = users.reduce(
        (count: number, user: any) =>
          count + (user.checkingAccount?.cardNumber ? 1 : 0),
        0
      );
      const pendingApprovals = transactionsResponse.data.transactions.length;

      setMetrics({
        totalBalance,
        activeUsers,
        activeCards,
        pendingApprovals,
      });
      toast({
        title: "Success",
        description: "Dashboard metrics loaded successfully",
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch dashboard metrics";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    setIsLoadingTransactions(true);
    setTransactionsError(null);
    try {
      const response = await api.get("/transactions", {
        params: {
          admin: true,
          limit: 5,
          sort: "-createdAt",
        },
      });

      const apiTransactions = response.data.transactions;

      setTransactions(apiTransactions);
      toast({
        title: "Success",
        description: "Recent transactions loaded successfully",
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch recent transactions";
      setTransactionsError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchRecentTransactions();
  }, []);

  const renderTransactionRow = (transaction: ITransactionPopulated) => {
    const statusColors = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(transaction.amount));

    return (
      <TableRow key={transaction._id}>
        <TableCell>{transaction._id}</TableCell>
        <TableCell>
          {transaction.user ? transaction.user.firstName : "N/A"}
        </TableCell>
        <TableCell>{transaction.type.replace("_", " ")}</TableCell>
        <TableCell
          className={transaction.amount > 0 ? "text-green-500" : "text-red-500"}
        >
          {transaction.amount > 0 ? "+" : "-"}
          {formattedAmount}
        </TableCell>
        <TableCell>
          <Badge className={`px-3 py-1 text-xs font-medium`}>
            {transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>{transaction.accountType || "N/A"}</TableCell>
        <TableCell>{transaction.type}</TableCell>
        <TableCell>
          {new Date(transaction.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </TableCell>
      </TableRow>
    );
  };

  const renderTransactionSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  // Paginated data for both tables
  const paginatedActivity = transactions.slice(
    activityPageIndex * pageSize,
    (activityPageIndex + 1) * pageSize
  );
  const paginatedTransactions = transactions.slice(
    transactionsPageIndex * pageSize,
    (transactionsPageIndex + 1) * pageSize
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <Link href="#" className="lg:hidden">
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-xl">
              Dashboard Overview
            </h1>
          </div>
          <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search accounts..."
                  className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[320px]"
                />
              </div>
            </form>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {metrics?.pendingApprovals || 0}
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  Admin
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}{" "}
                <Button variant="link" onClick={fetchMetrics} className="p-0">
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <div className="flex items-center ">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export Report
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Balance
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-32" />
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {metrics?.totalBalance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Across all accounts
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {metrics?.activeUsers.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Currently active
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Cards
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {metrics?.activeCards.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Active accounts
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Approvals
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {metrics?.pendingApprovals.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pending transactions
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RevenueChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      {isLoading ? (
                        <Skeleton className="h-4 w-40" />
                      ) : (
                        `There were ${
                          metrics?.pendingApprovals || 0
                        } pending transactions in the last 24 hours.`
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingTransactions ? (
                          renderTransactionSkeleton()
                        ) : paginatedActivity.length > 0 ? (
                          paginatedActivity.map(renderTransactionRow)
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center">
                              No recent transactions found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {/* Pagination controls for Recent Activity */}
                    {transactions.length > pageSize && (
                      <div className="flex items-center justify-end space-x-2 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setActivityPageIndex((prev) =>
                              Math.max(prev - 1, 0)
                            )
                          }
                          disabled={activityPageIndex === 0}
                        >
                          Previous
                        </Button>
                        <span>
                          Page {activityPageIndex + 1} of{" "}
                          {Math.ceil(transactions.length / pageSize)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setActivityPageIndex((prev) => prev + 1)
                          }
                          disabled={
                            activityPageIndex >=
                            Math.ceil(transactions.length / pageSize) - 1
                          }
                        >
                          Next
                        </Button>
                      </div>
                    )}
                    {transactionsError && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {transactionsError}{" "}
                          <Button
                            variant="link"
                            onClick={fetchRecentTransactions}
                            className="p-0"
                          >
                            Retry
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Showing the latest transactions across all accounts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Account</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingTransactions ? (
                          renderTransactionSkeleton()
                        ) : paginatedTransactions.length > 0 ? (
                          paginatedTransactions.map(renderTransactionRow)
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center">
                              No recent transactions found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {/* Pagination controls for Recent Transactions */}
                    {transactions.length > pageSize && (
                      <div className="flex items-center justify-end space-x-2 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setTransactionsPageIndex((prev) =>
                              Math.max(prev - 1, 0)
                            )
                          }
                          disabled={transactionsPageIndex === 0}
                        >
                          Previous
                        </Button>
                        <span>
                          Page {transactionsPageIndex + 1} of{" "}
                          {Math.ceil(transactions.length / pageSize)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setTransactionsPageIndex((prev) => prev + 1)
                          }
                          disabled={
                            transactionsPageIndex >=
                            Math.ceil(transactions.length / pageSize) - 1
                          }
                        >
                          Next
                        </Button>
                      </div>
                    )}
                    {transactionsError && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {transactionsError}{" "}
                          <Button
                            variant="link"
                            onClick={fetchRecentTransactions}
                            className="p-0"
                          >
                            Retry
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}
