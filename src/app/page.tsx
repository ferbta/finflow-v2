
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { TransactionList } from "@/components/transactions/TransactionList";
import { MonthlyChart } from "@/components/stats/MonthlyChart";
import { getCategories, getTransactions, getStats, getDailyStats } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [categories, transactions, stats, dailyStats] = await Promise.all([
    getCategories(),
    getTransactions(),
    getStats(),
    getDailyStats()
  ]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
          <p className="text-sm md:text-base text-muted-foreground">Tổng quan hoạt động tài chính của bạn</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AddTransactionModal
            categories={categories}
            defaultType="income"
            trigger={
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-4 w-4" /> Thêm thu nhập
              </Button>
            }
          />
          <AddTransactionModal
            categories={categories}
            defaultType="expense"
            trigger={
              <Button className="gap-2 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20">
                <TrendingDown className="h-4 w-4" /> Thêm chi tiêu
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card border-none bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dư</CardTitle>
            <Wallet className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{formatCurrency(stats.balance || 0)}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Số dư hiện có
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card border-none bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thu nhập</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-emerald-500">+{formatCurrency(stats.income || 0)}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Tháng này
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card border-none bg-gradient-to-br from-rose-500/10 to-rose-500/5 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi tiêu</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-rose-500">-{formatCurrency(stats.expense || 0)}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-4">
          <MonthlyChart data={dailyStats} />
        </div>
        <div className="col-span-4 lg:col-span-3">
          <Card className="h-full border-none bg-transparent shadow-none">
            <CardHeader className="pl-0">
              <CardTitle>Giao dịch gần đây</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <TransactionList transactions={transactions} categories={categories} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
