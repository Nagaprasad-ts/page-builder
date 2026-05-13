import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/types/menu';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';

type Props = {
    items: MenuItem[];
    onEdit: (item: MenuItem) => void;
    onDelete: (item: MenuItem) => void;
    onAddChild: (parentId: number) => void;
};

type ItemRowProps = {
    item: MenuItem;
    depth?: number;
    onEdit: (item: MenuItem) => void;
    onDelete: (item: MenuItem) => void;
    onAddChild: (parentId: number) => void;
};

function ItemRow({ item, depth = 0, onEdit, onDelete, onAddChild }: ItemRowProps) {
    return (
        <>
            <div
                className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5"
                style={{ marginLeft: depth * 20 }}
            >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {item.type === 'page' && item.page
                            ? `/${item.page.slug}`
                            : item.url ?? '—'}
                    </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {depth === 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onAddChild(item.id)}
                            title="Add child item"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onEdit(item)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => onDelete(item)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
            {item.children?.map((child) => (
                <ItemRow
                    key={child.id}
                    item={child}
                    depth={depth + 1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddChild={onAddChild}
                />
            ))}
        </>
    );
}

export function MenuItemTree({ items, onEdit, onDelete, onAddChild }: Props) {
    if (items.length === 0) {
        return (
            <div className="rounded-xl border-2 border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                No items yet. Add your first menu item.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <ItemRow
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddChild={onAddChild}
                />
            ))}
        </div>
    );
}
