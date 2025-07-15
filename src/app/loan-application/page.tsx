"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  FileText,
  User,
  Briefcase,
  Home,
  Shield,
  Clock,
} from "lucide-react"
import PageLayout from "@/components/page-layout"
import ScrollReveal from "@/components/scroll-reveal"
import StaggeredReveal from "@/components/staggered-reveal"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  ssn: string
  maritalStatus: string
  dependents: string

  // Address Information
  streetAddress: string
  city: string
  state: string
  zipCode: string
  residenceType: string
  monthsAtAddress: string

  // Employment Information
  employmentStatus: string
  employer: string
  jobTitle: string
  workPhone: string
  monthsEmployed: string
  annualIncome: string
  additionalIncome: string

  // Loan Information
  loanType: string
  loanAmount: string
  loanPurpose: string
  collateral: string

  // Financial Information
  monthlyRent: string
  monthlyDebt: string
  bankName: string
  accountType: string
  creditScore: string

  // Additional Information
  comments: string
  agreeToTerms: boolean
  agreeToCredit: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  ssn: "",
  maritalStatus: "",
  dependents: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  residenceType: "",
  monthsAtAddress: "",
  employmentStatus: "",
  employer: "",
  jobTitle: "",
  workPhone: "",
  monthsEmployed: "",
  annualIncome: "",
  additionalIncome: "",
  loanType: "",
  loanAmount: "",
  loanPurpose: "",
  collateral: "",
  monthlyRent: "",
  monthlyDebt: "",
  bankName: "",
  accountType: "",
  creditScore: "",
  comments: "",
  agreeToTerms: false,
  agreeToCredit: false,
}

export default function LoanApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const stepTitles = [
    "Personal Information",
    "Address & Residence",
    "Employment Details",
    "Loan Information",
    "Review & Submit",
  ]

  const stepIcons = [User, Home, Briefcase, DollarSign, FileText]

  if (isSubmitted) {
    return (
      <PageLayout currentPage="/loan-application">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
          <ScrollReveal direction="up" delay={200}>
            <Card className="max-w-2xl mx-auto p-8 text-center rounded-2xl">
              <CardContent className="py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-4">Application Submitted Successfully!</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for your loan application. We've received your information and will review it within 1-2
                  business days. You'll receive an email confirmation shortly with your application reference number.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                  <p className="text-blue-800 font-semibold">
                    Application Reference: #LA-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl">Track Application Status</Button>
                  <Button variant="outline" className="rounded-xl">
                    Return to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout currentPage="/loan-application">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 pt-8 pb-12 sm:pt-12 sm:pb-16 mx-2 sm:mx-5 mb-8 rounded-b-2xl sm:rounded-b-3xl px-4 sm:px-0 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center">
              <Badge className="mb-4 p-2 px-3 bg-zinc-800 text-zinc-200 hover:bg-blue-100 text-sm">
                💰 Loan Application
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-100 leading-tight mb-4">
                Apply for Your Loan
                <span className="text-zinc-300 block">Quick & Secure Process</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                Complete your loan application in just a few minutes. Our secure form ensures your information is
                protected.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-8 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Progress Bar */}
          <ScrollReveal direction="up" delay={200}>
            <Card className="mb-8 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Step {currentStep} of {totalSteps}
                  </h2>
                  <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="mb-4" />

                {/* Step Indicators */}
                <div className="flex justify-between">
                  {stepTitles.map((title, index) => {
                    const StepIcon = stepIcons[index]
                    const stepNumber = index + 1
                    const isActive = stepNumber === currentStep
                    const isCompleted = stepNumber < currentStep

                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isActive
                                ? "bg-zinc-900 text-white"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                        </div>
                        <span
                          className={`text-xs text-center hidden sm:block ${
                            isActive ? "text-zinc-900 font-semibold" : "text-gray-500"
                          }`}
                        >
                          {title}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Form Steps */}
          <ScrollReveal direction="up" delay={300}>
            <Card className="rounded-xl">
              <CardHeader className="pt-3">
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(stepIcons[currentStep - 1], { className: "w-6 h-6" })}
                  {stepTitles[currentStep - 1]}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <StaggeredReveal className="space-y-6" staggerDelay={100} direction="up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                          placeholder="John"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                          placeholder="Doe"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          placeholder="john@example.com"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          placeholder="(555) 123-4567"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ssn">Social Security Number *</Label>
                        <Input
                          id="ssn"
                          value={formData.ssn}
                          onChange={(e) => updateFormData("ssn", e.target.value)}
                          placeholder="XXX-XX-XXXX"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select
                          value={formData.maritalStatus}
                          onValueChange={(value) => updateFormData("maritalStatus", value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dependents">Number of Dependents</Label>
                        <Input
                          id="dependents"
                          type="number"
                          value={formData.dependents}
                          onChange={(e) => updateFormData("dependents", e.target.value)}
                          placeholder="0"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </StaggeredReveal>
                )}

                {/* Step 2: Address Information */}
                {currentStep === 2 && (
                  <StaggeredReveal className="space-y-6" staggerDelay={100} direction="up">
                    <div>
                      <Label htmlFor="streetAddress">Street Address *</Label>
                      <Input
                        id="streetAddress"
                        value={formData.streetAddress}
                        onChange={(e) => updateFormData("streetAddress", e.target.value)}
                        placeholder="123 Main Street"
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateFormData("city", e.target.value)}
                          placeholder="New York"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="ca">California</SelectItem>
                            <SelectItem value="tx">Texas</SelectItem>
                            <SelectItem value="fl">Florida</SelectItem>
                            {/* Add more states as needed */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => updateFormData("zipCode", e.target.value)}
                          placeholder="10001"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="residenceType">Residence Type</Label>
                        <Select
                          value={formData.residenceType}
                          onValueChange={(value) => updateFormData("residenceType", value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="own">Own</SelectItem>
                            <SelectItem value="rent">Rent</SelectItem>
                            <SelectItem value="mortgage">Mortgage</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="monthsAtAddress">Months at Current Address</Label>
                        <Input
                          id="monthsAtAddress"
                          type="number"
                          value={formData.monthsAtAddress}
                          onChange={(e) => updateFormData("monthsAtAddress", e.target.value)}
                          placeholder="24"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </StaggeredReveal>
                )}

                {/* Step 3: Employment Information */}
                {currentStep === 3 && (
                  <StaggeredReveal className="space-y-6" staggerDelay={100} direction="up">
                    <div>
                      <Label htmlFor="employmentStatus">Employment Status *</Label>
                      <Select
                        value={formData.employmentStatus}
                        onValueChange={(value) => updateFormData("employmentStatus", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed Full-Time</SelectItem>
                          <SelectItem value="part-time">Employed Part-Time</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="employer">Employer Name</Label>
                        <Input
                          id="employer"
                          value={formData.employer}
                          onChange={(e) => updateFormData("employer", e.target.value)}
                          placeholder="Company Name"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={formData.jobTitle}
                          onChange={(e) => updateFormData("jobTitle", e.target.value)}
                          placeholder="Software Engineer"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="workPhone">Work Phone</Label>
                        <Input
                          id="workPhone"
                          type="tel"
                          value={formData.workPhone}
                          onChange={(e) => updateFormData("workPhone", e.target.value)}
                          placeholder="(555) 987-6543"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthsEmployed">Months with Current Employer</Label>
                        <Input
                          id="monthsEmployed"
                          type="number"
                          value={formData.monthsEmployed}
                          onChange={(e) => updateFormData("monthsEmployed", e.target.value)}
                          placeholder="36"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="annualIncome">Annual Income *</Label>
                        <Input
                          id="annualIncome"
                          type="number"
                          value={formData.annualIncome}
                          onChange={(e) => updateFormData("annualIncome", e.target.value)}
                          placeholder="75000"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="additionalIncome">Additional Monthly Income</Label>
                        <Input
                          id="additionalIncome"
                          type="number"
                          value={formData.additionalIncome}
                          onChange={(e) => updateFormData("additionalIncome", e.target.value)}
                          placeholder="1000"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </StaggeredReveal>
                )}

                {/* Step 4: Loan Information */}
                {currentStep === 4 && (
                  <StaggeredReveal className="space-y-6" staggerDelay={100} direction="up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="loanType">Loan Type *</Label>
                        <Select value={formData.loanType} onValueChange={(value) => updateFormData("loanType", value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select loan type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="auto">Auto Loan</SelectItem>
                            <SelectItem value="home">Home Loan</SelectItem>
                            <SelectItem value="business">Business Loan</SelectItem>
                            <SelectItem value="student">Student Loan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="loanAmount">Loan Amount *</Label>
                        <Input
                          id="loanAmount"
                          type="number"
                          value={formData.loanAmount}
                          onChange={(e) => updateFormData("loanAmount", e.target.value)}
                          placeholder="25000"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                      <Select
                        value={formData.loanPurpose}
                        onValueChange={(value) => updateFormData("loanPurpose", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                          <SelectItem value="home-improvement">Home Improvement</SelectItem>
                          <SelectItem value="vehicle-purchase">Vehicle Purchase</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="medical">Medical Expenses</SelectItem>
                          <SelectItem value="business">Business Investment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="collateral">Collateral (if applicable)</Label>
                      <Textarea
                        id="collateral"
                        value={formData.collateral}
                        onChange={(e) => updateFormData("collateral", e.target.value)}
                        placeholder="Describe any collateral you're offering..."
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="monthlyRent">Monthly Housing Payment</Label>
                        <Input
                          id="monthlyRent"
                          type="number"
                          value={formData.monthlyRent}
                          onChange={(e) => updateFormData("monthlyRent", e.target.value)}
                          placeholder="1500"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthlyDebt">Monthly Debt Payments</Label>
                        <Input
                          id="monthlyDebt"
                          type="number"
                          value={formData.monthlyDebt}
                          onChange={(e) => updateFormData("monthlyDebt", e.target.value)}
                          placeholder="500"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="creditScore">Estimated Credit Score</Label>
                        <Select
                          value={formData.creditScore}
                          onValueChange={(value) => updateFormData("creditScore", value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent (750+)</SelectItem>
                            <SelectItem value="good">Good (700-749)</SelectItem>
                            <SelectItem value="fair">Fair (650-699)</SelectItem>
                            <SelectItem value="poor">Poor (600-649)</SelectItem>
                            <SelectItem value="bad">Bad (Below 600)</SelectItem>
                            <SelectItem value="unknown">Don't Know</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="comments">Additional Comments</Label>
                      <Textarea
                        id="comments"
                        value={formData.comments}
                        onChange={(e) => updateFormData("comments", e.target.value)}
                        placeholder="Any additional information you'd like to share..."
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </StaggeredReveal>
                )}

                {/* Step 5: Review & Submit */}
                {currentStep === 5 && (
                  <StaggeredReveal className="space-y-6" staggerDelay={100} direction="up">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Name:</strong> {formData.firstName} {formData.lastName}
                        </div>
                        <div>
                          <strong>Email:</strong> {formData.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {formData.phone}
                        </div>
                        <div>
                          <strong>Loan Type:</strong> {formData.loanType}
                        </div>
                        <div>
                          <strong>Loan Amount:</strong> ${formData.loanAmount}
                        </div>
                        <div>
                          <strong>Annual Income:</strong> ${formData.annualIncome}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                          I agree to the{" "}
                          <a href="/legal" className="text-blue-600 hover:underline">
                            Terms and Conditions
                          </a>{" "}
                          and
                          <a href="/privacy" className="text-blue-600 hover:underline ml-1">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeToCredit"
                          checked={formData.agreeToCredit}
                          onCheckedChange={(checked) => updateFormData("agreeToCredit", checked as boolean)}
                        />
                        <Label htmlFor="agreeToCredit" className="text-sm leading-relaxed">
                          I authorize Stellarone Holdings to obtain my credit report and verify the information provided
                          in this application
                        </Label>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <strong>Security Notice:</strong> Your information is encrypted and secure. We use bank-level
                          security to protect your personal and financial data.
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <strong>Processing Time:</strong> Most applications are reviewed within 1-2 business days.
                          You'll receive an email notification once your application has been processed.
                        </div>
                      </div>
                    </div>
                  </StaggeredReveal>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button onClick={nextStep} className="bg-zinc-900 hover:bg-zinc-800 rounded-xl">
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.agreeToTerms || !formData.agreeToCredit}
                      className="bg-green-600 hover:bg-green-700 rounded-xl"
                    >
                      Submit Application
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  )
}
