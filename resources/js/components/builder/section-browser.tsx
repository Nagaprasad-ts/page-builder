import { ChevronDown, Search, X } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        Object.fromEntries(Object.keys(categories).map((cat) => [cat, true])),
    );

    // Filter categories and their sections based on the search query
    const filteredCategories = Object.entries(categories).reduce<
        Record<string, SectionRegistration[]>
    >((acc, [category, sections]) => {
        const matched = sections.filter((reg) => {
            const nameMatch = reg.meta.name.toLowerCase().replace(/-/g, ' ').includes(searchQuery.toLowerCase()) ||
                reg.meta.name.toLowerCase().includes(searchQuery.toLowerCase());
            const descMatch = reg.meta.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
            const catMatch = reg.meta.category.toLowerCase().includes(searchQuery.toLowerCase());
            return nameMatch || descMatch || catMatch;
        });

        if (matched.length > 0) {
            acc[category] = matched;
        }

        return acc;
    }, {});

    const hasResults = Object.keys(filteredCategories).length > 0;

    return (
        <div className="space-y-1 p-3">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sections
            </p>

            {/* Search Input */}
            <div className="relative mb-4 px-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-input bg-background pl-8 pr-7 py-1.5 text-xs outline-none transition-all focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                        title="Clear search"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {hasResults ? (
                Object.entries(filteredCategories).map(([category, sections]) => (
                    <Collapsible
                        key={category}
                        open={searchQuery ? true : (openCategories[category] ?? true)}
                        onOpenChange={(open) => {
                            if (!searchQuery) {
                                setOpenCategories((prev) => ({ ...prev, [category]: open }));
                            }
                        }}
                    >
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                            {category}
                            <ChevronDown
                                className={cn(
                                    'h-3.5 w-3.5 transition-transform',
                                    (searchQuery || (openCategories[category] ?? true)) && 'rotate-180',
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
                ))
            ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                    No sections found for "{searchQuery}"
                </div>
            )}
        </div>
    );
}
