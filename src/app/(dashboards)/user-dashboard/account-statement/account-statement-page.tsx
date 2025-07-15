"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/utils/utils"
import {
  Download,
  Mail,
  CalendarIcon,
  FileText,
  FileIcon as FilePdf,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { api } from "@/api/axios"
import { SubmitHandler, useForm } from "react-hook-form"
import { StatementRequestFormData, StatementRequestSchema } from "@/utils/schemas/schemas"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { IStatement } from "@/lib/models/statement.model"
import { StatementResponseDto } from "@/lib/dto/statement.dto"
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const accounts = [
  { id: "checkingAccount", name: "Primary Checking" },
  { id: "loanAccount", name: "Loan Account" },
  { id: "investmentAccount", name: "Investment Account" },
];

export default function AccountStatementPage() {
  const [selectedAccount, setSelectedAccount] = useState("all-accounts");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statements, setStatements] = useState<IStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingStatementId, setDownloadingStatementId] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StatementRequestFormData>({
    resolver: zodResolver(StatementRequestSchema),
    defaultValues: {
      accountType: "checkingAccount",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const fetchStatements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<{ message: string; statements: IStatement[] }>("/statements");
      console.log(response);
      setStatements(response.data.statements);
    } catch (err) {
      console.log("This is the error", err)
      setError("Failed to fetch statements. Please try again.");
      toast.error("Error loading statements.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatements();
  }, [fetchStatements]);

  const handleStatementRequest: SubmitHandler<StatementRequestFormData> = async (data) => {
    console.log("This is the data", data);
    setIsSubmitting(true);
    try {
      const response = await api.post("/statements", {
        ...data,
      });
      console.log("This is the response", response);
      toast.success(response.data.message || "Statement requested successfully!");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      fetchStatements();
    } catch (error: any) {
      console.log("This is the error", error)
      toast.error(error?.response?.data?.message || "Failed to request statement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async (statementData: StatementResponseDto) => {
    const pdfDoc = await PDFDocument.create();
    var page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let yPosition = height - 50;

    // Header
    page.drawText('Account Statement', {
      x: 50,
      y: yPosition,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // Account and User Information
    page.drawText(`Account: ${accounts.find(a => a.id === statementData.accountType)?.name || statementData.accountType}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
    page.drawText(`Name: ${statementData.user.firstName} ${statementData.user.lastName}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
    page.drawText(`Period: ${format(new Date(statementData.startDate), "PPP")} to ${format(new Date(statementData.endDate), "PPP")}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // Balances
    page.drawText(`Starting Balance: ${statementData.balanceSummary.currency} ${statementData.balanceSummary.startingBalance.toFixed(2)}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
    page.drawText(`Ending Balance: ${statementData.balanceSummary.currency} ${statementData.balanceSummary.endingBalance.toFixed(2)}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // Transactions Header
    page.drawText('Transactions', {
      x: 50,
      y: yPosition,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Transactions Table Header
    page.drawText('Date', { x: 50, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText('Description', { x: 150, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText('Amount', { x: 350, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText('Status', { x: 450, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
    yPosition -= 20;

    // Transactions
    for (const tx of statementData.transactions) {
      if (yPosition < 50) {
        page.drawText('Continued on next page...', { x: 50, y: yPosition, size: fontSize, font, color: rgb(0.5, 0.5, 0.5) });
        page = pdfDoc.addPage([595, 842]);
        yPosition = height - 50;
      }

      page.drawText(format(new Date(tx.createdAt), 'MM/dd/yyyy'), { x: 50, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
      // page.drawText(tx.description?.substring(0, 30) || 'N/A', { x: 150, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
      page.drawText(`${statementData.balanceSummary.currency} ${tx.amount.toFixed(2)}`, { x: 350, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
      page.drawText(tx.status, { x: 450, y: yPosition, size: fontSize, font, color: rgb(0, 0, 0) });
      yPosition -= 20;
    }

    return await pdfDoc.save();
  };

  const handleDownload = async (statement: IStatement) => {
    setDownloadingStatementId(statement._id);
    try {
      const response = await api.get(`/statements/${statement._id}`);
      console.log("This is the response", response);

      const pdfBytes = await generatePDF(response.data.statement);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statement-${format(new Date(statement.startDate), 'yyyy-MM')}-${statement.accountType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Statement downloaded successfully!");
    } catch (error) {
      console.error("Error downloading statement:", error);
      toast.error("Failed to download statement. Please try again.");
    } finally {
      setDownloadingStatementId(null);
    }
  };

  const filteredStatements = selectedAccount && selectedAccount !== "all-accounts"
    ? statements.filter((stmt) => stmt.accountType === selectedAccount)
    : statements;

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Account Statements</h1>
      <p className="text-muted-foreground mb-8">View, download, or request statements for your accounts</p>

      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="request">Request Statement</TabsTrigger>
          <TabsTrigger value="history">Statement History</TabsTrigger>
        </TabsList>

        <TabsContent value="request">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Request Statement</CardTitle>
                <CardDescription>
                  Generate a statement for a specific date range and download it directly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleStatementRequest)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2" htmlFor="accountType">Select Account</Label>
                      <Select

                        value={watch("accountType")}
                        onValueChange={(value) => setValue("accountType", value as any)}
                      >
                        <SelectTrigger id="accountType">
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <div className="flex justify-between w-full">
                                <span>{account.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.accountType && (
                        <p className="text-red-500 text-xs">{errors.accountType.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="startDate"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(new Date(startDate), "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate ? new Date(startDate) : undefined}
                              onSelect={(date) => setValue("startDate", date?.toISOString().split("T")[0] || "")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.startDate && (
                          <p className="text-red-500 text-xs">{errors.startDate.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="endDate"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(new Date(endDate), "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate ? new Date(endDate) : undefined}
                              onSelect={(date) => setValue("endDate", date?.toISOString().split("T")[0] || "")}
                              initialFocus
                              disabled={(date) => (startDate ? date < new Date(startDate) : false)}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.endDate && (
                          <p className="text-red-500 text-xs">{errors.endDate.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={!watch("accountType") || !startDate || !endDate || isSubmitting}
                      >
                        {isSubmitting ? (
                          "Generating..."
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download Statement
                          </>
                        )}
                      </Button>
                    </div>

                    {isSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center text-green-800">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                        Statement has been generated for download go to your history and download it
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statement Information</CardTitle>
                <CardDescription>Details about our statement services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Available Periods</h3>
                  <p className="text-sm text-muted-foreground">
                    Statements are available for the past 7 years. Older statements may require special request.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Processing Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Most statements are generated instantly. Custom date ranges may take up to 24 hours.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">File Formats</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="flex items-center">
                      <FilePdf className="h-3 w-3 mr-1 text-red-500" />
                      PDF
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for assistance with statements or to request special formats.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm mt-1">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Statement History</CardTitle>
              <CardDescription>View and download your previously generated statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="filter-account" className="mb-2">Filter by Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger id="filter-account">
                      <SelectValue placeholder="All accounts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-accounts">All accounts</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                    <div className="col-span-3">Account</div>
                    <div className="col-span-4">Date Range</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <Separator />
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-3">
                          <div className="h-4 bg-muted rounded w-3/4" />
                        </div>
                        <div className="col-span-3">
                          <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                        <div className="col-span-4">
                          <div className="h-4 bg-muted rounded w-3/4" />
                        </div>
                        <div className="col-span-2">
                          <div className="h-8 bg-muted rounded w-20 ml-auto" />
                        </div>
                      </div>
                    ))
                  ) : filteredStatements.length > 0 ? (
                    filteredStatements.map((statement) => {
                      const account = accounts.find((a) => a.id === statement.accountType);
                      return (
                        <div key={statement._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30">
                          <div className="col-span-3">
                            {format(new Date(statement.startDate), "MMM yyyy")}
                          </div>
                          <div className="col-span-4 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(statement.startDate), "PPP")} to{" "}
                              {format(new Date(statement.endDate), "PPP")}
                            </div>
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(statement)}
                              disabled={downloadingStatementId === statement._id}
                            >
                              {downloadingStatementId === statement._id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No statements found for the selected account.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedAccount("all-accounts")}>
                Clear Filters
              </Button>
              {/* <Button variant="outline" size="sm" disabled={isLoading}>
                Export All Statements
              </Button> */}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
