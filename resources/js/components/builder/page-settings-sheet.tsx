import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    open: boolean;
    onClose: () => void;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    isExistingPage: boolean;
    customHeader: boolean;
    customFooter: boolean;
    onChange: (field: string, value: string) => void;
    onCustomHeaderChange: (value: boolean) => void;
    onCustomFooterChange: (value: boolean) => void;
};

export function PageSettingsSheet({
    open,
    onClose,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    isExistingPage,
    customHeader,
    customFooter,
    onChange,
    onCustomHeaderChange,
    onCustomFooterChange,
}: Props) {
    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent className="flex w-full flex-col sm:max-w-125 px-3">
                <SheetHeader className="border-b border-border pb-4">
                    <SheetTitle>Page settings</SheetTitle>
                    <SheetDescription>
                        Configure the URL slug and SEO metadata for this page.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                    <div className="space-y-6 px-1">
                        {/* URL Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-sm font-medium">
                                URL slug
                            </Label>
                            <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                <span className="select-none border-r border-input px-3 py-2 text-sm text-muted-foreground">
                                    /
                                </span>
                                <input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => onChange('slug', e.target.value)}
                                    placeholder="my-page"
                                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                                />
                            </div>
                            {isExistingPage && (
                                <p className="flex items-center gap-1.5 text-xs text-amber-600">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    Changing this will break existing links to this page.
                                </p>
                            )}
                        </div>

                        {/* Layout overrides */}
                        <div className="border-t border-border pt-2">
                            <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Layout
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="custom-header"
                                        checked={customHeader}
                                        onCheckedChange={(checked) =>
                                            onCustomHeaderChange(checked === true)
                                        }
                                        className="mt-0.5"
                                    />
                                    <div>
                                        <Label
                                            htmlFor="custom-header"
                                            className="cursor-pointer text-sm font-medium"
                                        >
                                            Custom header
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Use this page's header sections instead of the global
                                            header.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="custom-footer"
                                        checked={customFooter}
                                        onCheckedChange={(checked) =>
                                            onCustomFooterChange(checked === true)
                                        }
                                        className="mt-0.5"
                                    />
                                    <div>
                                        <Label
                                            htmlFor="custom-footer"
                                            className="cursor-pointer text-sm font-medium"
                                        >
                                            Custom footer
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Use this page's footer sections instead of the global
                                            footer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border pt-2">
                            <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                SEO
                            </p>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="meta-title" className="text-sm font-medium">
                                        Meta title
                                    </Label>
                                    <Input
                                        id="meta-title"
                                        value={metaTitle}
                                        onChange={(e) => onChange('metaTitle', e.target.value)}
                                        placeholder="Page title for search engines"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: 50–60 characters.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta-description" className="text-sm font-medium">
                                        Meta description
                                    </Label>
                                    <Textarea
                                        id="meta-description"
                                        value={metaDescription}
                                        onChange={(e) => onChange('metaDescription', e.target.value)}
                                        placeholder="Short description shown in search results"
                                        rows={3}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: 120–160 characters.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta-keywords" className="text-sm font-medium">
                                        Meta keywords
                                    </Label>
                                    <Input
                                        id="meta-keywords"
                                        value={metaKeywords}
                                        onChange={(e) => onChange('metaKeywords', e.target.value)}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Separate keywords with commas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border pt-4">
                    <Button className="w-full" onClick={onClose}>
                        Done
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
