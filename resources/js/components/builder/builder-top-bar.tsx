import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Loader2, Settings, Globe, FileEdit } from 'lucide-react';

type Props = {
    title: string;
    status: 'draft' | 'published';
    onTitleChange: (title: string) => void;
    onOpenSettings: () => void;
    onSave: () => void;
    onPublish: () => void;
    onUnpublish: () => void;
    canPublish: boolean;
    isSaving: boolean;
};

export function BuilderTopBar({
    title,
    status,
    onTitleChange,
    onOpenSettings,
    onSave,
    onPublish,
    onUnpublish,
    canPublish,
    isSaving,
}: Props) {
    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
            <Link
                href="/admin/pages"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Pages
            </Link>

            <div className="mx-1 h-5 w-px bg-border" />

            <Input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Page title"
                className="h-8 max-w-xs border-transparent bg-transparent text-sm font-medium shadow-none hover:border-input focus-visible:border-input focus-visible:ring-0"
            />

            {status === 'published' && (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    <Globe className="h-3 w-3" />
                    Published
                </span>
            )}
            {status === 'draft' && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <FileEdit className="h-3 w-3" />
                    Draft
                </span>
            )}

            <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onOpenSettings}>
                    <Settings className="mr-1.5 h-4 w-4" />
                    Settings
                </Button>

                <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                    Save draft
                </Button>

                {canPublish && (
                    <>
                        {status === 'draft' ? (
                            <Button size="sm" onClick={onPublish} disabled={isSaving}>
                                Publish
                            </Button>
                        ) : (
                            <Button variant="secondary" size="sm" onClick={onUnpublish} disabled={isSaving}>
                                Unpublish
                            </Button>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}
