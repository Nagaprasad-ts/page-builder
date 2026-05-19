import { Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

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

        if (res.ok) {
            const item = (await res.json()) as MediaItem;
            onMediaChange([item, ...media]);
        }

        // Reset input so the same file can be re-uploaded
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-medium">
                    {media.length} item{media.length !== 1 ? 's' : ''}
                </p>
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
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="aspect-square rounded-lg"
                            />
                        ))}
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-sm text-muted-foreground">
                        No media yet. Upload an image to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3">
                        {media.map((item) => (
                            <div key={item.id} className="group relative">
                                <button
                                    type="button"
                                    className={cn(
                                        'relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted transition-all',
                                        selectable &&
                                            'cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-1',
                                    )}
                                    onClick={() =>
                                        selectable && onSelect?.(item)
                                    }
                                    title={item.original_name}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.alt ?? item.original_name}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                                {!selectable && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item)}
                                        className="absolute top-1 right-1 hidden rounded bg-destructive p-1 text-destructive-foreground group-hover:flex"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
