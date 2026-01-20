
import { getStats, getDailyStats } from "../actions";
import { MonthlyChart } from "@/components/stats/MonthlyChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
    const [stats, dailyStats] = await Promise.all([
        getStats(),
        getDailyStats()
    ]);

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Thống kê chi tiết</h1>
                <p className="text-muted-foreground">Phân tích sâu hơn về tình hình tài chính của bạn</p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card className="glass-card border-none bg-indigo-500/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số dư</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.balance || 0)}</div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none bg-emerald-500/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{formatCurrency(stats.income || 0)}</div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none bg-rose-500/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-500">{formatCurrency(stats.expense || 0)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4">
                <MonthlyChart data={dailyStats} />
            </div>
        </div>
    );
}
