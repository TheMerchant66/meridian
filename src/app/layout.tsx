import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/contexts/UserContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Meridian Private Holdings",
    template: "%s | Meridian Private Holdings",
  },
  description:
    "Meridian Private Holdings - Your trusted partner in modern banking and financial services. Experience secure, innovative, and personalized banking solutions.",
  keywords: [
    "banking",
    "financial services",
    "online banking",
    "digital-banking",
    "secure banking",
    "modern banking",
  ],
  authors: [{ name: "Meridian Private Holdings" }],
  creator: "Meridian Private Holdings",
  publisher: "Meridian Private Holdings",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://meridianprivateholdings.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meridianprivateholdings.com",
    title: "Meridian Private Holdings",
    description:
      "Your trusted partner in modern banking and financial services",
    siteName: "Meridian Private Holdings",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian Private Holdings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meridian Private Holdings",
    description:
      "Your trusted partner in modern banking and financial services",
    images: ["/twitter-image.jpg"],
    creator: "@stellarone",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>{children}</UserProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(17, 17, 17, 0.95)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "#fff",
              borderRadius: "12px",
              padding: "16px 20px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              maxWidth: "300px",
              width: "100%",
              margin: "0 auto",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
            loading: {
              iconTheme: {
                primary: "#3b82f6",
                secondary: "#fff",
              },
            },
            className: "toast-custom",
          }}
        />
      </body>
    </html>
  );
}
