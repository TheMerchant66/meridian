"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ArrowUpDown, 
  ChevronDown, 
  MoreHorizontal, 
  ArrowRight, 
  ArrowLeft,
  Wallet,
  CreditCard,
  Banknote,
  Bitcoin,
  Receipt,
  PiggyBank,
  Building2,
  ArrowDownToLine,
  ArrowUpFromLine
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/api/axios";
import toast from "react-hot-toast";
import { TransactionType, TransactionStatus } from "@/lib/enums/transactionType.enum";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  recipient?: string;
}

interface ApiResponse {
  message: string;
  transactions: Array<{
    _id: string;
    type: TransactionType;
    amount: number;
    currency: { name: string };
    accountType: "loanAccount" | "investmentAccount" | "checkingAccount";
    status: TransactionStatus;
    recipient?: string;
    paymentMethod?: string;
    notes?: string;
    chequeDetails?: { description: string };
    cryptoDetails?: { network: string };
    createdAt: string;
  }>;
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Transaction",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const description = row.original.description;
      const isIncoming = row.original.amount > 0;

      const getTransactionIcon = (type: string) => {
        switch (type) {
          case 'DEPOSIT':
            return <Wallet className="h-4 w-4" />;
          case 'WITHDRAWAL':
            return <CreditCard className="h-4 w-4" />;
          case 'TRANSFER':
            return <ArrowRight className="h-4 w-4" />;
          case 'PAYMENT':
            return <Banknote className="h-4 w-4" />;
          case 'CRYPTO_DEPOSIT':
            return <Bitcoin className="h-4 w-4" />;
          case 'CHEQUE_DEPOSIT':
            return <Receipt className="h-4 w-4" />;
          case 'LOAN_PAYMENT':
            return <Building2 className="h-4 w-4" />;
          default:
            return isIncoming ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            );
        }
      };

      return (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            type === 'DEPOSIT' || type === 'CRYPTO_DEPOSIT' || type === 'CHEQUE_DEPOSIT' ? "bg-emerald-500/10" :
            type === 'WITHDRAWAL' ? "bg-rose-500/10" :
            type === 'TRANSFER' ? "bg-violet-500/10" :
            type === 'PAYMENT' ? "bg-amber-500/10" :
            type === 'LOAN_PAYMENT' ? "bg-indigo-500/10" :
            isIncoming ? "bg-emerald-500/10" : "bg-rose-500/10"
          }`}>
            {getTransactionIcon(type)}
          </div>
          <div>
            <p className="font-medium text-[0.8rem]">{description}</p>
            <p className="text-[0.7rem] text-muted-foreground">
              {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
            </p>
          </div>
        </div>
      );
    },
    // filterFn: (row: Row<Transaction>, id: string, value: string) => {
    //   const description = row.original.description.toLowerCase();
    //   const type = row.getValue(id).toString().toLowerCase();
    //   return description.includes(value.toLowerCase()) || type.includes(value.toLowerCase());
    // },
  },
  {
    accessorKey: "date",
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
      const date = new Date(row.getValue("date"));
      return (
        <div>
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).replace(",", " -")}
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
      const amount = parseFloat(row.getValue("amount"));
      const type = row.original.type;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Math.abs(amount));

      const getAmountColor = (type: string, amount: number) => {
        if (type === 'TRANSFER') return "text-rose-500";
        if (amount > 0) return "text-emerald-500";
        return "text-rose-500";
      };

      const getAmountSign = (type: string, amount: number) => {
        if (type === 'TRANSFER') return "-";
        if (amount > 0) return "+";
        return "-";
      };

      return (
        <div className={`font-medium text-[0.8rem] ${getAmountColor(type, amount)}`}>
          {getAmountSign(type, amount)}{formatted}
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
        [TransactionStatus.COMPLETED]: "bg-emerald-500/10 text-emerald-500",
        [TransactionStatus.IN_PROGRESS]: "bg-amber-500/10 text-amber-500",
        [TransactionStatus.CANCELLED]: "bg-rose-500/10 text-rose-500",
        [TransactionStatus.PROCESSING]: "bg-sky-500/10 text-sky-500",
      };

      return (
        <div
          className={`px-3 w-fit py-1 rounded-md text-xs whitespace-nowrap ${statusColors[status as keyof typeof statusColors]}`}
        >
          {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
        </div>
      );
    },
  },
];

export function ActivityTable() {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(10);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchTransactions = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse>("/transactions");
      const { transactions: apiTransactions } = response.data;

      const mappedTransactions: Transaction[] = apiTransactions.map((tx) => ({
        id: tx._id,
        type: tx.type,
        description:
          tx.notes ||
          tx.chequeDetails?.description ||
          tx.recipient ||
          `${tx.type.replace("_", " ").toLowerCase()} - ${tx.currency.name}`,
        date: tx.createdAt,
        amount: tx.amount,
        status: tx.status,
        recipient: tx.recipient,
      }));

      setTransactions(mappedTransactions);
    } catch (err) {
      setError("Failed to fetch transactions. Please try again.");
      toast.error("Error loading transactions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const table = useReactTable({
    data: transactions,
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

  const renderSkeleton = () => (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="px-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6">
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="px-6">
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="px-6">
            <Skeleton className="h-6 w-16 rounded-md" />
          </TableCell>
          <TableCell className="px-6">
            <Skeleton className="h-6 w-6 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const renderMobileCard = (transaction: Transaction) => {
    const statusColors = {
      [TransactionStatus.COMPLETED]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      [TransactionStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      [TransactionStatus.CANCELLED]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      [TransactionStatus.PROCESSING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };

    const iconBackgrounds = {
      [TransactionType.TRANSFER]: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      [TransactionType.DEPOSIT]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      [TransactionType.WITHDRAWAL]: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      [TransactionType.PAYMENT]: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      [TransactionType.CRYPTO_DEPOSIT]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      [TransactionType.CHEQUE_DEPOSIT]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      [TransactionType.LOAN_PAYMENT]: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };

    const transactionIcons = {
      [TransactionType.TRANSFER]: <ArrowRight className="h-3.5 w-3.5" />,
      [TransactionType.DEPOSIT]: <ArrowDownToLine className="h-3.5 w-3.5" />,
      [TransactionType.WITHDRAWAL]: <ArrowUpFromLine className="h-3.5 w-3.5" />,
      [TransactionType.PAYMENT]: <Wallet className="h-3.5 w-3.5" />,
      [TransactionType.CRYPTO_DEPOSIT]: <Bitcoin className="h-3.5 w-3.5" />,
      [TransactionType.CHEQUE_DEPOSIT]: <Receipt className="h-3.5 w-3.5" />,
      [TransactionType.LOAN_PAYMENT]: <Building2 className="h-3.5 w-3.5" />,
    };

    const isIncoming = transaction.amount > 0;
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
            <div className={`p-1.5 rounded-lg ${iconBackgrounds[transaction.type]}`}>
              {transactionIcons[transaction.type]}
            </div>
            <div>
              <p className="text-sm font-medium leading-tight">{transaction.description}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {transaction.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`px-2 py-0.5 text-[10px] font-medium ${statusColors[transaction.status]}`}
          >
            {transaction.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
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
          <div className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
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
        <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl p-3 space-y-2.5 border border-zinc-200 dark:border-zinc-800">
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
    <div className="w-full p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-4">
        <h3 className="text-lg font-semibold px-3">Latest Transactions</h3>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => {
              table.resetColumnFilters();
              table.setPageSize(100);
            }}
            className="w-full md:w-auto"
          >
            View All
          </Button>
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
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
      {isMobile ? (
        <div className="space-y-2">
          {isLoading ? (
            renderMobileSkeleton()
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => renderMobileCard(row.original))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No Transactions Found.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md">
          <Table>
            <TableHeader className="bg-zinc-900 py-4">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={`text-zinc-100 px-6 ${index === 0 ? "rounded-tl-lg rounded-bl-lg" : ""
                        } ${index === headerGroup.headers.length - 1 ? "rounded-tr-lg rounded-br-lg" : ""
                        }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="py-4">
              {isLoading ? (
                renderSkeleton()
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No Transactions Found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {pageIndex * pageSize + 1} To{" "}
          {Math.min((pageIndex + 1) * pageSize, transactions.length)} Of {transactions.length}{" "}
          Transactions
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPageIndex((prev) => prev - 1);
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPageIndex((prev) => prev + 1);
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}