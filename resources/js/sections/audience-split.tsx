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
        type: 'richtext',
        label: 'Description',
        default:
            '<p>Our Content Creation Package is perfect for brands and businesses looking to grow their presence and connect with their audience.</p>',
    },
    image: { type: 'image', label: 'Image' },
    imageAlt: { type: 'text', label: 'Image Alt Text', default: '' },
    items: {
        type: 'array',
        label: 'Audience columns',
        default: [
            { icon: 'CalendarDays', title: 'Startups', body: '<p>Build your brand from the ground up.</p>' },
            { icon: 'BarChart2', title: 'Growing Businesses', body: '<p>Scale your content and reach new audiences.</p>' },
            { icon: 'Users', title: 'Established Brands', body: '<p>Strengthen your presence and stay top-of-mind.</p>' },
            { icon: 'Megaphone', title: 'Agencies', body: '<p>White-label content support for your clients.</p>' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon (Lucide name e.g. CalendarDays)', default: 'CalendarDays' },
            title: { type: 'text', label: 'Title', default: 'Audience' },
            body: { type: 'richtext', label: 'Description', default: '<p>Short description.</p>' },
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
    imageAlt?: string;
    items?: AudienceItem[];
};

export default function AudienceSplitSection({
    heading,
    description,
    image,
    imageAlt,
    items = [],
}: Props) {
    // Split heading to highlight the last word with a decorative solid circle
    const words = heading ? heading.split(' ') : [];
    const lastWord = words.pop() || '';
    const mainHeading = words.join(' ');

    return (
        <section className="bg-gray-50/50 py-16 lg:py-24">
            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-9 lg:flex-row lg:items-stretch lg:gap-16">

                {/* ── Left ── */}
                <div className="w-full lg:w-[68%] space-y-10">
                    <div>
                        {/* Heading + decorative circle */}
                        {heading && (
                            <h2 className="font-heading mb-4 text-3xl font-extrabold leading-tight text-brand sm:text-4xl">
                                {mainHeading}{' '}
                                <span className="relative inline-block z-10">
                                    {lastWord}
                                    <span className="absolute bottom-1 -right-3 -z-10 h-7 w-7 rounded-full bg-accent-brand sm:h-8 sm:w-8" />
                                </span>
                            </h2>
                        )}

                        {/* Description */}
                        {description && (
                            <div
                                className="max-w-xl prose prose-sm"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}
                    </div>

                    {/* 4-column icon grid with vertical separators */}
                    {items.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                            {items.map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col items-start ${i < items.length - 1
                                        ? 'lg:border-r lg:border-gray-200/80 lg:pr-5'
                                        : ''
                                        }`}
                                >
                                    <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-brand/10 text-accent-brand">
                                        <DynamicIcon name={item.icon} className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1.5">
                                        {item.title && (
                                            <h3 className="text-sm font-bold text-brand">{item.title}</h3>
                                        )}
                                        {item.body && (
                                            <div
                                                className="text-xs leading-relaxed text-gray-500 prose prose-sm max-w-none [&_p]:m-0"
                                                dangerouslySetInnerHTML={{ __html: item.body }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right: image ── */}
                <div className="w-full lg:w-[32%] lg:shrink-0 flex">
                    {image ? (
                        <img
                            src={image}
                            alt={imageAlt ?? ''}
                            className="w-full h-full min-h-[350px] lg:min-h-full rounded-3xl object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div className="flex aspect-[4/5] w-full h-full items-center justify-center rounded-3xl bg-gray-200">
                            <span className="text-sm text-gray-400">Add image</span>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
