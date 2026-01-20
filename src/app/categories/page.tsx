
'use client';

import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../actions';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import * as Icons from "lucide-react";
import { Category } from "@prisma/client";
import { IconWrapper } from "@/components/ui/icon-wrapper";

// List of common icons to choose from
const ICON_LIST = [
    'Utensils', 'ShoppingBag', 'Car', 'Home', 'Gamepad2', 'Film', 'Music', 'Heart',
    'Coffee', 'Pizza', 'Beer', 'Laptop', 'Smartphone', 'Gift', 'Plane', 'Bus',
    'Train', 'Bike', 'Dumbbell', 'Stethoscope', 'Pill', 'GraduationCap', 'Book',
    'Briefcase', 'Wallet', 'TrendingUp', 'TrendingDown', 'PiggyBank', 'Coins',
    'CreditCard', 'Banknote', 'Zap', 'Droplets', 'Flame', 'Wifi', 'MoreHorizontal'
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const cats = await getCategories();
        setCategories(cats);
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            await loadCategories();
            toast.success(editingCategory ? "Cập nhật danh mục thành công" : "Thêm danh mục thành công");
            setIsModalOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
        try {
            await deleteCategory(id);
            await loadCategories();
            toast.success("Xóa danh mục thành công");
        } catch (error: any) {
            toast.error(error.message || "Không thể xóa danh mục");
        }
    }

    const filteredCategories = categories.filter(cat =>
        (cat.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h1>
                    <p className="text-muted-foreground">Thêm, sửa hoặc xóa các danh mục thu chi</p>
                </div>
                <Button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} className="gap-2">
                    <Plus className="h-4 w-4" /> Thêm danh mục
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm danh mục..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map((cat) => (
                    <Card key={cat.id} className="glass-card hover:bg-card/60 transition-colors border-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                                <IconWrapper name={cat.icon} color={cat.color} className="p-2" iconClassName="h-5 w-5" />
                                <div>
                                    <CardTitle className="text-base font-semibold">{cat.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        {cat.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10" onClick={() => handleDelete(cat.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
            >
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tên danh mục</label>
                        <Input name="name" defaultValue={editingCategory?.name || ''} placeholder="Tên danh mục..." required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Loại</label>
                        <Select name="type" defaultValue={editingCategory?.type || 'expense'} required>
                            <option value="expense">Chi tiêu</option>
                            <option value="income">Thu nhập</option>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Biểu tượng</label>
                        <div className="grid grid-cols-6 gap-2 p-2 max-h-40 overflow-y-auto rounded-md border bg-background/50">
                            {ICON_LIST.map((iconName) => (
                                <label key={iconName} className="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors has-[:checked]:bg-primary/20 has-[:checked]:ring-1 has-[:checked]:ring-primary">
                                    <input
                                        type="radio"
                                        name="icon"
                                        value={iconName}
                                        className="sr-only"
                                        defaultChecked={editingCategory?.icon === iconName}
                                        required
                                    />
                                    {/* @ts-ignore */}
                                    {(() => {
                                        const IconsAny = Icons as any;
                                        const IconComp = IconsAny[iconName] || IconsAny.Circle;
                                        return <IconComp className="h-5 w-5" />;
                                    })()}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Màu sắc</label>
                        <Input
                            name="color"
                            type="color"
                            defaultValue={editingCategory?.color || '#3b82f6'}
                            className="h-10 p-1"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : (editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
