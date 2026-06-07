import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { getDefaultProps, getSectionsByCategory } from '@/sections';
import type { SectionRegistration } from '@/types/builder';

// Width we render the section at before scaling
const RENDER_WIDTH = 1200;
// Width available in the sidebar thumbnail
const THUMB_WIDTH = 220;
const SCALE = THUMB_WIDTH / RENDER_WIDTH;

function SectionThumbnail({ reg }: { reg: SectionRegistration }) {
    const Component = reg.default;
    const defaultProps = getDefaultProps(reg.meta.name);

    return (
        <div
            className="relative overflow-hidden rounded-md border border-border bg-white"
            style={{ width: THUMB_WIDTH, height: 120 }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: RENDER_WIDTH,
                    transformOrigin: 'top left',
                    transform: `scale(${SCALE})`,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <Component {...(defaultProps as any)} />
            </div>
        </div>
    );
}

type Props = {
    onAdd: (sectionType: string) => void;
};

export function SectionBrowser({ onAdd }: Props) {
    const categories = getSectionsByCategory();
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        Object.fromEntries(Object.keys(categories).map((cat) => [cat, true])),
    );

    return (
        <div className="space-y-1 p-3">
            <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sections
            </p>
            {Object.entries(categories).map(([category, sections]) => (
                <Collapsible
                    key={category}
                    open={openCategories[category] ?? true}
                    onOpenChange={(open) =>
                        setOpenCategories((prev) => ({ ...prev, [category]: open }))
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
                    <CollapsibleContent className="space-y-2 pt-1">
                        {sections.map((reg) => (
                            <button
                                key={reg.meta.name}
                                type="button"
                                onClick={() => onAdd(reg.meta.name)}
                                className="group w-full rounded-md p-1.5 text-left transition-colors hover:bg-accent"
                            >
                                <SectionThumbnail reg={reg} />
                                <p className="mt-1.5 px-0.5 text-xs font-medium capitalize leading-tight text-foreground">
                                    {reg.meta.name.replace(/-/g, ' ')}
                                </p>
                            </button>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    );
}
