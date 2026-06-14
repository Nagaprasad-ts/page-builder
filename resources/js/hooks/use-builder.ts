import { useState } from 'react';
import { getDefaultProps } from '@/sections';
import type { Page, PageSection, SectionInstance } from '@/types/builder';

type Region = 'header' | 'body' | 'footer';

type BuilderInitial = {
    page?: Partial<Page>;
    sections?: PageSection[];
};

type BuilderPayload = {
    title: string;
    slug: string;
    parent_id: number | null;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    custom_header: boolean;
    custom_footer: boolean;
    sections: {
        region: Region;
        section_type: string;
        sort_order: number;
        props: Record<string, unknown>;
    }[];
};


function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Centralised state for the page builder.
 * Both create and edit pages use this hook.
 */
export function useBuilder(initial: BuilderInitial = {}) {
    const isExistingPage = !!initial.page?.id;

    const [title, setTitle] = useState(initial.page?.title ?? '');
    const [slug, setSlug] = useState(initial.page?.slug ?? '');
    const [parentId, setParentId] = useState<number | null>(
        initial.page?.parent_id ?? null,
    );
    const [metaTitle, setMetaTitle] = useState(initial.page?.meta_title ?? '');
    const [metaDescription, setMetaDescription] = useState(
        initial.page?.meta_description ?? '',
    );
    const [metaKeywords, setMetaKeywords] = useState(
        initial.page?.meta_keywords ?? '',
    );
    const [customHeader, setCustomHeader] = useState(
        initial.page?.custom_header ?? false,
    );
    const [customFooter, setCustomFooter] = useState(
        initial.page?.custom_footer ?? false,
    );
    const [activeRegion, setActiveRegion] = useState<Region>('body');

    const [sections, setSections] = useState<SectionInstance[]>(() =>
        (initial.sections ?? []).map((s) => ({
            id: crypto.randomUUID(),
            section_type: s.section_type,
            sort_order: s.sort_order,
            region: s.region ?? 'body',
            props: s.props ?? {},
        })),
    );

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

    /** Updates title and auto-generates slug for new pages */
    const handleTitleChange = (value: string) => {
        setTitle(value);

        if (!isExistingPage) {
            setSlug(generateSlug(value));
        }
    };

    const addSection = (sectionType: string, atIndex?: number) => {
        const regionSections = sections.filter((s) => s.region === activeRegion);
        const newSection: SectionInstance = {
            id: crypto.randomUUID(),
            section_type: sectionType,
            sort_order: regionSections.length,
            region: activeRegion,
            props: getDefaultProps(sectionType),
        };

        setSections((prev) => {
            if (atIndex !== undefined) {
                // Insert within the active region at the given index
                const regionItems = prev.filter((s) => s.region === activeRegion);
                const otherItems = prev.filter((s) => s.region !== activeRegion);
                regionItems.splice(atIndex, 0, newSection);

                return [...otherItems, ...regionItems];
            }

            return [...prev, newSection];
        });

        setSelectedId(newSection.id);
    };

    const removeSection = (id: string) => {
        setSections((prev) => prev.filter((s) => s.id !== id));

        if (selectedId === id) {
            setSelectedId(null);
        }
    };

    const reorderSections = (newOrder: SectionInstance[]) => {
        // Replace sections for the active region with the new order, keeping other regions intact
        setSections((prev) => {
            const otherItems = prev.filter((s) => s.region !== activeRegion);

            return [...otherItems, ...newOrder];
        });
    };

    const updateSectionProps = (id: string, props: Record<string, unknown>) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, props } : s)),
        );
    };

    const openMediaPicker = (onSelect: (url: string) => void) => {
        // useState setter with a function value must be wrapped to avoid being called as updater
        setMediaPickerCallback(() => onSelect);
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (url: string) => {
        if (url && mediaPickerCallback) {
            mediaPickerCallback(url);
        }
    };

    const closeMediaPicker = () => {
        setMediaPickerOpen(false);
        setMediaPickerCallback(null);
    };

    /** Builds the payload to send to the backend */
    const buildPayload = (): BuilderPayload => ({
        title,
        slug,
        parent_id: parentId,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        custom_header: customHeader,
        custom_footer: customFooter,
        sections: sections.map((s, index) => ({
            region: s.region,
            section_type: s.section_type,
            sort_order: index,
            props: s.props,
        })),
    });

    const selectedSection = sections.find((s) => s.id === selectedId) ?? null;

    const headerSections = sections.filter((s) => s.region === 'header');
    const bodySections = sections.filter((s) => s.region === 'body');
    const footerSections = sections.filter((s) => s.region === 'footer');

    return {
        // Page meta
        title,
        slug,
        parentId,
        metaTitle,
        metaDescription,
        metaKeywords,
        customHeader,
        customFooter,
        isExistingPage,

        // Region
        activeRegion,
        setActiveRegion,

        // Sections
        sections,
        headerSections,
        bodySections,
        footerSections,
        selectedId,
        selectedSection,

        // Modals
        settingsOpen,
        mediaPickerOpen,

        // Handlers
        handleTitleChange,
        setSlug,
        setParentId,
        setMetaTitle,
        setMetaDescription,
        setMetaKeywords,
        setCustomHeader,
        setCustomFooter,
        addSection,
        removeSection,
        reorderSections,
        updateSectionProps,
        setSelectedId,
        setSettingsOpen,
        openMediaPicker,
        handleMediaSelect,
        closeMediaPicker,
        buildPayload,
    };
}
