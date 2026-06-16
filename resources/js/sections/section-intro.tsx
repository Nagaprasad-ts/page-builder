import * as LucideIcons from 'lucide-react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'section-intro',
    category: 'Content',
    icon: 'LayoutList',
    description: 'Number, two-line heading, description, and three icon feature columns.',
};

export const schema: SectionSchema = {
    headingLine1: { type: 'text', label: 'Heading line 1', default: 'What Is' },
    headingLine2: { type: 'text', label: 'Heading line 2', default: 'Content Creation?' },
    description: {
        type: 'richtext',
        label: 'Description',
        default:
            '<p>Content creation is the art of turning ideas into valuable, relevant, and engaging content that speaks to your audience and supports your brand goals.</p>',
    },
    items: {
        type: 'array',
        label: 'Feature columns',
        default: [
            { icon: 'Headphones', title: 'Strategy-Driven', body: '<p>Every piece is planned with purpose.</p>' },
            { icon: 'PlusSquare', title: 'Audience-Focused', body: '<p>We create for people, not just platforms.</p>' },
            { icon: 'Share2', title: 'Results-Oriented', body: '<p>Content that drives engagement and growth.</p>' },
            { icon: 'Share2', title: 'Results-Oriented', body: '<p>Content that drives engagement and growth.</p>' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon (Lucide name e.g. Headphones)', default: 'Headphones' },
            title: { type: 'text', label: 'Title', default: 'Strategy-Driven' },
            body: { type: 'richtext', label: 'Description', default: '<p>Every piece is planned with purpose.</p>' },
        },
    },
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

type FeatureItem = {
    icon?: string;
    title?: string;
    body?: string;
};

type Props = {
    number?: string;
    headingLine1?: string;
    headingLine2?: string;
    description?: string;
    items?: FeatureItem[];
};

export default function SectionIntro({
    headingLine1,
    headingLine2,
    description,
    items = [],
}: Props) {
    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-7 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">

                {/* ── Left Column: Heading & Description ── */}
                <div className="w-full lg:w-[45%] space-y-6">
                    <h2 className="text-4xl font-extrabold leading-tight text-gray-900">
                        {headingLine1 && <span className="block">{headingLine1}</span>}
                        {headingLine2 && <span className="block text-accent-brand">{headingLine2}</span>}
                    </h2>

                    {description && (
                        <div
                            className="max-w-md prose prose-sm"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}
                </div>

                {/* ── Right Column: Vertical List of Features ── */}
                {items.length > 0 && (
                    <div className="w-full lg:w-[50%] space-y-4">
                        {items.map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100/80 transition-shadow duration-300 hover:shadow-md">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-brand/10 text-accent-brand">
                                    <DynamicIcon name={item.icon} className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    {item.title && (
                                        <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                                    )}
                                    {item.body && (
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: item.body }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}
