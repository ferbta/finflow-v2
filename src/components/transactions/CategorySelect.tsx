'use client';

import { useState, useRef, useEffect } from 'react';
import { Category } from '@prisma/client';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface CategorySelectProps {
    categories: Category[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function CategorySelect({ categories, value, onChange, placeholder = "Chọn danh mục" }: CategorySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedCategory = categories.find(cat => cat.id === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background cursor-pointer hover:bg-accent/50 transition-all active:scale-[0.98]",
                    isOpen && "ring-2 ring-ring ring-offset-2 border-primary/50"
                )}
            >
                <div className="flex items-center gap-3">
                    {selectedCategory ? (
                        <>
                            <IconWrapper
                                name={selectedCategory.icon}
                                color={selectedCategory.color}
                                className="p-1.5"
                                iconClassName="h-4 w-4"
                            />
                            <span className="font-medium">{selectedCategory.name}</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto p-1 scrollbar-hide">
                        {categories.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                Không có danh mục nào
                            </div>
                        ) : (
                            categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => {
                                        onChange(cat.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer transition-colors",
                                        value === cat.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
                                    )}
                                >
                                    <IconWrapper
                                        name={cat.icon}
                                        color={cat.color}
                                        className="p-1.5"
                                        iconClassName="h-4 w-4"
                                    />
                                    <span className="font-medium">{cat.name}</span>
                                    {value === cat.id && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
