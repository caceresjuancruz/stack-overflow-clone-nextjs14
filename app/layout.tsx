import { images } from "@/constants/images";
import { ThemeProvider } from "@/context/ThemeProvider";
import { LayoutProps } from "@/types";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/prism.css";
import "./globals.css";
import { Providers } from "./providers";

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
    icon: images.logo,
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

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} custom-scrollbar`}>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
