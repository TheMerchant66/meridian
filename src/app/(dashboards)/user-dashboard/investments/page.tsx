"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { BankCard } from "@/components/bank-card";
import { InvActivityTable } from "./investment-activity";
import { HiArrowCircleUp } from "react-icons/hi";
import { IoMdListBox } from "react-icons/io";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  ArrowRightIcon, 
  Badge, 
  LineChart, 
  TrendingUp,
  ChevronDown,
  Info,
  Calendar,
  Filter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const generateHeatmapData = () => {
  const today = new Date()
  const data: { [key: string]: number } = {}
  
  // Generate 90 days of data
  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Generate random activity level (0-4)
    // Higher values for recent dates to show more activity
    const baseValue = Math.random() * 2
    const recencyBonus = Math.max(0, 1 - (i / 90))
    const value = Math.min(4, Math.round(baseValue + recencyBonus * 2))
    
    data[dateStr] = value
  }
  
  return data
}

const ActivityHeatmap = () => {
  const data = generateHeatmapData()
  const today = new Date()
  const days = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  // Get unique months for labels
  const months = Array.from(new Set(days.map(date => 
    date.toLocaleString('default', { month: 'short' })
  )))

  const getColor = (value: number) => {
    const colors = [
      'bg-zinc-100',
      'bg-blue-100',
      'bg-blue-200',
      'bg-blue-300',
      'bg-blue-400'
    ]
    return colors[value] || colors[0]
  }

  // Group days by month for layout
  const daysByMonth = days.reduce((acc, date) => {
    const month = date.toLocaleString('default', { month: 'short' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(date)
    return acc
  }, {} as { [key: string]: Date[] })

  return (
    <div className="w-full">
      <div className="flex gap-2">
        {/* Month labels */}
        <div className="flex flex-col justify-end pb-2">
          {months.map(month => (
            <div key={month} className="h-8 text-xs text-zinc-500 flex items-center">
              {month}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex-1">
          <div className="grid grid-cols-13 gap-1">
            {days.map((date, i) => {
              const dateStr = date.toISOString().split('T')[0]
              const value = data[dateStr] || 0
              
              return (
                <div
                  key={dateStr}
                  className={cn(
                    "aspect-square rounded-sm",
                    getColor(value),
                    "hover:ring-2 hover:ring-blue-500/50 transition-all"
                  )}
                  title={`${date.toLocaleDateString()}: Activity level ${value}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((value) => (
              <div
                key={value}
                className={cn("w-3 h-3 rounded-sm", getColor(value))}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Last 90 days</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-zinc-400" />
            <span className="text-xs">Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-17">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 py-4 px-10 pt-0">
          <div className="mt-2 text-2xl flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">Investment Overview</h1>
              <p className="text-muted-foreground text-sm">Track your portfolio performance</p>
            </div>
            <div className="flex gap-2 items-center">
              <Button>Top up</Button>
              <Button>
                <ArrowRightIcon /> Withdraw
              </Button>
            </div>
          </div>
          <div className="px-3 py-6 mt-4 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className=" mt-1">
                <span className="px-3 py-1.5 rounded-lg font-medium text-zinc-700 bg-zinc-100 text-sm">
                  Portfolio Balance
                </span>
                <h2 className="text-6xl mt-5 font-bold">
                  $680,700.00
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Available: <strong>$560,700.00</strong>
                </p>
                <div className="flex gap-2 items-center">
                  <Button className="mt-4">
                    <ArrowRightIcon /> Withdraw Funds
                  </Button>
                </div>
                <div className="grid gap-5 md:grid-cols-2 mt-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="border rounded-xl flex flex-col gap-2 p-4 relative bg-zinc-50/50">
                          <div className="absolute top-4 right-4">
                            <Info className="w-4 h-4 text-zinc-400" />
                          </div>
                          <p className="text-[13px] text-muted-foreground">Total Investment</p>
                          <p className="text-[34px] text-zinc-700 font-bold">$24,847.88</p>
                          <p className="text-[13px] mt-1">
                            <span className="text-green-600 font-semibold bg-green-100 rounded-xl px-2 py-0.5 mr-2">+50%</span> 
                            Last Update Today
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
                        <p className="text-zinc-700">Total amount invested across all your investment plans, including both active and completed investments.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="border rounded-xl flex flex-col gap-2 p-4 relative bg-zinc-50/50">
                          <div className="absolute top-4 right-4">
                            <Info className="w-4 h-4 text-zinc-400" />
                          </div>
                          <p className="text-[13px] text-muted-foreground">Total Withdrawals</p>
                          <p className="text-[34px]  text-zinc-700 font-bold">$24,847.88</p>
                          <p className="text-[13px] mt-1 ">
                            <span className="text-green-600 font-semibold bg-green-100 rounded-xl px-2 py-0.5 mr-2">+50%</span> 
                            Last Update Today
                          </p>
                        </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg ">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Activity Heatmap</h3>
                    <p className="text-sm text-zinc-500">Investment activity intensity</p>
                  </div>
                  <div className="flex items-center gap-4">
                   
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Calendar className="w-4 h-4" />
                          Time Range
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Select Range</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                        <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                        <DropdownMenuItem>Last 90 days</DropdownMenuItem>
                        <DropdownMenuItem>Last Year</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-500">+4.7%</span>
                    </div>
                  </div>
                </div>
                <ActivityHeatmap />
              </div>
            </div>
          </div>

          <div className="grid auto-rows-min gap-5 md:grid-cols-1">
            <div className="bg-muted/50 rounded-xl flex flex-col"></div>
          </div>
          
          <div>
            <InvActivityTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
