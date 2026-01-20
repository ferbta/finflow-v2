
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearAllData } from "../actions";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleClearData = async () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác.')) {
            setLoading(true);
            try {
                await clearAllData();
                toast.success('Đã xóa toàn bộ dữ liệu thành công.');
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa dữ liệu.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
                <p className="text-muted-foreground">Quản lý ứng dụng và dữ liệu của bạn</p>
            </div>

            <Card className="border-rose-500/20 bg-rose-500/5">
                <CardHeader>
                    <CardTitle className="text-rose-500 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Vùng nguy hiểm
                    </CardTitle>
                    <CardDescription>
                        Các hành động tại đây có thể gây mất dữ liệu vĩnh viễn.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-background/50 border border-rose-500/10">
                        <div>
                            <p className="font-semibold">Xóa toàn bộ dữ liệu</p>
                            <p className="text-sm text-muted-foreground">Xóa tất cả các giao dịch đã lưu trong hệ thống.</p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={handleClearData}
                            disabled={loading}
                            className="shrink-0"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {loading ? 'Đang xóa...' : 'Xóa tất cả'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
