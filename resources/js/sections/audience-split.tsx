import * as LucideIcons from 'lucide-react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'audience-split',
    category: 'Marketing',
    icon: 'Users',
    description: 'Number, heading with circle accent, description, 4 icon columns, and image right.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: "Who It's For" },
    description: {
        type: 'textarea',
        label: 'Description',
        default:
            'Our Content Creation Package is perfect for brands and businesses looking to grow their presence and connect with their audience.',
    },
    image: { type: 'image', label: 'Image' },
    items: {
        type: 'array',
        label: 'Audience columns',
        default: [
            { icon: 'CalendarDays', title: 'Startups', body: 'Build your brand from the ground up.' },
            { icon: 'BarChart2', title: 'Growing Businesses', body: 'Scale your content and reach new audiences.' },
            { icon: 'Users', title: 'Established Brands', body: 'Strengthen your presence and stay top-of-mind.' },
            { icon: 'Megaphone', title: 'Agencies', body: 'White-label content support for your clients.' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon (Lucide name e.g. CalendarDays)', default: 'CalendarDays' },
            title: { type: 'text', label: 'Title', default: 'Audience' },
            body: { type: 'textarea', label: 'Description', default: 'Short description.' },
        },
    },
};

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    if (!name) return null;
    const Icon = (LucideIcons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string }> | undefined;
    if (!Icon) return <span className={className}>{name}</span>;
    return <Icon className={className} />;
}

type AudienceItem = {
    icon?: string;
    title?: string;
    body?: string;
};

type Props = {
    number?: string;
    heading?: string;
    description?: string;
    image?: string | null;
    items?: AudienceItem[];
};

export default function AudienceSplitSection({
    number,
    heading,
    description,
    image,
    items = [],
}: Props) {
    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-6 lg:flex-row">

                {/* ── Left ── */}
                <div className="w-full lg:w-3/5">

                    {/* Heading + decorative circle */}
                    {heading && (
                        <h2 className="mb-4 flex items-center gap-3 text-3xl font-extrabold leading-tight text-gray-900 lg:text-4xl">
                            {heading}
                            <span className="inline-block shrink-0 rounded-full bg-accent-brand" style={{ width: '4.5rem', height: '4.5rem' }} />
                        </h2>
                    )}

                    {/* Description */}
                    {description && (
                        <p className="mb-10 max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
                    )}

                    {/* 4-column icon grid */}
                    {items.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {items.map((item, i) => (
                                <div key={i}>
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-accent-brand/30 text-accent-brand">
                                        <DynamicIcon name={item.icon} className="h-5 w-5" />
                                    </div>
                                    {item.title && (
                                        <h3 className="mb-1 text-sm font-bold text-gray-900">{item.title}</h3>
                                    )}
                                    {item.body && (
                                        <p className="text-xs leading-relaxed text-gray-500">{item.body}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right: image ── */}
                <div className="w-full lg:w-2/5 lg:shrink-0">
                    {image ? (
                        <img
                            src={image}
                            alt=""
                            className="w-full rounded-3xl object-cover"
                            style={{ maxHeight: '420px' }}
                        />
                    ) : (
                        <div className="flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-gray-200">
                            <span className="text-sm text-gray-400">Add image</span>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
