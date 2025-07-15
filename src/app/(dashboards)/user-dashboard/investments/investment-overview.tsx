"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, BarChart3, DollarSign, LineChart, PieChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for investments
const portfolioData = {
  totalValue: 248750.65,
  totalReturn: 48750.65,
  returnPercentage: 24.38,
  dailyChange: 1250.32,
  dailyChangePercentage: 0.51,
  assetAllocation: [
    { name: "Stocks", value: 145250.32, percentage: 58.4, color: "bg-blue-500" },
    { name: "Bonds", value: 62500.75, percentage: 25.1, color: "bg-emerald-500" },
    { name: "Cash", value: 18750.25, percentage: 7.5, color: "bg-amber-500" },
    { name: "Alternative", value: 22249.33, percentage: 9.0, color: "bg-purple-500" },
  ],
  performanceHistory: [
    { month: "Jan", value: 210000 },
    { month: "Feb", value: 215000 },
    { month: "Mar", value: 225000 },
    { month: "Apr", value: 218000 },
    { month: "May", value: 228000 },
    { month: "Jun", value: 235000 },
    { month: "Jul", value: 240000 },
    { month: "Aug", value: 248750 },
  ],
  topHoldings: [
    { name: "AAPL", fullName: "Apple Inc.", value: 28500.25, change: 2.3, shares: 125 },
    { name: "MSFT", fullName: "Microsoft Corp.", value: 22750.5, change: 1.5, shares: 65 },
    { name: "AMZN", fullName: "Amazon.com Inc.", value: 18250.75, change: -0.8, shares: 110 },
    { name: "GOOGL", fullName: "Alphabet Inc.", value: 15500.4, change: 0.7, shares: 85 },
    { name: "TSLA", fullName: "Tesla Inc.", value: 12250.8, change: -1.2, shares: 45 },
  ],
}

export function InvestmentOverview() {
  const [timeframe, setTimeframe] = React.useState("1Y")

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investment Overview</h1>
          <p className="text-muted-foreground">Track your portfolio performance and asset allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="5Y">5 Years</SelectItem>
              <SelectItem value="ALL">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <DollarSign className="h-4 w-4 mr-2" />
            Invest
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Portfolio Value</CardTitle>
                <CardDescription>Total investments and returns</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono">
                <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                {portfolioData.returnPercentage}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <p className="text-3xl font-bold">
                  ${portfolioData.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center mt-1 text-sm">
                  <span
                    className={`flex items-center ${portfolioData.dailyChange >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {portfolioData.dailyChange >= 0 ? (
                      <ArrowUp className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5 mr-1" />
                    )}
                    ${Math.abs(portfolioData.dailyChange).toLocaleString("en-US", { minimumFractionDigits: 2 })}(
                    {Math.abs(portfolioData.dailyChangePercentage).toFixed(2)}%)
                  </span>
                  <span className="text-muted-foreground ml-2">Today</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p
                  className={`text-lg font-semibold ${portfolioData.totalReturn >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  ${portfolioData.totalReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="h-[180px] mt-6 relative">
              <div className="absolute inset-0 flex items-end space-x-2">
                {portfolioData.performanceHistory.map((month, index) => {
                  const maxValue = Math.max(...portfolioData.performanceHistory.map((m) => m.value))
                  const height = (month.value / maxValue) * 100

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary/10 rounded-t-sm hover:bg-primary/20 transition-colors relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute inset-x-0 -top-10 hidden group-hover:block">
                          <div className="bg-background border shadow-sm rounded px-2 py-1 text-xs text-center mx-auto w-max">
                            ${month.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs mt-2 text-muted-foreground">{month.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" size="sm" className="ml-auto">
              <LineChart className="h-4 w-4 mr-2" />
              Detailed Analysis
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Current distribution of assets</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-center my-4">
              <div className="relative w-[160px] h-[160px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {
                    portfolioData.assetAllocation.reduce(
                      (acc, asset, i) => {
                        const previousOffset = i === 0 ? 0 : acc.offset
                        const offset = previousOffset + asset.percentage

                        acc.elements.push(
                          <circle
                            key={asset.name}
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={`var(--${asset.color.split("-")[1]})`}
                            strokeWidth="20"
                            strokeDasharray={`${asset.percentage} 100`}
                            strokeDashoffset={`${100 - previousOffset}`}
                            fill="none"
                            className="transition-all duration-500 ease-in-out"
                          />,
                        )

                        acc.offset = offset
                        return acc
                      },
                      { elements: [] as React.ReactNode[], offset: 0 },
                    ).elements
                  }
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <PieChart className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="font-bold">
                    ${portfolioData.totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {portfolioData.assetAllocation.map((asset) => (
                <div key={asset.name} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${asset.color} mr-2`}></div>
                    <span className="text-sm">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{asset.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Rebalance Portfolio
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Top Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
          <CardDescription>Your best performing investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium py-3 px-4">Symbol</th>
                  <th className="text-left font-medium py-3 px-4">Name</th>
                  <th className="text-right font-medium py-3 px-4">Shares</th>
                  <th className="text-right font-medium py-3 px-4">Value</th>
                  <th className="text-right font-medium py-3 px-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.topHoldings.map((holding) => (
                  <tr key={holding.name} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{holding.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{holding.fullName}</td>
                    <td className="py-3 px-4 text-right">{holding.shares}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${holding.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-4 text-right ${holding.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      <div className="flex items-center justify-end">
                        {holding.change >= 0 ? (
                          <ArrowUp className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 mr-1" />
                        )}
                        {Math.abs(holding.change).toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View All Holdings
          </Button>
          <Button variant="outline" size="sm">
            Trade
          </Button>
        </CardFooter>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Latest market trends and news</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="trends">Market Trends</TabsTrigger>
              <TabsTrigger value="news">Latest News</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">S&P 500</span>
                    <Badge variant="outline" className="text-green-500">
                      +1.2%
                    </Badge>
                  </div>
                  <div className="h-[60px] bg-gradient-to-r from-transparent to-green-500/10 rounded-md mb-2"></div>
                  <p className="text-sm text-muted-foreground">4,782.82 pts</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Nasdaq</span>
                    <Badge variant="outline" className="text-green-500">
                      +0.9%
                    </Badge>
                  </div>
                  <div className="h-[60px] bg-gradient-to-r from-transparent to-green-500/10 rounded-md mb-2"></div>
                  <p className="text-sm text-muted-foreground">16,741.05 pts</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Dow Jones</span>
                    <Badge variant="outline" className="text-red-500">
                      -0.3%
                    </Badge>
                  </div>
                  <div className="h-[60px] bg-gradient-to-r from-transparent to-red-500/10 rounded-md mb-2"></div>
                  <p className="text-sm text-muted-foreground">38,150.30 pts</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="news">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-1">Fed Signals Potential Rate Cut in September</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Federal Reserve officials indicated they could begin cutting interest rates as early as September if
                    inflation continues to cool.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Financial Times • 2h ago</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      Read More
                    </Button>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-medium mb-1">Tech Stocks Rally on Strong Earnings Reports</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Major tech companies exceeded earnings expectations, driving a sector-wide rally in technology
                    stocks.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Bloomberg • 5h ago</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      Read More
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Oil Prices Stabilize After Recent Volatility</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Crude oil prices have stabilized following weeks of volatility, as supply concerns ease and demand
                    outlook improves.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Reuters • 8h ago</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="watchlist">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">NVDA</p>
                    <p className="text-sm text-muted-foreground">NVIDIA Corporation</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$845.92</p>
                    <p className="text-sm text-green-500">+2.5%</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">META</p>
                    <p className="text-sm text-muted-foreground">Meta Platforms Inc.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$478.22</p>
                    <p className="text-sm text-green-500">+1.8%</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">JPM</p>
                    <p className="text-sm text-muted-foreground">JPMorgan Chase & Co.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$198.56</p>
                    <p className="text-sm text-red-500">-0.7%</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-2">
                  Edit Watchlist
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
