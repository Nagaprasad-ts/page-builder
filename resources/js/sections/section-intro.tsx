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
        type: 'textarea',
        label: 'Description',
        default:
            'Content creation is the art of turning ideas into valuable, relevant, and engaging content that speaks to your audience and supports your brand goals.',
    },
    items: {
        type: 'array',
        label: 'Feature columns',
        default: [
            { icon: 'Headphones', title: 'Strategy-Driven', body: 'Every piece is planned with purpose.' },
            { icon: 'PlusSquare', title: 'Audience-Focused', body: 'We create for people, not just platforms.' },
            { icon: 'Share2', title: 'Results-Oriented', body: 'Content that drives engagement and growth.' },
            { icon: 'Share2', title: 'Results-Oriented', body: 'Content that drives engagement and growth.' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon (Lucide name e.g. Headphones)', default: 'Headphones' },
            title: { type: 'text', label: 'Title', default: 'Strategy-Driven' },
            body: { type: 'textarea', label: 'Description', default: 'Every piece is planned with purpose.' },
        },
    },
};

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    if (!name) return null;
    const Icon = (LucideIcons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string }> | undefined;
    if (!Icon) return <span className={className}>{name}</span>;
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
    number,
    headingLine1,
    headingLine2,
    description,
    items = [],
}: Props) {
    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-6">

                {/* Heading */}
                <h2 className="mb-5 text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
                    {headingLine1 && <span className="block">{headingLine1}</span>}
                    {headingLine2 && <span className="block">{headingLine2}</span>}
                </h2>

                {/* Description */}
                {description && (
                    <p className="mb-12 max-w-lg text-sm font-semibold leading-relaxed text-gray-500">{description}</p>
                )}

                {/* Feature columns */}
                {items.length > 0 && (
                    <div className="grid gap-8 sm:grid-cols-4">
                        {items.map((item, i) => (
                            <div key={i}>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-accent-brand text-accent-brand">
                                    <DynamicIcon name={item.icon} className="h-5 w-5" />
                                </div>
                                {item.title && (
                                    <h3 className="mb-1 text-sm font-bold text-gray-900">{item.title}</h3>
                                )}
                                {item.body && (
                                    <p className="text-sm leading-relaxed text-gray-500">{item.body}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
