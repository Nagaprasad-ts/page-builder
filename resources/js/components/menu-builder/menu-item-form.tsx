import { useEffect, useRef, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/types/menu';

type PageRef = { id: number; title: string; slug: string };

function PageCombobox({
    pages,
    value,
    onChange,
}: {
    pages: PageRef[];
    value: number | null;
    onChange: (id: number | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = pages.find((p) => p.id === value) ?? null;

    const filtered = pages.filter(
        (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.slug.toLowerCase().includes(query.toLowerCase()),
    );

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => {
                    setOpen((v) => !v);
                    setQuery('');
                }}
                className={cn(
                    'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
                )}
            >
                <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
                    {selected ? `${selected.title}  ${selected.slug.startsWith('/') ? selected.slug : `/${selected.slug}`}` : 'Select a page…'}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
                    <div className="p-2">
                        <Input
                            autoFocus
                            placeholder="Search by name or URL…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="h-8 text-sm"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto pb-1">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-muted-foreground">No pages found.</li>
                        ) : (
                            filtered.map((p) => (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(p.id);
                                            setOpen(false);
                                            setQuery('');
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Check
                                            className={cn(
                                                'h-3.5 w-3.5 shrink-0',
                                                value === p.id ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                        <span className="font-medium">{p.title}</span>
                                        <span className="ml-1 text-muted-foreground">{p.slug.startsWith('/') ? p.slug : `/${p.slug}`}</span>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

type FormData = {
    label: string;
    type: 'page' | 'url';
    page_id: number | null;
    url: string;
    target: '_self' | '_blank';
    parent_id: number | null;
};

type Props = {
    item: MenuItem | null;
    pages: PageRef[];
    parentId?: number | null;
    onSave: (data: FormData) => void;
    onCancel: () => void;
    isSaving?: boolean;
};

export function MenuItemForm({
    item,
    pages,
    parentId = null,
    onSave,
    onCancel,
    isSaving,
}: Props) {
    const [form, setForm] = useState<FormData>({
        label: item?.label ?? '',
        type: item?.type ?? 'url',
        page_id: item?.page_id ?? null,
        url: item?.url ?? '',
        target: item?.target ?? '_self',
        parent_id: item?.parent_id ?? parentId,
    });

    const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Label */}
            <div className="space-y-1.5">
                <Label htmlFor="label">Label</Label>
                <Input
                    id="label"
                    value={form.label}
                    onChange={(e) => set('label', e.target.value)}
                    placeholder="Home"
                    required
                />
            </div>

            {/* Row 2: Link type + Open in */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="type">Link type</Label>
                    <Select
                        value={form.type}
                        onValueChange={(v) => set('type', v as 'page' | 'url')}
                    >
                        <SelectTrigger id="type" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="page">Page</SelectItem>
                            <SelectItem value="url">Custom URL</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="target">Open in</Label>
                    <Select
                        value={form.target}
                        onValueChange={(v) => set('target', v as '_self' | '_blank')}
                    >
                        <SelectTrigger id="target" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_self">Same tab</SelectItem>
                            <SelectItem value="_blank">New tab</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Row 3: URL or Page picker */}
            {form.type === 'page' ? (
                <div className="space-y-1.5">
                    <Label>Page</Label>
                    <PageCombobox
                        pages={pages}
                        value={form.page_id}
                        onChange={(id) => set('page_id', id)}
                    />
                </div>
            ) : (
                <div className="space-y-1.5">
                    <Label htmlFor="url">URL</Label>
                    <Input
                        id="url"
                        value={form.url}
                        onChange={(e) => set('url', e.target.value)}
                        placeholder="https://example.com"
                        required
                    />
                </div>
            )}

            <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm" disabled={isSaving}>
                    {item ? 'Update' : 'Add item'}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
