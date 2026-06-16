import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import BrandButton from '@/components/ui/brand-button';
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
                quote: '<p>Studioit completely transformed our content strategy. The quality, consistency, and creativity of their work have helped us grow our audience and drive results.</p>',
                authorName: 'Emily Carter',
                authorTitle: 'Marketing Director, BrightCo',
                authorImage: null,
            },
        ],
        itemSchema: {
            quote: { type: 'richtext', label: 'Quote', default: '<p>Your testimonial here.</p>' },
            authorName: { type: 'text', label: 'Author name', default: 'John Doe' },
            authorTitle: { type: 'text', label: 'Author title', default: 'CEO, Company' },
            authorImage: { type: 'image', label: 'Author photo' },
        },
    },

    /* ── Right: CTA ── */
    ctaHeadingLine1: { type: 'text', label: 'CTA heading line 1', default: 'Ready to Elevate' },
    ctaHeadingLine2: { type: 'text', label: 'CTA heading line 2', default: 'Your Content?' },
    ctaDescription: {
        type: 'richtext',
        label: 'CTA description',
        default: "<p>Let's create content that connects, converts, and grows your brand.</p>",
    },
    primaryLabel: { type: 'text', label: 'Primary button label', default: 'Book a consultation' },
    primaryUrl: { type: 'url', label: 'Primary button URL', default: '#' },
    secondaryLabel: { type: 'text', label: 'Secondary link label', default: 'Or contact us directly' },
    secondaryUrl: { type: 'url', label: 'Secondary link URL', default: '#' },
    ctaImage: { type: 'image', label: 'CTA image' },
    ctaImageAlt: { type: 'text', label: 'CTA Image Alt Text', default: '' },
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
    ctaImageAlt?: string;
};

export default function TestimonialCtaSection({
    testimonialHeading,
    testimonials = [],
    ctaHeadingLine1,
    ctaHeadingLine2,
    ctaDescription,
    primaryLabel,
    primaryUrl,
    secondaryLabel,
    secondaryUrl,
    ctaImage,
    ctaImageAlt,
}: Props) {
    const [index, setIndex] = useState(0);
    const current = testimonials[index] ?? {};
    const total = testimonials.length;

    const ctaWords = ctaHeadingLine2 ? ctaHeadingLine2.split(' ') : [];
    const ctaLastWord = ctaWords.pop() || '';
    const ctaMainHeading = ctaWords.join(' ');

    return (
        <section className="bg-gray-50 py-16 lg:py-24">
            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-7 lg:flex-row lg:items-stretch lg:gap-0">

                {/* ── Left: Testimonial ── */}
                <div className="flex w-full flex-col justify-between border-b border-gray-200/80 py-10 lg:w-[40%] lg:border-b-0 lg:border-r lg:border-gray-200/80 lg:py-0 lg:pr-10">

                    {testimonialHeading && (
                        <h2 className="mb-6 text-2xl font-extrabold text-gray-900 lg:text-3xl">
                            {testimonialHeading}
                        </h2>
                    )}

                    {/* Quote text with solid quote mark above */}
                    <div className="relative mb-8">
                        <span className="block text-4xl font-serif font-black text-accent-brand leading-none mb-4 select-none">&ldquo;</span>
                        {current.quote && (
                            <div
                                className="text-gray-600 prose prose-sm"
                                dangerouslySetInnerHTML={{ __html: current.quote }}
                            />
                        )}
                    </div>

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
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIndex((i) => (i - 1 + total) % total)}
                                disabled={total <= 1}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-accent-brand hover:text-accent-brand disabled:opacity-40"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIndex((i) => (i + 1) % total)}
                                disabled={total <= 1}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-brand text-white transition hover:bg-accent-brand/90 disabled:opacity-40"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Middle: CTA Text ── */}
                <div className="w-full flex flex-col justify-between border-b border-gray-200/80 py-10 lg:w-[35%] lg:border-b-0 lg:py-0 lg:px-10">
                    <div>
                        <h2 className="mb-5 text-3xl font-extrabold leading-tight text-brand lg:text-4xl">
                            {ctaHeadingLine1 && <span className="block">{ctaHeadingLine1}</span>}
                            {ctaHeadingLine2 && (
                                <span className="relative inline-block z-10">
                                    {ctaMainHeading}{' '}
                                    <span className="relative inline-block z-10">
                                        {ctaLastWord}
                                        <span
                                            className="absolute bottom-1 -right-3 -z-10 h-7 w-7 rounded-full bg-accent-brand sm:h-9 sm:w-9"
                                        />
                                    </span>
                                </span>
                            )}
                        </h2>

                        {ctaDescription && (
                            <div
                                className="mb-8 prose prose-sm"
                                dangerouslySetInnerHTML={{ __html: ctaDescription }}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-4 items-stretch w-full max-w-xs">
                        {primaryLabel && primaryUrl && (
                            <BrandButton variant="secondary" href={primaryUrl} className="w-full shadow-none">
                                {primaryLabel}
                            </BrandButton>
                        )}
                        {secondaryLabel && secondaryUrl && (
                            <BrandButton variant="outline" href={secondaryUrl} className="w-full">
                                {secondaryLabel}
                            </BrandButton>
                        )}
                    </div>
                </div>

                {/* ── Right: CTA Image ── */}
                <div className="w-full lg:w-[25%] lg:shrink-0 flex flex-col justify-stretch py-10 lg:py-0">
                    {ctaImage ? (
                        <img
                            src={ctaImage}
                            alt={ctaImageAlt ?? ''}
                            className="w-full h-full min-h-[350px] lg:min-h-full rounded-3xl object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
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
