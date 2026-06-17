import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'testimonials',
    category: 'Marketing',
    icon: 'MessageSquareQuote',
    description: 'Client testimonials — heading left, 2 sliding quote cards right.',
};

const DEFAULT_TESTIMONIALS = [
    {
        quote: '<p>Working with EVP HQ transformed how we present ourselves to potential talent. Our employer brand finally feels authentic and compelling.</p>',
        authorName: 'Sarah Mitchell',
        authorTitle: 'Head of People, TechCorp',
        authorImage: null,
    },
    {
        quote: '<p>The team at EVP HQ truly understands the intersection of culture and branding. They helped us build something our employees are proud of.</p>',
        authorName: 'Rahul Sharma',
        authorTitle: 'HR Director, Innovate Labs',
        authorImage: null,
    },
    {
        quote: '<p>From strategy to execution, every step felt intentional. We saw a measurable improvement in candidate quality within months.</p>',
        authorName: 'Priya Nair',
        authorTitle: 'Talent Acquisition Lead, FinEdge',
        authorImage: null,
    },
];

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Heading',
        default: 'What Our Customers Say',
    },
    subtext: {
        type: 'richtext',
        label: 'Subtext',
        default: '<p>We have stood out with people-first solutions crafted to strengthen employer brands, workplace culture, and talent experiences.</p>',
    },
    testimonials: {
        type: 'array',
        label: 'Testimonials',
        default: DEFAULT_TESTIMONIALS,
        itemSchema: {
            quote: { type: 'richtext', label: 'Quote', default: '<p>Your testimonial here.</p>' },
            authorName: { type: 'text', label: 'Author name', default: 'Jane Brooklyn' },
            authorTitle: { type: 'text', label: 'Author title', default: 'New company director' },
            authorImage: { type: 'image', label: 'Author photo' },
        },
    },
};

type Testimonial = {
    quote?: string;
    authorName?: string;
    authorTitle?: string;
    authorImage?: string | null;
};

type Props = {
    heading?: string;
    subtext?: string;
    testimonials?: Testimonial[];
};

export default function TestimonialsSection({ heading, subtext, testimonials }: Props) {
    const items: Testimonial[] = (testimonials ? Object.values(testimonials) : []).length > 0
        ? Object.values(testimonials ?? {})
        : DEFAULT_TESTIMONIALS;

    const [visibleCount, setVisibleCount] = useState(2);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const update = () => {
            const nextVal = window.innerWidth < 768 ? 1 : 2;
            setVisibleCount((prev) => (prev !== nextVal ? nextVal : prev));
        };
        update();
        window.addEventListener('resize', update);

        return () => window.removeEventListener('resize', update);
    }, []);

    const maxIndex = Math.max(0, items.length - visibleCount);
    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(maxIndex, i + 1));
    const visible = items.slice(index, index + visibleCount);

    // Split heading: all words except last, + last word (gets circle)
    const words = (heading ?? '').trim().split(' ');
    const lastWord = words.pop() ?? '';
    const firstPart = words.join(' ');

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-7">

                {/* Outer: flex row on desktop, stack on mobile */}
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

                    {/* ── Left: heading + subtext + arrows ── */}
                    <div className="lg:w-[40%] lg:shrink-0">
                        {heading && (
                            <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                                {firstPart && <span className="block">{firstPart}</span>}
                                <span className="relative inline-block">
                                    <span
                                        className="absolute rounded-full bg-accent-brand"
                                        style={{ inset: '-6px -4px', zIndex: 0 }}
                                    />
                                    <span className="relative" style={{ zIndex: 1 }}>{lastWord}</span>
                                </span>
                            </h2>
                        )}

                        {subtext && (
                            <div
                                className="mb-8 prose prose-sm"
                                dangerouslySetInnerHTML={{ __html: subtext }}
                            />
                        )}

                        {/* Arrows + dots */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                type="button"
                                onClick={prev}
                                disabled={index === 0}
                                aria-label="Previous"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                disabled={index >= maxIndex}
                                aria-label="Next"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ArrowRight className="h-5 w-5" />
                            </button>
                            <div className="ml-2 flex items-center gap-1.5">
                                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setIndex(i)}
                                        className={[
                                            'h-1.5 rounded-full transition-all duration-300',
                                            i === index ? 'w-6 bg-brand' : 'w-1.5 bg-gray-300 hover:bg-gray-400',
                                        ].join(' ')}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: 2 cards side by side ── */}
                    <div className="flex w-full gap-6 lg:w-[60%]">
                        {visible.map((item, i) => (
                            <div
                                key={`${index}-${i}`}
                                className="flex flex-1 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                            >
                                {/* Quote mark */}
                                <div>
                                    <span className="mb-4 block text-3xl font-black leading-none text-accent-brand">
                                        &ldquo;
                                    </span>
                                    {item.quote && (
                                        <div
                                            className="mb-8 text-gray-700 prose prose-sm"
                                            dangerouslySetInnerHTML={{ __html: item.quote }}
                                        />
                                    )}
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                    {item.authorImage ? (
                                        <img
                                            src={item.authorImage}
                                            alt={item.authorName ?? ''}
                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div
                                            className="flex shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
                                            style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem' }}
                                        >
                                            {item.authorName?.charAt(0) ?? 'A'}
                                        </div>
                                    )}
                                    <div>
                                        {item.authorName && (
                                            <p className="text-sm font-semibold text-gray-900">{item.authorName}</p>
                                        )}
                                        {item.authorTitle && (
                                            <p className="text-xs text-gray-500">{item.authorTitle}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex md:hidden items-center gap-3">
                        <button
                            type="button"
                            onClick={prev}
                            disabled={index === 0}
                            aria-label="Previous"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            disabled={index >= maxIndex}
                            aria-label="Next"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </button>
                        <div className="ml-2 flex items-center gap-1.5">
                            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setIndex(i)}
                                    className={[
                                        'h-1.5 rounded-full transition-all duration-300',
                                        i === index ? 'w-6 bg-brand' : 'w-1.5 bg-gray-300 hover:bg-gray-400',
                                    ].join(' ')}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
