"use client"

import * as React from "react"
import { ArrowUpDown, ChevronDown, MoreHorizontal, ArrowRight, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils/utils"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

type InvestmentActivity = {
  id: string
  type: "purchase" | "sale" | "dividend" | "return"
  description: string
  date: string
  amount: number
  status: "completed" | "pending" | "failed"
  asset?: string
  units?: number
  price?: number
}

const data: InvestmentActivity[] = [
  {
    id: "INV001",
    type: "purchase",
    description: "Stock Purchase - AAPL",
    date: "2024-03-15",
    amount: -2500,
    status: "completed",
    asset: "AAPL",
    units: 10,
    price: 250
  },
  {
    id: "INV002",
    type: "dividend",
    description: "Dividend Payment - MSFT",
    date: "2024-03-14",
    amount: 450,
    status: "completed",
    asset: "MSFT"
  },
  {
    id: "INV003",
    type: "sale",
    description: "Stock Sale - GOOGL",
    date: "2024-03-13",
    amount: 3200,
    status: "completed",
    asset: "GOOGL",
    units: 2,
    price: 1600
  },
  {
    id: "INV004",
    type: "return",
    description: "Investment Return - VTI",
    date: "2024-03-12",
    amount: 850,
    status: "completed",
    asset: "VTI"
  },
  {
    id: "INV005",
    type: "purchase",
    description: "ETF Purchase - VOO",
    date: "2024-03-11",
    amount: -3000,
    status: "completed",
    asset: "VOO",
    units: 5,
    price: 600
  }
]

const ActivityCard = ({ activity }: { activity: InvestmentActivity }) => {
  const isIncoming = activity.amount > 0
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(activity.amount))

  const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const statusColors = {
    completed: "bg-green-500/10 text-green-500",
    pending: "bg-orange-500/10 text-orange-500",
    failed: "bg-red-500/10 text-red-500"
  }

  const typeIcons = {
    purchase: <TrendingDown className="h-5 w-5" />,
    sale: <TrendingUp className="h-5 w-5" />,
    dividend: <DollarSign className="h-5 w-5" />,
    return: <TrendingUp className="h-5 w-5" />
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
      <div className="relative bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-2 rounded-lg",
              isIncoming ? "bg-green-500/10" : "bg-blue-500/10"
            )}>
              {typeIcons[activity.type]}
            </div>
            <div>
              <h3 className="font-medium text-zinc-100">{activity.description}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-zinc-400">{activity.asset}</span>
                {activity.units && (
                  <span className="text-sm text-zinc-400">• {activity.units} units</span>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(activity.id)}
              >
                Copy activity ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Download statement</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-zinc-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className={cn(
              "px-2 py-1 rounded-md text-xs",
              statusColors[activity.status]
            )}>
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
            </div>
          </div>
          <div className={cn(
            "font-medium text-lg",
            isIncoming ? "text-green-500" : "text-red-500"
          )}>
            {isIncoming ? '+' : '-'}{formattedAmount}
          </div>
        </div>
      </div>
    </div>
  )
}

type TimeRange = '1M' | '3M' | '6M' | '1Y'

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('6M')

  const generateChartData = (range: TimeRange): ChartData<'line'> => {
    const now = new Date()
    const months = {
      '1M': 1,
      '3M': 3,
      '6M': 6,
      '1Y': 12
    }
    
    const labels = Array.from({ length: months[range] }, (_, i) => {
      const date = new Date(now)
      date.setMonth(date.getMonth() - (months[range] - 1 - i))
      return date.toLocaleString('default', { month: 'short' })
    })

    // Simulate portfolio value data
    const baseValue = 10000
    const data = labels.map((_, i) => {
      const randomFactor = 1 + (Math.random() * 0.1 - 0.05)
      return Math.round(baseValue * (1 + (i * 0.05)) * randomFactor)
    })

    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#71717a',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#71717a',
          callback: function(value) {
            return '$' + value.toLocaleString()
          }
        },
      },
    },
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Performance</h3>
          <p className="text-sm text-zinc-400">Last {timeRange}</p>
        </div>
        <div className="flex items-center gap-2">
          {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-[300px]">
        <Line data={generateChartData(timeRange)} options={options} />
      </div>
    </div>
  )
}

export function ActivityTable() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5

  const filteredData = data.filter(activity => 
    activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.asset?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-lg font-semibold">Investment Activity</h3>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px]"
          />
          <Button className="gap-2">
            View All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {paginatedData.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
        
        <div className="lg:sticky lg:top-6">
          <PerformanceChart />
        </div>
      </div>
    </div>
  )
}
