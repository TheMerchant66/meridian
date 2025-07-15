"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  X,
  Download,
  Copy,
  User,
  CreditCard,
  MapPin,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Bitcoin,
  Receipt,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/api/axios";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  customer: string;
  type:
    | "DEPOSIT"
    | "CRYPTO_DEPOSIT"
    | "CHEQUE_DEPOSIT"
    | "WITHDRAWAL"
    | "TRANSFER"
    | "PAYMENT"
    | "LOAN_PAYMENT";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  account: string;
  method: string;
  description: string;
  recipient?: string;
  category: string;
  reference: string;
  notes?: string;
  location?: string;
}

interface ApiResponse {
  message: string;
  transactions: Array<{
    _id: string;
    user: { fullName: string };
    type: Transaction["type"];
    amount: number;
    status: Transaction["status"];
    createdAt: string;
    accountType: string;
    paymentMethod: string;
    recipient?: string;
    notes?: string;
    category: string;
    reference: string;
    location?: string;
  }>;
}

interface TransactionDetailsModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsModalProps) {
  const statusColors = {
    completed:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    pending:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    failed:
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const typeIcons = {
    DEPOSIT: <ArrowDownToLine className="h-5 w-5 text-green-500" />,
    CRYPTO_DEPOSIT: <Bitcoin className="h-5 w-5 text-green-500" />,
    CHEQUE_DEPOSIT: <Receipt className="h-5 w-5 text-green-500" />,
    WITHDRAWAL: <ArrowUpFromLine className="h-5 w-5 text-amber-500" />,
    TRANSFER: <ArrowRight className="h-5 w-5 text-blue-500" />,
    PAYMENT: <Wallet className="h-5 w-5 text-purple-500" />,
    LOAN_PAYMENT: <Building2 className="h-5 w-5 text-indigo-500" />,
  };

  const typeColors = {
    DEPOSIT:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    CRYPTO_DEPOSIT:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    CHEQUE_DEPOSIT:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    WITHDRAWAL:
      "bg-rose-500/10 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    TRANSFER:
      "bg-violet-500/10 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    PAYMENT:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    LOAN_PAYMENT:
      "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <div className="flex flex-col">
          <div
            className={`p-6 ${
              transaction.amount > 0
                ? "bg-green-50 dark:bg-green-950/30"
                : "bg-blue-50 dark:bg-blue-950/30"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-full ${typeColors[transaction.type]}`}
                >
                  {typeIcons[transaction.type]}
                </div>
                <DialogTitle className="text-xl font-semibold">
                  {transaction.description}
                </DialogTitle>
              </div>
              <Badge
                className={`px-3 py-1 text-xs font-medium border ${
                  statusColors[transaction.status]
                }`}
              >
                {transaction.status.charAt(0).toUpperCase() +
                  transaction.status.slice(1)}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Transaction Amount
                </p>
                <p
                  className={`text-3xl font-bold ${
                    transaction.amount > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {Math.abs(transaction.amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <p className="text-sm text-muted-foreground mb-1">
                  Transaction ID
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-sm font-mono">
                    {transaction.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      navigator.clipboard.writeText(transaction.id)
                    }
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy ID</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ScrollArea className="max-h-[400px]">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Date
                  </h4>
                  <p className="text-base font-medium">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Reference
                  </h4>
                  <p className="text-base font-medium">
                    {transaction.reference}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Category
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Account
                  </h4>
                  <p className="text-base font-medium">{transaction.account}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Customer
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <User className="h-4 w-4 text-zinc-500" />
                    </div>
                    <p className="text-base font-medium">
                      {transaction.customer}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </h4>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {/* Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD' }).format(amount) */}
                    <p className="text-base font-medium">
                      {transaction.method}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Location
                  </h4>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-medium">
                      {transaction.location || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              {transaction.notes && (
                <div className="pt-4 border-t">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Notes
                    </h4>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border">
                      <p className="text-base">{transaction.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center justify-between p-4 border-t bg-zinc-50 dark:bg-zinc-900">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RecentTransactionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterCustomer, setFilterCustomer] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(10);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => <div>{row.getValue("customer")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const iconBackgrounds = {
          DEPOSIT: "bg-emerald-500/10",
          CRYPTO_DEPOSIT: "bg-emerald-500/10",
          CHEQUE_DEPOSIT: "bg-emerald-500/10",
          WITHDRAWAL: "bg-rose-500/10",
          TRANSFER: "bg-violet-500/10",
          PAYMENT: "bg-amber-500/10",
          LOAN_PAYMENT: "bg-indigo-500/10",
        };

        const transactionIcons = {
          DEPOSIT: <ArrowDownToLine className="h-4 w-4" />,
          CRYPTO_DEPOSIT: <Bitcoin className="h-4 w-4" />,
          CHEQUE_DEPOSIT: <Receipt className="h-4 w-4" />,
          WITHDRAWAL: <ArrowUpFromLine className="h-4 w-4" />,
          TRANSFER: <ArrowRight className="h-4 w-4" />,
          PAYMENT: <Wallet className="h-4 w-4" />,
          LOAN_PAYMENT: <Building2 className="h-4 w-4" />,
        };

        return (
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                iconBackgrounds[type as keyof typeof iconBackgrounds]
              }`}
            >
              {transactionIcons[type as keyof typeof transactionIcons]}
            </div>
            <span>
              {type.charAt(0).toUpperCase() +
                type.toLowerCase().slice(1).replace("_", " ")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.abs(amount));

        return (
          <div
            className={`font-medium ${
              amount > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {amount > 0 ? "+" : "-"}
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors = {
          completed:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          pending:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          failed:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        };

        return (
          <Badge
            className={`px-3 py-1 text-xs font-medium ${
              statusColors[status as keyof typeof statusColors]
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "account",
      header: "Account",
      cell: ({ row }) => <div>{row.getValue("account")}</div>,
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => <div>{row.getValue("method")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div>
            {date
              .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              .replace(",", " -")}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setSelectedTransaction(transaction)}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View account</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Download receipt</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchTransactions = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse>("/transactions", {
        params: {
          admin: true,
          type: filterType !== "all" ? filterType : undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
          customer: filterCustomer || undefined,
          dateFrom: dateRange.from || undefined,
          dateTo: dateRange.to || undefined,
          page: pageIndex + 1,
          limit: pageSize,
        },
      });

      const { transactions: apiTransactions } = response.data;

      const mappedTransactions: Transaction[] = apiTransactions.map((tx) => ({
        id: tx._id,
        customer: tx.user.fullName,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        date: tx.createdAt,
        account: tx.accountType,
        method: tx.paymentMethod,
        description:
          tx.notes ||
          tx.recipient ||
          `${tx.type.replace("_", " ").toLowerCase()} - USD`,
        recipient: tx.recipient,
        category: tx.category,
        reference: tx.reference,
        notes: tx.notes,
        location: tx.location,
      }));

      setTransactions(mappedTransactions);
      toast.success("Transactions fetched successfully");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch transactions. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    filterType,
    filterStatus,
    filterCustomer,
    dateRange,
    pageIndex,
    pageSize,
  ]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredData = React.useMemo(() => {
    return transactions.filter((transaction) => {
      const typeMatch = filterType === "all" || transaction.type === filterType;
      const statusMatch =
        filterStatus === "all" || transaction.status === filterStatus;
      const customerMatch = filterCustomer
        ? transaction.customer
            .toLowerCase()
            .includes(filterCustomer.toLowerCase())
        : true;
      const dateMatch =
        (!dateRange.from ||
          new Date(transaction.date) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(transaction.date) <= new Date(dateRange.to));
      return typeMatch && statusMatch && customerMatch && dateMatch;
    });
  }, [transactions, filterType, filterStatus, filterCustomer, dateRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex, pageSize },
    },
  });

  const renderMobileCard = (transaction: Transaction) => {
    const statusColors = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    const iconBackgrounds = {
      DEPOSIT: "bg-emerald-500/10",
      CRYPTO_DEPOSIT: "bg-emerald-500/10",
      CHEQUE_DEPOSIT: "bg-emerald-500/10",
      WITHDRAWAL: "bg-rose-500/10",
      TRANSFER: "bg-violet-500/10",
      PAYMENT: "bg-amber-500/10",
      LOAN_PAYMENT: "bg-indigo-500/10",
    };

    const transactionIcons = {
      DEPOSIT: <ArrowDownToLine className="h-3.5 w-3.5" />,
      CRYPTO_DEPOSIT: <Bitcoin className="h-3.5 w-3.5" />,
      CHEQUE_DEPOSIT: <Receipt className="h-3.5 w-3.5" />,
      WITHDRAWAL: <ArrowUpFromLine className="h-3.5 w-3.5" />,
      TRANSFER: <ArrowRight className="h-3.5 w-3.5" />,
      PAYMENT: <Wallet className="h-3.5 w-3.5" />,
      LOAN_PAYMENT: <Building2 className="h-3.5 w-3.5" />,
    };

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(transaction.amount));

    return (
      <div
        key={transaction.id}
        className="bg-white dark:bg-zinc-900 rounded-xl p-3 space-y-2.5 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        onClick={() => setSelectedTransaction(transaction)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded-lg ${
                iconBackgrounds[transaction.type]
              }`}
            >
              {
                transactionIcons[
                  transaction.type as keyof typeof transactionIcons
                ]
              }
            </div>
            <div>
              <p className="text-sm font-medium leading-tight">
                {transaction.description}
              </p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {transaction.type.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`px-2 py-0.5 text-[10px] font-medium ${
              statusColors[transaction.status]
            }`}
          >
            {transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <div className="text-xs text-muted-foreground">
            {new Date(transaction.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div
            className={`text-sm font-medium ${
              transaction.amount > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {transaction.amount > 0 ? "+" : "-"}
            {formattedAmount}
          </div>
        </div>
      </div>
    );
  };

  const renderMobileSkeleton = () => (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-900 rounded-xl p-3 space-y-2.5 border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <div>
                <Skeleton className="h-3.5 w-28 mb-1" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
          <div className="flex items-center justify-between pt-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}{" "}
            <Button variant="link" onClick={fetchTransactions} className="p-0">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between gap-4 px-5">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilterType("all");
            setFilterStatus("all");
            setFilterCustomer("");
            setDateRange({ from: "", to: "" });
          }}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>
      <div className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="DEPOSIT">Deposit</SelectItem>
                  <SelectItem value="CRYPTO_DEPOSIT">Crypto Deposit</SelectItem>
                  <SelectItem value="CHEQUE_DEPOSIT">Cheque Deposit</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                  <SelectItem value="PAYMENT">Payment</SelectItem>
                  <SelectItem value="LOAN_PAYMENT">Loan Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <Input
                type="text"
                placeholder="Search by customer name"
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="From"
                    value={
                      dateRange.from
                        ? new Date(dateRange.from).toLocaleDateString()
                        : ""
                    }
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setDateRange((prev) => ({
                          ...prev,
                          from: date.toISOString().split("T")[0],
                        }));
                      }
                    }}
                    className="w-full pl-3 pr-8 text-sm"
                  />
                  <input
                    type="date"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="To"
                    value={
                      dateRange.to
                        ? new Date(dateRange.to).toLocaleDateString()
                        : ""
                    }
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setDateRange((prev) => ({
                          ...prev,
                          to: date.toISOString().split("T")[0],
                        }));
                      }
                    }}
                    className="w-full pl-3 pr-8 text-sm"
                  />
                  <input
                    type="date"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden space-y-3">
          {isLoading ? (
            renderMobileSkeleton()
          ) : filteredData.length > 0 ? (
            filteredData.map((transaction) => renderMobileCard(transaction))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found.
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900 py-4">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-0"
                >
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={`text-zinc-100 px-6 ${
                        index === 0 ? "rounded-tl-lg rounded-bl-lg" : ""
                      } ${
                        index === headerGroup.headers.length - 1
                          ? "rounded-tr-lg rounded-br-lg"
                          : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-6">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="px-6">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="px-6">
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </TableCell>
                    <TableCell className="px-6">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="px-6">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="px-6">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="px-6">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    onClick={() => setSelectedTransaction(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, filteredData.length)} of{" "}
            {filteredData.length} transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPageIndex((prev) => prev - 1);
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to previous page</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPageIndex((prev) => prev + 1);
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to next page</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {selectedTransaction && (
          <TransactionDetailsModal
            transaction={selectedTransaction}
            isOpen={!!selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </div>
    </div>
  );
}
