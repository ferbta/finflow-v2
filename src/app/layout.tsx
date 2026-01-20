
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
      <body className={cn(inter.className, "min-h-screen bg-background flex relative overflow-hidden")} suppressHydrationWarning>
        {/* Background Decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden mesh-gradient pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] animate-blob" />
          <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-indigo-500/10 blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] animate-blob animation-delay-4000" />
        </div>

        <Sidebar />
        <main className="flex-1 p-4 pb-24 lg:p-8 overflow-y-auto h-screen relative z-10">
          <div className="mx-auto max-w-5xl">
            <Toaster position="top-right" richColors />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
