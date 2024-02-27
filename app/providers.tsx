"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { LayoutProps } from "@/types";
import { ClerkProvider } from "@clerk/nextjs";

export async function Providers({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <ClerkProvider
        appearance={{
          elements: {
            formButtonPrimary: "primary-gradient",
            footerActionLink: "primary-text-gradient hover:text-primary-500",
          },
        }}
      >
        {children}
      </ClerkProvider>
    </ThemeProvider>
  );
}
