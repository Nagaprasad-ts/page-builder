import { Head } from '@inertiajs/react';
import { Check, Pencil, Search, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { MediaItem } from '@/types/builder';


type Props = {
    media: {
        data: MediaItem[];
        current_page: number;
        last_page: number;
    };
};

function csrfToken(): string {
    return document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

export default function MediaIndex({ media }: Props) {
    const [list, setList] = useState<MediaItem[]>(media.data ?? []);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editAlt, setEditAlt] = useState('');
    const [editName, setEditName] = useState('');
    const [savingId, setSavingId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filtered list based on search
    const filtered = list.filter((item) => {
        const q = search.toLowerCase();

        return (
            item.original_name?.toLowerCase().includes(q) ||
            item.alt?.toLowerCase().includes(q) ||
            item.filename?.toLowerCase().includes(q)
        );
    });

    const allFilteredSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));
    const someSelected = selected.size > 0;

    const toggleSelect = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelected((prev) => {
                const next = new Set(prev);
                filtered.forEach((i) => next.delete(i.id));

                return next;
            });
        } else {
            setSelected((prev) => {
                const next = new Set(prev);
                filtered.forEach((i) => next.add(i.id));

                return next;
            });
        }
    };

    const clearSelection = () => setSelected(new Set());

    // Upload
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);

        if (files.length === 0) {
return;
}

        setUploading(true);

        const uploaded = await Promise.all(
            files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/admin/media', {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': csrfToken(), 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
                    body: formData,
                });

                return res.ok ? ((await res.json()) as MediaItem) : null;
            }),
        );

        const successful = uploaded.filter((item): item is MediaItem => item !== null);

        if (successful.length > 0) {
            setList((prev) => [...successful.reverse(), ...prev]);
        }

        setUploading(false);

        if (fileInputRef.current) {
fileInputRef.current.value = '';
}
    };

    // Single delete
    const handleDelete = async (item: MediaItem) => {
        await fetch(`/admin/media/${item.id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrfToken(), 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        });
        setList((prev) => prev.filter((m) => m.id !== item.id));
        setSelected((prev) => {
 const n = new Set(prev); n.delete(item.id);

 return n; 
});
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.size} selected file${selected.size !== 1 ? 's' : ''}?`)) {
return;
}

        setBulkDeleting(true);
        await Promise.all(
            [...selected].map((id) =>
                fetch(`/admin/media/${id}`, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-TOKEN': csrfToken(), 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
                }),
            ),
        );
        setList((prev) => prev.filter((m) => !selected.has(m.id)));
        setSelected(new Set());
        setBulkDeleting(false);
    };

    // Edit
    const startEdit = (item: MediaItem) => {
        setEditingId(item.id);
        setEditAlt(item.alt ?? '');
        setEditName(item.original_name ?? '');
    };

    const cancelEdit = () => {
 setEditingId(null); setEditAlt(''); setEditName(''); 
};

    const saveEdit = async (item: MediaItem) => {
        setSavingId(item.id);
        const res = await fetch(`/admin/media/${item.id}`, {
            method: 'PATCH',
            headers: { 'X-CSRF-TOKEN': csrfToken(), 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ alt: editAlt, original_name: editName }),
        });

        if (res.ok) {
            const updated = (await res.json()) as MediaItem;
            setList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        }

        setSavingId(null);
        cancelEdit();
    };

    return (
        <>
            <Head title="Media Library" />

            <div className="flex h-full flex-1 flex-col gap-4 p-6">

                {/* Top bar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
                        <p className="text-sm text-muted-foreground">{list.length} file{list.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Uploading…' : 'Upload Image'}
                    </Button>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                </div>

                {/* Search + select all toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by filename or alt text…"
                            className="pl-9"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Select all */}
                    {filtered.length > 0 && (
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <Checkbox
                                checked={allFilteredSelected}
                                onCheckedChange={toggleSelectAll}
                            />
                            Select all ({filtered.length})
                        </label>
                    )}

                    {/* Bulk actions */}
                    {someSelected && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{selected.size} selected</span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                                disabled={bulkDeleting}
                            >
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                {bulkDeleting ? 'Deleting…' : `Delete (${selected.size})`}
                            </Button>
                            <Button variant="outline" size="sm" onClick={clearSelection}>
                                <X className="mr-1 h-3.5 w-3.5" />
                                Clear
                            </Button>
                        </div>
                    )}
                </div>

                {/* Upload skeleton */}
                {uploading && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        <Skeleton className="aspect-square rounded-xl" />
                    </div>
                )}

                {/* Empty state */}
                {filtered.length === 0 && !uploading && (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-sm text-muted-foreground">
                        <Upload className="mb-3 h-8 w-8 opacity-40" />
                        {search ? `No results for "${search}"` : 'No images yet. Click "Upload Image" to get started.'}
                    </div>
                )}

                {/* Grid */}
                {filtered.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {filtered.map((item) => {
                            const isSelected = selected.has(item.id);

                            return (
                                <div key={item.id} className="group flex flex-col gap-2">

                                    {/* Image tile */}
                                    <div
                                        className={cn(
                                            'relative aspect-square overflow-hidden rounded-xl border bg-muted transition-all',
                                            isSelected ? 'border-brand ring-2 ring-brand ring-offset-1' : 'border-border',
                                        )}
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.alt ?? item.original_name}
                                            className="h-full w-full object-cover"
                                        />

                                            {/* Clickable overlay for selection */}
                                        <button
                                            type="button"
                                            onClick={() => toggleSelect(item.id)}
                                            className="absolute inset-0 z-0"
                                            aria-label={isSelected ? 'Deselect' : 'Select'}
                                        />

                                        {/* Selected checkmark — top left */}
                                        <div className={cn(
                                            'absolute top-2 left-2 z-20 flex h-6 w-6 items-center justify-center rounded-full transition-all',
                                            isSelected
                                                ? 'bg-brand text-white opacity-100 scale-100'
                                                : 'border-2 border-white bg-black/30 opacity-0 group-hover:opacity-100 scale-95',
                                        )}>
                                            {isSelected && <Check className="h-3.5 w-3.5" />}
                                        </div>

                                        {/* Edit / Delete buttons — z-20, stop propagation so they don't toggle selection */}
                                        <div className="absolute bottom-2 right-2 z-20 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={(e) => {
 e.stopPropagation(); startEdit(item); 
}}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-800 shadow transition hover:bg-gray-100"
                                                title="Edit"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
 e.stopPropagation(); handleDelete(item); 
}}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow transition hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        {/* Dim overlay when selected */}
                                        <div className={cn(
                                            'pointer-events-none absolute inset-0 transition-opacity',
                                            isSelected ? 'bg-brand/20 opacity-100' : 'bg-black/0 opacity-0 group-hover:bg-black/30 group-hover:opacity-100',
                                        )} />
                                    </div>

                                    {/* Inline edit / info */}
                                    {editingId === item.id ? (
                                        <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-background p-2 shadow-sm">
                                            <div>
                                                <Label className="text-xs">File name</Label>
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="mt-0.5 h-7 text-xs"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Alt text</Label>
                                                <Input
                                                    value={editAlt}
                                                    onChange={(e) => setEditAlt(e.target.value)}
                                                    placeholder="Describe the image…"
                                                    className="mt-0.5 h-7 text-xs"
                                                />
                                            </div>
                                            <div className="flex gap-1.5">
                                                <Button
                                                    size="sm"
                                                    className="h-7 flex-1 text-xs"
                                                    onClick={() => saveEdit(item)}
                                                    disabled={savingId === item.id}
                                                >
                                                    <Check className="mr-1 h-3 w-3" />
                                                    {savingId === item.id ? 'Saving…' : 'Save'}
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-7 px-2" onClick={cancelEdit}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-0.5">
                                            <p className="truncate text-xs font-medium text-gray-800" title={item.original_name}>
                                                {item.original_name}
                                            </p>
                                            <p className={cn(
                                                'truncate text-xs',
                                                item.alt ? 'text-muted-foreground' : 'italic text-muted-foreground/50',
                                            )}>
                                                {item.alt || 'No alt text'}
                                            </p>
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </>
    );
}

MediaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Media', href: '/admin/media' },
    ],
};
