"use client"

import { useState } from "react"
import { CreditCard, Plus, Trash2, Edit, DollarSign, Percent } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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

interface LoanProduct {
  id: number;
  name: string;
  type: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  rateType: string;
  minTerm: number;
  maxTerm: number;
  processingFee: number;
  status: 'active' | 'inactive';
  eligibility: string[];
  collateralRequired: boolean;
}

interface LoanProductsTabProps {
  onSettingsChange: () => void;
}

interface FormData {
  name: string;
  type: string;
  description: string;
  minAmount: string;
  maxAmount: string;
  interestRate: string;
  rateType: string;
  minTerm: string;
  maxTerm: string;
  processingFee: string;
  status: 'active' | 'inactive';
  eligibility: string;
  collateralRequired: boolean;
}

export function LoanProductsTab({ onSettingsChange }: LoanProductsTabProps) {
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([
    {
      id: 1,
      name: "Personal Loan",
      type: "personal",
      description: "Unsecured personal loans for various needs",
      minAmount: 1000,
      maxAmount: 50000,
      interestRate: 8.5,
      rateType: "fixed",
      minTerm: 12,
      maxTerm: 60,
      processingFee: 2.0,
      status: "active",
      eligibility: ["Minimum income $30,000", "Credit score 650+", "Employment history 2+ years"],
      collateralRequired: false,
    },
    {
      id: 2,
      name: "Home Mortgage",
      type: "mortgage",
      description: "Fixed and variable rate mortgages for home purchases",
      minAmount: 50000,
      maxAmount: 1000000,
      interestRate: 4.5,
      rateType: "variable",
      minTerm: 120,
      maxTerm: 360,
      processingFee: 1.5,
      status: "active",
      eligibility: ["Down payment 20%", "Credit score 700+", "Debt-to-income ratio <43%"],
      collateralRequired: true,
    },
    {
      id: 3,
      name: "Auto Loan",
      type: "auto",
      description: "Competitive rates for new and used vehicle financing",
      minAmount: 5000,
      maxAmount: 100000,
      interestRate: 6.2,
      rateType: "fixed",
      minTerm: 24,
      maxTerm: 84,
      processingFee: 1.0,
      status: "active",
      eligibility: ["Valid driver's license", "Credit score 600+", "Proof of income"],
      collateralRequired: true,
    },
    {
      id: 4,
      name: "Business Loan",
      type: "business",
      description: "Funding solutions for small and medium businesses",
      minAmount: 10000,
      maxAmount: 500000,
      interestRate: 9.8,
      rateType: "variable",
      minTerm: 12,
      maxTerm: 120,
      processingFee: 3.0,
      status: "active",
      eligibility: ["Business registration", "2+ years in operation", "Financial statements"],
      collateralRequired: true,
    },
    {
      id: 5,
      name: "Student Loan",
      type: "education",
      description: "Educational financing for students and parents",
      minAmount: 1000,
      maxAmount: 75000,
      interestRate: 5.8,
      rateType: "fixed",
      minTerm: 60,
      maxTerm: 240,
      processingFee: 0.5,
      status: "inactive",
      eligibility: ["Enrolled in accredited institution", "Satisfactory academic progress"],
      collateralRequired: false,
    },
  ])

  const [editingLoan, setEditingLoan] = useState<LoanProduct | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    description: "",
    minAmount: "",
    maxAmount: "",
    interestRate: "",
    rateType: "fixed",
    minTerm: "",
    maxTerm: "",
    processingFee: "",
    status: "active",
    eligibility: "",
    collateralRequired: false,
  })

  const loanTypes = [
    { value: "personal", label: "Personal Loan" },
    { value: "mortgage", label: "Home Mortgage" },
    { value: "auto", label: "Auto Loan" },
    { value: "business", label: "Business Loan" },
    { value: "education", label: "Student Loan" },
    { value: "home_equity", label: "Home Equity Loan" },
    { value: "construction", label: "Construction Loan" },
    { value: "refinance", label: "Refinance Loan" },
  ]

  const rateTypes = [
    { value: "fixed", label: "Fixed Rate" },
    { value: "variable", label: "Variable Rate" },
    { value: "adjustable", label: "Adjustable Rate" },
  ]

  const handleEdit = (loan: LoanProduct) => {
    setEditingLoan(loan)
    setFormData({
      name: loan.name,
      type: loan.type,
      description: loan.description,
      minAmount: loan.minAmount.toString(),
      maxAmount: loan.maxAmount.toString(),
      interestRate: loan.interestRate.toString(),
      rateType: loan.rateType,
      minTerm: loan.minTerm.toString(),
      maxTerm: loan.maxTerm.toString(),
      processingFee: loan.processingFee.toString(),
      status: loan.status,
      eligibility: loan.eligibility.join(", "),
      collateralRequired: loan.collateralRequired,
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingLoan(null)
    setFormData({
      name: "",
      type: "",
      description: "",
      minAmount: "",
      maxAmount: "",
      interestRate: "",
      rateType: "fixed",
      minTerm: "",
      maxTerm: "",
      processingFee: "",
      status: "active",
      eligibility: "",
      collateralRequired: false,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const loanData = {
      ...formData,
      minAmount: Number.parseFloat(formData.minAmount),
      maxAmount: Number.parseFloat(formData.maxAmount),
      interestRate: Number.parseFloat(formData.interestRate),
      minTerm: Number.parseInt(formData.minTerm),
      maxTerm: Number.parseInt(formData.maxTerm),
      processingFee: Number.parseFloat(formData.processingFee),
      eligibility: formData.eligibility
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
    }

    if (editingLoan) {
      setLoanProducts((prev) => prev.map((loan) => (loan.id === editingLoan.id ? { ...loan, ...loanData } : loan)))
      toast({
        title: "Loan product updated",
        description: `${loanData.name} has been updated successfully.`,
      })
    } else {
      const newLoan = {
        id: Math.max(...loanProducts.map((l) => l.id)) + 1,
        ...loanData,
      }
      setLoanProducts((prev) => [...prev, newLoan])
      toast({
        title: "Loan product created",
        description: `${loanData.name} has been created successfully.`,
      })
    }

    setIsDialogOpen(false)
    onSettingsChange()
  }

  const handleDelete = (id: number) => {
    setLoanProducts((prev) => prev.filter((loan) => loan.id !== id))
    onSettingsChange()
    toast({
      title: "Loan product deleted",
      description: "The loan product has been removed successfully.",
    })
  }

  const toggleStatus = (id: number) => {
    setLoanProducts((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: loan.status === "active" ? "inactive" : "active" } : loan,
      ),
    )
    onSettingsChange()
  }

  const getLoanTypeLabel = (type: string) => {
    return loanTypes.find((t) => t.value === type)?.label || type
  }

  const formatTermRange = (minTerm: number, maxTerm: number) => {
    const minYears = Math.floor(minTerm / 12)
    const maxYears = Math.floor(maxTerm / 12)

    if (minYears === 0 && maxYears === 0) {
      return `${minTerm}-${maxTerm} months`
    } else if (minYears === 0) {
      return `${minTerm} months - ${maxYears} years`
    } else if (maxYears === minYears) {
      return `${minYears} years`
    } else {
      return `${minYears}-${maxYears} years`
    }
  }

  const getLoanTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "personal":
        return "secondary"
      case "business":
        return "secondary"
      case "mortgage":
        return "destructive"
      case "auto":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusBadgeVariant = (status: LoanProduct['status']) => {
    return status === "active" ? "secondary" : "destructive"
  }

  const getRateTypeBadgeVariant = (rateType: string) => {
    switch (rateType) {
      case "fixed":
        return "secondary"
      case "variable":
        return "destructive"
      default:
        return "default"
    }
  }

  const getCollateralBadgeVariant = (required: boolean) => {
    return required ? "destructive" : "secondary"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Loan Products Management
            </span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Loan Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingLoan ? "Edit Loan Product" : "Add New Loan Product"}</DialogTitle>
                  <DialogDescription>
                    {editingLoan ? "Update the loan product details" : "Create a new loan product for customers"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loan-name">Loan Product Name</Label>
                      <Input
                        id="loan-name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Personal Loan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loan-type">Loan Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger id="loan-type">
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loanTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loan-description">Description</Label>
                    <Textarea
                      id="loan-description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the loan product..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-amount">Minimum Amount ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="min-amount"
                          type="number"
                          className="pl-8"
                          value={formData.minAmount}
                          onChange={(e) => setFormData((prev) => ({ ...prev, minAmount: e.target.value }))}
                          placeholder="1000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-amount">Maximum Amount ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="max-amount"
                          type="number"
                          className="pl-8"
                          value={formData.maxAmount}
                          onChange={(e) => setFormData((prev) => ({ ...prev, maxAmount: e.target.value }))}
                          placeholder="50000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="interest-rate"
                          type="number"
                          step="0.1"
                          className="pl-8"
                          value={formData.interestRate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
                          placeholder="8.5"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate-type">Rate Type</Label>
                      <Select
                        value={formData.rateType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, rateType: value }))}
                      >
                        <SelectTrigger id="rate-type">
                          <SelectValue placeholder="Select rate type" />
                        </SelectTrigger>
                        <SelectContent>
                          {rateTypes.map((rate) => (
                            <SelectItem key={rate.value} value={rate.value}>
                              {rate.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="processing-fee">Processing Fee (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="processing-fee"
                          type="number"
                          step="0.1"
                          className="pl-8"
                          value={formData.processingFee}
                          onChange={(e) => setFormData((prev) => ({ ...prev, processingFee: e.target.value }))}
                          placeholder="2.0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-term">Minimum Term (months)</Label>
                      <Input
                        id="min-term"
                        type="number"
                        value={formData.minTerm}
                        onChange={(e) => setFormData((prev) => ({ ...prev, minTerm: e.target.value }))}
                        placeholder="12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-term">Maximum Term (months)</Label>
                      <Input
                        id="max-term"
                        type="number"
                        value={formData.maxTerm}
                        onChange={(e) => setFormData((prev) => ({ ...prev, maxTerm: e.target.value }))}
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eligibility">Eligibility Criteria (comma-separated)</Label>
                    <Textarea
                      id="eligibility"
                      value={formData.eligibility}
                      onChange={(e) => setFormData((prev) => ({ ...prev, eligibility: e.target.value }))}
                      placeholder="Minimum income $30,000, Credit score 650+, Employment history 2+ years"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="collateral-required">Collateral Required</Label>
                      <div className="text-sm text-muted-foreground">Does this loan require collateral?</div>
                    </div>
                    <Switch
                      id="collateral-required"
                      checked={formData.collateralRequired}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, collateralRequired: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="loan-status">Product Status</Label>
                      <div className="text-sm text-muted-foreground">Enable this loan product for customers</div>
                    </div>
                    <Switch
                      id="loan-status"
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>{editingLoan ? "Update Product" : "Create Product"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Create and manage loan products offered to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount Range</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Term Range</TableHead>
                <TableHead>Collateral</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loanProducts.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{loan.name}</div>
                      <div className="text-sm text-muted-foreground">{loan.description.slice(0, 50)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getLoanTypeBadgeVariant(loan.type)}>
                      {getLoanTypeLabel(loan.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>${loan.minAmount.toLocaleString()}</div>
                      <div className="text-muted-foreground">to ${loan.maxAmount.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{loan.interestRate}%</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      <Badge variant={getRateTypeBadgeVariant(loan.rateType)}>
                        {loan.rateType.charAt(0).toUpperCase() + loan.rateType.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatTermRange(loan.minTerm, loan.maxTerm)}</TableCell>
                  <TableCell>
                    <Badge variant={getCollateralBadgeVariant(loan.collateralRequired)}>
                      {loan.collateralRequired ? "Required" : "Not Required"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(loan.status)}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleStatus(loan.id)}>
                        {loan.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(loan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(loan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
