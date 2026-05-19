import { Settings } from 'lucide-react';
import { sectionRegistry } from '@/sections';
import type { SectionInstance } from '@/types/builder';
import { FieldEditor } from './field-editor';

type Props = {
    section: SectionInstance | null;
    onChange: (id: string, props: Record<string, unknown>) => void;
    onOpenMediaPicker: (fieldKey: string) => void;
};

export function PropertiesPanel({
    section,
    onChange,
    onOpenMediaPicker,
}: Props) {
    if (!section) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                <Settings className="h-8 w-8 opacity-40" />
                <p className="text-sm">Select a section to edit its content</p>
            </div>
        );
    }

    const registration = sectionRegistry[section.section_type];

    if (!registration) {
        return (
            <div className="p-4 text-sm text-muted-foreground">
                Unknown section type: <code>{section.section_type}</code>
            </div>
        );
    }

    const { meta, schema } = registration;

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold">
                    {meta.name.charAt(0).toUpperCase() + meta.name.slice(1)}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    {meta.description}
                </p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {Object.entries(schema).map(([key, def]) => (
                    <FieldEditor
                        key={key}
                        fieldKey={key}
                        def={def}
                        value={section.props[key] ?? def.default ?? null}
                        onChange={(v) => {
                            onChange(section.id, {
                                ...section.props,
                                [key]: v,
                            });
                        }}
                        onOpenMediaPicker={() => onOpenMediaPicker(key)}
                    />
                ))}
            </div>
        </div>
    );
}
