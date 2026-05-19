import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { getSectionsByCategory } from '@/sections';

type Props = {
    onAdd: (sectionType: string) => void;
};

export function SectionBrowser({ onAdd }: Props) {
    const categories = getSectionsByCategory();
    const [openCategories, setOpenCategories] = useState<
        Record<string, boolean>
    >(Object.fromEntries(Object.keys(categories).map((cat) => [cat, true])));

    return (
        <div className="space-y-1 p-3">
            <p className="mb-3 px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Sections
            </p>
            {Object.entries(categories).map(([category, sections]) => (
                <Collapsible
                    key={category}
                    open={openCategories[category] ?? true}
                    onOpenChange={(open) =>
                        setOpenCategories((prev) => ({
                            ...prev,
                            [category]: open,
                        }))
                    }
                >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                        {category}
                        <ChevronDown
                            className={cn(
                                'h-3.5 w-3.5 transition-transform',
                                openCategories[category] && 'rotate-180',
                            )}
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 pt-1">
                        {sections.map((reg) => (
                            <button
                                key={reg.meta.name}
                                type="button"
                                onClick={() => onAdd(reg.meta.name)}
                                className="group flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
                            >
                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-xs font-bold text-muted-foreground">
                                    {reg.meta.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs leading-tight font-medium">
                                        {reg.meta.name.charAt(0).toUpperCase() +
                                            reg.meta.name.slice(1)}
                                    </p>
                                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-muted-foreground">
                                        {reg.meta.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    );
}
