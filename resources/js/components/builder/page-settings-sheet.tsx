import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

type Props = {
    open: boolean;
    onClose: () => void;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    isExistingPage: boolean;
    onChange: (field: string, value: string) => void;
};

export function PageSettingsSheet({
    open,
    onClose,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    isExistingPage,
    onChange,
}: Props) {
    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent className="w-[400px] sm:max-w-[400px]">
                <SheetHeader>
                    <SheetTitle>Page settings</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="slug">URL slug</Label>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm text-muted-foreground">/</span>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => onChange('slug', e.target.value)}
                                placeholder="my-page"
                            />
                        </div>
                        {isExistingPage && (
                            <p className="flex items-center gap-1 text-xs text-amber-600">
                                <AlertCircle className="h-3 w-3" />
                                Changing this will break existing links to this page.
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="meta-title">Meta title</Label>
                        <Input
                            id="meta-title"
                            value={metaTitle}
                            onChange={(e) => onChange('metaTitle', e.target.value)}
                            placeholder="Page title for search engines"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="meta-description">Meta description</Label>
                        <Textarea
                            id="meta-description"
                            value={metaDescription}
                            onChange={(e) => onChange('metaDescription', e.target.value)}
                            placeholder="Short description shown in search results"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="meta-keywords">Meta keywords</Label>
                        <Input
                            id="meta-keywords"
                            value={metaKeywords}
                            onChange={(e) => onChange('metaKeywords', e.target.value)}
                            placeholder="keyword1, keyword2, keyword3"
                        />
                    </div>

                    <Button className="w-full" onClick={onClose}>
                        Done
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
