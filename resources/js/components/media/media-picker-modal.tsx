import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { MediaItem } from '@/types/builder';
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
    const [fetched, setFetched] = useState(false);

    // Derive loading: modal is open but we haven't fetched yet
    const loading = open && !fetched;

    useEffect(() => {
        if (!open) {
            return;
        }

        fetch('/admin/media', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        })
            .then((r) => r.json())
            .then((response: MediaIndexResponse) => {
                setMedia(response?.media?.data ?? []);
                setFetched(true);
            });
    }, [open]);

    const handleClose = () => {
        setFetched(false);
        onClose();
    };

    const handleSelect = (item: MediaItem) => {
        onSelect(item.url, item.alt ?? '');
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="flex h-[90vh] w-[95vw] max-w-[95vw] sm:max-w-[95vw] flex-col p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Media library</DialogTitle>
                    <DialogDescription className="sr-only">
                        Browse and select an image from your media library.
                    </DialogDescription>
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
