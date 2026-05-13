import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MenuItem } from '@/types/menu';
import { useState } from 'react';

type PageRef = { id: number; title: string; slug: string };

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

export function MenuItemForm({ item, pages, parentId = null, onSave, onCancel, isSaving }: Props) {
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
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
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

            <div className="space-y-1.5">
                <Label htmlFor="type">Link type</Label>
                <Select value={form.type} onValueChange={(v) => set('type', v as 'page' | 'url')}>
                    <SelectTrigger id="type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="url">Custom URL</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {form.type === 'page' ? (
                <div className="space-y-1.5">
                    <Label htmlFor="page">Page</Label>
                    <Select
                        value={form.page_id ? String(form.page_id) : ''}
                        onValueChange={(v) => set('page_id', Number(v))}
                    >
                        <SelectTrigger id="page">
                            <SelectValue placeholder="Select a page…" />
                        </SelectTrigger>
                        <SelectContent>
                            {pages.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.title} <span className="text-muted-foreground">/{p.slug}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

            <div className="space-y-1.5">
                <Label htmlFor="target">Open in</Label>
                <Select value={form.target} onValueChange={(v) => set('target', v as '_self' | '_blank')}>
                    <SelectTrigger id="target">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="_self">Same tab</SelectItem>
                        <SelectItem value="_blank">New tab</SelectItem>
                    </SelectContent>
                </Select>
            </div>

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
