import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Search, MessageCircle, Phone } from "lucide-react";
import PageLayout from "@/components/page-layout";
import HeroSection from "@/components/hero-section";
import CTASection from "@/components/cta-section";

export default function FAQsPage() {
  return (
    <PageLayout currentPage="/faqs">
      {/* Hero Section */}
      <HeroSection
        badgeText="Frequently Asked Questions"
        badgeIcon="❓"
        title="Find Answers"
        subtitle="To Your Questions"
        description="Get quick answers to common questions about our banking services, accounts, and policies. Can't find what you're looking for? Contact our support team."
      />

      {/* FAQ Categories */}
      <section className="py-20 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Account Questions
                </h3>
                <p className="text-gray-600">
                  Learn about opening accounts, fees, and account management
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Security & Privacy
                </h3>
                <p className="text-gray-600">
                  Information about keeping your account safe and secure
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Digital Banking</h3>
                <p className="text-gray-600">
                  Help with online banking and mobile app features
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-12 text-center">
              Common Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="bg-white rounded-xl border-0 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                  How do I open a new account with Meridian Private Holdings?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  Opening an account is simple and can be done online in just a
                  few minutes. You'll need a valid government-issued ID, Social
                  Security number, and an initial deposit (minimum varies by
                  account type). You can also visit any of our branch locations
                  for in-person assistance. Our team will help you choose the
                  right account type based on your banking needs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-white rounded-xl border-0 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                  What are your current interest rates for savings accounts?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  Our High-Yield Savings account currently offers 4.5% APY on
                  all balances with no minimum balance requirement. Interest
                  rates are variable and may change at any time. We also offer
                  competitive rates on CDs and money market accounts. For the
                  most current rates, please visit our website or contact a
                  customer service representative.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-white rounded-xl border-0 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                  Are there any monthly fees for checking accounts?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  Our Essential Checking account has no monthly maintenance
                  fees. Our Premium Banking account has a monthly fee that can
                  be waived with a qualifying balance or by meeting certain
                  relationship requirements. All fees are clearly disclosed when
                  you open your account, and we'll help you choose the account
                  that best fits your banking habits.
                </AccordionContent>
              </AccordionItem>

              {/* Additional FAQ items would go here */}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-20 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our customer service
              team is here to help you 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Call Us</h3>
                <p className="text-gray-600 mb-6">
                  Speak with a customer service representative
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-zinc-900">
                    (555) 123-BANK
                  </div>
                  <div className="text-sm text-gray-500">Available 24/7</div>
                </div>
                <Button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Live Chat</h3>
                <p className="text-gray-600 mb-6">
                  Get instant help through our secure chat
                </p>
                <div className="mb-6">
                  <div className="text-lg font-semibold text-zinc-900">
                    Available Now
                  </div>
                  <div className="text-sm text-gray-500">
                    Average response time: 30 seconds
                  </div>
                </div>
                <Button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        description="Have more questions? Our team is ready to help you find the perfect banking solution for your needs."
        primaryButtonText="Open Account"
        secondaryButtonText="Contact Support"
        secondaryButtonIcon={<MessageCircle className="ml-2 w-5 h-5" />}
      />
    </PageLayout>
  );
}
