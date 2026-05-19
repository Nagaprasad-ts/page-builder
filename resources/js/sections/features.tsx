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
                type: 'textarea',
                label: 'Description',
                default: 'Short description of this feature.',
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
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                                {item.icon ?? '★'}
                            </div>
                            {item.title && (
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                            )}
                            {item.body && (
                                <p className="text-gray-600">{item.body}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
