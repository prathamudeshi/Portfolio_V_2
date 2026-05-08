import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/ui/CookieConsent";
// import AnalyticsProvider from "@/components/AnalyticsProvider";

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
  title: "Pratham Udeshi — AI Engineer | Nexus Portfolio",
  description:
    "Explore the spatial computing portfolio of Pratham Udeshi. Specialized in AI Engineering, Computer Vision, Agentic AI, and Full-Stack Development. Creator of Nexus and Amethyst AI Platform.",
  keywords: [
    "Pratham Udeshi",
    "Nexus by Pratham",
    "AI Engineer",
    "Amethyst AI",
    "Amethyst Platform",
    "GenAI",
    "Agentic AI",
    "Computer Vision",
    "Full Stack Developer",
    "Spatial Computing",
    "Three.js Portfolio",
    "LLM Hackathon IIT-Bombay",
    "AI Agents",
    "Next.js Portfolio",
    "Holographic Portfolio",
    "GenAI Systems"
  ],
  authors: [{ name: "Pratham Udeshi" }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Pratham Udeshi — AI Engineer | Nexus Portfolio",
    description: "Spatial computing portfolio specialized in AI Engineering, Agentic Systems, and Computer Vision.",
    url: "https://prathamudeshi.com",
    siteName: "Nexus Portfolio",
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Pratham Udeshi Nexus Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratham Udeshi — AI Engineer",
    description: "AI Engineer specializing in Computer Vision, Agentic AI, and Full-Stack development.",
    images: ["/images/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Pratham Udeshi",
    "url": "https://prathamudeshi.com",
    "jobTitle": "AI Engineer",
    "alumniOf": "K.J. Somaiya School of Engineering",
    "knowsAbout": ["AI Engineering", "Computer Vision", "Agentic AI", "Full-Stack Development", "GenAI", "Nexus", "Amethyst AI"],
    "sameAs": [
      "https://github.com/prathamudeshi",
      "https://linkedin.com/in/prathamudeshi"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          key="jsonld"
        />
        {children}
        {/* <AnalyticsProvider /> */}
        <CookieConsent />
      </body>
    </html>
  );
}
