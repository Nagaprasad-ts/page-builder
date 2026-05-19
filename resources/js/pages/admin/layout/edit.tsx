import { Head, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { BuilderCanvas } from '@/components/builder/builder-canvas';
import { PropertiesPanel } from '@/components/builder/properties-panel';
import { SectionBrowser } from '@/components/builder/section-browser';
import { MediaPickerModal } from '@/components/media/media-picker-modal';
import { Button } from '@/components/ui/button';
import { getDefaultProps } from '@/sections';
import { cn } from '@/lib/utils';
import type { PageSection, SectionInstance } from '@/types/builder';

type Region = 'header' | 'footer';

type Props = {
    headerSections: PageSection[];
    footerSections: PageSection[];
};

const REGIONS: Region[] = ['header', 'footer'];

function toInstances(sections: PageSection[]): SectionInstance[] {
    return sections.map((s) => ({
        id: crypto.randomUUID(),
        section_type: s.section_type,
        sort_order: s.sort_order,
        region: s.region ?? 'body',
        props: s.props ?? {},
    }));
}

export default function GlobalLayoutEdit({ headerSections, footerSections }: Props) {
    const [activeRegion, setActiveRegion] = useState<Region>('header');
    const [header, setHeader] = useState<SectionInstance[]>(() => toInstances(headerSections));
    const [footer, setFooter] = useState<SectionInstance[]>(() => toInstances(footerSections));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerFieldKey, setMediaPickerFieldKey] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const activeSections = activeRegion === 'header' ? header : footer;
    const setActiveSections = activeRegion === 'header' ? setHeader : setFooter;

    const selectedSection =
        activeSections.find((s) => s.id === selectedId) ?? null;

    const addSection = (sectionType: string, atIndex?: number) => {
        const newSection: SectionInstance = {
            id: crypto.randomUUID(),
            section_type: sectionType,
            sort_order: activeSections.length,
            region: activeRegion,
            props: getDefaultProps(sectionType),
        };

        setActiveSections((prev) => {
            if (atIndex !== undefined) {
                const next = [...prev];
                next.splice(atIndex, 0, newSection);

                return next;
            }

            return [...prev, newSection];
        });

        setSelectedId(newSection.id);
    };

    const removeSection = (id: string) => {
        setActiveSections((prev) => prev.filter((s) => s.id !== id));

        if (selectedId === id) {
            setSelectedId(null);
        }
    };

    const reorderSections = (newOrder: SectionInstance[]) => {
        setActiveSections(newOrder);
    };

    const updateSectionProps = (id: string, props: Record<string, unknown>) => {
        setActiveSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, props } : s)),
        );
    };

    const openMediaPicker = (fieldKey: string) => {
        setMediaPickerFieldKey(fieldKey);
        setMediaPickerOpen(true);
    };

    const closeMediaPicker = () => {
        setMediaPickerOpen(false);
        setMediaPickerFieldKey(null);
    };

    const handleMediaSelect = (url: string) => {
        if (url && selectedId && mediaPickerFieldKey) {
            const section = activeSections.find((s) => s.id === selectedId);

            if (section) {
                updateSectionProps(selectedId, {
                    ...section.props,
                    [mediaPickerFieldKey]: url,
                });
            }
        }
    };

    const handleSave = () => {
        setProcessing(true);

        const payload = {
            header_sections: header.map((s, index) => ({
                section_type: s.section_type,
                sort_order: index,
                props: s.props,
            })),
            footer_sections: footer.map((s, index) => ({
                section_type: s.section_type,
                sort_order: index,
                props: s.props,
            })),
        };

        router.post('/admin/layout', payload as any, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Global Layout" />

            <div className="flex h-screen flex-col overflow-hidden bg-muted/20">
                {/* Top bar */}
                <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
                    <Link
                        href="/admin/pages"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Pages
                    </Link>

                    <div className="mx-1 h-5 w-px bg-border" />

                    <span className="text-sm font-medium">Global Layout</span>

                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={processing}
                        >
                            {processing && (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            )}
                            Save
                        </Button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left: section browser */}
                    <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-background">
                        <SectionBrowser onAdd={addSection} />
                    </aside>

                    {/* Center: canvas */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="mx-auto max-w-4xl">
                            {/* Region tabs */}
                            <div className="mb-4 flex gap-1">
                                {REGIONS.map((region) => (
                                    <button
                                        key={region}
                                        onClick={() => {
                                            setActiveRegion(region);
                                            setSelectedId(null);
                                        }}
                                        className={cn(
                                            'rounded-md px-3 py-1.5 text-xs font-medium capitalize',
                                            activeRegion === region
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                        )}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>

                            <BuilderCanvas
                                sections={activeSections}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                onReorder={reorderSections}
                                onRemove={removeSection}
                                onDropNewSection={addSection}
                            />
                        </div>
                    </main>

                    {/* Right: properties */}
                    <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-background">
                        <PropertiesPanel
                            section={selectedSection}
                            onChange={updateSectionProps}
                            onOpenMediaPicker={openMediaPicker}
                        />
                    </aside>
                </div>
            </div>

            <MediaPickerModal
                open={mediaPickerOpen}
                onClose={closeMediaPicker}
                onSelect={handleMediaSelect}
            />
        </>
    );
}

GlobalLayoutEdit.layout = null;
