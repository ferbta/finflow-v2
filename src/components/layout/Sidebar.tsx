
'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, Settings, PieChart, Wallet, List, Tags } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block border-r bg-card/40 w-64 min-h-screen p-4 sticky top-0">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="bg-primary/20 p-2 rounded-full">
                        <Receipt className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        FinFlow
                    </h1>
                </div>

                <nav className="space-y-2">
                    <NavItem href="/" icon={<LayoutDashboard className="h-4 w-4" />} label="Bảng điều khiển" active={pathname === "/"} />
                    <NavItem href="/transactions" icon={<Receipt className="h-4 w-4" />} label="Giao dịch" active={pathname === "/transactions"} />
                    <NavItem href="/categories" icon={<Tags className="h-4 w-4" />} label="Danh mục" active={pathname === "/categories"} />
                    <NavItem href="/stats" icon={<PieChart className="h-4 w-4" />} label="Thống kê" active={pathname === "/stats"} />
                    <NavItem href="/settings" icon={<Settings className="h-4 w-4" />} label="Cài đặt" active={pathname === "/settings"} />
                </nav>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Ngân sách tháng</p>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-lg font-bold text-white">75%</span>
                        <span className="text-xs text-gray-400">$1,200 / $1,600</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[75%]" />
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Bottom Nav */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-border z-50 px-6">
                <nav className="flex items-center justify-between h-full max-w-lg mx-auto">
                    <MobileNavItem href="/" icon={<LayoutDashboard className="h-5 w-5" />} active={pathname === "/"} />
                    <MobileNavItem href="/transactions" icon={<Receipt className="h-5 w-5" />} active={pathname === "/transactions"} />
                    <MobileNavItem href="/categories" icon={<Tags className="h-5 w-5" />} active={pathname === "/categories"} />
                    <MobileNavItem href="/stats" icon={<PieChart className="h-5 w-5" />} active={pathname === "/stats"} />
                    <MobileNavItem href="/settings" icon={<Settings className="h-5 w-5" />} active={pathname === "/settings"} />
                </nav>
            </div>
        </>
    )
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium",
                active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-white"
            )}
        >
            {icon}
            {label}
        </Link>
    )
}

function MobileNavItem({ href, icon, active }: { href: string, icon: React.ReactNode, active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "p-2 rounded-xl transition-all",
                active ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}
        >
            {icon}
        </Link>
    )
}
