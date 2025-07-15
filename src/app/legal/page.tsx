import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, Shield, AlertCircle } from "lucide-react";
import PageLayout from "@/components/page-layout";
import HeroSection from "@/components/hero-section";
import ScrollReveal from "@/components/scroll-reveal";
import StaggeredReveal from "@/components/staggered-reveal";

export default function LegalPage() {
  return (
    <PageLayout currentPage="/legal">
      {/* Hero Section */}
      <HeroSection
        badgeText="Legal Information"
        badgeIcon="⚖️"
        title="Legal Terms"
        subtitle="& Disclosures"
        description="Important legal information, terms of service, and regulatory disclosures for Meridian Private Holdings banking services."
      />

      {/* Legal Categories */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StaggeredReveal
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12"
            staggerDelay={200}
            direction="up"
          >
            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Terms of Service
                </h3>
                <p className="text-gray-600 text-sm">
                  Conditions governing your use of our services
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Regulatory Compliance
                </h3>
                <p className="text-gray-600 text-sm">
                  FDIC insurance and regulatory information
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Security Policies
                </h3>
                <p className="text-gray-600 text-sm">
                  How we protect your information and accounts
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Disclosures
                </h3>
                <p className="text-gray-600 text-sm">
                  Important notices and fee schedules
                </p>
              </CardContent>
            </Card>
          </StaggeredReveal>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <ScrollReveal direction="up" delay={200}>
            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Terms of Service
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  1. Acceptance of Terms
                </h3>
                <p className="text-gray-600 mb-4">
                  By accessing and using Meridian Private Holdings banking
                  services, you accept and agree to be bound by the terms and
                  provision of this agreement.
                </p>

                <h3 className="text-xl font-semibold mb-4">2. Account Terms</h3>
                <p className="text-gray-600 mb-4">
                  All accounts are subject to approval. We reserve the right to
                  refuse service, terminate accounts, or cancel transactions in
                  our sole discretion.
                </p>

                <h3 className="text-xl font-semibold mb-4">
                  3. Electronic Communications
                </h3>
                <p className="text-gray-600 mb-4">
                  By using our services, you consent to receive communications
                  from us electronically, including account statements, notices,
                  and other disclosures.
                </p>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                FDIC Insurance
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <p className="text-gray-600 mb-4">
                  Meridian Private Holdings is a Member FDIC. Deposits are
                  insured by the Federal Deposit Insurance Corporation up to the
                  maximum amount allowed by law.
                </p>
                <p className="text-gray-600">
                  For current FDIC insurance limits and coverage details, please
                  visit{" "}
                  <a
                    href="https://www.fdic.gov"
                    className="text-blue-600 hover:underline"
                  >
                    www.fdic.gov
                  </a>
                  .
                </p>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Fee Schedule
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 font-semibold">Service</th>
                        <th className="pb-3 font-semibold">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b">
                        <td className="py-3">
                          Monthly Maintenance (Essential Checking)
                        </td>
                        <td className="py-3">$0</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Overdraft Fee</td>
                        <td className="py-3">$35</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">ATM Fee (Out-of-Network)</td>
                        <td className="py-3">$2.50</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Wire Transfer (Domestic)</td>
                        <td className="py-3">$25</td>
                      </tr>
                      <tr>
                        <td className="py-3">Stop Payment</td>
                        <td className="py-3">$30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl">
                <p className="text-gray-600 mb-4">
                  For questions about these terms or our services, please
                  contact us:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>
                    <strong>Phone:</strong> (555) 123-BANK
                  </li>
                  <li>
                    <strong>Email:</strong> legal@meridianprivateholdings.com
                  </li>
                  <li>
                    <strong>Address:</strong> 123 Financial District, New York,
                    NY 10001
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}
