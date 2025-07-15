import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import PageLayout from "@/components/page-layout";
import HeroSection from "@/components/hero-section";
import CTASection from "@/components/cta-section";

export default function ContactPage() {
  return (
    <PageLayout currentPage="/contact">
      {/* Hero Section */}
      <HeroSection
        badgeText="We're Here to Help"
        badgeIcon="📞"
        title="Get in Touch"
        subtitle="With Our Team"
        description="Have questions about our services? Need assistance with your account? Our dedicated team is ready to provide the support you need."
      />

      {/* Contact Methods Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              {
                icon: MessageCircle,
                title: "Live Chat",
                description: "Get instant help through our secure chat system",
                button: "Start Chat",
                gradient: "hover:from-white hover:to-green-50",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                description: "Find a branch or ATM location near you",
                button: "Route des Acacias 60, 1211 Genève 73, Switzerland",
                gradient: "hover:from-white hover:to-purple-50",
              },
            ].map((method, index) => (
              <Card
                key={index}
                className={`p-6 sm:p-8 text-center border-zinc-100 hover:bg-gradient-to-br ${method.gradient} rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group animate-in fade-in slide-in-from-bottom-6 duration-800`}
                style={{ animationDelay: `${200 + index * 200}ms` }}
              >
                <CardContent className="py-3 sm:py-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <method.icon className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    {method.description}
                  </p>
                  <Button className="bg-zinc-900 hover:bg-zinc-800 rounded-xl w-full sm:w-auto transition-all duration-300 hover:scale-105 group/btn">
                    {method.button}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                Fill out the form below and we'll get back to you within one
                business day. For urgent matters, please call our customer
                service line.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    icon: Clock,
                    title: "Business Hours",
                    content: [
                      "Monday - Friday: 8:00 AM - 8:00 PM",
                      "Saturday: 9:00 AM - 5:00 PM",
                      "Sunday: 10:00 AM - 4:00 PM",
                    ],
                  },
                  {
                    icon: Mail,
                    title: "Email Support",
                    content: ["General: helpdesk@meridianprivateholdings.com"],
                  },
                ].map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 sm:space-x-4 animate-in fade-in slide-in-from-left-4 duration-800"
                    style={{ animationDelay: `${300 + index * 200}ms` }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12">
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {info.title}
                      </h3>
                      <div className="text-gray-600 space-y-1 text-sm sm:text-base">
                        {info.content.map((line, lineIndex) => (
                          <div key={lineIndex}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-6 sm:p-8 rounded-xl sm:rounded-2xl animate-in fade-in slide-in-from-right-8 duration-1000 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="py-3 sm:py-5">
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: "firstName",
                        label: "First Name",
                        placeholder: "John",
                      },
                      {
                        id: "lastName",
                        label: "Last Name",
                        placeholder: "Doe",
                      },
                    ].map((field, index) => (
                      <div
                        key={field.id}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-600"
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                      >
                        <Label
                          htmlFor={field.id}
                          className="text-sm sm:text-base"
                        >
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          placeholder={field.placeholder}
                          className="mt-2 transition-all duration-300 focus:scale-105"
                        />
                      </div>
                    ))}
                  </div>

                  {[
                    {
                      id: "email",
                      label: "Email",
                      type: "email",
                      placeholder: "john@example.com",
                    },
                    {
                      id: "phone",
                      label: "Phone Number",
                      type: "tel",
                      placeholder: "(555) 123-4567",
                    },
                    {
                      id: "subject",
                      label: "Subject",
                      placeholder: "How can we help you?",
                    },
                  ].map((field, index) => (
                    <div
                      key={field.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-600"
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <Label
                        htmlFor={field.id}
                        className="text-sm sm:text-base"
                      >
                        {field.label}
                      </Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="mt-2 transition-all duration-300 focus:scale-105"
                      />
                    </div>
                  ))}

                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-700">
                    <Label htmlFor="message" className="text-sm sm:text-base">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question or concern in detail..."
                      className="mt-2 min-h-[100px] sm:min-h-[120px] transition-all duration-300 focus:scale-105"
                    />
                  </div>

                  <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-300 hover:scale-105 group animate-in fade-in slide-in-from-bottom-4 duration-600 delay-800">
                    Send Message
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Branch Locations Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-top-6 duration-1000">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Visit Our Locations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Find a Meridian Private Holdings branch near you for personalized
              service and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Downtown Branch",
                address: "123 Main Street",
                city: "Downtown, NY 10001",
                phone: "(555) 123-0001",
              },
              {
                name: "Uptown Branch",
                address: "456 Park Avenue",
                city: "Uptown, NY 10002",
                phone: "(555) 123-0002",
              },
              {
                name: "Westside Branch",
                address: "789 West Street",
                city: "Westside, NY 10003",
                phone: "(555) 123-0003",
              },
            ].map((branch, index) => (
              <Card
                key={index}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl group animate-in fade-in slide-in-from-bottom-6 duration-800"
                style={{ animationDelay: `${200 + index * 200}ms` }}
              >
                <CardContent className="py-3 sm:py-5">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    {branch.name}
                  </h3>
                  <div className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                      <div>
                        <div>{branch.address}</div>
                        <div>{branch.city}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                      <div>{branch.phone}</div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                      <div>Mon-Fri: 9AM-6PM</div>
                    </div>
                  </div>
                  <Button className="w-full mt-4 sm:mt-6 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-300 hover:scale-105 group/btn">
                    Get Directions
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Need Immediate Assistance?"
        description="Our customer service team is available 24/7 to help with urgent banking needs and account issues."
        primaryButtonText="Call Now: (555) 123-BANK"
        secondaryButtonText="Start Live Chat"
        primaryButtonIcon={
          <Phone className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
        }
        secondaryButtonIcon={
          <MessageCircle className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
        }
      />
    </PageLayout>
  );
}
