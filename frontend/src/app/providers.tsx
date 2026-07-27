"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { makeQueryClient } from "@/lib/queryClient";
import { SearchProvider } from "@/context/SearchContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
        <SearchProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              className:
                "dark:!bg-zinc-900 dark:!text-zinc-100 !bg-white !text-zinc-900 !border !border-zinc-200/80 dark:!border-zinc-800 !rounded-2xl !shadow-xl !font-sans !text-xs !font-semibold !px-4.5 !py-3",
              success: {
                iconTheme: {
                  primary: "#FF385C",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </SearchProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
