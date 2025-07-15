import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Coffee,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import PageLayout from "@/components/page-layout";
import HeroSection from "@/components/hero-section";
import CTASection from "@/components/cta-section";
import ScrollReveal from "@/components/scroll-reveal";
import StaggeredReveal from "@/components/staggered-reveal";

export default function CareersPage() {
  return (
    <PageLayout currentPage="/careers">
      {/* Hero Section */}
      <HeroSection
        badgeText="Join Our Team"
        badgeIcon="💼"
        title="Build Your Career"
        subtitle="With Meridian Private Holdings"
        description="Join a team of passionate professionals who are transforming the future of banking. Discover opportunities to grow, innovate, and make a meaningful impact."
      />

      {/* Why Work With Us */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Why Work With Us?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                We believe our people are our greatest asset. Here's what makes
                Meridian Private Holdings a great place to work.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            staggerDelay={200}
            direction="up"
          >
            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Growth Opportunities
                </h3>
                <p className="text-gray-600 text-sm">
                  Advance your career with continuous learning and development
                  programs
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Work-Life Balance
                </h3>
                <p className="text-gray-600 text-sm">
                  Flexible schedules and remote work options to fit your
                  lifestyle
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Inclusive Culture
                </h3>
                <p className="text-gray-600 text-sm">
                  Diverse and inclusive workplace where everyone belongs
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Great Benefits
                </h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive health, retirement, and wellness benefits
                </p>
              </CardContent>
            </Card>
          </StaggeredReveal>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Open Positions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Explore current opportunities to join our growing team and make
                an impact in the financial industry.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="space-y-6"
            staggerDelay={200}
            direction="up"
          >
            {[
              {
                title: "Senior Software Engineer",
                department: "Technology",
                location: "New York, NY",
                type: "Full-time",
                experience: "5+ years",
                description:
                  "Lead development of our next-generation banking platform using modern technologies.",
              },
              {
                title: "Product Manager",
                department: "Product",
                location: "San Francisco, CA",
                type: "Full-time",
                experience: "3+ years",
                description:
                  "Drive product strategy and roadmap for our digital banking solutions.",
              },
              {
                title: "UX/UI Designer",
                department: "Design",
                location: "Remote",
                type: "Full-time",
                experience: "4+ years",
                description:
                  "Create intuitive and engaging user experiences for our banking applications.",
              },
              {
                title: "Data Scientist",
                department: "Analytics",
                location: "Chicago, IL",
                type: "Full-time",
                experience: "3+ years",
                description:
                  "Analyze customer data to drive insights and improve our services.",
              },
              {
                title: "Customer Success Manager",
                department: "Customer Experience",
                location: "Austin, TX",
                type: "Full-time",
                experience: "2+ years",
                description:
                  "Ensure customer satisfaction and drive adoption of our banking services.",
              },
            ].map((job, index) => (
              <Card
                key={index}
                className="p-6 sm:p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group"
              >
                <CardContent className="py-3 sm:py-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-xl sm:text-2xl font-semibold">
                          {job.title}
                        </h3>
                        <Badge className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                          {job.department}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>
                    </div>

                    <div className="lg:ml-6">
                      <Button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-300 hover:scale-105 group/btn w-full lg:w-auto">
                        Apply Now
                        <Briefcase className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal direction="left" delay={200}>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Comprehensive Benefits Package
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                  We invest in our employees' well-being and future with a
                  comprehensive benefits package designed to support you and
                  your family.
                </p>

                <StaggeredReveal
                  className="space-y-4"
                  staggerDelay={200}
                  direction="left"
                >
                  <div className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Health & Wellness
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Comprehensive medical, dental, and vision coverage plus
                        wellness programs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Retirement Planning
                      </h3>
                      <p className="text-gray-600 text-sm">
                        401(k) with company matching and financial planning
                        resources
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Learning & Development
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Tuition reimbursement, professional development, and
                        training programs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Time Off</h3>
                      <p className="text-gray-600 text-sm">
                        Generous PTO, holidays, and sabbatical opportunities
                      </p>
                    </div>
                  </div>
                </StaggeredReveal>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={400}>
              <div className="relative group">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Team collaboration"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Application Process
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Our streamlined application process is designed to help us get
                to know you and find the perfect fit.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid md:grid-cols-4 gap-6 sm:gap-8"
            staggerDelay={200}
            direction="up"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Apply Online</h3>
              <p className="text-gray-600 text-sm">
                Submit your application and resume through our careers portal
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Initial Review</h3>
              <p className="text-gray-600 text-sm">
                Our recruiting team reviews your qualifications and experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Interview Process</h3>
              <p className="text-gray-600 text-sm">
                Meet with hiring managers and potential team members
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Welcome Aboard</h3>
              <p className="text-gray-600 text-sm">
                Join our team and start your onboarding journey
              </p>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Join Our Team?"
        description="Take the next step in your career and help us shape the future of banking. We're excited to meet you!"
        primaryButtonText="View All Positions"
        secondaryButtonText="Learn About Culture"
      />
    </PageLayout>
  );
}
