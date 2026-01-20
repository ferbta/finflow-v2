
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinFlow - Expense Tracker",
  description: "Manage your daily expenses and funds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background flex")} suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 p-4 pb-24 lg:p-8 overflow-y-auto h-screen">
          <div className="mx-auto max-w-5xl">
            <Toaster position="top-right" richColors />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
