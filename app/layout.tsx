import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "../styles/prism.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "DevOverflow",
  applicationName: "DevOverflow",
  authors: {
    name: "Juan Cruz Cáceres",
    url: "https://caceresjuan.vercel.app/",
  },
  creator: "Juan Cruz Cáceres",
  publisher: "Juan Cruz Cáceres",
  description:
    "DevOverflow is a platform for developers to share their knowledge and learn from others.",
  icons: {
    icon: "assets/images/site-logo.svg",
  },
  generator: "DevOverflow NextJS 14",
  referrer: "no-referrer",
  keywords: [
    "Nextjs",
    "Next.js 14",
    "React",
    "TypeScript",
    "TailwindCSS",
    "MongoDB",
    "Vercel",
    "Clerk",
    "Vercel Analytics",
    "Vercel Speed Insights",
    "StackoverflowClone",
    "DevOverflow",
    "Juan Cruz Cáceres",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>
            {children}
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
