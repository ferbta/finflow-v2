
import { TransactionList } from "@/components/transactions/TransactionList";
import { getTransactions } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Lịch sử giao dịch</h1>
                <p className="text-muted-foreground">Xem chi tiết tất cả các giao dịch của bạn</p>
            </div>

            <Card className="border-none bg-transparent shadow-none">
                <CardContent className="px-0">
                    <TransactionList transactions={transactions} />
                </CardContent>
            </Card>
        </div>
    );
}
