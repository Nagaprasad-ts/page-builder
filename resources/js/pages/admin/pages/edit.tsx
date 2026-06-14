import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { BuilderCanvas } from '@/components/builder/builder-canvas';
import { BuilderTopBar } from '@/components/builder/builder-top-bar';
import { PageSettingsSheet } from '@/components/builder/page-settings-sheet';
import { PropertiesPanel } from '@/components/builder/properties-panel';
import { SectionBrowser } from '@/components/builder/section-browser';
import { MediaPickerModal } from '@/components/media/media-picker-modal';
import { useBuilder } from '@/hooks/use-builder';
import { cn } from '@/lib/utils';
import type { Page, PageSection } from '@/types/builder';

type Props = {
    page: Page;
    sections: PageSection[];
};

const REGIONS = ['header', 'body', 'footer'] as const;

export default function EditPage({ page, sections, pages }: Props & { pages: Page[] }) {
    const { auth } = usePage().props;
    const builder = useBuilder({ page, sections });
    const [processing, setProcessing] = useState(false);
    const [panelOpen, setPanelOpen] = useState(true);

    const handleSave = () => {
        setProcessing(true);

        router.put(`/admin/pages/${page.id}`, builder.buildPayload() as any, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handlePublish = () => {
        router.post(`/admin/pages/${page.id}/publish`, {}, { preserveScroll: true });
    };

    const handleUnpublish = () => {
        router.post(`/admin/pages/${page.id}/unpublish`, {}, { preserveScroll: true });
    };

    const canPublish = auth.user.role === 'admin';

    const activeSections =
        builder.activeRegion === 'header'
            ? builder.headerSections
            : builder.activeRegion === 'footer'
              ? builder.footerSections
              : builder.bodySections;

    const showGlobalNotice =
        (builder.activeRegion === 'header' && !builder.customHeader) ||
        (builder.activeRegion === 'footer' && !builder.customFooter);

    const globalNoticeText =
        builder.activeRegion === 'header'
            ? 'Using global header — enable Custom header in Page Settings to override.'
            : 'Using global footer — enable Custom footer in Page Settings to override.';

    const parentPage = pages?.find((p) => p.id === builder.parentId);
    const currentPath = parentPage
        ? `${parentPage.path}/${builder.slug}`
        : builder.slug;

    return (
        <>
            <Head title={`Edit — ${page.title}`} />

            <div className="flex h-screen flex-col overflow-hidden bg-muted/20">
                <BuilderTopBar
                    title={builder.title}
                    slug={currentPath}
                    status={page.status}
                    onTitleChange={builder.handleTitleChange}
                    onOpenSettings={() => builder.setSettingsOpen(true)}
                    onSave={handleSave}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    canPublish={canPublish}
                    isSaving={processing}
                />

                <div className="flex flex-1 overflow-hidden">
                    {/* Left: section browser */}
                    <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-background">
                        <SectionBrowser onAdd={builder.addSection} />
                    </aside>

                    {/* Center: canvas */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="mx-auto max-w-4xl">
                            {/* Region tabs */}
                            <div className="mb-4 flex gap-1">
                                {REGIONS.map((region) => (
                                    <button
                                        key={region}
                                        onClick={() => builder.setActiveRegion(region)}
                                        className={cn(
                                            'rounded-md px-3 py-1.5 text-xs font-medium capitalize',
                                            builder.activeRegion === region
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                        )}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>

                            {/* Global layout notice */}
                            {showGlobalNotice && (
                                <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                    {globalNoticeText}
                                </p>
                            )}

                            <BuilderCanvas
                                sections={activeSections}
                                selectedId={builder.selectedId}
                                onSelect={builder.setSelectedId}
                                onReorder={builder.reorderSections}
                                onRemove={builder.removeSection}
                                onDropNewSection={builder.addSection}
                            />
                        </div>
                    </main>

                    {/* Right: properties (collapsible) */}
                    <aside
                        className={cn(
                            'relative shrink-0 border-l border-border bg-background transition-all duration-200',
                            panelOpen ? 'w-80' : 'w-8',
                        )}
                    >
                        {/* Toggle button */}
                        <button
                            type="button"
                            onClick={() => setPanelOpen((v) => !v)}
                            title={panelOpen ? 'Hide panel' : 'Show panel'}
                            className="absolute -left-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground"
                        >
                            {panelOpen ? (
                                <ChevronRight className="h-3 w-3" />
                            ) : (
                                <ChevronLeft className="h-3 w-3" />
                            )}
                        </button>

                        <div className={cn('h-full overflow-y-auto', !panelOpen && 'invisible')}>
                            <PropertiesPanel
                                section={builder.selectedSection}
                                onChange={builder.updateSectionProps}
                                onOpenMediaPicker={builder.openMediaPicker}
                            />
                        </div>
                    </aside>
                </div>
            </div>

            <PageSettingsSheet
                open={builder.settingsOpen}
                onClose={() => builder.setSettingsOpen(false)}
                slug={builder.slug}
                parentId={builder.parentId}
                pages={pages}
                metaTitle={builder.metaTitle}
                metaDescription={builder.metaDescription}
                metaKeywords={builder.metaKeywords}
                isExistingPage={true}
                customHeader={builder.customHeader}
                customFooter={builder.customFooter}
                onChange={(field, value) => {
                    if (field === 'slug') {
                        builder.setSlug(value);
                    } else if (field === 'metaTitle') {
                        builder.setMetaTitle(value);
                    } else if (field === 'metaDescription') {
                        builder.setMetaDescription(value);
                    } else if (field === 'metaKeywords') {
                        builder.setMetaKeywords(value);
                    }
                }}
                onParentIdChange={builder.setParentId}
                onCustomHeaderChange={builder.setCustomHeader}
                onCustomFooterChange={builder.setCustomFooter}
            />

            <MediaPickerModal
                open={builder.mediaPickerOpen}
                onClose={builder.closeMediaPicker}
                onSelect={builder.handleMediaSelect}
            />
        </>
    );
}

EditPage.layout = null;
