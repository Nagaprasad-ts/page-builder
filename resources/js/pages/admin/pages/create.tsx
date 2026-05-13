import { BuilderCanvas } from '@/components/builder/builder-canvas';
import { BuilderTopBar } from '@/components/builder/builder-top-bar';
import { PageSettingsSheet } from '@/components/builder/page-settings-sheet';
import { PropertiesPanel } from '@/components/builder/properties-panel';
import { SectionBrowser } from '@/components/builder/section-browser';
import { MediaPickerModal } from '@/components/media/media-picker-modal';
import { useBuilder } from '@/hooks/use-builder';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CreatePage() {
    const { auth } = usePage().props;
    const builder = useBuilder();
    const [processing, setProcessing] = useState(false);

    const handleSave = () => {
        setProcessing(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.post('/admin/pages', builder.buildPayload() as any, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="New page" />

            <div className="flex h-screen flex-col overflow-hidden bg-muted/20">
                <BuilderTopBar
                    title={builder.title}
                    status="draft"
                    onTitleChange={builder.handleTitleChange}
                    onOpenSettings={() => builder.setSettingsOpen(true)}
                    onSave={handleSave}
                    onPublish={() => {}}
                    onUnpublish={() => {}}
                    canPublish={false}
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
                            <BuilderCanvas
                                sections={builder.sections}
                                selectedId={builder.selectedId}
                                onSelect={builder.setSelectedId}
                                onReorder={builder.reorderSections}
                                onRemove={builder.removeSection}
                                onDropNewSection={builder.addSection}
                            />
                        </div>
                    </main>

                    {/* Right: properties */}
                    <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-background">
                        <PropertiesPanel
                            section={builder.selectedSection}
                            onChange={builder.updateSectionProps}
                            onOpenMediaPicker={builder.openMediaPicker}
                        />
                    </aside>
                </div>
            </div>

            <PageSettingsSheet
                open={builder.settingsOpen}
                onClose={() => builder.setSettingsOpen(false)}
                slug={builder.slug}
                metaTitle={builder.metaTitle}
                metaDescription={builder.metaDescription}
                metaKeywords={builder.metaKeywords}
                isExistingPage={false}
                onChange={(field, value) => {
                    if (field === 'slug') builder.setSlug(value);
                    else if (field === 'metaTitle') builder.setMetaTitle(value);
                    else if (field === 'metaDescription') builder.setMetaDescription(value);
                    else if (field === 'metaKeywords') builder.setMetaKeywords(value);
                }}
            />

            <MediaPickerModal
                open={builder.mediaPickerOpen}
                onClose={() => builder.handleMediaSelect('')}
                onSelect={builder.handleMediaSelect}
            />
        </>
    );
}

CreatePage.layout = null;
