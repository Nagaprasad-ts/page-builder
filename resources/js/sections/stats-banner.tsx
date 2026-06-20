import React from 'react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'stats-banner',
    category: 'Marketing',
    icon: 'Percent',
    description: 'A horizontal banner showing key metrics, trust indicators, and achievements.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: 'Trusted by Forward-Thinking HR Leaders' },
    description: {
        type: 'text',
        label: 'Description',
        default: 'From startups to enterprises, HR leaders across industries trust HR Library.',
    },
    items: {
        type: 'array',
        label: 'Stat Items',
        default: [
            { value: '750+', label: 'HR Leaders' },
            { value: '150+', label: 'Companies' },
            { value: '25+', label: 'Industries' },
            { value: '98%', label: 'Reader Satisfaction' },
        ],
        itemSchema: {
            value: { type: 'text', label: 'Stat Value (e.g. 750+)', default: '' },
            label: { type: 'text', label: 'Stat Label (e.g. HR Leaders)', default: '' },
        },
    },
};

type StatItem = {
    value?: string;
    label?: string;
};

type Props = {
    heading?: string;
    description?: string;
    items?: StatItem[];
};

export default function StatsBannerSection({
    heading = 'Trusted by Forward-Thinking HR Leaders',
    description = 'From startups to enterprises, HR leaders across industries trust HR Library.',
    items = [
        { value: '750+', label: 'HR Leaders' },
        { value: '150+', label: 'Companies' },
        { value: '25+', label: 'Industries' },
        { value: '98%', label: 'Reader Satisfaction' },
    ],
}: Props) {
    return (
        <section className="bg-white py-12 lg:py-16 select-none">
            <div className="mx-auto max-w-7xl px-4 md:px-7">
                <div className="rounded-[2.5rem] border border-gray-100 bg-gray-50/50 p-8 md:p-12 lg:py-16 lg:px-14">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
                        
                        {/* Left Side: Header & Text */}
                        <div className="lg:col-span-5 space-y-3 text-left">
                            {heading && (
                                <h2 className="font-heading text-2xl md:text-3xl font-extrabold leading-tight text-brand">
                                    {heading}
                                </h2>
                            )}
                            {description && (
                                <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-md">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Right Side: Stat Items */}
                        {items && items.length > 0 && (
                            <div className="lg:col-span-7 w-full">
                                <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:flex md:flex-row md:items-center md:justify-around md:divide-x md:divide-gray-200/80 md:gap-0">
                                    {items.map((stat, idx) => (
                                        <div 
                                            key={idx} 
                                            className="text-center md:flex-1 md:px-4 space-y-1.5 md:space-y-2"
                                        >
                                            {stat.value && (
                                                <span className="block font-heading text-4xl sm:text-5xl font-black tracking-tight text-accent-brand">
                                                    {stat.value}
                                                </span>
                                            )}
                                            {stat.label && (
                                                <span className="block font-sans text-xs sm:text-sm font-bold text-gray-900 leading-normal">
                                                    {stat.label}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
