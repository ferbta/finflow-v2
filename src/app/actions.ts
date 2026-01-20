
'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
    const count = await prisma.category.count();
    if (count === 0) {
        // Seed default categories
        const defaults = [
            { name: 'Ăn uống', type: 'expense', icon: 'Utensils', color: '#ef4444' },
            { name: 'Di chuyển', type: 'expense', icon: 'Car', color: '#3b82f6' },
            { name: 'Mua sắm', type: 'expense', icon: 'ShoppingBag', color: '#f59e0b' },
            { name: 'Nhà cửa', type: 'expense', icon: 'Home', color: '#10b981' },
            { name: 'Giải trí', type: 'expense', icon: 'Film', color: '#8b5cf6' },
            { name: 'Sức khỏe', type: 'expense', icon: 'Heart', color: '#ec4899' },
            { name: 'Lương', type: 'income', icon: 'Wallet', color: '#22c55e' },
            { name: 'Đầu tư', type: 'income', icon: 'TrendingUp', color: '#0ea5e9' },
            { name: 'Khác', type: 'expense', icon: 'MoreHorizontal', color: '#64748b' },
        ];
        await prisma.category.createMany({
            data: defaults
        });
    }

    return await prisma.category.findMany();
}

export async function addTransaction(formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const categoryId = formData.get('category') as string;
    const dateStr = formData.get('date') as string;
    const date = new Date(dateStr);

    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });
    if (!category) throw new Error('Category not found');

    await prisma.transaction.create({
        data: {
            amount,
            description,
            categoryId,
            date,
            type: category.type || 'expense'
        }
    });

    revalidatePath('/');
    return { success: true };
}

export async function getTransactions(month?: number, year?: number) {
    const now = new Date();
    const currentMonth = month !== undefined ? month : now.getMonth();
    const currentYear = year !== undefined ? year : now.getFullYear();

    const start = new Date(currentYear, currentMonth, 1);
    const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    return await prisma.transaction.findMany({
        where: {
            date: {
                gte: start,
                lte: end
            }
        },
        include: {
            category: true
        },
        orderBy: {
            date: 'desc'
        }
    });
}

export async function getStats(month?: number, year?: number) {
    const now = new Date();
    const currentMonth = month !== undefined ? month : now.getMonth();
    const currentYear = year !== undefined ? year : now.getFullYear();

    const start = new Date(currentYear, currentMonth, 1);
    const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const stats = await prisma.transaction.groupBy({
        by: ['type'],
        where: {
            date: {
                gte: start,
                lte: end
            }
        },
        _sum: {
            amount: true
        }
    });

    const income = stats.find(s => s.type === 'income')?._sum.amount || 0;
    const expense = stats.find(s => s.type === 'expense')?._sum.amount || 0;

    return {
        income,
        expense,
        balance: income - expense
    };
}

export async function getDailyStats(month?: number, year?: number) {
    const now = new Date();
    const currentMonth = month !== undefined ? month : now.getMonth();
    const currentYear = year !== undefined ? year : now.getFullYear();

    const start = new Date(currentYear, currentMonth, 1);
    const end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
        where: {
            date: {
                gte: start,
                lte: end
            }
        }
    });

    const dailyMap = new Map();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(currentYear, currentMonth, i);
        const dayStr = String(i);
        const dateKey = dayDate.toISOString().split('T')[0];
        dailyMap.set(dateKey, { date: dayStr, income: 0, expense: 0, rawDate: dateKey });
    }

    transactions.forEach(t => {
        if (!t.date) return;
        const dateKey = t.date.toISOString().split('T')[0];
        if (dailyMap.has(dateKey)) {
            const entry = dailyMap.get(dateKey);
            if (t.type === 'income') {
                entry.income += (t.amount || 0);
            } else {
                entry.expense += (t.amount || 0);
            }
        }
    });

    return Array.from(dailyMap.values());
}

export async function clearAllData() {
    await prisma.transaction.deleteMany();
    revalidatePath('/');
    return { success: true };
}

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const icon = formData.get('icon') as string;
    const color = formData.get('color') as string;

    await prisma.category.create({
        data: { name, type, icon, color }
    });

    revalidatePath('/categories');
    return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const icon = formData.get('icon') as string;
    const color = formData.get('color') as string;

    await prisma.category.update({
        where: { id },
        data: { name, type, icon, color }
    });

    revalidatePath('/categories');
    return { success: true };
}

export async function deleteCategory(id: string) {
    // Check if there are transactions using this category
    const transactions = await prisma.transaction.count({
        where: { categoryId: id }
    });

    if (transactions > 0) {
        throw new Error('Không thể xóa danh mục đang có giao dịch');
    }

    await prisma.category.delete({
        where: { id }
    });

    revalidatePath('/categories');
    return { success: true };
}

export async function deleteTransaction(id: string) {
    await prisma.transaction.delete({
        where: { id }
    });
    revalidatePath('/');
    return { success: true };
}

export async function updateTransaction(id: string, formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const categoryId = formData.get('category') as string;
    const dateStr = formData.get('date') as string;
    const date = new Date(dateStr);

    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });
    if (!category) throw new Error('Category not found');

    await prisma.transaction.update({
        where: { id },
        data: {
            amount,
            description,
            categoryId,
            date,
            type: category.type || 'expense'
        }
    });

    revalidatePath('/');
    return { success: true };
}
