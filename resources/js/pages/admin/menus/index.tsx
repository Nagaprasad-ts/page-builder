import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
import type { Menu } from '@/types/menu';

type MenuWithCount = Menu & { all_items_count: number };

type Props = {
    menus: MenuWithCount[];
};

const locationLabels: Record<string, string> = {
    desktop_nav: 'Desktop nav',
    mobile_nav: 'Mobile nav',
    footer: 'Footer',
};

export default function MenusIndex({ menus }: Props) {
    const [deletingMenu, setDeletingMenu] = useState<MenuWithCount | null>(
        null,
    );
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!deletingMenu) {
            return;
        }

        destroy(`/admin/menus/${deletingMenu.id}`, {
            onSuccess: () => setDeletingMenu(null),
        });
    };

    return (
        <>
            <Head title="Menus" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Menus</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage navigation menus for desktop, mobile, and
                            footer.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/menus/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New menu
                        </Link>
                    </Button>
                </div>

                {menus.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
                        <p className="text-sm text-muted-foreground">
                            No menus yet.
                        </p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link href="/admin/menus/create">Create menu</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Items
                                    </th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {menus.map((menu) => (
                                    <tr
                                        key={menu.id}
                                        className="group bg-background hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {menu.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">
                                                {locationLabels[
                                                    menu.location
                                                ] ?? menu.location}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {menu.all_items_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Link
                                                        href={`/admin/menus/${menu.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        setDeletingMenu(menu)
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

            <Dialog
                open={!!deletingMenu}
                onOpenChange={(v) => !v && setDeletingMenu(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete menu?</DialogTitle>
                        <DialogDescription>
                            "{deletingMenu?.name}" and all its items will be
                            permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingMenu(null)}
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
