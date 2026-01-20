'use client';

import { Category, Transaction } from '@prisma/client'
import { format } from 'date-fns'
import * as Icons from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

type TransactionWithCategory = Transaction & { category: Category }

interface TransactionListProps {
    transactions: TransactionWithCategory[]
}

import { IconWrapper } from '@/components/ui/icon-wrapper'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { deleteTransaction } from '@/app/actions'
import { toast } from 'sonner'
import { EditTransactionModal } from './EditTransactionModal'
import { Button } from '@/components/ui/button'

export function TransactionList({ transactions, categories }: { transactions: TransactionWithCategory[], categories: Category[] }) {
    const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const grouped = transactions.reduce((acc, t) => {
        const dateKey = format(t.date ? new Date(t.date) : new Date(), 'yyyy-MM-dd')
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(t)
        return acc
    }, {} as Record<string, TransactionWithCategory[]>)

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return
        try {
            await deleteTransaction(id)
            toast.success('Xóa giao dịch thành công')
        } catch (error) {
            toast.error('Không thể xóa giao dịch')
        }
    }

    const handleEdit = (t: TransactionWithCategory) => {
        setEditingTransaction(t)
        setIsEditModalOpen(true)
    }

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (transactions.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <Icons.Receipt className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p>Không tìm thấy giao dịch nào trong tháng này.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8">
            {sortedDates.map(date => (
                <div key={date} className="space-y-3 md:space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xs md:text-sm font-medium text-muted-foreground">
                            {format(new Date(date), 'dd/MM/yyyy')}
                        </h3>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        {grouped[date].map(t => {
                            const category = t.category;
                            return (
                                <div key={t.id} className="group flex items-center justify-between p-3 md:p-4 rounded-xl bg-card/40 border border-transparent hover:border-border/50 hover:bg-card transition-all">
                                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                        <IconWrapper name={category?.icon || null} color={category?.color || null} />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-xs md:text-sm truncate">{t.description || 'Không có mô tả'}</p>
                                            <p className="text-[10px] md:text-xs text-muted-foreground truncate">{category?.name || 'Danh mục chưa đặt tên'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                        <span className={cn(
                                            "font-bold text-xs md:text-sm tabular-nums",
                                            t.type === 'income' ? 'text-emerald-500' : 'text-foreground'
                                        )}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount || 0)}
                                        </span>
                                        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => handleEdit(t)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                                                onClick={() => handleDelete(t.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    categories={categories}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setEditingTransaction(null)
                    }}
                />
            )}
        </div>
    )
}
