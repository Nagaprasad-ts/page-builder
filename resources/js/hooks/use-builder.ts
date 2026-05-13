import { getDefaultProps } from '@/sections';
import type { Page, PageSection, SectionInstance } from '@/types/builder';
import { useState } from 'react';

type BuilderInitial = {
    page?: Partial<Page>;
    sections?: PageSection[];
};

type BuilderPayload = {
    title: string;
    slug: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    sections: {
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
    const [metaTitle, setMetaTitle] = useState(initial.page?.meta_title ?? '');
    const [metaDescription, setMetaDescription] = useState(initial.page?.meta_description ?? '');
    const [metaKeywords, setMetaKeywords] = useState(initial.page?.meta_keywords ?? '');

    const [sections, setSections] = useState<SectionInstance[]>(() =>
        (initial.sections ?? []).map((s) => ({
            id: crypto.randomUUID(),
            section_type: s.section_type,
            sort_order: s.sort_order,
            props: s.props ?? {},
        })),
    );

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerFieldKey, setMediaPickerFieldKey] = useState<string | null>(null);

    /** Updates title and auto-generates slug for new pages */
    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!isExistingPage) {
            setSlug(generateSlug(value));
        }
    };

    const addSection = (sectionType: string, atIndex?: number) => {
        const newSection: SectionInstance = {
            id: crypto.randomUUID(),
            section_type: sectionType,
            sort_order: sections.length,
            props: getDefaultProps(sectionType),
        };

        setSections((prev) => {
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
        setSections((prev) => prev.filter((s) => s.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
        }
    };

    const reorderSections = (newOrder: SectionInstance[]) => {
        setSections(newOrder);
    };

    const updateSectionProps = (id: string, props: Record<string, unknown>) => {
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, props } : s)));
    };

    const openMediaPicker = (fieldKey: string) => {
        setMediaPickerFieldKey(fieldKey);
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (url: string) => {
        if (selectedId && mediaPickerFieldKey) {
            const section = sections.find((s) => s.id === selectedId);
            if (section) {
                updateSectionProps(selectedId, { ...section.props, [mediaPickerFieldKey]: url });
            }
        }
        setMediaPickerOpen(false);
        setMediaPickerFieldKey(null);
    };

    /** Builds the payload to send to the backend */
    const buildPayload = (): BuilderPayload => ({
        title,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        sections: sections.map((s, index) => ({
            section_type: s.section_type,
            sort_order: index,
            props: s.props,
        })),
    });

    const selectedSection = sections.find((s) => s.id === selectedId) ?? null;

    return {
        // Page meta
        title,
        slug,
        metaTitle,
        metaDescription,
        metaKeywords,
        isExistingPage,

        // Sections
        sections,
        selectedId,
        selectedSection,

        // Modals
        settingsOpen,
        mediaPickerOpen,

        // Handlers
        handleTitleChange,
        setSlug,
        setMetaTitle,
        setMetaDescription,
        setMetaKeywords,
        addSection,
        removeSection,
        reorderSections,
        updateSectionProps,
        setSelectedId,
        setSettingsOpen,
        openMediaPicker,
        handleMediaSelect,
        buildPayload,
    };
}
