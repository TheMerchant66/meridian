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
  Bitcoin,
  Receipt,
  Building2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
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

// Define transaction types and statuses as enums for type safety
enum TransactionType {
  DEPOSIT = "DEPOSIT",
  CRYPTO_DEPOSIT = "CRYPTO_DEPOSIT",
  CHEQUE_DEPOSIT = "CHEQUE_DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  PAYMENT = "PAYMENT",
  LOAN_PAYMENT = "LOAN_PAYMENT",
}

enum TransactionStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  PROCESSING = "PROCESSING",
}

interface ICurrency {
  name: string;
  _id: string;
}

interface ICryptoDetails {
  network: string;
  walletAddress: string;
}

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ITransaction {
  _id: string;
  accountType: string;
  amount: number;
  createdAt: string;
  date: string;
  updatedAt: string;
  status: TransactionStatus;
  type: TransactionType;
  currency: ICurrency;
  user: IUser;
  cryptoDetails?: ICryptoDetails;
  __v: number;
}

interface ApiResponse {
  message: string;
  transactions: ITransaction[];
}

interface TransactionDetailsModalProps {
  transaction: ITransaction;
  isOpen: boolean;
  onClose: () => void;
}

function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsModalProps) {
  const statusColors: Record<TransactionStatus, string> = {
    [TransactionStatus.COMPLETED]:
      "bg-emerald-500/10 text-emerald-500 border-emerald-200",
    [TransactionStatus.IN_PROGRESS]:
      "bg-amber-500/10 text-amber-500 border-amber-200",
    [TransactionStatus.CANCELLED]:
      "bg-rose-500/10 text-rose-500 border-rose-200",
    [TransactionStatus.PROCESSING]:
      "bg-sky-500/10 text-sky-500 border-sky-200 ",
  };

  const typeIcons: Record<TransactionType, React.JSX.Element> = {
    [TransactionType.TRANSFER]: (
      <ArrowRight className="h-5 w-5 text-violet-500" />
    ),
    [TransactionType.DEPOSIT]: (
      <ArrowDownToLine className="h-5 w-5 text-emerald-500" />
    ),
    [TransactionType.WITHDRAWAL]: (
      <ArrowUpFromLine className="h-5 w-5 text-rose-500" />
    ),
    [TransactionType.PAYMENT]: <Wallet className="h-5 w-5 text-amber-500" />,
    [TransactionType.CRYPTO_DEPOSIT]: (
      <Bitcoin className="h-5 w-5 text-orange-500" />
    ),
    [TransactionType.CHEQUE_DEPOSIT]: (
      <Receipt className="h-5 w-5 text-teal-500" />
    ),
    [TransactionType.LOAN_PAYMENT]: (
      <Building2 className="h-5 w-5 text-indigo-500" />
    ),
  };

  const typeColors: Record<TransactionType, string> = {
    [TransactionType.DEPOSIT]:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200",
    [TransactionType.CRYPTO_DEPOSIT]:
      "bg-orange-500/10 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200",
    [TransactionType.CHEQUE_DEPOSIT]:
      "bg-teal-500/10 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200",
    [TransactionType.WITHDRAWAL]:
      "bg-rose-500/10 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200",
    [TransactionType.TRANSFER]:
      "bg-violet-500/10 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200",
    [TransactionType.PAYMENT]:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
    [TransactionType.LOAN_PAYMENT]:
      "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200",
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.includes("USDT") ? "USD" : "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <div className="flex flex-col">
          <div className={`p-6 ${typeColors[transaction.type]}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${typeColors[transaction.type]}`}
                >
                  {typeIcons[transaction.type]}
                </div>
                <DialogTitle className="text-xl font-semibold capitalize">
                  {transaction.type.replace("_", " ").toLowerCase()}
                </DialogTitle>
              </div>
              <Badge
                className={`px-3 py-1 text-xs font-medium border ${
                  statusColors[transaction.status]
                }`}
              >
                {transaction.status.charAt(0).toUpperCase() +
                  transaction.status.slice(1).toLowerCase()}
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
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {formatAmount(transaction.amount, transaction.currency.name)}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <p className="text-sm text-muted-foreground mb-1">
                  Transaction ID
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-sm font-mono truncate max-w-[150px]">
                    {transaction._id}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      navigator.clipboard.writeText(transaction._id);
                      toast.success("Transaction ID copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy ID</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ScrollArea className="max-h-[450px]">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Date & Time
                  </h4>
                  <p className="text-base font-medium">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </h4>
                  <p className="text-base font-medium">
                    {new Date(transaction.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.updatedAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Account Type
                  </h4>
                  <p className="text-base font-medium capitalize">
                    {transaction.accountType.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Currency
                  </h4>
                  <p className="text-base font-medium">
                    {transaction.currency.name}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                  User Details
                </h4>
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-base font-medium">
                      {transaction.user.firstName} {transaction.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {transaction.user._id}
                    </p>
                  </div>
                </div>
              </div>
              {transaction.cryptoDetails && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                    Crypto Details
                  </h4>
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Network:
                      </p>
                      <p className="text-base">
                        {transaction.cryptoDetails.network}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Wallet Address:
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-base font-mono truncate max-w-[250px]">
                          {transaction.cryptoDetails.walletAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              transaction.cryptoDetails!.walletAddress
                            );
                            toast.success("Wallet address copied");
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center justify-between p-4 border-t bg-zinc-50 dark:bg-zinc-900">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => toast.success("Receipt download initiated")}
            >
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

export function ActivityTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<ITransaction | null>(null);
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterAccountType, setFilterAccountType] =
    React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [transactions, setTransactions] = React.useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const pageSize = 10;

  const columns: ColumnDef<ITransaction>[] = [
    {
      accessorKey: "type",
      header: "Transaction",
      cell: ({ row }) => {
        const transaction = row.original as ITransaction;
        const iconBackgrounds: Record<TransactionType, string> = {
          [TransactionType.DEPOSIT]: "bg-emerald-500/10",
          [TransactionType.CRYPTO_DEPOSIT]: "bg-orange-500/10",
          [TransactionType.CHEQUE_DEPOSIT]: "bg-teal-500/10",
          [TransactionType.WITHDRAWAL]: "bg-rose-500/10",
          [TransactionType.TRANSFER]: "bg-violet-500/10",
          [TransactionType.PAYMENT]: "bg-amber-500/10",
          [TransactionType.LOAN_PAYMENT]: "bg-indigo-500/10",
        };

        const transactionIcons: Record<TransactionType, React.JSX.Element> = {
          [TransactionType.DEPOSIT]: (
            <ArrowDownToLine className="h-4 w-4 text-emerald-500" />
          ),
          [TransactionType.CRYPTO_DEPOSIT]: (
            <Bitcoin className="h-4 w-4 text-orange-500" />
          ),
          [TransactionType.CHEQUE_DEPOSIT]: (
            <Receipt className="h-4 w-4 text-teal-500" />
          ),
          [TransactionType.WITHDRAWAL]: (
            <ArrowUpFromLine className="h-4 w-4 text-rose-500" />
          ),
          [TransactionType.TRANSFER]: (
            <ArrowRight className="h-4 w-4 text-violet-500" />
          ),
          [TransactionType.PAYMENT]: (
            <Wallet className="h-4 w-4 text-amber-500" />
          ),
          [TransactionType.LOAN_PAYMENT]: (
            <Building2 className="h-4 w-4 text-indigo-600" />
          ),
        };

        return (
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                iconBackgrounds[transaction.type]
              }`}
            >
              {transactionIcons[transaction.type]}
            </div>
            <div>
              <p className="text-sm font-medium capitalize">
                {transaction.type.replace("_", " ").toLowerCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.user.firstName} {transaction.user.lastName}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent text-sm font-medium"
        >
          Date
          <ArrowUpDown className="ml-4 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <div className="text-sm">
            {new Date(date)
              .toLocaleString("en-US", {
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
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent text-sm font-medium "
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const transaction = row.original as ITransaction;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: transaction.currency.name.includes("USDT") ? "USD" : "USD",
        }).format(transaction.amount);

        return (
          <div
            className={`text-sm font-medium ${
              transaction.amount > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {transaction.amount > 0 ? "+" : ""}
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusRaw = row.getValue("status") as string;
        const status = statusRaw.toUpperCase() as TransactionStatus;
        const statusColors: Record<TransactionStatus, string> = {
          [TransactionStatus.COMPLETED]:
            "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
          [TransactionStatus.PROCESSING]:
            "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
          [TransactionStatus.IN_PROGRESS]:
            "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300",
          [TransactionStatus.CANCELLED]:
            "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
        };

        return (
          <div className="w-fit">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
              {statusRaw.charAt(0).toUpperCase() +
                statusRaw.slice(1).toLowerCase()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "accountType",
      header: "Account",
      cell: ({ row }) => (
        <div className="text-sm capitalize">
          {(row.getValue("accountType") as string)
            .replace(/([A-Z])/g, " $1")
            .trim()}
        </div>
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {(row.original.currency as ICurrency).name}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original as ITransaction;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(transaction._id);
                  toast.success("Transaction ID copied");
                }}
              >
                Copy Transaction ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedTransaction(transaction)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.success("Receipt download initiated")}
              >
                Download Receipt
              </DropdownMenuItem>
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
      const response = await api.get<ApiResponse>("/transactions");
      setTransactions(response.data.transactions);
      console.log("Fetched transactions:", response.data.transactions);
      toast.success(response.data.message);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch transactions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredData = React.useMemo(() => {
    return transactions.filter((transaction) => {
      const typeMatch =
        filterType === "all" ||
        transaction.type.toLowerCase() === filterType.toLowerCase();
      const statusMatch =
        filterStatus === "all" ||
        transaction.status.toLowerCase() === filterStatus.toLowerCase();
      const dateMatch =
        (!dateRange.from ||
          new Date(transaction.createdAt) >= new Date(dateRange.from)) &&
        (!dateRange.to ||
          new Date(transaction.createdAt) <= new Date(dateRange.to));
      const searchMatch =
        !searchQuery ||
        transaction._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.user.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.user.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.user.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (transaction.cryptoDetails?.walletAddress
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);

      return typeMatch && statusMatch && dateMatch && searchMatch;
    });
  }, [transactions, filterType, filterStatus, dateRange, searchQuery]);

  const paginatedData = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageIndex, pageSize]);

  const table = useReactTable({
    data: paginatedData,
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
    manualPagination: true,
    pageCount: Math.ceil(filteredData.length / pageSize),
  });

  const renderMobileCard = (transaction: ITransaction) => {
    const statusColors: Record<TransactionStatus, string> = {
      [TransactionStatus.COMPLETED]:
        "bg-emerald-500/10 text-emerald-500 border-emerald-600",
      [TransactionStatus.IN_PROGRESS]:
        "bg-amber-500/10 text-amber-500 border-amber-600",
      [TransactionStatus.CANCELLED]:
        "bg-rose-500/10 text-rose-500 border-rose-600",
      [TransactionStatus.PROCESSING]:
        "bg-blue-500/10 text-blue-500 border-blue-600",
    };

    const iconBackgrounds: Record<TransactionType, string> = {
      [TransactionType.DEPOSIT]: "bg-emerald-500/10",
      [TransactionType.CRYPTO_DEPOSIT]: "bg-orange-500/10",
      [TransactionType.CHEQUE_DEPOSIT]: "bg-teal-500/10",
      [TransactionType.WITHDRAWAL]: "bg-rose-500/10",
      [TransactionType.TRANSFER]: "bg-violet-500/10",
      [TransactionType.PAYMENT]: "bg-amber-500/10",
      [TransactionType.LOAN_PAYMENT]: "bg-indigo-500/10",
    };

    const transactionIcons: Record<TransactionType, React.JSX.Element> = {
      [TransactionType.DEPOSIT]: (
        <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-500" />
      ),
      [TransactionType.CRYPTO_DEPOSIT]: (
        <Bitcoin className="h-3.5 w-3.5 text-orange-500" />
      ),
      [TransactionType.CHEQUE_DEPOSIT]: (
        <Receipt className="h-3.5 w-3.5 text-teal-500" />
      ),
      [TransactionType.WITHDRAWAL]: (
        <ArrowUpFromLine className="h-3.5 w-3.5 text-rose-500" />
      ),
      [TransactionType.TRANSFER]: (
        <ArrowRight className="h-3.5 w-3.5 text-violet-500" />
      ),
      [TransactionType.PAYMENT]: (
        <Wallet className="h-3.5 w-3.5 text-amber-500" />
      ),
      [TransactionType.LOAN_PAYMENT]: (
        <Building2 className="h-3.5 w-3.5 text-indigo-600" />
      ),
    };

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: transaction.currency.name.includes("USDT") ? "USD" : "USD",
    }).format(transaction.amount);

    return (
      <div
        key={transaction._id}
        className="bg-white dark:bg-zinc-900 rounded-xl p-3 space-y-2.5 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors"
        onClick={() => setSelectedTransaction(transaction)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded-lg ${
                iconBackgrounds[transaction.type]
              }`}
            >
              {transactionIcons[transaction.type]}
            </div>
            <div>
              <p className="text-sm font-medium capitalize">
                {transaction.type.replace("_", " ").toLowerCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.user.firstName} {transaction.user.lastName}
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
              transaction.status.slice(1).toLowerCase()}
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <div className="text-xs text-muted-foreground">
            {new Date(transaction.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div
            className={`text-sm font-medium ${
              transaction.amount > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {transaction.amount > 0 ? "+" : ""}
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
              <Skeleton className="h-6 w-6 rounded-full" />
              <div>
                <Skeleton className="h-3.5 w-28 mb-1" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
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
            <Button
              variant="link"
              onClick={fetchTransactions}
              className="p-0 h-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div>
        <div className="flex sm:items-center justify-between gap-4 px-5">
          <h3 className="text-xl font-semibold">Transaction History</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterType("all");
              setFilterStatus("all");
              setDateRange({ from: "", to: "" });
              setSearchQuery("");
            }}
            className="gap-2 self-end sm:self-auto"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="w-full p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by ID, user, or wallet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(TransactionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ").toLowerCase()}
                    </SelectItem>
                  ))}
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(TransactionStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <Select
                value={filterAccountType}
                onValueChange={setFilterAccountType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="loanAccount">Loan Account</SelectItem>
                  <SelectItem value="investmentAccount">
                    Investment Account
                  </SelectItem>
                  <SelectItem value="checkingAccount">
                    Checking Account
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full">
                  <div className="relative">
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
                      className="w-full pl-5 pr-10 text-sm"
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
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="relative">
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
                      className="w-full pl-5 pr-10 text-sm"
                    />
                    <input
                      type="date"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      value={dateRange.to}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          to: e.target.value,
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
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
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
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredData.length} transaction
              {filteredData.length !== 1 ? "s" : ""} found
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden space-y-3">
          {isLoading ? (
            renderMobileSkeleton()
          ) : paginatedData.length > 0 ? (
            paginatedData.map((transaction) => renderMobileCard(transaction))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found.
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-950">
            <Table>
              <TableHeader className=" bg-gray-900 dark:bg-gray-950">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className=" hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header, index) => (
                      <TableHead
                        key={header.id}
                        className={`text-gray-100 dark:text-gray-200 px-4 py-3 text-sm font-semibold ${
                          index === 0 ? "rounded-tl-xl rounded-bl-xl" : ""
                        } ${
                          index === headerGroup.headers.length - 1
                            ? "rounded-tr-xl rounded-br-xl"
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
                    <TableRow
                      key={index}
                      className="even:bg-gray-50/50 dark:even:bg-gray-900/50"
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors even:bg-gray-50/50 dark:even:bg-gray-900/50 ${
                        rowIndex === table.getRowModel().rows.length - 1
                          ? "last:rounded-b-lg"
                          : ""
                      }`}
                      onClick={() => setSelectedTransaction(row.original)}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => (
                        <TableCell
                          key={cell.id}
                          className={`px-4 py-3 ${
                            rowIndex === table.getRowModel().rows.length - 1
                              ? cellIndex === 0
                                ? "rounded-bl-lg"
                                : cellIndex === row.getVisibleCells().length - 1
                                ? "rounded-br-lg"
                                : ""
                              : ""
                          }`}
                        >
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
                      className="h-24 text-center text-gray-500 dark:text-gray-400 rounded-b-lg"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to previous page</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => prev + 1)}
              disabled={
                pageIndex >= Math.ceil(filteredData.length / pageSize) - 1
              }
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
