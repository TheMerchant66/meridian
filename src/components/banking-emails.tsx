"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OTPEmail } from "./emails/otp-email"
import { DepositUnderReviewEmail } from "./emails/deposit-under-review-email"
import { DepositConfirmationEmail } from "./emails/deposit-confirmation-email"
import { LoanApprovalEmail } from "./emails/loan-approval-email"
import { TransferSuccessEmail } from "./emails/transfer-success-email"
import { TransferFailedEmail } from "./emails/transfer-failed-email"
import { StatementRequestEmail } from "./emails/statement-request-email"
import { LoanDeclinedEmail } from "./emails/loan-declined-email"
import { DepositRejectedEmail } from "./emails/deposit-rejected-email"

export default function BankingEmails() {
  const [activeTab, setActiveTab] = useState("otp")

  const emailTemplates = [
    { id: "otp", label: "OTP Code", component: <OTPEmail otpCode="123456" /> },
    {
      id: "deposit-review",
      label: "Deposit Under Review",
      component: <DepositUnderReviewEmail amount="$2,500.00" transactionId="TXN-2024-001" />,
    },
    {
      id: "deposit-confirm",
      label: "Deposit Confirmation",
      component: <DepositConfirmationEmail amount="$2,500.00" balance="$15,750.00" transactionId="TXN-2024-001" />,
    },
    {
      id: "deposit-rejected",
      label: "Deposit Rejected",
      component: (
        <DepositRejectedEmail amount="$2,500.00" transactionId="TXN-2024-001" reason="Invalid check signature" />
      ),
    },
    {
      id: "loan-approval",
      label: "Loan Approval",
      component: <LoanApprovalEmail loanAmount="$50,000" interestRate="4.5%" loanId="LOAN-2024-001" />,
    },
    {
      id: "loan-declined",
      label: "Loan Declined",
      component: <LoanDeclinedEmail loanAmount="$50,000" applicationId="APP-2024-001" />,
    },
    {
      id: "transfer-success",
      label: "Transfer Success",
      component: <TransferSuccessEmail amount="$1,200.00" recipient="John Smith" transactionId="TXN-2024-002" />,
    },
    {
      id: "transfer-failed",
      label: "Transfer Failed",
      component: <TransferFailedEmail amount="$1,200.00" recipient="John Smith" reason="Insufficient funds" />,
    },
    {
      id: "statement-request",
      label: "Statement Request",
      component: <StatementRequestEmail period="December 2024" downloadLink="#" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-3 sm:pt-5 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Banking Email Templates</h1>
          <p className="text-muted-foreground">Professional email templates for your banking application</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 mb-6">
            {emailTemplates.map((template) => (
              <TabsTrigger key={template.id} value={template.id} className="text-xs">
                {template.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {emailTemplates.map((template) => (
            <TabsContent key={template.id} value={template.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{template.label} Email</CardTitle>
                  <CardDescription>Preview of the {template.label.toLowerCase()} email template</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">{template.component}</div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
