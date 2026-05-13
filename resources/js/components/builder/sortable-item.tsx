import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {
    id: string;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    children: ReactNode;
};

export function SortableItem({ id, isSelected, onSelect, onRemove, children }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative rounded-lg border-2 bg-white transition-shadow',
                isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-border',
                isDragging && 'opacity-50 shadow-xl',
            )}
            onClick={onSelect}
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-0 flex h-full w-7 cursor-grab items-center justify-center rounded-l-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
            >
                <GripVertical className="h-4 w-4" />
            </div>

            {/* Remove button */}
            <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
            >
                <Trash2 className="h-3 w-3" />
            </Button>

            {/* Section preview */}
            <div className="pointer-events-none overflow-hidden rounded-lg">{children}</div>
        </div>
    );
}
