import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'explore-services',
    category: 'Marketing',
    icon: 'Grid',
    description: 'A 6-card services/solutions showcase grid with image preview, overlapping badges, and custom icons.',
};

const DEFAULT_SERVICES = [
    {
        title: 'Create engaging content',
        description: '<p>From idea to final cut, we create videos that inform, inspire, and leave a lasting impact.</p>',
        icon: 'Video',
        image: null,
        imageAlt: '',
        linkUrl: '#',
    },
    {
        title: 'Self serve products',
        description: '<p>Premium templates and tools to help you create stunning presentations on your own.</p>',
        icon: 'Cpu',
        image: null,
        imageAlt: '',
        linkUrl: '#',
    },
    {
        title: 'Skills training for every subscriber',
        description: '<p>Learn from industry experts and build skills that take you forward.</p>',
        icon: 'GraduationCap',
        image: null,
        imageAlt: '',
        linkUrl: '#',
    },
    {
        title: 'Face-to-face presentations and workshops',
        description: '<p>Interactive sessions designed to engage your team and drive real results.</p>',
        icon: 'Users',
        image: null,
        imageAlt: '',
        linkUrl: '#',
    },
    {
        title: 'Broadcast quality live webinars',
        description: '<p>High-quality, seamless webinars that connect and convert.</p>',
        icon: 'Radio',
        image: null,
        imageAlt: '',
        linkUrl: '#',
    },
    {
        title: 'Online video courses for education',
        description: '<p>Engaging courses that educate, inspire, and deliver results.</p>',
        icon: 'ShoppingBag',
        image: null,
        imageAlt: '',
        linkUrl: '#',
    },
];

export const schema: SectionSchema = {
    label: { type: 'text', label: 'Section Label', default: 'We can help you with' },
    heading: { type: 'text', label: 'Section Heading', default: 'Explore Our Services' },
    services: {
        type: 'array',
        label: 'Services list',
        default: DEFAULT_SERVICES,
        itemSchema: {
            image: { type: 'image', label: 'Card Image' },
            imageAlt: { type: 'text', label: 'Image Alt Text', default: '' },
            icon: { type: 'text', label: 'Icon (Lucide name e.g. Video, Cpu)', default: 'Video' },
            title: { type: 'text', label: 'Title', default: 'Service Title' },
            description: { type: 'richtext', label: 'Description', default: '<p>Short service description.</p>' },
            linkUrl: { type: 'url', label: 'Link URL', default: '#' },
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

type ServiceCard = {
    image?: string | null;
    imageAlt?: string;
    icon?: string;
    title?: string;
    description?: string;
    linkUrl?: string;
};

type Props = {
    label?: string;
    heading?: string;
    services?: ServiceCard[];
};

export default function ExploreServicesSection({
    label = 'We can help you with',
    heading = 'Explore Our Services',
    services,
}: Props) {
    const rawServices = services ? Object.values(services) : [];
    const items: ServiceCard[] = rawServices.length > 0 ? rawServices : DEFAULT_SERVICES;

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 md:px-7">

                {/* ── Heading Block ── */}
                <div className="mb-16 text-center space-y-3">
                    {label && (
                        <p className="text-sm font-semibold tracking-wide text-accent-brand uppercase">
                            {label}
                        </p>
                    )}
                    {heading && (
                        <h2 className="font-heading text-3xl font-extrabold text-brand sm:text-4xl lg:text-5xl">
                            {heading}
                        </h2>
                    )}
                </div>

                {/* ── Services Grid ── */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((service, i) => (
                        <div
                            key={i}
                            className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                        >
                            {/* Card Image Block */}
                            <div className="relative aspect-video w-full bg-gray-100">
                                <div className="absolute inset-0 overflow-hidden">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.imageAlt || service.title || ''}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand/5 to-brand/15">
                                            <span className="text-xs text-gray-400 font-medium">Add service image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Floating Badged Icon */}
                                {service.icon && (
                                    <div className="absolute -bottom-6 left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-accent-brand text-white shadow-md border-4 border-white transition-colors duration-300 group-hover:bg-brand">
                                        <DynamicIcon name={service.icon} className="h-5 w-5" />
                                    </div>
                                )}
                            </div>

                            {/* Card Details Block */}
                            <div className="flex flex-1 flex-col p-6 pt-10 justify-between">
                                <div className="space-y-3">
                                    {service.title && (
                                        <h3 className="font-heading text-lg font-bold text-gray-900 leading-snug group-hover:text-accent-brand transition-colors duration-200">
                                            {service.title}
                                        </h3>
                                    )}
                                    {service.description && (
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: service.description }}
                                        />
                                    )}
                                </div>

                                {/* Arrow Button */}
                                {service.linkUrl && (
                                    <div className="flex justify-end pt-2">
                                        <a
                                            href={service.linkUrl}
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-colors duration-200 hover:bg-accent-brand"
                                            aria-label={service.title ? `Explore ${service.title}` : 'Explore Service'}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
