import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { MediaItem } from '@/types/builder';
import { useEffect, useState } from 'react';
import { MediaLibrary } from './media-library';

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (url: string, alt: string) => void;
};

type MediaIndexResponse = {
    media: {
        data: MediaItem[];
    };
};

export function MediaPickerModal({ open, onClose, onSelect }: Props) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setLoading(true);
        fetch('/admin/media', { headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } })
            .then((r) => r.json())
            .then((response: MediaIndexResponse) => {
                setMedia(response?.media?.data ?? []);
                setLoading(false);
            });
    }, [open]);

    const handleSelect = (item: MediaItem) => {
        onSelect(item.url, item.alt ?? '');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="flex h-[70vh] max-w-3xl flex-col p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Media library</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <MediaLibrary
                        media={media}
                        onMediaChange={setMedia}
                        onSelect={handleSelect}
                        selectable
                        loading={loading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
