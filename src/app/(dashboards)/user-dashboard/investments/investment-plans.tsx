"use client"

import * as React from "react"
import { BarChart3, Calendar, CheckCircle, Clock, DollarSign, LineChart, PiggyBank, Plus, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for investment plans
const investmentPlans = [
  {
    id: "plan-001",
    name: "Retirement Fund",
    type: "401(k)",
    targetAmount: 1500000,
    currentAmount: 325750.45,
    progress: 21.7,
    monthlyContribution: 1500,
    returnRate: 7.2,
    targetDate: "2052-06-15",
    riskLevel: "Moderate",
    status: "on-track",
    allocation: [
      { name: "US Stocks", percentage: 55 },
      { name: "International Stocks", percentage: 25 },
      { name: "Bonds", percentage: 15 },
      { name: "Cash", percentage: 5 },
    ],
    recentContributions: [
      { date: "2024-03-15", amount: 1500, type: "Contribution" },
      { date: "2024-02-15", amount: 1500, type: "Contribution" },
      { date: "2024-01-15", amount: 1500, type: "Contribution" },
      { date: "2023-12-15", amount: 1500, type: "Contribution" },
    ],
  },
  {
    id: "plan-002",
    name: "Home Down Payment",
    type: "Savings Goal",
    targetAmount: 100000,
    currentAmount: 65250.75,
    progress: 65.3,
    monthlyContribution: 1200,
    returnRate: 3.5,
    targetDate: "2026-09-30",
    riskLevel: "Conservative",
    status: "on-track",
    allocation: [
      { name: "Bonds", percentage: 60 },
      { name: "Cash", percentage: 30 },
      { name: "US Stocks", percentage: 10 },
    ],
    recentContributions: [
      { date: "2024-03-10", amount: 1200, type: "Contribution" },
      { date: "2024-02-10", amount: 1200, type: "Contribution" },
      { date: "2024-01-10", amount: 1200, type: "Contribution" },
      { date: "2023-12-10", amount: 1200, type: "Contribution" },
    ],
  },
  {
    id: "plan-003",
    name: "Education Fund",
    type: "529 Plan",
    targetAmount: 250000,
    currentAmount: 42500.3,
    progress: 17.0,
    monthlyContribution: 500,
    returnRate: 6.0,
    targetDate: "2036-08-15",
    riskLevel: "Moderate",
    status: "needs-attention",
    allocation: [
      { name: "US Stocks", percentage: 50 },
      { name: "International Stocks", percentage: 20 },
      { name: "Bonds", percentage: 25 },
      { name: "Cash", percentage: 5 },
    ],
    recentContributions: [
      { date: "2024-03-05", amount: 500, type: "Contribution" },
      { date: "2024-02-05", amount: 500, type: "Contribution" },
      { date: "2024-01-05", amount: 500, type: "Contribution" },
      { date: "2023-12-05", amount: 500, type: "Contribution" },
    ],
  },
]

export function InvestmentPlans() {
  const [selectedPlan, setSelectedPlan] = React.useState(investmentPlans[0])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investment Plans</h1>
          <p className="text-muted-foreground">Track your investment goals and progress</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {investmentPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${selectedPlan.id === plan.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
            onClick={() => setSelectedPlan(plan)}
          >
            <div className={`h-2 ${plan.status === "on-track" ? "bg-green-500" : "bg-amber-500"}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.type}</CardDescription>
                </div>
                <Badge variant={plan.status === "on-track" ? "outline" : "secondary"} className="capitalize">
                  {plan.status === "on-track" ? "On Track" : "Needs Attention"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${plan.currentAmount.toLocaleString()}</span>
                    <span>${plan.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly</p>
                    <p className="font-medium">${plan.monthlyContribution}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Return</p>
                    <p className="font-medium">{plan.returnRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Risk</p>
                    <p className="font-medium">{plan.riskLevel}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 py-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Target: {new Date(plan.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Selected Plan Details */}
      {selectedPlan && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{selectedPlan.name} Details</h2>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <LineChart className="h-4 w-4" />
                Forecast
              </Button>
              <Button className="gap-2">
                <DollarSign className="h-4 w-4" />
                Contribute
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plan Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Target Amount</p>
                        <p className="text-xl font-bold">${selectedPlan.targetAmount.toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Amount</p>
                        <p className="text-lg font-semibold">
                          ${selectedPlan.currentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Monthly Contribution</p>
                        <p className="text-lg font-semibold">${selectedPlan.monthlyContribution}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Target Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(selectedPlan.targetDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Expected Return Rate</p>
                        <p className="text-lg font-semibold">{selectedPlan.returnRate}% annually</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                        <p className="text-lg font-semibold">{selectedPlan.riskLevel}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Progress</p>
                        <p className="text-lg font-semibold">{selectedPlan.progress}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className="text-lg font-semibold">
                          $
                          {(selectedPlan.targetAmount - selectedPlan.currentAmount).toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="relative pt-2">
                      <div className="overflow-hidden h-3 rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-in-out ${selectedPlan.status === "on-track" ? "bg-green-500" : "bg-amber-500"}`}
                          style={{ width: `${selectedPlan.progress}%` }}
                        />
                      </div>
                      <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground pt-1">
                        <span>Start</span>
                        <span>Target</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <Target className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Projected Completion</p>
                          <p className="font-medium">
                            {new Date(selectedPlan.targetDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <PiggyBank className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Savings</p>
                          <p className="font-medium">${selectedPlan.monthlyContribution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPlan.status === "on-track" ? (
                      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 flex gap-3">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 h-fit">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800 dark:text-green-400">On Track to Meet Your Goal</h3>
                          <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                            You're making great progress toward your {selectedPlan.name.toLowerCase()} goal. Keep up the
                            consistent contributions!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex gap-3">
                        <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 h-fit">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-800 dark:text-amber-400">Needs Attention</h3>
                          <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                            You're slightly behind on your {selectedPlan.name.toLowerCase()} goal. Consider increasing
                            your monthly contribution by $200 to stay on track.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Increase Contribution</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Increasing your monthly contribution by $100 could help you reach your goal 1 year earlier.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Adjust Contribution
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Optimize Allocation</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Adjusting your asset allocation could potentially increase your returns by 0.5% annually.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Review Allocation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="allocation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="aspect-square max-w-[250px] mx-auto relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full rounded-full border-[16px] border-muted"></div>
                        </div>

                        {selectedPlan.allocation.map((asset, index) => {
                          const previousAllocations = selectedPlan.allocation
                            .slice(0, index)
                            .reduce((sum, a) => sum + a.percentage, 0)

                          const rotation = previousAllocations * 3.6 // 3.6 degrees per percentage point
                          const skew = asset.percentage > 15 ? 0 : 0 // Adjust skew for small segments

                          return (
                            <div
                              key={asset.name}
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ transform: `rotate(${rotation}deg)` }}
                            >
                              <div
                                className="origin-bottom-right absolute bottom-1/2 right-1/2 bg-primary h-1/2 w-1/2 rounded-tl-[999px]"
                                style={{
                                  background: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                                  transform: `rotate(${asset.percentage * 3.6}deg) skew(${skew}deg)`,
                                  zIndex: 10 - index,
                                }}
                              ></div>
                            </div>
                          )
                        })}

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-[60%] h-[60%] rounded-full bg-background flex flex-col items-center justify-center">
                            <span className="text-xs text-muted-foreground">Total</span>
                            <span className="font-bold">100%</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 space-y-3">
                        {selectedPlan.allocation.map((asset, index) => (
                          <div key={asset.name} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ background: `hsl(${(index * 60) % 360}, 70%, 60%)` }}
                              ></div>
                              <span className="text-sm">{asset.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{asset.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Risk Profile: {selectedPlan.riskLevel}</h3>
                        <p className="text-sm text-muted-foreground">
                          This allocation is designed for a {selectedPlan.riskLevel.toLowerCase()} risk tolerance with a
                          time horizon ending in {new Date(selectedPlan.targetDate).getFullYear()}.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-medium">Allocation Details</h3>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Stocks</span>
                            <span>
                              {selectedPlan.allocation
                                .filter((a) => a.name.includes("Stocks"))
                                .reduce((sum, a) => sum + a.percentage, 0)}
                              %
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Higher growth potential with higher volatility. Suitable for longer time horizons.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Bonds</span>
                            <span>
                              {selectedPlan.allocation
                                .filter((a) => a.name.includes("Bonds"))
                                .reduce((sum, a) => sum + a.percentage, 0)}
                              %
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Moderate growth with lower volatility. Provides income and stability.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Cash</span>
                            <span>
                              {selectedPlan.allocation
                                .filter((a) => a.name.includes("Cash"))
                                .reduce((sum, a) => sum + a.percentage, 0)}
                              %
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Lowest risk with lowest return potential. Provides liquidity and safety.
                          </p>
                        </div>
                      </div>

                      <Button className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Adjust Allocation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contributions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPlan.recentContributions.map((contribution, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{contribution.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(contribution.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            +${contribution.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <h3 className="font-medium mb-4">Contribution Settings</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Monthly Contribution</span>
                            <span className="font-medium">${selectedPlan.monthlyContribution}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Automatically contributed on the 15th of each month.
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Change Amount
                          </Button>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Auto-Increase</span>
                            <Badge variant="outline">Enabled</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Contribution increases by 3% annually in January.
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Adjust Settings
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button className="gap-2">
                          <DollarSign className="h-4 w-4" />
                          Make One-Time Contribution
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
