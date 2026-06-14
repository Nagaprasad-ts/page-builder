import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/types/menu';

type Props = {
    items: MenuItem[];
    onEdit: (item: MenuItem) => void;
    onDelete: (item: MenuItem) => void;
    onAddChild: (parentId: number) => void;
    onReorder: (items: MenuItem[]) => void;
};

// ─── Sortable top-level row ───────────────────────────────────────────────────
type RowProps = {
    item: MenuItem;
    onEdit: (item: MenuItem) => void;
    onDelete: (item: MenuItem) => void;
    onAddChild: (parentId: number) => void;
};

function SortableItemRow({ item, onEdit, onDelete, onAddChild }: RowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="space-y-1">
            {/* Parent row */}
            <div className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                {/* Drag handle */}
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4 shrink-0" />
                </button>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                        {item.type === 'page' && item.page
                            ? (() => {
                                const path = item.page.path ?? item.page.slug;
                                return path.startsWith('/') ? path : `/${path}`;
                              })()
                            : (item.url ?? '—')}
                    </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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

            {/* Children (indented, not sortable for now) */}
            {item.children && item.children.length > 0 && (
                <div className="ml-6 space-y-1 border-l border-border pl-3">
                    {item.children.map((child) => (
                        <div
                            key={child.id}
                            className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5"
                        >
                            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/20" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{child.label}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {child.type === 'page' && child.page
                                        ? (() => {
                                            const path = child.page.path ?? child.page.slug;
                                            return path.startsWith('/') ? path : `/${path}`;
                                          })()
                                        : (child.url ?? '—')}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => onEdit(child)}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => onDelete(child)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Tree root ────────────────────────────────────────────────────────────────
export function MenuItemTree({ items, onEdit, onDelete, onAddChild, onReorder }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(items, oldIndex, newIndex);
        onReorder(reordered);
    };

    if (items.length === 0) {
        return (
            <div className="rounded-xl border-2 border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                No items yet. Add your first menu item.
            </div>
        );
    }

    return (
        <DndContext
            id="menu-item-tree"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {items.map((item) => (
                        <SortableItemRow
                            key={item.id}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
