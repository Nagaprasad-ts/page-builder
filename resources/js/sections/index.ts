import type { SectionRegistration } from '@/types/builder';

/**
 * Auto-discover all section files (every .tsx in this directory except index).
 * Each file must export `meta`, `schema`, and a default React component.
 */
const modules = import.meta.glob<SectionRegistration>('./*.tsx', {
    eager: true,
});

export const sectionRegistry: Record<string, SectionRegistration> = {};

for (const mod of Object.values(modules)) {
    if (mod.meta) {
        sectionRegistry[mod.meta.name] = mod;
    }
}

/**
 * Returns sections grouped by category for the section browser panel.
 */
export function getSectionsByCategory(): Record<string, SectionRegistration[]> {
    return Object.values(sectionRegistry).reduce<
        Record<string, SectionRegistration[]>
    >((acc, reg) => {
        (acc[reg.meta.category] ??= []).push(reg);

        return acc;
    }, {});
}

/**
 * Returns the default props for a section type, populated from schema defaults.
 */
export function getDefaultProps(sectionType: string): Record<string, unknown> {
    const registration = sectionRegistry[sectionType];

    if (!registration) {
        return {};
    }

    return Object.entries(registration.schema).reduce<Record<string, unknown>>(
        (acc, [key, field]) => {
            acc[key] = field.default ?? null;

            return acc;
        },
        {},
    );
}
