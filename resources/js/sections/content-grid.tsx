import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'content-grid',
    category: 'Marketing',
    icon: 'LayoutGrid',
    description: 'Left text + CTA, right 2×2 icon card grid. Icon names are editable.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: 'What We Create' },
    description: {
        type: 'textarea',
        label: 'Description',
        default:
            'From compelling copy to scroll-stopping visuals, we create content that captures attention and drives results.',
    },
    ctaLabel: { type: 'text', label: 'CTA label', default: 'Explore all services' },
    ctaUrl: { type: 'url', label: 'CTA URL', default: '#' },
    items: {
        type: 'array',
        label: 'Cards',
        default: [
            { icon: 'FileText', title: 'Blog Posts', body: 'Informative and SEO-friendly articles that build authority.' },
            { icon: 'Share2', title: 'Social Media Content', body: 'Engaging posts that grow your brand presence.' },
            { icon: 'Home', title: 'Website Copy', body: 'Clear, persuasive copy that converts visitors.' },
            { icon: 'Video', title: 'Video Scripts', body: 'Stories that captivate and communicate your message.' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon (Lucide name e.g. FileText)', default: 'FileText' },
            title: { type: 'text', label: 'Title', default: 'Card title' },
            body: { type: 'textarea', label: 'Description', default: 'Short description.' },
        },
    },
};

type CardItem = {
    icon?: string;
    title?: string;
    body?: string;
};

type Props = {
    number?: string;
    heading?: string;
    description?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    items?: CardItem[];
};

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    if (!name) return null;
    const Icon = (LucideIcons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string }> | undefined;
    if (!Icon) return <span className={className}>{name}</span>;
    return <Icon className={className} />;
}

export default function ContentGridSection({
    number,
    heading,
    description,
    ctaLabel,
    ctaUrl,
    items = [],
}: Props) {
    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-start">

                {/* ── Left ── */}
                <div className="w-full lg:w-2/5 lg:shrink-0">

                    {heading && (
                        <h2 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900">
                            {heading}
                        </h2>
                    )}

                    {description && (
                        <p className="mb-8 text-sm leading-relaxed text-gray-500">{description}</p>
                    )}

                    {ctaLabel && ctaUrl && (
                        <a
                            href={ctaUrl}
                            className="inline-flex items-center gap-3 text-sm font-bold text-gray-900 transition hover:text-accent-brand"
                        >
                            {ctaLabel}
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-brand text-white">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </a>
                    )}
                </div>

                {/* ── Right: 2×2 card grid ── */}
                <div className="grid w-full grid-cols-2 gap-4">
                    {items.map((item, i) => (
                        <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-brand/10 text-accent-brand">
                                <DynamicIcon name={item.icon} className="h-5 w-5" />
                            </div>
                            {item.title && (
                                <h3 className="mb-2 text-sm font-bold text-gray-900">{item.title}</h3>
                            )}
                            {item.body && (
                                <p className="text-xs leading-relaxed text-gray-500">{item.body}</p>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
