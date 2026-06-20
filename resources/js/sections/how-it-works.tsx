import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'how-it-works',
    category: 'Marketing',
    icon: 'ListOrdered',
    description: 'Split section: How it works horizontal steps on the left, testimonial blockquote card on the right.',
};

export const schema: SectionSchema = {
    badgeText: { type: 'text', label: 'Badge Text', default: 'HOW IT WORKS' },
    headingText: { type: 'text', label: 'Heading Text', default: 'Simple. Personal. Secure.' },
    steps: {
        type: 'array',
        label: 'Process Steps',
        default: [
            { icon: 'FileText', title: 'Apply', description: 'Fill out the short application form.' },
            { icon: 'Search', title: 'Review', description: 'Our team reviews your details.' },
            { icon: 'Mail', title: 'Approve', description: "You'll receive an email once you're approved." },
            { icon: 'UserCheck', title: 'Access', description: 'Start receiving HR Library in your inbox & WhatsApp.' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Lucide Icon Name', default: 'Check' },
            title: { type: 'text', label: 'Step Title', default: '' },
            description: { type: 'text', label: 'Step Description', default: '' },
        },
    },
    testimonialQuote: {
        type: 'textarea',
        label: 'Testimonial Quote',
        default: "HR Library is the one newsletter I never skip. It's relevant, practical and helps me stay ahead in my role.",
    },
    testimonialAuthorName: { type: 'text', label: 'Author Name', default: 'Anita Sharma' },
    testimonialAuthorTitle: { type: 'text', label: 'Author Title', default: 'Head of People, Tech Company' },
    testimonialAuthorImage: { type: 'image', label: 'Author Photo' },
};

type StepItem = {
    icon?: string;
    title?: string;
    description?: string;
};

type Props = {
    badgeText?: string;
    headingText?: string;
    steps?: StepItem[];
    testimonialQuote?: string;
    testimonialAuthorName?: string;
    testimonialAuthorTitle?: string;
    testimonialAuthorImage?: string | null;
};

export default function HowItWorksSection({
    badgeText = 'HOW IT WORKS',
    headingText = 'Simple. Personal. Secure.',
    steps = [
        { icon: 'FileText', title: 'Apply', description: 'Fill out the short application form.' },
        { icon: 'Search', title: 'Review', description: 'Our team reviews your details.' },
        { icon: 'Mail', title: 'Approve', description: "You'll receive an email once you're approved." },
        { icon: 'UserCheck', title: 'Access', description: 'Start receiving HR Library in your inbox & WhatsApp.' },
    ],
    testimonialQuote = "HR Library is the one newsletter I never skip. It's relevant, practical and helps me stay ahead in my role.",
    testimonialAuthorName = 'Anita Sharma',
    testimonialAuthorTitle = 'Head of People, Tech Company',
    testimonialAuthorImage = null,
}: Props) {
    return (
        <section className="bg-white py-12 lg:py-16 select-none">
            <div className="mx-auto max-w-7xl px-4 md:px-7">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 items-stretch">

                    {/* ── Left Card: How it Works Process ── */}
                    <div className="lg:col-span-3 flex flex-col justify-between rounded-[2.5rem] border border-gray-100 bg-gray-50/50 py-8 px-4 md:p-10 shadow-xs hover:shadow-md transition-shadow duration-300">
                        <div className="space-y-4">
                            {badgeText && (
                                <span className="text-xs font-bold tracking-wider text-accent-brand uppercase">
                                    {badgeText}
                                </span>
                            )}
                            {headingText && (
                                <h2 className="font-heading text-2xl md:text-3xl font-extrabold leading-tight text-brand">
                                    {headingText}
                                </h2>
                            )}
                        </div>

                        {/* Steps Flow Container */}
                        {steps && steps.length > 0 && (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative w-full pt-10">
                                {steps.map((step, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="flex-1 flex flex-row md:flex-col justify-left items-center md:text-center bg-accent md:bg-transparent py-3 pr-2 pl-5 rounded-lg w-full gap-x-5">
                                            {/* Icon rounded card wrapper */}
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-brand/10 text-accent-brand">
                                                <DynamicIcon name={step.icon} className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="block text-sm font-bold text-gray-900 mt-4 leading-none">
                                                    {idx + 1}. {step.title}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-2 leading-relaxed md:max-w-[300px]">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Horizontal arrow divider between items (hidden on mobile) */}
                                        {idx < steps.length - 1 && (
                                            <div className="hidden md:flex h-12 items-center text-gray-300 select-none">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right Card: Dark Testimonial Box ── */}
                    <div className="lg:col-span-2 flex flex-col justify-between rounded-[2.5rem] bg-brand text-white p-8 md:p-10 shadow-xs hover:shadow-md transition-shadow duration-300">

                        {/* Quote icon at top */}
                        <div className="text-accent-brand select-none">
                            <span className="block font-serif text-5xl font-black leading-none mb-6">
                                &ldquo;
                            </span>
                        </div>

                        {/* Testimonial Quote */}
                        {testimonialQuote && (
                            <p className="font-sans text-base sm:text-lg font-medium text-white/95 leading-relaxed max-w-sm mb-8">
                                {testimonialQuote}
                            </p>
                        )}

                        {/* Author Profile */}
                        <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                            {testimonialAuthorImage ? (
                                <img
                                    src={testimonialAuthorImage}
                                    alt={testimonialAuthorName}
                                    className="h-10 w-10 rounded-full object-cover shrink-0"
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-brand text-white text-xs font-bold uppercase">
                                    {testimonialAuthorName.charAt(0)}
                                </div>
                            )}
                            <div className="text-left">
                                <span className="block text-sm font-bold text-white">
                                    {testimonialAuthorName}
                                </span>
                                <span className="block text-xs text-gray-400 mt-0.5 leading-none">
                                    {testimonialAuthorTitle}
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
