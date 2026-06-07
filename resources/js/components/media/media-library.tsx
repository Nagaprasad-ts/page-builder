import { Search, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { MediaItem } from '@/types/builder';

type Props = {
    media: MediaItem[];
    onMediaChange: (media: MediaItem[]) => void;
    onSelect?: (item: MediaItem) => void;
    selectable?: boolean;
    loading?: boolean;
};

function csrfToken(): string {
    return (
        document.head
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

export function MediaLibrary({
    media,
    onMediaChange,
    onSelect,
    selectable = false,
    loading = false,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState('');

    const filtered = media.filter((item) => {
        const q = search.toLowerCase();
        return (
            item.original_name?.toLowerCase().includes(q) ||
            item.alt?.toLowerCase().includes(q) ||
            item.filename?.toLowerCase().includes(q)
        );
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const uploaded = await Promise.all(
            files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/admin/media', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                        Accept: 'application/json',
                    },
                    body: formData,
                });
                return res.ok ? ((await res.json()) as MediaItem) : null;
            }),
        );

        const successful = uploaded.filter((item): item is MediaItem => item !== null);
        if (successful.length > 0) {
            onMediaChange([...successful.reverse(), ...media]);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (item: MediaItem) => {
        await fetch(`/admin/media/${item.id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        });
        onMediaChange(media.filter((m) => m.id !== item.id));
    };

    return (
        <div className="flex h-full flex-col">

            {/* Toolbar */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <p className="shrink-0 text-sm font-medium text-muted-foreground">
                    {media.length} item{media.length !== 1 ? 's' : ''}
                </p>

                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by filename or alt text…"
                        className="h-8 pl-9 text-sm"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Upload
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <Skeleton className="aspect-square rounded-lg" />
                                <Skeleton className="h-3 w-3/4 rounded" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-sm text-muted-foreground">
                        {search ? `No results for "${search}"` : 'No media yet. Upload an image to get started.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                        {filtered.map((item) => (
                            <div key={item.id} className="group flex flex-col gap-1.5">
                                <button
                                    type="button"
                                    className={cn(
                                        'relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted transition-all',
                                        selectable &&
                                            'cursor-pointer hover:ring-2 hover:ring-brand hover:ring-offset-1',
                                    )}
                                    onClick={() => selectable && onSelect?.(item)}
                                    title={item.original_name}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.alt ?? item.original_name}
                                        className="h-full w-full object-cover"
                                    />
                                    {!selectable && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                                            className="absolute top-1 right-1 hidden rounded-full bg-white p-1 text-red-600 shadow group-hover:flex hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    )}
                                </button>

                                {/* Filename */}
                                <p
                                    className="truncate px-0.5 text-xs text-muted-foreground"
                                    title={item.original_name}
                                >
                                    {item.original_name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
