"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ITransactionPopulated } from "@/lib/models/transaction.model";
import { format } from "date-fns";

interface TransactionDetailsDialogProps {
  transaction: ITransactionPopulated;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "processing":
      case "in progress":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Transaction Details</h2>
        </div>
        <div className="text-sm text-muted-foreground mb-6">
          Transaction ID: {transaction._id} • Created: {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Transaction Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-semibold">{transaction._id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font ong-semibold capitalize">
                      {transaction.type.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold text-lg">
                      {transaction.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account Type</span>
                    <span className="font-semibold capitalize">
                      {transaction.accountType.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold">
                      {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transaction.recipient && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recipient</span>
                      <span className="font-semibold">{transaction.recipient}</span>
                    </div>
                  )}
                  {transaction.paymentMethod && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="font-semibold capitalize">
                        {transaction.paymentMethod.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                  )}
                  {transaction.loanType && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Loan Type</span>
                      <span className="font-semibold capitalize">
                        {transaction.loanType.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                  )}
                  {transaction.currency && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Currency</span>
                      <span className="font-semibold">
                        {transaction.currency.name}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {(transaction.notes || transaction.notes === "") && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {transaction.notes || "No notes available"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="customer" className="space-y-6 pt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {transaction.user?.firstName?.charAt(0) || "U"}
                      {transaction.user?.lastName?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">
                      {transaction.user?.firstName || "Unknown"} {transaction.user?.lastName || "User"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.user?.email || "No email provided"}
                    </div>
                  </div>
                </div>
                {transaction.user?.phoneNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-semibold">{transaction.user.phoneNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 pt-6">
            {transaction.chequeDetails && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Cheque Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cheque Number</span>
                    <span className="font-semibold">{transaction.chequeDetails.chequeNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold">
                      {format(new Date(transaction.chequeDetails.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span className="font-semibold">{transaction.chequeDetails.description || "N/A"}</span>
                  </div>
                  {(transaction.chequeDetails.frontImage || transaction.chequeDetails.backImage) && (
                    <div className="space-y-2">
                      <span className="text-muted-foreground">Cheque Images</span>
                      <div className="grid grid-cols-2 gap-4">
                        {transaction.chequeDetails.frontImage && (
                          <div>
                            <p className="text-sm font-semibold">Front</p>
                            <img
                              src={transaction.chequeDetails.frontImage}
                              alt="Cheque Front"
                              className="mt-2 rounded-md max-w-[200px] border"
                            />
                          </div>
                        )}
                        {transaction.chequeDetails.backImage && (
                          <div>
                            <p className="text-sm font-semibold">Back</p>
                            <img
                              src={transaction.chequeDetails.backImage}
                              alt="Cheque Back"
                              className="mt-2 rounded-md max-w-[200px] border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {transaction.cryptoDetails && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Crypto Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-semibold">{transaction.cryptoDetails.network}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Wallet Address</span>
                    <span className="font-semibold break-all">{transaction.cryptoDetails.walletAddress}</span>
                  </div>
                  {transaction.cryptoDetails.proofOfPayment && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Proof of Payment</span>
                      <a
                        href={transaction.cryptoDetails.proofOfPayment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        View Proof
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {transaction.transferDetails && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Transfer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account Name</span>
                    <span className="font-semibold">{transaction.transferDetails.accountName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-semibold">{transaction.transferDetails.accountNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bank Name</span>
                    <span className="font-semibold">{transaction.transferDetails.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-semibold">{transaction.transferDetails.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">SWIFT Code</span>
                    <span className="font-semibold">{transaction.transferDetails.swiftCode}</span>
                  </div>
                  {transaction.transferDetails.iban && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">IBAN</span>
                      <span className="font-semibold">{transaction.transferDetails.iban}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bank Address</span>
                    <span className="font-semibold">{transaction.transferDetails.bankAddress}</span>
                  </div>
                  {transaction.transferDetails.description && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Description</span>
                      <span className="font-semibold">{transaction.transferDetails.description}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="audit" className="space-y-6 pt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <div className="font-semibold">Transaction Created</div>
                      <div className="text-sm text-muted-foreground">
                        System generated transaction
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm:ss")}
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <div className="font-semibold">Status Updated</div>
                      <div className="text-sm text-muted-foreground">
                        Marked as {transaction.status.toLowerCase()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(transaction.updatedAt), "MMM dd, yyyy HH:mm:ss")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}