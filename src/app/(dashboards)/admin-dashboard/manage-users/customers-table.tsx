"use client"

import { CreditCard, MoreHorizontal, Shield, User, Plus, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { AccountStatus } from "@/lib/enums/accountStatus.enum"
import { api } from "@/api/axios"
import { toast } from "@/components/ui/use-toast"
import { IUserWithId } from "@/lib/models/user.model"

interface Props {
  searchQuery: string;
  statusFilter: string;
  columnVisibility: {
    id: boolean;
    name: boolean;
    email: boolean;
    status: boolean;
    balance: boolean;
    accounts: boolean;
    transactions: boolean;
    joined: boolean;
    actions: boolean;
  };
  onViewDetails: (customer: IUserWithId) => void;
  onEditBalance: (customer: IUserWithId) => void;
  onToggleTransactionStatus: (customer: IUserWithId) => void;
  onAddTransaction: (customer: IUserWithId) => void;
  onEditUser: (customer: IUserWithId) => void;
  customers: IUserWithId[];
}

export function CustomersTable({
  searchQuery,
  statusFilter,
  columnVisibility,
  onViewDetails,
  onEditBalance,
  onToggleTransactionStatus,
  onAddTransaction,
  onEditUser,
  customers,
}: Props) {
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer._id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.accountStatus.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

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

  const handleToggleSwitch = async (customer: IUserWithId, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await api.put(`/admin/users/${customer._id}`, {
        allowTransfer: !customer.allowTransfer,
      })
      toast({
        title: "Success",
        description: `Transactions ${!customer.allowTransfer ? "enabled" : "disabled"} successfully`,
      })
      onToggleTransactionStatus(response.data.user)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update transaction status",
      })
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columnVisibility.id && <TableHead>Customer ID</TableHead>}
          {columnVisibility.name && <TableHead>Name</TableHead>}
          {columnVisibility.email && <TableHead>Email</TableHead>}
          {columnVisibility.status && <TableHead>Status</TableHead>}
          {columnVisibility.balance && <TableHead>Balance</TableHead>}
          {columnVisibility.accounts && <TableHead>Accounts</TableHead>}
          {columnVisibility.transactions && <TableHead>Transactions</TableHead>}
          {columnVisibility.joined && <TableHead>Joined</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCustomers.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={Object.values(columnVisibility).filter(Boolean).length + 1}
              className="text-center py-8"
            >
              No customers found matching your criteria
            </TableCell>
          </TableRow>
        ) : (
          filteredCustomers.map((customer) => {
            const fullName = `${customer.firstName} ${customer.lastName}`
            const totalBalance =
              (customer.checkingAccount.balance || 0) +
              (customer.loanAccount.balance || 0) +
              (customer.investmentAccount.balance || 0)

            return (
              <TableRow key={customer._id}>
                {columnVisibility.id && <TableCell className="font-medium">{customer._id}</TableCell>}
                {columnVisibility.name && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{customer.firstName[0]}{customer.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{fullName}</div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.email && <TableCell>{customer.email}</TableCell>}
                {columnVisibility.status && (
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(customer.accountStatus)}>
                      {customer.accountStatus.toUpperCase()}
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.balance && (
                  <TableCell className="font-medium">
                    ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                )}
                {columnVisibility.accounts && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>3</span> {/* Assuming checking, loan, and investment accounts */}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.transactions && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={customer.allowTransfer}
                        className="mr-2"
                        onClick={(e) => handleToggleSwitch(customer, e)}
                      />
                      <span>N/A</span> {/* Transactions count not available in IUser */}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.joined && (
                  <TableCell>{format(new Date(customer.createdAt), "PPP")}</TableCell>
                )}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                        <User className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditUser(customer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit user
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEditBalance(customer)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Edit balance
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddTransaction(customer)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}