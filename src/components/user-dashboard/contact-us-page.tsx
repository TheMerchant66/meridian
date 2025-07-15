"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, Clock, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">Get in touch with our support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">1-800-123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@bank.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM</p>
                <p className="text-sm text-muted-foreground">Sat: 9AM-2PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>Fill out the form and we'll get back to you soon</CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>Your message has been sent successfully!</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account Question</SelectItem>
                      <SelectItem value="loan">Loan Inquiry</SelectItem>
                      <SelectItem value="card">Card Issue</SelectItem>
                      <SelectItem value="online">Online Banking</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={4} required />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Crypto Purchase Guidelines */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-full">
                <span className="text-orange-600 font-bold text-sm">₿</span>
              </div>
              Cryptocurrency Purchase Guidelines
            </CardTitle>
            <CardDescription>Learn how to safely purchase cryptocurrency and explore trusted platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Guidelines Section */}
            <div>
              <h3 className="font-semibold mb-3">How to Buy Cryptocurrency Safely</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <span className="block w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Research Before You Buy</p>
                      <p className="text-xs text-muted-foreground">
                        Understand the cryptocurrency you want to purchase and its market trends
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <span className="block w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Use Reputable Exchanges</p>
                      <p className="text-xs text-muted-foreground">
                        Only use well-established and regulated cryptocurrency exchanges
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <span className="block w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Secure Your Wallet</p>
                      <p className="text-xs text-muted-foreground">
                        Use hardware wallets or secure software wallets for storage
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <span className="block w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Start Small</p>
                      <p className="text-xs text-muted-foreground">
                        Begin with small amounts until you're comfortable with the process
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <span className="block w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Enable Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">
                        Always enable 2FA on your exchange and wallet accounts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <span className="block w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Beware of Scams</p>
                      <p className="text-xs text-muted-foreground">
                        Never share private keys and be cautious of too-good-to-be-true offers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Trusted Cryptocurrency Exchanges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Coinbase</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Beginner Friendly</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    User-friendly platform with strong security features
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="https://www.coinbase.com" target="_blank" rel="noopener noreferrer">
                      Visit Coinbase
                    </a>
                  </Button>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Binance</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Advanced</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Large selection of cryptocurrencies and trading features
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="https://www.binance.com" target="_blank" rel="noopener noreferrer">
                      Visit Binance
                    </a>
                  </Button>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Kraken</h4>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Secure</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Known for security and regulatory compliance</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="https://www.kraken.com" target="_blank" rel="noopener noreferrer">
                      Visit Kraken
                    </a>
                  </Button>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Gemini</h4>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Regulated</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Regulated exchange with insurance protection</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="https://www.gemini.com" target="_blank" rel="noopener noreferrer">
                      Visit Gemini
                    </a>
                  </Button>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">eToro</h4>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Social Trading</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Social trading platform with copy trading features
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="https://www.etoro.com" target="_blank" rel="noopener noreferrer">
                      Visit eToro
                    </a>
                  </Button>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Cash App</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Mobile First</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Simple mobile app for buying Bitcoin</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="https://cash.app" target="_blank" rel="noopener noreferrer">
                      Visit Cash App
                    </a>
                  </Button>
                </Card>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                  <span className="block w-3 h-3 bg-amber-600 rounded-full"></span>
                </div>
                <div>
                  <p className="font-medium text-amber-800 text-sm mb-1">Important Disclaimer</p>
                  <p className="text-xs text-amber-700">
                    Cryptocurrency investments are highly volatile and risky. Only invest what you can afford to lose.
                    This information is for educational purposes only and not financial advice. Always do your own
                    research and consider consulting with a financial advisor before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
