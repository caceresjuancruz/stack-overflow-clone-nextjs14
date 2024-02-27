"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { LayoutProps } from "@/types";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

export function Providers({ children }: LayoutProps) {
  return (
    <Suspense>
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
    </Suspense>
  );
}
