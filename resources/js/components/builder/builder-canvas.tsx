import type { DragEndEvent } from '@dnd-kit/core';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { LayoutTemplate } from 'lucide-react';
import { useState } from 'react';
import { sectionRegistry } from '@/sections';
import type { SectionInstance } from '@/types/builder';
import { SortableItem } from './sortable-item';

type Props = {
    sections: SectionInstance[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onReorder: (sections: SectionInstance[]) => void;
    onRemove: (id: string) => void;
    onDropNewSection?: (sectionType: string, atIndex?: number) => void;
};

export function BuilderCanvas({
    sections,
    selectedId,
    onSelect,
    onReorder,
    onRemove,
    onDropNewSection,
}: Props) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        // New section dragged from the browser panel
        if (
            typeof active.id === 'string' &&
            active.id.startsWith('new-section:')
        ) {
            const sectionType = active.id.replace('new-section:', '');
            const overIndex = sections.findIndex((s) => s.id === over.id);
            onDropNewSection?.(
                sectionType,
                overIndex >= 0 ? overIndex : undefined,
            );

            return;
        }

        // Reorder existing sections
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            onReorder(arrayMove(sections, oldIndex, newIndex));
        }
    }

    if (sections.length === 0) {
        return (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background p-12 text-center">
                <LayoutTemplate className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                    No sections yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                    Click a section in the left panel to add it
                </p>
            </div>
        );
    }

    return (
        <DndContext
            id="builder-canvas"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={({ active }) => setActiveId(String(active.id))}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {sections.map((section) => {
                        const reg = sectionRegistry[section.section_type];
                        const Component = reg?.default;

                        return (
                            <SortableItem
                                key={section.id}
                                id={section.id}
                                isSelected={selectedId === section.id}
                                onSelect={() => onSelect(section.id)}
                                onRemove={() => onRemove(section.id)}
                            >
                                {Component ? (
                                    <div className="origin-top scale-[0.85]">
                                        <Component {...section.props} />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                        Unknown section: {section.section_type}
                                    </div>
                                )}
                            </SortableItem>
                        );
                    })}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeId && (
                    <div className="rounded-lg border-2 border-primary bg-white p-3 opacity-80 shadow-xl">
                        <span className="text-xs font-medium text-muted-foreground">
                            Moving section…
                        </span>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
