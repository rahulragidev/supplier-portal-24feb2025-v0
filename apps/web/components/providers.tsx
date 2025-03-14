"use client";

import { SWRProvider } from "@workspace/ui/providers/swr-provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange={true}
        enableColorScheme={true}
      >
        {children}
      </NextThemesProvider>
    </SWRProvider>
  );
}
