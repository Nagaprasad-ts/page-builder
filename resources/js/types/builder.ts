import type React from 'react';

export type FieldType = 'text' | 'textarea' | 'richtext' | 'image' | 'url' | 'boolean' | 'number' | 'select' | 'array';

export type FieldDef = {
    type: FieldType;
    label: string;
    default?: unknown;
    /** Options for `select` field type */
    options?: { label: string; value: string }[];
    /** Sub-schema for `array` field type */
    itemSchema?: SectionSchema;
};

export type SectionSchema = Record<string, FieldDef>;

export type SectionMeta = {
    /** Unique key — used as `section_type` stored in the database */
    name: string;
    category: string;
    /** Lucide icon name (e.g. "Mail", "Sparkles") */
    icon: string;
    description: string;
};

export type SectionRegistration = {
    meta: SectionMeta;
    schema: SectionSchema;
    default: React.ComponentType<Record<string, unknown>>;
};

/** A section instance inside the builder canvas (client-only) */
export type SectionInstance = {
    /** Client-only uuid for dnd-kit keys — NOT the database id */
    id: string;
    section_type: string;
    sort_order: number;
    props: Record<string, unknown>;
};

export type Page = {
    id: number;
    title: string;
    slug: string;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
};

export type PageSection = {
    id: number;
    page_id: number;
    section_type: string;
    sort_order: number;
    props: Record<string, unknown>;
};

export type MediaItem = {
    id: number;
    filename: string;
    original_name: string;
    path: string;
    url: string;
    alt: string | null;
    mime_type: string;
    size: number;
};
