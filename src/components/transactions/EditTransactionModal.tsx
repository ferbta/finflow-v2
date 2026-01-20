'use client';

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CategorySelect } from './CategorySelect'
import { updateTransaction } from '@/app/actions'
import { toast } from 'sonner'
import { Category, Transaction } from '@prisma/client'
import { numberToVietnameseWords } from '@/lib/utils'

interface EditTransactionModalProps {
    transaction: Transaction
    categories: Category[]
    isOpen: boolean
    onClose: () => void
}

export function EditTransactionModal({ transaction, categories, isOpen, onClose }: EditTransactionModalProps) {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState<string>('')
    const [amountInWords, setAmountInWords] = useState<string>('')
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(transaction.categoryId || '')

    useEffect(() => {
        if (transaction.amount) {
            const initialAmount = transaction.amount.toString();
            setAmount(formatVND(initialAmount));
            setSelectedCategoryId(transaction.categoryId || '');
        }
    }, [transaction]);

    const formatVND = (value: string) => {
        const digits = value.replace(/\D/g, '');
        return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseVND = (value: string) => {
        return value.replace(/\./g, '');
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/\D/g, '');
        setAmount(formatVND(numericValue));
    };

    useEffect(() => {
        const num = parseFloat(parseVND(amount))
        if (!isNaN(num) && num > 0) {
            setAmountInWords(numberToVietnameseWords(num))
        } else {
            setAmountInWords('')
        }
    }, [amount])

    const transactionType = transaction.type || 'expense';
    const filteredCategories = categories.filter(cat => cat.type === transactionType);

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const numericAmount = parseVND(amount);
            formData.set('amount', numericAmount);

            await updateTransaction(transaction.id, formData)
            toast.success("Cập nhật giao dịch thành công")
            onClose()
        } catch (error) {
            console.error(error)
            toast.error("Không thể cập nhật giao dịch. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Sửa giao dịch"
        >
            <form action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Số tiền</label>
                    <Input
                        name="amount"
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={amount}
                        onChange={handleAmountChange}
                        required
                        className="text-lg font-semibold"
                    />
                    {amountInWords && (
                        <p className="text-xs text-muted-foreground italic animate-in fade-in slide-in-from-top-1">
                            {amountInWords}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Mô tả</label>
                    <Input
                        name="description"
                        defaultValue={transaction.description || ''}
                        placeholder="Bạn đã chi/nhận tiền cho việc gì?"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Danh mục</label>
                    <CategorySelect
                        categories={filteredCategories}
                        value={selectedCategoryId}
                        onChange={setSelectedCategoryId}
                    />
                    <input type="hidden" name="category" value={selectedCategoryId} required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Ngày</label>
                    <Input
                        name="date"
                        type="date"
                        defaultValue={transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : ''}
                        required
                        className="appearance-none cursor-pointer"
                        onClick={(e) => e.currentTarget.showPicker()}
                        onKeyDown={(e) => e.preventDefault()}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
                    <Button type="submit" disabled={loading} className={transactionType === 'income' ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
