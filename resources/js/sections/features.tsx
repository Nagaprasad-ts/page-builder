import * as LucideIcons from 'lucide-react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'features',
    category: 'Content',
    icon: 'LayoutGrid',
    description: 'A grid of feature cards with icon, title, and description.',
};

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Section Heading',
        default: 'Why choose us',
    },
    items: {
        type: 'array',
        label: 'Features',
        default: [],
        itemSchema: {
            icon: {
                type: 'text',
                label: 'Icon (lucide name)',
                default: 'Star',
            },
            title: { type: 'text', label: 'Title', default: 'Feature title' },
            body: {
                type: 'richtext',
                label: 'Description',
                default: '<p>Short description of this feature.</p>',
            },
        },
    },
};

type FeatureItem = {
    icon?: string;
    title?: string;
    body?: string;
};

type Props = {
    heading?: string;
    items?: FeatureItem[];
};

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    if (!name) {
return null;
}

    const pascalName = name
        .replace(/[-_ ]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (c) => c.toUpperCase());
    const Icon = (LucideIcons as Record<string, unknown>)[pascalName] as React.ComponentType<{ className?: string }> | undefined;

    if (!Icon) {
return <span className={className}>{name}</span>;
}

    return <Icon className={className} />;
}

export default function FeaturesSection({ heading, items = [] }: Props) {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-6xl px-6">
                {heading && (
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
                        {heading}
                    </h2>
                )}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-gray-200 p-6"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <DynamicIcon name={item.icon} className="h-6 w-6" />
                            </div>
                            {item.title && (
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                            )}
                            {item.body && (
                                <div 
                                    className="text-gray-600 prose prose-sm max-w-none [&_p]:mb-2"
                                    dangerouslySetInnerHTML={{ __html: item.body }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
