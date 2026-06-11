import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'testimonial-cta',
    category: 'Marketing',
    icon: 'LayoutColumns',
    description: 'Two-column: left testimonial slider, right CTA with image.',
};

export const schema: SectionSchema = {
    /* ── Left: testimonial ── */
    testimonialHeading: { type: 'text', label: 'Testimonial heading', default: 'What Our Clients Say' },
    testimonials: {
        type: 'array',
        label: 'Testimonials',
        default: [
            {
                quote: 'Studioit completely transformed our content strategy. The quality, consistency, and creativity of their work have helped us grow our audience and drive results.',
                authorName: 'Emily Carter',
                authorTitle: 'Marketing Director, BrightCo',
                authorImage: null,
            },
        ],
        itemSchema: {
            quote: { type: 'textarea', label: 'Quote', default: 'Your testimonial here.' },
            authorName: { type: 'text', label: 'Author name', default: 'John Doe' },
            authorTitle: { type: 'text', label: 'Author title', default: 'CEO, Company' },
            authorImage: { type: 'image', label: 'Author photo' },
        },
    },

    /* ── Right: CTA ── */
    ctaHeadingLine1: { type: 'text', label: 'CTA heading line 1', default: 'Ready to Elevate' },
    ctaHeadingLine2: { type: 'text', label: 'CTA heading line 2', default: 'Your Content?' },
    ctaDescription: {
        type: 'textarea',
        label: 'CTA description',
        default: "Let's create content that connects, converts, and grows your brand.",
    },
    primaryLabel: { type: 'text', label: 'Primary button label', default: 'Book a consultation' },
    primaryUrl: { type: 'url', label: 'Primary button URL', default: '#' },
    secondaryLabel: { type: 'text', label: 'Secondary link label', default: 'Or contact us directly' },
    secondaryUrl: { type: 'url', label: 'Secondary link URL', default: '#' },
    ctaImage: { type: 'image', label: 'CTA image' },
};

type TestimonialItem = {
    quote?: string;
    authorName?: string;
    authorTitle?: string;
    authorImage?: string | null;
};

type Props = {
    testimonialNumber?: string;
    testimonialHeading?: string;
    testimonials?: TestimonialItem[];
    ctaNumber?: string;
    ctaHeadingLine1?: string;
    ctaHeadingLine2?: string;
    ctaDescription?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
    ctaImage?: string | null;
};

export default function TestimonialCtaSection({
    testimonialNumber,
    testimonialHeading,
    testimonials = [],
    ctaNumber,
    ctaHeadingLine1,
    ctaHeadingLine2,
    ctaDescription,
    primaryLabel,
    primaryUrl,
    secondaryLabel,
    secondaryUrl,
    ctaImage,
}: Props) {
    const [index, setIndex] = useState(0);
    const current = testimonials[index] ?? {};
    const total = testimonials.length;

    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto flex max-w-7xl flex-col gap-0 px-6 lg:flex-row">

                {/* ── Left: Testimonial ── */}
                <div className="flex w-full flex-col justify-between border-b border-border py-10 lg:w-1/2 lg:border-b-0 lg:border-r lg:py-0 lg:pr-12">

                    {testimonialHeading && (
                        <h2 className="mb-6 text-2xl font-extrabold text-gray-900 lg:text-3xl">
                            {testimonialHeading}
                        </h2>
                    )}

                    {/* Quote text with decorative quote mark behind */}
                    {current.quote && (
                        <div className="relative mb-8">
                            <span className="pointer-events-none absolute -left-4 -top-6 select-none text-8xl font-black leading-none text-accent-brand/30" style={{ zIndex: 0 }}>&ldquo;</span>
                            <p className="relative text-sm leading-relaxed text-gray-600" style={{ zIndex: 1 }}>{current.quote}</p>
                        </div>
                    )}

                    {/* Author + navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {current.authorImage ? (
                                <img
                                    src={current.authorImage}
                                    alt={current.authorName ?? ''}
                                    className="rounded-full object-cover"
                                    style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem' }}
                                />
                            ) : (
                                <div
                                    className="flex items-center justify-center rounded-full bg-accent-brand/20 text-xs font-bold text-accent-brand"
                                    style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem' }}
                                >
                                    {current.authorName?.charAt(0) ?? '?'}
                                </div>
                            )}
                            <div>
                                {current.authorName && (
                                    <p className="text-xs font-bold text-gray-900">{current.authorName}</p>
                                )}
                                {current.authorTitle && (
                                    <p className="text-xs text-gray-400">{current.authorTitle}</p>
                                )}
                            </div>
                        </div>

                        {/* Arrows */}
                        {total > 1 && (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIndex((i) => (i - 1 + total) % total)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-gray-500 transition hover:border-accent-brand hover:text-accent-brand"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIndex((i) => (i + 1) % total)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-brand text-white transition hover:bg-accent-brand/90"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right: CTA ── */}
                <div className="flex w-full gap-8 py-10 lg:w-1/2 lg:pl-12 lg:py-0">
                    <div className="flex-1">

                        <h2 className="mb-5 text-2xl font-extrabold leading-tight text-gray-900 lg:text-3xl">
                            {ctaHeadingLine1 && (
                                <span className="flex items-center gap-3">
                                    <span>{ctaHeadingLine1}</span>
                                    <span
                                        className="inline-block shrink-0 rounded-full bg-accent-brand"
                                        style={{ width: '1.5rem', height: '1.5rem' }}
                                    />
                                </span>
                            )}
                            {ctaHeadingLine2 && <span className="block">{ctaHeadingLine2}</span>}
                        </h2>

                        {ctaDescription && (
                            <p className="mb-8 text-sm leading-relaxed text-gray-500">{ctaDescription}</p>
                        )}

                        <div className="flex flex-col gap-4">
                            {primaryLabel && primaryUrl && (
                                <a
                                    href={primaryUrl}
                                    className="inline-flex w-fit items-center gap-3 rounded-full bg-gray-900 py-3 pl-6 pr-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                                >
                                    {primaryLabel}
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-brand">
                                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                                    </span>
                                </a>
                            )}
                            {secondaryLabel && secondaryUrl && (
                                <a
                                    href={secondaryUrl}
                                    className="ml-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-accent-brand"
                                >
                                    {secondaryLabel}
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-brand/20 text-accent-brand">
                                        <ArrowRight className="h-3 w-3" />
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* CTA image */}
                    {ctaImage ? (
                        <div className="hidden w-40 shrink-0 lg:block">
                            <img
                                src={ctaImage}
                                alt=""
                                className="h-full w-full rounded-2xl object-cover"
                            />
                        </div>
                    ) : (
                        <div className="hidden w-40 shrink-0 lg:flex items-center justify-center rounded-2xl bg-gray-200">
                            <span className="text-xs text-gray-400 text-center px-2">Add image</span>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
