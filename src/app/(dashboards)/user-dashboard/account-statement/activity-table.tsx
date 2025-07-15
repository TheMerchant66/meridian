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

type Transaction = {
  id: string;
  type: "transfer" | "deposit" | "withdrawal" | "payment";
  description: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  recipient?: string;
  category: string;
  account: string;
  reference: string;
  notes?: string;
  location?: string;
  paymentMethod?: string;
};

const data: Transaction[] = [
  {
    id: "TRX001",
    type: "transfer",
    description: "Transfer to Sarah",
    date: "2024-03-15",
    amount: -1200,
    status: "completed",
    recipient: "Sarah Johnson",
    category: "Personal Transfer",
    account: "Checking Account",
    reference: "TRF-2024-001",
    notes: "Monthly rent payment",
    location: "Online Banking",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TRX002",
    type: "deposit",
    description: "Salary Deposit",
    date: "2024-03-14",
    amount: 4500,
    status: "completed",
    category: "Income",
    account: "Checking Account",
    reference: "DEP-2024-001",
    notes: "March salary",
    location: "Direct Deposit",
    paymentMethod: "ACH",
  },
  {
    id: "TRX003",
    type: "payment",
    description: "Investment Payment",
    date: "2024-03-13",
    amount: -2000,
    status: "pending",
    category: "Investment",
    account: "Investment Account",
    reference: "INV-2024-001",
    notes: "Quarterly investment contribution",
    location: "Investment Platform",
    paymentMethod: "Wire Transfer",
  },
  {
    id: "TRX004",
    type: "payment",
    description: "Utility Bill",
    date: "2024-03-12",
    amount: -150,
    status: "completed",
    category: "Utilities",
    account: "Checking Account",
    reference: "UTL-2024-001",
    notes: "Electricity bill payment",
    location: "Online Payment",
    paymentMethod: "Credit Card",
  },
  {
    id: "TRX005",
    type: "withdrawal",
    description: "ATM Withdrawal",
    date: "2024-03-11",
    amount: -300,
    status: "completed",
    category: "Cash",
    account: "Checking Account",
    reference: "ATM-2024-001",
    notes: "Cash withdrawal",
    location: "Main Street ATM",
    paymentMethod: "Debit Card",
  },
];

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Transaction",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const description = row.original.description;
      const isIncoming = row.original.amount > 0;

      const iconBackgrounds = {
        transfer:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        deposit:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        withdrawal:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        payment:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      };

      return (
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              iconBackgrounds[type as keyof typeof iconBackgrounds]
            }`}
          >
            {isIncoming ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="font-medium">{description}</p>
            <p className="text-sm text-muted-foreground capitalize">{type}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
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
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
        failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      };

      return (
        <div className="w-fit">
          <div
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              statusColors[status as keyof typeof statusColors]
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
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
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Download receipt</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

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
    transfer: <ArrowRight className="h-5 w-5 text-blue-500" />,
    deposit: <ArrowLeft className="h-5 w-5 text-green-500" />,
    withdrawal: <ArrowRight className="h-5 w-5 text-amber-500" />,
    payment: <ArrowRight className="h-5 w-5 text-purple-500" />,
  };

  const typeColors = {
    transfer:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    deposit:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    withdrawal:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    payment:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <div className="flex flex-col">
          {/* Header with colored background based on transaction type */}
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

          {/* Transaction details */}
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

              {transaction.recipient && (
                <div className="pt-4 border-t">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Recipient
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <User className="h-4 w-4 text-zinc-500" />
                      </div>
                      <p className="text-base font-medium">
                        {transaction.recipient}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </h4>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-medium">
                      {transaction.paymentMethod}
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
                      {transaction.location}
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

          {/* Footer with actions */}
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

export function ActivityTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<{
    from: string;
    to: string;
  }>({
    from: "",
    to: "",
  });

  const filteredData = React.useMemo(() => {
    return data.filter((transaction) => {
      const typeMatch = filterType === "all" || transaction.type === filterType;
      const statusMatch =
        filterStatus === "all" || transaction.status === filterStatus;
      const dateMatch =
        (!dateRange.from ||
          new Date(transaction.date) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(transaction.date) <= new Date(dateRange.to));
      return typeMatch && statusMatch && dateMatch;
    });
  }, [filterType, filterStatus, dateRange]);

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
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5">
          <div>
            <h3 className="text-xl font-semibold">Account Statement</h3>
            <p className="text-sm text-muted-foreground ">
              View your account activity and download statements
            </p>
          </div>

          <Button
            
            size="sm"
            onClick={() => {
              setFilterType("all");
              setFilterStatus("all");
              setDateRange({ from: "", to: "" });
            }}
            className="gap-2 self-end sm:self-auto"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="w-full p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
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
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
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

            <div className="flex flex-col space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="w-full "
                    placeholder="From"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground pointer-events-none">
                    {!dateRange.from && "From"}
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="w-full"
                    placeholder="To"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground pointer-events-none">
                    {!dateRange.to && "To"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md  overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900 py-4">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-0"
                >
                  {headerGroup.headers.map((header, index) => {
                    return (
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
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
            Showing {table.getRowModel().rows.length} of {data.length}{" "}
            transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
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
              onClick={() => table.nextPage()}
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
