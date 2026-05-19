import { Head, Link, useForm } from '@inertiajs/react';
import { FilePlus, Pencil } from 'lucide-react';
import { useState } from 'react';
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
import type { Page } from '@/types/builder';

type PageWithCreator = Page & { creator: { name: string } };

type Props = {
    pages: PageWithCreator[];
};

export default function PagesIndex({ pages }: Props) {
    const [deletingPage, setDeletingPage] = useState<PageWithCreator | null>(
        null,
    );
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!deletingPage) {
            return;
        }

        destroy(`/admin/pages/${deletingPage.id}`, {
            onSuccess: () => setDeletingPage(null),
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
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Slug
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Updated
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Author
                                    </th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pages.map((page) => (
                                    <tr
                                        key={page.id}
                                        className="group bg-background hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {page.title}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            /{page.slug}
                                        </td>
                                        <td className="px-4 py-3">
                                            {page.status === 'published' ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Published
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Draft
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(
                                                page.updated_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {page.creator?.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Link
                                                        href={`/admin/pages/${page.id}/edit`}
                                                    >
                                                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        setDeletingPage(page)
                                                    }
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

            {/* Delete confirmation dialog */}
            <Dialog
                open={!!deletingPage}
                onOpenChange={(v) => !v && setDeletingPage(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete page?</DialogTitle>
                        <DialogDescription>
                            "{deletingPage?.title}" will be permanently deleted.
                            This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingPage(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
