"use client"

import { useState, useEffect } from "react"
import { Building, Plus, Trash2, Copy, Pencil } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ICurrencyWithId } from "@/lib/models/currency.model"
import { CreateCurrencyDto, UpdateCurrencyDto } from "@/lib/dto/currency.dto"
import { api } from "@/api/axios"

// Define a clean type for state management to avoid Mongoose-specific properties
interface CurrencyFormData {
  _id?: string
  name: string
  walletAddress: string
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface BankAccount {
  id: number
  bankName: string
  accountName: string
  accountNumber: string
  routingNumber: string
  accountType: string
  status: 'active' | 'inactive'
  currency: string
}

interface PaymentMethodsTabProps {
  onSettingsChange: () => void
}

export function PaymentMethodsTab({ onSettingsChange }: PaymentMethodsTabProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currencies, setCurrencies] = useState<ICurrencyWithId[]>([])
  const [newCurrency, setNewCurrency] = useState<CreateCurrencyDto>({
    name: "",
    walletAddress: "",
    active: true,
  })
  const [editCurrency, setEditCurrency] = useState<CurrencyFormData | null>(null)
  const [isAddCurrencyOpen, setIsAddCurrencyOpen] = useState(false)
  const [isEditCurrencyOpen, setIsEditCurrencyOpen] = useState(false)
  const router = useRouter()

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 1,
      bankName: "JPMorgan Chase",
      accountName: "SecureBank Operating Account",
      accountNumber: "****1234",
      routingNumber: "021000021",
      accountType: "checking",
      status: "active",
      currency: "USD",
    },
    {
      id: 2,
      bankName: "Bank of America",
      accountName: "SecureBank Reserve Account",
      accountNumber: "****5678",
      routingNumber: "026009593",
      accountType: "savings",
      status: "active",
      currency: "USD",
    },
    {
      id: 3,
      bankName: "Wells Fargo",
      accountName: "SecureBank International",
      accountNumber: "****9012",
      routingNumber: "121000248",
      accountType: "checking",
      status: "inactive",
      currency: "USD",
    },
  ])

  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    id: 0,
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    status: "active",
    currency: "USD",
  })

  const [isAddBankOpen, setIsAddBankOpen] = useState(false)

  const accountTypes = [
    { value: "checking", label: "Checking" },
    { value: "savings", label: "Savings" },
    { value: "business", label: "Business" },
    { value: "money_market", label: "Money Market" },
  ]

  // Validate DTO before submission
  const validateCurrency = (data: CreateCurrencyDto | UpdateCurrencyDto, isUpdate: boolean = false) => {
    const schema = isUpdate ? UpdateCurrencyDto.validationSchema : CreateCurrencyDto.validationSchema
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) {
      toast({
        title: "Validation Error",
        description: error.details.map(d => d.message).join(", "),
        variant: "destructive"
      })
      return false
    }
    return true
  }

  // Fetch currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/currencies')
        setCurrencies(response.data.currencies || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch currencies",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  const handleAddCurrency = async () => {
    if (!validateCurrency(newCurrency)) return

    try {
      const response = await api.post('/currencies', new CreateCurrencyDto(newCurrency))
      setCurrencies(prev => [...prev, response.data.currency])
      setNewCurrency({
        name: "",
        walletAddress: "",
        active: true,
      })
      setIsAddCurrencyOpen(false)
      onSettingsChange()
      toast({
        title: "Currency added successfully",
        description: `${newCurrency.name} has been added to your payment methods.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add currency",
        variant: "destructive"
      })
    }
  }

  const handleEditCurrency = async () => {
    if (!editCurrency || !validateCurrency({
      name: editCurrency.name,
      walletAddress: editCurrency.walletAddress,
      active: editCurrency.active
    }, true)) return

    try {
      const response = await api.put(`/currencies/${editCurrency._id}`,
        new UpdateCurrencyDto({
          name: editCurrency.name,
          walletAddress: editCurrency.walletAddress,
          active: editCurrency.active
        })
      )
      setCurrencies(prev =>
        prev.map(currency =>
          currency._id === editCurrency._id ? response.data.currency : currency
        )
      )
      setIsEditCurrencyOpen(false)
      setEditCurrency(null)
      onSettingsChange()
      toast({
        title: "Currency updated successfully",
        description: `${editCurrency.name} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update currency",
        variant: "destructive"
      })
    }
  }

  const handleDeleteCurrency = async (id: string) => {
    try {
      await api.delete(`/currencies/${id}`)
      setCurrencies(prev => prev.filter(currency => currency._id !== id))
      onSettingsChange()
      toast({
        title: "Currency deleted successfully",
        description: "The currency has been removed from your payment methods.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete currency",
        variant: "destructive"
      })
    }
  }

  const handleToggleCurrencyStatus = async (id: string) => {
    const currency = currencies.find(c => c._id === id)
    if (!currency) return

    try {
      const response = await api.put(`/currencies/${id}`,
        new UpdateCurrencyDto({ active: !currency.active })
      )
      setCurrencies(prev =>
        prev.map(c => c._id === id ? response.data.currency : c)
      )
      onSettingsChange()
      toast({
        title: "Status updated",
        description: `Currency status changed to ${!currency.active ? 'active' : 'inactive'}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update currency status",
        variant: "destructive"
      })
    }
  }

  const handleAddBankAccount = () => {
    // const account: BankAccount = {
    //   id: Math.max(...bankAccounts.map(b => b.id), 0) + 1,
    //   ...newBankAccount,
    // }
    // setBankAccounts(prev => [...prev, account])
    setNewBankAccount({
      id: 0,
      bankName: "",
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "",
      status: "active",
      currency: "USD",
    })
    setIsAddBankOpen(false)
    onSettingsChange()
    toast({
      title: "Bank account added successfully",
      description: `${newBankAccount.bankName} account has been added to your payment methods.`,
    })
  }

  const handleDeleteBankAccount = (id: number) => {
    setBankAccounts(prev => prev.filter(account => account.id !== id))
    onSettingsChange()
    toast({
      title: "Bank account deleted successfully",
      description: "The bank account has been removed from your payment methods.",
    })
  }

  const handleToggleBankStatus = (id: number) => {
    setBankAccounts(prev =>
      prev.map(account =>
        account.id === id
          ? { ...account, status: account.status === "active" ? "inactive" : "active" }
          : account
      )
    )
    onSettingsChange()
    toast({
      title: "Status updated",
      description: `Bank account status changed to ${bankAccounts.find(a => a.id === id)?.status === "active" ? "inactive" : "active"}.`,
    })
  }

  const getStatusBadgeVariant = (status: boolean | 'active' | 'inactive') => {
    return status === true || status === "active" ? "secondary" : "destructive"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The wallet address has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Cryptocurrency Management
            </span>
            <Dialog open={isAddCurrencyOpen} onOpenChange={setIsAddCurrencyOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Currency
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Cryptocurrency</DialogTitle>
                  <DialogDescription>Add a new cryptocurrency configuration.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency-name">Currency Name</Label>
                    <Input
                      id="currency-name"
                      value={newCurrency.name}
                      onChange={(e) => setNewCurrency(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Bitcoin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <Input
                      id="wallet-address"
                      value={newCurrency.walletAddress}
                      onChange={(e) => setNewCurrency(prev => ({ ...prev, walletAddress: e.target.value }))}
                      placeholder="Enter wallet address"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCurrencyOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCurrency} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Currency"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Manage cryptocurrency configurations for payment processing</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading currencies...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency Name</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency._id}>
                    <TableCell className="font-medium">{currency.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {currency.walletAddress.slice(0, 10)}...{currency.walletAddress.slice(-6)}
                        </code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currency.walletAddress)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(currency.active)}>
                        {currency.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditCurrency({
                              _id: currency._id,
                              name: currency.name,
                              walletAddress: currency.walletAddress,
                              active: currency.active,
                              createdAt: currency.createdAt,
                              updatedAt: currency.updatedAt,
                            })
                            setIsEditCurrencyOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleCurrencyStatus(currency._id)}
                        >
                          {currency.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCurrency(currency._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditCurrencyOpen} onOpenChange={setIsEditCurrencyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Cryptocurrency</DialogTitle>
            <DialogDescription>Update the cryptocurrency configuration.</DialogDescription>
          </DialogHeader>
          {editCurrency && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-currency-name">Currency Name</Label>
                <Input
                  id="edit-currency-name"
                  value={editCurrency.name}
                  onChange={(e) => setEditCurrency(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="e.g., Bitcoin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-wallet-address">Wallet Address</Label>
                <Input
                  id="edit-wallet-address"
                  value={editCurrency.walletAddress}
                  onChange={(e) => setEditCurrency(prev => prev ? { ...prev, walletAddress: e.target.value } : null)}
                  placeholder="Enter wallet address"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditCurrencyOpen(false)
              setEditCurrency(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditCurrency} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Currency"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    
    </div>
  )
}