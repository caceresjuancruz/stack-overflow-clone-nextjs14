"use client";

import { useTheme } from "@/context/ThemeProvider";
import { LayoutProps } from "@/types";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

export function Providers({ children }: LayoutProps) {
  const { mode } = useTheme();
  const [clerkTheme, setClerkTheme] = useState<any | undefined>(undefined);

  useEffect(() => {
    setClerkTheme(mode === "dark" ? dark : undefined);
  }, [mode]);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: clerkTheme,
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:text-primary-500",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
