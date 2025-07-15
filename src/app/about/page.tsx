import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Globe, TrendingUp, Heart, Shield } from "lucide-react";
import Image from "next/image";
import PageLayout from "@/components/page-layout";
import HeroSection from "@/components/hero-section";
import CTASection from "@/components/cta-section";
import ScrollReveal from "@/components/scroll-reveal";
import StaggeredReveal from "@/components/staggered-reveal";

export default function AboutPage() {
  return (
    <PageLayout currentPage="/about">
      {/* Hero Section */}
      <HeroSection
        badgeText="About Meridian Private Holdings"
        badgeIcon="🏦"
        title="Banking Built"
        subtitle="For Your Future"
        description="For over 50 years, we've been committed to providing innovative financial solutions that help individuals and businesses achieve their dreams and build lasting prosperity."
      />

      {/* Mission & Vision Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Our Mission & Vision
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                We believe in empowering people through financial innovation and
                exceptional service.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
            staggerDelay={300}
            direction="up"
          >
            <Card className="p-6 sm:p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  To provide accessible, innovative financial services that
                  empower our customers to achieve their financial goals while
                  building stronger communities through responsible banking
                  practices.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 sm:p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  To be the leading digital-first bank that transforms the
                  financial industry through cutting-edge technology,
                  exceptional customer experience, and unwavering commitment to
                  financial inclusion.
                </p>
              </CardContent>
            </Card>
          </StaggeredReveal>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Trusted by Millions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Our numbers speak to the trust and confidence our customers
                place in us every day.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            staggerDelay={200}
            direction="up"
          >
            <div className="text-center p-6 bg-white rounded-xl hover:scale-110 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">
                2M+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Active Customers
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl hover:scale-110 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">
                $50B+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Assets Under Management
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl hover:scale-110 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">
                150+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Branch Locations
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl hover:scale-110 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">
                50+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Years of Service
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Leadership Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Meet the experienced professionals who guide our vision and
                drive our success.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            staggerDelay={200}
            direction="up"
          >
            {[
              {
                name: "Sarah Mitchell",
                role: "Chief Executive Officer",
                experience: "25+ years in banking",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "David Chen",
                role: "Chief Technology Officer",
                experience: "20+ years in fintech",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Maria Rodriguez",
                role: "Chief Financial Officer",
                experience: "18+ years in finance",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((leader, index) => (
              <Card
                key={index}
                className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group"
              >
                <CardContent className="py-3 sm:py-5">
                  <div className="relative mb-6 group">
                    <Image
                      src={leader.image || "/placeholder.svg"}
                      alt={leader.name}
                      width={200}
                      height={200}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {leader.name}
                  </h3>
                  <p className="text-zinc-600 font-medium mb-2">
                    {leader.role}
                  </p>
                  <p className="text-gray-500 text-sm">{leader.experience}</p>
                </CardContent>
              </Card>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                These principles guide everything we do and shape how we serve
                our customers and communities.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            staggerDelay={200}
            direction="up"
          >
            {[
              {
                icon: Shield,
                title: "Trust & Security",
                description:
                  "We prioritize the security of your financial information and maintain the highest standards of integrity.",
              },
              {
                icon: Users,
                title: "Customer First",
                description:
                  "Every decision we make is centered around providing exceptional value and service to our customers.",
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description:
                  "We continuously evolve our technology and services to meet the changing needs of modern banking.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We strive for excellence in everything we do, from customer service to product development.",
              },
              {
                icon: Heart,
                title: "Community",
                description:
                  "We're committed to supporting and strengthening the communities we serve through responsible banking.",
              },
              {
                icon: Globe,
                title: "Accessibility",
                description:
                  "We believe financial services should be accessible to everyone, regardless of their background or location.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="p-6 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group"
              >
                <CardContent className="py-3 sm:py-5">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <value.icon className="w-6 h-6 text-zinc-800" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Experience Banking Excellence?"
        description="Join millions of customers who trust Meridian Private Holdings for their financial needs. Discover what makes us different."
        primaryButtonText="Open Account Today"
        secondaryButtonText="Learn More About Us"
      />
    </PageLayout>
  );
}
