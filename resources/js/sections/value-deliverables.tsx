import React from 'react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'value-deliverables',
    category: 'Marketing',
    icon: 'LayoutGrid',
    description: 'A grid of 6 horizontal cards detailing the value, assets, and deliverables of a program or subscription.',
};

export const schema: SectionSchema = {
    badgeText: { type: 'text', label: 'Badge Text', default: "WHAT YOU'LL GET" },
    headingText: { type: 'text', label: 'Heading Text', default: 'Curated. Practical. Actionable.' },
    subheadingText: {
        type: 'text',
        label: 'Subheading Text',
        default: 'Your weekly edge in people, culture and employer brand.',
    },
    items: {
        type: 'array',
        label: 'Deliverables List',
        default: [
            {
                icon: 'FileText',
                title: 'In-depth Insights',
                description: 'Research-backed insights on HR trends, employer branding, talent strategy and the future of work.',
            },
            {
                icon: 'Folder',
                title: 'Practical Resources',
                description: 'Templates, checklists, playbooks and frameworks you can immediately apply.',
            },
            {
                icon: 'TrendingUp',
                title: 'Real-world Case Studies',
                description: 'Learn from organizations that are building strong cultures and winning with people.',
            },
            {
                icon: 'CalendarDays',
                title: 'Event & Webinar Invites',
                description: 'Exclusive access to HR roundtables, webinars and masterclasses.',
            },
            {
                icon: 'Users',
                title: 'Expert Perspectives',
                description: 'Curated opinions from industry leaders, HR practitioners and subject matter experts.',
            },
            {
                icon: 'Star',
                title: 'First Access',
                description: 'Be the first to access our reports, resources and upcoming programs.',
            },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Lucide Icon Name', default: 'Check' },
            title: { type: 'text', label: 'Title', default: '' },
            description: { type: 'textarea', label: 'Description', default: '' },
        },
    },
    showDecorativeCircles: { type: 'boolean', label: 'Show Decorative Circles', default: true },
};

type DeliverableItem = {
    icon?: string;
    title?: string;
    description?: string;
};

type Props = {
    badgeText?: string;
    headingText?: string;
    subheadingText?: string;
    items?: DeliverableItem[];
    showDecorativeCircles?: boolean;
};

export default function ValueDeliverablesSection({
    badgeText = "WHAT YOU'LL GET",
    headingText = 'Curated. Practical. Actionable.',
    subheadingText = 'Your weekly edge in people, culture and employer brand.',
    items = [
        {
            icon: 'FileText',
            title: 'In-depth Insights',
            description: 'Research-backed insights on HR trends, employer branding, talent strategy and the future of work.',
        },
        {
            icon: 'Folder',
            title: 'Practical Resources',
            description: 'Templates, checklists, playbooks and frameworks you can immediately apply.',
        },
        {
            icon: 'TrendingUp',
            title: 'Real-world Case Studies',
            description: 'Learn from organizations that are building strong cultures and winning with people.',
        },
        {
            icon: 'CalendarDays',
            title: 'Event & Webinar Invites',
            description: 'Exclusive access to HR roundtables, webinars and masterclasses.',
        },
        {
            icon: 'Users',
            title: 'Expert Perspectives',
            description: 'Curated opinions from industry leaders, HR practitioners and subject matter experts.',
        },
        {
            icon: 'Star',
            title: 'First Access',
            description: 'Be the first to access our reports, resources and upcoming programs.',
        },
    ],
    showDecorativeCircles = true,
}: Props) {
    return (
        <section className="relative overflow-hidden bg-white py-12 lg:py-16 select-none">
            {/* Decorative Side Accents */}
            {showDecorativeCircles && (
                <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 lg:w-8 lg:h-8 -translate-x-1/2 rounded-full bg-accent-brand opacity-80 pointer-events-none" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 lg:w-8 lg:h-8 translate-x-1/2 rounded-full bg-accent-brand opacity-80 pointer-events-none" />
                </>
            )}

            <div className="mx-auto max-w-7xl px-4 md:px-7">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    {badgeText && (
                        <span className="text-xs font-bold tracking-widest text-accent-brand uppercase">
                            {badgeText}
                        </span>
                    )}
                    {headingText && (
                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand tracking-tight">
                            {headingText}
                        </h2>
                    )}
                    {subheadingText && (
                        <p className="font-sans text-sm sm:text-base md:text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            {subheadingText}
                        </p>
                    )}
                </div>

                {/* Grid */}
                {items && items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-row items-start gap-4 p-6 rounded-2xl bg-gray-50/50 border border-gray-100/80 hover:shadow-xs hover:border-gray-200 transition-all duration-300"
                            >
                                {/* Icon container */}
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-brand/10 text-accent-brand mt-1">
                                    <DynamicIcon name={item.icon} className="h-5 w-5" />
                                </div>

                                {/* Text content */}
                                <div className="space-y-1.5">
                                    {item.title && (
                                        <h3 className="font-heading text-base md:text-lg font-bold text-brand leading-snug">
                                            {item.title}
                                        </h3>
                                    )}
                                    {item.description && (
                                        <p className="font-sans text-sm text-gray-500 leading-relaxed">
                                            {item.description}
                                        </p>
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
