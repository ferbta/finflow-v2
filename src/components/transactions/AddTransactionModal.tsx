
'use client';

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CategorySelect } from './CategorySelect'
import { addTransaction } from '@/app/actions'
import { toast } from 'sonner'
import { Category } from '@prisma/client'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import * as Icons from 'lucide-react'
import { numberToVietnameseWords } from '@/lib/utils'

interface AddTransactionModalProps {
    categories: Category[]
    defaultType?: 'income' | 'expense'
    trigger?: React.ReactNode
}

export function AddTransactionModal({ categories, defaultType = 'expense', trigger }: AddTransactionModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState<string>('')
    const [amountInWords, setAmountInWords] = useState<string>('')
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

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

    const filteredCategories = categories.filter(cat => cat.type === defaultType)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            // Parse amount before sending to server
            const numericAmount = parseVND(amount);
            formData.set('amount', numericAmount);

            await addTransaction(formData)
            toast.success("Thêm giao dịch thành công")
            setIsOpen(false)
            setAmount('')
            setSelectedCategoryId('')
        } catch (error) {
            console.error(error)
            toast.error("Không thể thêm giao dịch. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    const defaultTrigger = (
        <Button onClick={() => setIsOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4" /> Thêm giao dịch
        </Button>
    )

    return (
        <>
            {trigger ? (
                <div onClick={() => setIsOpen(true)}>{trigger}</div>
            ) : defaultTrigger}

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={defaultType === 'income' ? "Thêm khoản thu" : "Thêm khoản chi"}
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
                        <Input name="description" placeholder="Bạn đã chi/nhận tiền cho việc gì?" required />
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
                            defaultValue={new Date().toISOString().split('T')[0]}
                            required
                            className="appearance-none cursor-pointer"
                            onClick={(e) => e.currentTarget.showPicker()}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button>
                        <Button type="submit" disabled={loading} className={defaultType === 'income' ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                            {loading ? 'Đang thêm...' : 'Thêm giao dịch'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
