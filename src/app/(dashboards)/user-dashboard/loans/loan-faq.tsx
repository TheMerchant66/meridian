"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, FileText, Percent, Calendar, AlertCircle, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export function LoanFAQ() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      id: "application",
      name: "Application",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "eligibility",
      name: "Eligibility",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    {
      id: "repayment",
      name: "Repayment",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "rates",
      name: "Rates & Fees",
      icon: <Percent className="h-4 w-4" />,
    },
  ]

  const faqItems = {
    application: [
      {
        question: "How do I apply for a loan?",
        answer:
          "You can apply for a loan directly through your dashboard by clicking on the 'Apply Now' button in the Loans section. Follow the guided application process, fill in the required information, and submit your application. You can also visit any of our branches or call our customer service for assistance.",
      },
      {
        question: "What documents do I need to apply?",
        answer:
          "Required documents typically include proof of identity (government-issued ID), proof of income (pay stubs, tax returns), proof of address (utility bills, lease agreement), and bank statements. Additional documents may be required depending on the loan type and amount.",
      },
      {
        question: "How long does the application process take?",
        answer:
          "The online application takes approximately 10-15 minutes to complete. Once submitted, personal loans are typically processed within 1-2 business days, while mortgage and business loans may take 5-7 business days for initial review.",
      },
      {
        question: "Can I save my application and complete it later?",
        answer:
          "Yes, your application progress is automatically saved. You can return to your dashboard anytime to continue where you left off within 30 days of starting the application.",
      },
    ],
    eligibility: [
      {
        question: "What are the eligibility requirements for a loan?",
        answer:
          "General eligibility requirements include being at least 18 years old, having a regular source of income, maintaining a good credit score (typically 650+), and having a debt-to-income ratio below 40%. Specific loan products may have additional requirements.",
      },
      {
        question: "How does my credit score affect my loan application?",
        answer:
          "Your credit score is a key factor in loan approval and determining your interest rate. Higher scores generally result in better rates. Scores below 600 may limit your options or require additional security or a co-signer.",
      },
      {
        question: "Can I get a loan with bad credit?",
        answer:
          "Yes, we offer certain loan options for customers with lower credit scores, though they may come with higher interest rates or require collateral. Our secured loan products and credit-builder loans are designed to help customers with challenging credit histories.",
      },
      {
        question: "Do I need a co-signer for my loan?",
        answer:
          "A co-signer is not always required but may be beneficial if you have limited credit history or a lower credit score. Having a co-signer with strong credit can improve your chances of approval and may help you secure better terms.",
      },
    ],
    repayment: [
      {
        question: "What repayment options are available?",
        answer:
          "We offer multiple repayment options including automatic payments from your bank account, online payments through your dashboard, mobile app payments, phone payments, and in-branch payments. You can choose monthly, bi-weekly, or weekly payment schedules for most loans.",
      },
      {
        question: "Can I pay off my loan early?",
        answer:
          "Yes, you can make additional payments or pay off your loan in full at any time. Most of our loan products have no prepayment penalties, though some mortgage products may have early payoff fees within the first 3 years.",
      },
      {
        question: "What happens if I miss a payment?",
        answer:
          "If you miss a payment, a late fee may be applied after a 15-day grace period. Multiple missed payments can negatively impact your credit score and may result in collection activities. We encourage you to contact us immediately if you anticipate payment difficulties.",
      },
      {
        question: "Can I change my payment due date?",
        answer:
          "Yes, you can request a change to your payment due date through your online dashboard or by contacting customer service. We allow one due date change every 12 months to help align with your pay schedule or other financial obligations.",
      },
    ],
    rates: [
      {
        question: "How are interest rates determined?",
        answer:
          "Interest rates are determined based on several factors including your credit score, loan amount, loan term, loan type, current market rates, and your relationship with our bank. We offer both fixed and variable rate options for most loan products.",
      },
      {
        question: "What fees are associated with loans?",
        answer:
          "Common fees include application fees ($0-$100 depending on loan type), origination fees (0-3% of loan amount), late payment fees (typically $25-$50 or 5% of payment amount), and returned payment fees ($25). Some loans may also have annual fees or maintenance fees.",
      },
      {
        question: "Are there any hidden costs I should be aware of?",
        answer:
          "We are committed to transparency in our loan products. All fees and costs are disclosed in your loan agreement. There are no hidden fees, but be sure to review your loan disclosure documents carefully for details on potential situational fees like late payments or wire transfers.",
      },
      {
        question: "Do you offer rate discounts?",
        answer:
          "Yes, we offer rate discounts for automatic payments (0.25%), existing customers (up to 0.50% depending on relationship), and for certain loan types when you maintain qualifying deposit accounts with us. Military members and seniors may also qualify for special rate programs.",
      },
    ],
  }

  const allFaqs = Object.values(faqItems).flat()

  const filteredFaqs = searchQuery
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  return (
    <Card className="w-full border mt-10 bg-zinc-100/50 border-0 ">
      <CardHeader className="pb-3 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-zinc-500/10 p-1.5">
              <HelpCircle className="h-5 w-5 text-zinc-900" />
            </div>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              className="pl-9 bg-muted/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {searchQuery ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <h3 className="text-sm font-medium">Search Results</h3>
              <Badge variant="secondary" className="text-xs">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"}
              </Badge>
            </div>

            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`search-${index}`} className="border-b border-muted">
                    <AccordionTrigger className="text-left hover:bg-muted/50 px-3 py-3 rounded-md">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10 bg-muted/20 rounded-lg">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="font-medium">No results found for "{searchQuery}"</p>
                <p className="text-sm mt-1 text-muted-foreground">
                  Try different keywords or browse the categories below
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="application" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-6 h-auto p-1 bg-zinc-200">
              {faqCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-700"
                >
                  <span className=" p-1 rounded-full flex items-center justify-center">
                    {category.icon}
                  </span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(faqItems).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <Accordion type="single" collapsible className="w-full">
                  {items.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category}-${index}`}
                      className="border-b border-muted last:border-0"
                    >
                      <AccordionTrigger className="text-left hover:bg-muted/50 px-3 py-3 rounded-md">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-6 flex flex-col items-center justify-center pt-4">
                  <Separator className="mb-6" />
                  <div className="flex items-center gap-x-3 ">
                  <div className="flex items-center gap-2 text-muted-foreground ">
                 
                    <p className="text-sm">Still have questions?</p>
                  </div>
                  <Button size="sm" className="gap-2 bg-zinc-900 hover:bg-zinc-700">
                    <MessageSquare className="h-4 w-4" />
                    Contact Support
                  </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
