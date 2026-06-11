import { Head, Link, useForm } from '@inertiajs/react';
import { Copy, FilePlus, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Page } from '@/types/builder';

type PageWithCreator = Page & { creator: { name: string } };

type Props = {
    pages: PageWithCreator[];
};

export default function PagesIndex({ pages }: Props) {
    const [deletingPage, setDeletingPage] = useState<PageWithCreator | null>(null);
    const [duplicatingPage, setDuplicatingPage] = useState<PageWithCreator | null>(null);

    const { delete: destroy, processing: deleting } = useForm();

    const duplicateForm = useForm({ title: '', slug: '' });

    // Pre-fill title/slug when a page is selected for duplication
    useEffect(() => {
        if (duplicatingPage) {
            duplicateForm.setData({
                title: `${duplicatingPage.title} (Copy)`,
                slug: `${duplicatingPage.slug}-copy`,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duplicatingPage]);

    const handleDelete = () => {
        if (!deletingPage) return;
        destroy(`/admin/pages/${deletingPage.id}`, {
            onSuccess: () => setDeletingPage(null),
        });
    };

    const handleDuplicate = () => {
        if (!duplicatingPage) return;
        duplicateForm.post(`/admin/pages/${duplicatingPage.id}/duplicate`, {
            onSuccess: () => {
                setDuplicatingPage(null);
                duplicateForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Pages" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Pages</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Build and manage your site pages.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/pages/create">
                            <FilePlus className="mr-2 h-4 w-4" />
                            New page
                        </Link>
                    </Button>
                </div>

                {pages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
                        <p className="text-sm text-muted-foreground">
                            No pages yet. Create your first page.
                        </p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link href="/admin/pages/create">Create page</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Updated</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Author</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pages.map((page) => (
                                    <tr key={page.id} className="group bg-background hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium">{page.title}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {page.slug.startsWith('/') ? page.slug : `/${page.slug}`}
                                        </td>
                                        <td className="px-4 py-3">
                                            {page.status === 'published' ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Published</Badge>
                                            ) : (
                                                <Badge variant="secondary">Draft</Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(page.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{page.creator?.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button asChild size="sm" variant="ghost">
                                                    <Link href={`/admin/pages/${page.id}/edit`}>
                                                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDuplicatingPage(page)}
                                                >
                                                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                                                    Duplicate
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeletingPage(page)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Duplicate dialog */}
            <Dialog open={!!duplicatingPage} onOpenChange={(v) => !v && setDuplicatingPage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Duplicate page</DialogTitle>
                        <DialogDescription>
                            Creating a copy of "{duplicatingPage?.title}". Set a new name and URL for the duplicate.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="dup-title">Page name</Label>
                            <Input
                                id="dup-title"
                                value={duplicateForm.data.title}
                                onChange={(e) => duplicateForm.setData('title', e.target.value)}
                                placeholder="My Page (Copy)"
                            />
                            {duplicateForm.errors.title && (
                                <p className="text-xs text-destructive">{duplicateForm.errors.title}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dup-slug">URL slug</Label>
                            <div className="flex items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                <span className="mr-1 text-muted-foreground">/</span>
                                <input
                                    id="dup-slug"
                                    className="flex-1 bg-transparent outline-none"
                                    value={duplicateForm.data.slug}
                                    onChange={(e) => duplicateForm.setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    placeholder="my-page-copy"
                                />
                            </div>
                            {duplicateForm.errors.slug && (
                                <p className="text-xs text-destructive">{duplicateForm.errors.slug}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDuplicatingPage(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDuplicate} disabled={duplicateForm.processing}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deletingPage} onOpenChange={(v) => !v && setDeletingPage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete page?</DialogTitle>
                        <DialogDescription>
                            "{deletingPage?.title}" will be permanently deleted. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingPage(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
