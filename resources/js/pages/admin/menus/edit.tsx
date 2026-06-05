import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { MenuItemForm } from '@/components/menu-builder/menu-item-form';
import { MenuItemTree } from '@/components/menu-builder/menu-item-tree';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Menu, MenuItem } from '@/types/menu';

type PageRef = { id: number; title: string; slug: string };

type Props = {
    menu: Menu;
    pages: PageRef[];
};

type FormData = {
    label: string;
    type: 'page' | 'url';
    page_id: number | null;
    url: string;
    target: '_self' | '_blank';
    parent_id: number | null;
};

function csrfToken(): string {
    return (
        document.head
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

const jsonHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-CSRF-TOKEN': '',
    'X-Requested-With': 'XMLHttpRequest',
};

function apiFetch(
    method: string,
    url: string,
    data?: unknown,
): Promise<unknown> {
    return fetch(url, {
        method,
        headers: { ...jsonHeaders, 'X-CSRF-TOKEN': csrfToken() },
        body: data !== undefined ? JSON.stringify(data) : undefined,
    }).then((r) => r.json());
}

export default function EditMenu({ menu: initialMenu, pages }: Props) {
    const [items, setItems] = useState<MenuItem[]>(initialMenu.items);
    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [parentId, setParentId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const openAddForm = (parent: number | null = null) => {
        setEditingItem(null);
        setParentId(parent);
        setFormOpen(true);
    };

    const openEditForm = (item: MenuItem) => {
        setEditingItem(item);
        setParentId(item.parent_id);
        setFormOpen(true);
    };

    const handleSave = async (data: FormData) => {
        setSaving(true);

        try {
            if (editingItem) {
                await apiFetch(
                    'PUT',
                    `/admin/menus/${initialMenu.id}/items/${editingItem.id}`,
                    data,
                );
            } else {
                await apiFetch(
                    'POST',
                    `/admin/menus/${initialMenu.id}/items`,
                    data,
                );
            }

            refreshItems();
        } finally {
            setSaving(false);
            setFormOpen(false);
        }
    };

    const handleReorder = async (reordered: MenuItem[]) => {
        // Optimistic update
        setItems(reordered);

        await apiFetch(
            'POST',
            `/admin/menus/${initialMenu.id}/items/reorder`,
            {
                items: reordered.map((item, index) => ({
                    id: item.id,
                    sort_order: index,
                    parent_id: item.parent_id,
                })),
            },
        );
    };

    const handleDelete = async (item: MenuItem) => {
        await apiFetch(
            'DELETE',
            `/admin/menus/${initialMenu.id}/items/${item.id}`,
        );
        refreshItems();
    };

    const refreshItems = async () => {
        // Re-fetch the menu to get updated items with children
        const response = (await apiFetch(
            'GET',
            `/admin/menus/${initialMenu.id}/items`,
        )) as { items: MenuItem[] } | null;

        if (response?.items) {
            setItems(response.items);
        }
    };

    return (
        <>
            <Head title={`Edit menu — ${initialMenu.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {initialMenu.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground capitalize">
                            {initialMenu.location.replace('_', ' ')}
                        </p>
                    </div>
                    <Button onClick={() => openAddForm(null)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add item
                    </Button>
                </div>

                <MenuItemTree
                    items={items}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    onAddChild={(pid) => openAddForm(pid)}
                    onReorder={handleReorder}
                />

                <Dialog open={formOpen} onOpenChange={(v) => !v && setFormOpen(false)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem
                                    ? 'Edit item'
                                    : parentId
                                      ? 'Add child item'
                                      : 'Add menu item'}
                            </DialogTitle>
                        </DialogHeader>
                        <MenuItemForm
                            item={editingItem}
                            pages={pages}
                            parentId={parentId}
                            onSave={handleSave}
                            onCancel={() => setFormOpen(false)}
                            isSaving={saving}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
