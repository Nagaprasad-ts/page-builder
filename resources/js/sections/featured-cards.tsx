import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'featured-cards',
    category: 'Marketing',
    icon: 'LayoutGrid',
    description: 'Sliding card grid with heading, subtext, and per-card links.',
};

const DEFAULT_CARDS = [
    {
        title: 'EVP Strategy',
        description:
            'Define a compelling Employer Value Proposition (EVP) that aligns perception, culture, and hiring goals across every talent touchpoint.',
        linkLabel: 'Learn more',
        linkUrl: '#',
    },
    {
        title: 'Employer Branding',
        description:
            'Build a recognizable employer brand that helps your company attract better talent and stand out in competitive hiring.',
        linkLabel: 'Learn more',
        linkUrl: '#',
    },
    {
        title: 'Recruitment Branding',
        description:
            'Enable consistent recruitment and hiring communication that increase candidate interest, applications, and engagement across recruitment drives.',
        linkLabel: 'Learn more',
        linkUrl: '#',
    },
    {
        title: 'LinkedIn Branding',
        description:
            'Strengthen company and leadership presence through consistent storytelling, thought leadership, and employer-focused content.',
        linkLabel: 'Learn more',
        linkUrl: '#',
    },
    {
        title: 'Employee Experience',
        description:
            'Design meaningful employee journeys that improve engagement, retention, workplace culture, and overall employer perception.',
        linkLabel: 'Learn more',
        linkUrl: '#',
    },
    {
        title: 'HR Tech & Automation',
        description:
            'Streamline hiring and people operations with integrated HR systems, automation workflows, and recruitment analytics.',
        linkLabel: 'Learn more',
        linkUrl: '#',
    },
];

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Heading',
        default: 'Brand Solutions Across Every Touchpoint',
    },
    subtext: {
        type: 'textarea',
        label: 'Subtext',
        default:
            'From strategy to experience, EVP Headquarters helps companies shape perception, attract better talent, and build stronger workplaces.',
    },
    cards: {
        type: 'array',
        label: 'Cards',
        default: DEFAULT_CARDS,
        itemSchema: {
            title: { type: 'text', label: 'Title', default: 'Card Title' },
            description: { type: 'textarea', label: 'Description', default: 'Card description.' },
            image: { type: 'image', label: 'Image' },
            linkLabel: { type: 'text', label: 'Link label', default: 'Learn more' },
            linkUrl: { type: 'url', label: 'Link URL', default: '#' },
        },
    },
};

type Card = {
    title?: string;
    description?: string;
    image?: string | null;
    linkLabel?: string;
    linkUrl?: string;
};

type Props = {
    heading?: string;
    subtext?: string;
    cards?: Card[];
};

export default function FeaturedCardsSection({ heading, subtext, cards }: Props) {
    // Normalise: DB JSON may deserialise as a plain object instead of an array
    const rawCards = cards ? Object.values(cards) : [];
    const items: Card[] = rawCards.length > 0 ? rawCards : DEFAULT_CARDS;
    const total = items.length;

    const [index, setIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(2);

    useEffect(() => {
        const update = () => setVisibleCount(window.innerWidth < 768 ? 1 : 2);
        update();
        window.addEventListener('resize', update);
        
        return () => window.removeEventListener('resize', update);
    }, []);

    const maxIndex = Math.max(0, total - visibleCount);
    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(maxIndex, i + 1));
    const visible = items.slice(index, index + visibleCount);

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

                    {/* ── Left 40%: heading + subtext + arrows ── */}
                    <div className="lg:w-[40%] lg:shrink-0">
                        {/* Blue accent bar */}
                        <div className="mb-5 h-1 w-12 rounded-full bg-blue-600" />

                        {heading && (
                            <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                                {heading}
                            </h2>
                        )}

                        {subtext && (
                            <p className="mb-10 text-base leading-relaxed text-gray-500">
                                {subtext}
                            </p>
                        )}

                        {/* Arrow controls */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={prev}
                                disabled={index === 0}
                                aria-label="Previous"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                disabled={index >= maxIndex}
                                aria-label="Next"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ArrowRight className="h-5 w-5" />
                            </button>

                            {/* Dot indicators */}
                            <div className="ml-2 flex items-center gap-1.5">
                                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setIndex(i)}
                                        className={[
                                            'h-1.5 rounded-full transition-all',
                                            i === index
                                                ? 'w-6 bg-blue-600'
                                                : 'w-1.5 bg-gray-300 hover:bg-gray-400',
                                        ].join(' ')}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right 60%: cards ── */}
                    <div className="flex w-full gap-6 lg:w-[60%]">
                        {visible.map((card, i) => (
                            <div
                                key={`${index}-${i}`}
                                className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                            >
                                {/* Card image */}
                                {card.image ? (
                                    <div className="h-48 w-full overflow-hidden">
                                        <img
                                            src={card.image}
                                            alt={card.title ?? ''}
                                            className="h-full w-full object-cover transition hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center bg-blue-50">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                                            {String(index + i + 1).padStart(2, '0')}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-6">
                                    {/* Blue number badge — shown only when image is present */}
                                    {card.image && (
                                        <div className="mb-3 text-xs font-bold text-blue-600">
                                            {String(index + i + 1).padStart(2, '0')}
                                        </div>
                                    )}

                                    <h3 className="mb-3 text-lg font-bold text-gray-900">
                                        {card.title}
                                    </h3>

                                    <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
                                        {card.description}
                                    </p>

                                    {card.linkLabel && card.linkUrl && (
                                        <a
                                            href={card.linkUrl}
                                            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                                        >
                                            {card.linkLabel}
                                            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Fill empty slot if odd number of cards */}
                        {visible.length < visibleCount && (
                            <div className="flex-1" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
