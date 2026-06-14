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
import type { Page } from '@/types/builder';

type Props = {
    open: boolean;
    onClose: () => void;
    slug: string;
    parentId: number | null;
    pages?: Page[];
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    isExistingPage: boolean;
    customHeader: boolean;
    customFooter: boolean;
    onChange: (field: string, value: string) => void;
    onParentIdChange: (value: number | null) => void;
    onCustomHeaderChange: (value: boolean) => void;
    onCustomFooterChange: (value: boolean) => void;
};

export function PageSettingsSheet({
    open,
    onClose,
    slug,
    parentId,
    pages = [],
    metaTitle,
    metaDescription,
    metaKeywords,
    isExistingPage,
    customHeader,
    customFooter,
    onChange,
    onParentIdChange,
    onCustomHeaderChange,
    onCustomFooterChange,
}: Props) {
    const slugError = slug !== '/' && slug.startsWith('/')
        ? 'Remove the leading slash — the / prefix is added automatically.'
        : null;

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
                        {/* Parent Page Selection */}
                        {slug !== '404' && slug !== '/' && (
                            <div className="space-y-2">
                                <Label htmlFor="parent-id" className="text-sm font-medium">
                                    Parent page
                                </Label>
                                <div className="relative">
                                    <select
                                        id="parent-id"
                                        value={parentId ?? ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            onParentIdChange(val ? parseInt(val, 10) : null);
                                        }}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 cursor-pointer"
                                    >
                                        <option value="">None (Root Page)</option>
                                        {pages.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.title} (/{p.path})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Selecting a parent will nest this page's URL (e.g. <code className="rounded bg-muted px-1">/parent/child</code>).
                                </p>
                            </div>
                        )}

                        {/* URL Slug */}
                        {slug !== '404' && (
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-sm font-medium">
                                    URL slug
                                </Label>
                                {slug === '/' ? (
                                    <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                        <input
                                            id="slug"
                                            value="/"
                                            onChange={(e) => onChange('slug', e.target.value)}
                                            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                        {parentId ? (
                                            <span className="select-none border-r border-input px-3 py-2 text-sm text-muted-foreground bg-muted/30 max-w-[200px] truncate">
                                                /{pages.find((p) => p.id === parentId)?.path}/
                                            </span>
                                        ) : (
                                            <span className="select-none border-r border-input px-3 py-2 text-sm text-muted-foreground">
                                                /
                                            </span>
                                        )}
                                        <input
                                            id="slug"
                                            value={slug}
                                            onChange={(e) => onChange('slug', e.target.value)}
                                            placeholder="my-page"
                                            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Use <code className="rounded bg-muted px-1">/</code> to set this page as the homepage.
                                </p>
                                {slugError && (
                                    <p className="text-xs font-medium text-destructive">{slugError}</p>
                                )}
                                {isExistingPage && slug !== '/' && (
                                    <p className="flex items-center gap-1.5 text-xs text-amber-600">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        Changing this will break existing links to this page.
                                    </p>
                                )}
                            </div>
                        )}                        {/* Layout overrides */}
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
