"use client"

import { useState } from "react"
import { TrendingUp, Plus, Trash2, Edit, DollarSign } from "lucide-react"
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

interface InvestmentPlan {
  id: number;
  name: string;
  category: string;
  description: string;
  minInvestment: number;
  maxInvestment: number;
  expectedReturn: number;
  term: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  status: 'active' | 'inactive';
  features: string[];
  fees: number;
}

interface InvestmentPlansTabProps {
  onSettingsChange: () => void;
}

interface FormData {
  name: string;
  category: string;
  description: string;
  minInvestment: string;
  maxInvestment: string;
  expectedReturn: string;
  term: string;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  status: 'active' | 'inactive';
  features: string;
  fees: string;
}

export function InvestmentPlansTab({ onSettingsChange }: InvestmentPlansTabProps) {
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([
    {
      id: 1,
      name: "Conservative Growth Portfolio",
      category: "mutual_funds",
      description: "Low-risk investment plan focused on steady growth with minimal volatility",
      minInvestment: 1000,
      maxInvestment: 100000,
      expectedReturn: 6.5,
      term: 12,
      riskLevel: "low",
      status: "active",
      features: ["Professional Management", "Diversified Portfolio", "Quarterly Reports"],
      fees: 1.2,
    },
    {
      id: 2,
      name: "Aggressive Growth Stocks",
      category: "stocks",
      description: "High-growth potential stock portfolio for experienced investors",
      minInvestment: 5000,
      maxInvestment: 500000,
      expectedReturn: 12.8,
      term: 24,
      riskLevel: "high",
      status: "active",
      features: ["High Growth Potential", "Active Trading", "Market Analysis"],
      fees: 2.5,
    },
    {
      id: 3,
      name: "Government Bond Fund",
      category: "bonds",
      description: "Secure investment in government-backed securities",
      minInvestment: 500,
      maxInvestment: 50000,
      expectedReturn: 4.2,
      term: 36,
      riskLevel: "low",
      status: "active",
      features: ["Government Backed", "Fixed Returns", "Capital Protection"],
      fees: 0.8,
    },
    {
      id: 4,
      name: "Cryptocurrency Portfolio",
      category: "crypto",
      description: "Diversified cryptocurrency investment for digital asset exposure",
      minInvestment: 100,
      maxInvestment: 25000,
      expectedReturn: 18.5,
      term: 6,
      riskLevel: "high",
      status: "inactive",
      features: ["Digital Assets", "24/7 Trading", "High Volatility"],
      fees: 3.0,
    },
  ])

  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    description: "",
    minInvestment: "",
    maxInvestment: "",
    expectedReturn: "",
    term: "",
    riskLevel: "low",
    status: "active",
    features: "",
    fees: "",
  })

  const categories = [
    { value: "stocks", label: "Stocks" },
    { value: "bonds", label: "Bonds" },
    { value: "mutual_funds", label: "Mutual Funds" },
    { value: "etf", label: "ETFs" },
    { value: "crypto", label: "Cryptocurrency" },
    { value: "real_estate", label: "Real Estate" },
    { value: "commodities", label: "Commodities" },
    { value: "mixed", label: "Mixed Portfolio" },
  ]

  const riskLevels = [
    { value: "low", label: "Low Risk" },
    { value: "medium", label: "Medium Risk" },
    { value: "high", label: "High Risk" },
    { value: "very_high", label: "Very High Risk" },
  ]

  const handleEdit = (plan: InvestmentPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      category: plan.category,
      description: plan.description,
      minInvestment: plan.minInvestment.toString(),
      maxInvestment: plan.maxInvestment.toString(),
      expectedReturn: plan.expectedReturn.toString(),
      term: plan.term.toString(),
      riskLevel: plan.riskLevel,
      status: plan.status,
      features: plan.features.join(", "),
      fees: plan.fees.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingPlan(null)
    setFormData({
      name: "",
      category: "",
      description: "",
      minInvestment: "",
      maxInvestment: "",
      expectedReturn: "",
      term: "",
      riskLevel: "low",
      status: "active",
      features: "",
      fees: "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const planData = {
      ...formData,
      minInvestment: Number.parseFloat(formData.minInvestment),
      maxInvestment: Number.parseFloat(formData.maxInvestment),
      expectedReturn: Number.parseFloat(formData.expectedReturn),
      term: Number.parseInt(formData.term),
      fees: Number.parseFloat(formData.fees),
      features: formData.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    } as InvestmentPlan

    if (editingPlan) {
      setInvestmentPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id ? { ...planData, id: plan.id } : plan
        )
      )
    } else {
      setInvestmentPlans((prev) => [
        ...prev,
        { ...planData, id: Math.max(...prev.map((p) => p.id)) + 1 },
      ])
    }

    setIsDialogOpen(false)
    toast({
      title: editingPlan ? "Investment Plan Updated" : "New Investment Plan Added",
      description: `The investment plan has been successfully ${
        editingPlan ? "updated" : "added"
      }.`,
    })
    onSettingsChange()
  }

  const handleDelete = (id: number) => {
    setInvestmentPlans((prev) => prev.filter((plan) => plan.id !== id))
    onSettingsChange()
    toast({
      title: "Investment plan deleted",
      description: "The investment plan has been removed successfully.",
    })
  }

  const toggleStatus = (id: number) => {
    setInvestmentPlans((prev) =>
      prev.map((plan) =>
        plan.id === id ? { ...plan, status: plan.status === "active" ? "inactive" : "active" } : plan,
      ),
    )
    onSettingsChange()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getRiskBadgeVariant = (risk: InvestmentPlan['riskLevel']) => {
    switch (risk) {
      case "low":
        return "secondary"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "very_high":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusBadgeVariant = (status: InvestmentPlan['status']) => {
    return status === "active" ? "secondary" : "destructive"
  }

  const getCategoryLabel = (category: string) => {
    const found = categories.find((c) => c.value === category)
    return found ? found.label : category
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Investment Plans Management
            </span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPlan ? "Edit Investment Plan" : "Add New Investment Plan"}</DialogTitle>
                  <DialogDescription>
                    {editingPlan ? "Update the investment plan details" : "Create a new investment plan for customers"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={formData.name}
                        onChange={handleInputChange}
                        name="name"
                        placeholder="e.g., Conservative Growth Portfolio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan-category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="plan-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plan-description">Description</Label>
                    <Textarea
                      id="plan-description"
                      value={formData.description}
                      onChange={handleInputChange}
                      name="description"
                      placeholder="Describe the investment plan..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-investment">Minimum Investment ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="min-investment"
                          type="number"
                          className="pl-8"
                          value={formData.minInvestment}
                          onChange={handleInputChange}
                          name="minInvestment"
                          placeholder="1000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-investment">Maximum Investment ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="max-investment"
                          type="number"
                          className="pl-8"
                          value={formData.maxInvestment}
                          onChange={handleInputChange}
                          name="maxInvestment"
                          placeholder="100000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expected-return">Expected Return (%)</Label>
                      <Input
                        id="expected-return"
                        type="number"
                        step="0.1"
                        value={formData.expectedReturn}
                        onChange={handleInputChange}
                        name="expectedReturn"
                        placeholder="6.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="term">Term (months)</Label>
                      <Input
                        id="term"
                        type="number"
                        value={formData.term}
                        onChange={handleInputChange}
                        name="term"
                        placeholder="12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fees">Management Fees (%)</Label>
                      <Input
                        id="fees"
                        type="number"
                        step="0.1"
                        value={formData.fees}
                        onChange={handleInputChange}
                        name="fees"
                        placeholder="1.2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk-level">Risk Level</Label>
                    <Select
                      value={formData.riskLevel}
                      onValueChange={(value) => handleSelectChange("riskLevel", value)}
                    >
                      <SelectTrigger id="risk-level">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        {riskLevels.map((risk) => (
                          <SelectItem key={risk.value} value={risk.value}>
                            {risk.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      name="features"
                      placeholder="Professional Management, Diversified Portfolio, Quarterly Reports"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="plan-status">Plan Status</Label>
                      <div className="text-sm text-muted-foreground">Enable this investment plan for customers</div>
                    </div>
                    <Switch
                      id="plan-status"
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) =>
                        handleSelectChange("status", checked ? "active" : "inactive")
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>{editingPlan ? "Update Plan" : "Create Plan"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Create and manage investment plans offered to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Investment Range</TableHead>
                <TableHead>Expected Return</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.description.slice(0, 50)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(plan.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>${plan.minInvestment.toLocaleString()}</div>
                      <div className="text-muted-foreground">to ${plan.maxInvestment.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">{plan.expectedReturn}%</div>
                    <div className="text-sm text-muted-foreground">annually</div>
                  </TableCell>
                  <TableCell>{plan.term} months</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(plan.riskLevel)}>
                      {plan.riskLevel.charAt(0).toUpperCase() + plan.riskLevel.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(plan.status)}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleStatus(plan.id)}>
                        {plan.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)}>
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
