"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Filter, Plus, Search } from "lucide-react"
import { DashboardLayout } from "../dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomersTable } from "./customers-table"
import { CustomerDetailsDialog } from "./customer-details-dialog"
import { EditBalanceDialog } from "./edit-balance-dialog"
import { ToggleTransactionStatusDialog } from "./toggle-transaction-status-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddTransactionDialog } from "./add-transaction-dialog"
import { api } from "@/api/axios"
import { toast } from "@/components/ui/use-toast"
import { AccountStatus } from "@/lib/enums/accountStatus.enum"
import { IUserWithId } from "@/lib/models/user.model"
import Link from "next/link"

export function CustomersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<IUserWithId | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false)
  const [isToggleTransactionOpen, setIsToggleTransactionOpen] = useState(false)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [customers, setCustomers] = useState<IUserWithId[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    name: true,
    email: true,
    status: true,
    balance: true,
    accounts: true,
    transactions: true,
    joined: true,
    actions: true,
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/admin/users')
      setCustomers(response.data.users)
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch customers" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (customer: IUserWithId) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
  }

  const handleDetailsClose = () => {
    setIsDetailsOpen(false)
    requestAnimationFrame(() => {
      setSelectedCustomer(null)
    })
  }

  const handleEditBalance = (customer: IUserWithId) => {
    setSelectedCustomer(customer)
    setIsEditBalanceOpen(true)
  }

  const handleEditBalanceClose = () => {
    setIsEditBalanceOpen(false)
    setSelectedCustomer(null)
  }

  const handleToggleTransactionStatus = (customer: IUserWithId) => {
    setSelectedCustomer(customer)
    setIsToggleTransactionOpen(true)
  }

  const handleAddTransaction = (customer: IUserWithId) => {
    setSelectedCustomer(customer)
    setIsAddTransactionOpen(true)
  }

  const handleAddTransactionClose = () => {
    setIsAddTransactionOpen(false)
    setTimeout(() => {
      setSelectedCustomer(null)
    }, 500)
  }

  const handleEditUser = (customer: IUserWithId) => {
    setSelectedCustomer(customer)
    setIsEditUserOpen(true)
  }

  const handleEditUserClose = () => {
    setIsEditUserOpen(false)
    setTimeout(() => {
      setSelectedCustomer(null)
    }, 500)
  }

  const handleUserUpdated = (updatedUser: IUserWithId) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer._id === updatedUser._id ? updatedUser : customer
      )
    )
    setSelectedCustomer(updatedUser)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center">
            <h1 className="text-lg font-semibold md:text-xl">Customer Management</h1>
          </div>
          <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[320px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/admin-dashboard/register" target="_blank" rel="noopener noreferrer">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Customer</span>
              </Link>
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
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value={AccountStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={AccountStatus.SUSPENDED}>Suspended</SelectItem>
                    <SelectItem value={AccountStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={AccountStatus.CLOSED}>Closed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">More Filters</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto h-8 gap-1">
                    <span className="hidden sm:inline">Columns</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.id}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, id: checked })}
                  >
                    ID
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.name}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, name: checked })}
                  >
                    Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.email}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, email: checked })}
                  >
                    Email
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.status}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, status: checked })}
                  >
                    Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.balance}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, balance: checked })}
                  >
                    Balance
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.accounts}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, accounts: checked })}
                  >
                    Accounts
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.transactions}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, transactions: checked })}
                  >
                    Transactions
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.joined}
                    onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, joined: checked })}
                  >
                    Joined Date
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="border rounded-lg">
            <CustomersTable
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              columnVisibility={columnVisibility}
              onViewDetails={handleViewDetails}
              onEditBalance={handleEditBalance}
              onToggleTransactionStatus={handleToggleTransactionStatus}
              onAddTransaction={handleAddTransaction}
              onEditUser={handleEditUser}
              customers={customers}
            />
          </div>
        </main>
      </div>

      {selectedCustomer && (
        <CustomerDetailsDialog
          key={selectedCustomer._id}
          customer={selectedCustomer}
          open={isDetailsOpen}
          onOpenChange={handleDetailsClose}
        />
      )}
      {selectedCustomer && isEditBalanceOpen && (
        <EditBalanceDialog
          key={selectedCustomer._id}
          customer={selectedCustomer}
          open={isEditBalanceOpen}
          onOpenChange={handleEditBalanceClose}
        />
      )}
      {selectedCustomer && (
        <ToggleTransactionStatusDialog
          customer={selectedCustomer}
          open={isToggleTransactionOpen}
          onOpenChange={setIsToggleTransactionOpen}
        />
      )}
      {selectedCustomer && (
        <AddTransactionDialog
          key={`${selectedCustomer._id}-${isAddTransactionOpen}`}
          customer={selectedCustomer}
          retailerId={selectedCustomer._id}
          open={isAddTransactionOpen}
          onOpenChange={handleAddTransactionClose}
        />
      )}
      {selectedCustomer && (
        <EditUserDialog
          key={`${selectedCustomer._id}-${isEditUserOpen}`}
          customer={selectedCustomer}
          open={isEditUserOpen}
          onOpenChange={handleEditUserClose}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </DashboardLayout>
  )
}