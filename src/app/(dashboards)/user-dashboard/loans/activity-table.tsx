"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, ArrowRight, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Transaction = {
  id: string
  type: "transfer" | "deposit" | "withdrawal" | "payment"
  description: string
  date: string
  amount: number
  status: "completed" | "pending" | "failed"
  recipient?: string
}

const data: Transaction[] = [
  {
    id: "TRX001",
    type: "transfer",
    description: "Transfer to Sarah",
    date: "2024-03-15",
    amount: -1200,
    status: "completed",
    recipient: "Sarah Johnson"
  },
  {
    id: "TRX002",
    type: "deposit",
    description: "Salary Deposit",
    date: "2024-03-14",
    amount: 4500,
    status: "completed"
  },
  {
    id: "TRX003",
    type: "payment",
    description: "Investment Payment",
    date: "2024-03-13",
    amount: -2000,
    status: "pending"
  },
  {
    id: "TRX004",
    type: "payment",
    description: "Utility Bill",
    date: "2024-03-12",
    amount: -150,
    status: "completed"
  },
  {
    id: "TRX005",
    type: "withdrawal",
    description: "ATM Withdrawal",
    date: "2024-03-11",
    amount: -300,
    status: "completed"
  }
]

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Transaction",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      const description = row.original.description
      const isIncoming = row.original.amount > 0

      return (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isIncoming ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
            {isIncoming ? (
              <ArrowLeft className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowRight className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <div>
            <p className="font-medium">{description}</p>
            <p className="text-sm text-muted-foreground capitalize">{type}</p>
          </div>
        </div>
      )
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
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div>{date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(',', ' -')}</div>
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
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Math.abs(amount))

      return (
        <div className={`font-medium ${amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {amount > 0 ? '+' : '-'}{formatted}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusColors = {
        completed: "bg-green-500/10 text-green-500",
        pending: "bg-orange-500/10 text-orange-500",
        failed: "bg-red-500/10 text-red-500"
      }

      return (
        <div className={`px-3 w-fit py-1 rounded-md text-xs whitespace-nowrap ${statusColors[status as keyof typeof statusColors]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original

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
      )
    },
  },
]

export function ActivityTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
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
  })

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-lg font-semibold px-3">Latest Transactions</h3>
        <div className="flex items-center gap-2">
          <Button  className="gap-2">
            View All
            
          </Button>
   
        </div>
      </div>
      <div className="rounded-md ">
        <Table className="">
          <TableHeader className="bg-zinc-900 py-4">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className={`text-zinc-100 px-6 ${
                        index === 0 ? 'rounded-tl-lg rounded-bl-lg' : ''} ${
                        index === headerGroup.headers.length - 1 ? 'rounded-tr-lg rounded-br-lg' : ''
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="py-4">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
