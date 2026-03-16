import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import CookieConsent from "@/components/ui/CookieConsent";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pratham Udeshi — AI Engineer",
  description:
    "Spatial computing portfolio of Pratham Udeshi. AI Engineer specializing in computer vision, agentic AI, and full-stack development.",
  keywords: ["AI Engineer", "Computer Vision", "Portfolio", "Three.js", "React", "LangChain"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}>
        {/* MediaPipe CDN globals */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1640029074/camera_utils.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js"
          strategy="afterInteractive"
        />
        
        {children}
        <AnalyticsProvider />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
