import React from 'react';
import BrandButton from '@/components/ui/brand-button';
import { cn } from '@/lib/utils';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'alternate-cards',
    category: 'Marketing',
    icon: 'Layers',
    description: 'Checkerboard grid of alternating image and text cards.',
};

const DEFAULT_IMAGES = [
    { image: null, alt: '' },
    { image: null, alt: '' },
    { image: null, alt: '' },
    { image: null, alt: '' },
];

const DEFAULT_ITEMS = [
    {
        title: 'Branded Workspaces',
        description: '<p>Turn everyday office spaces into immersive brand experiences that reflect your culture, vision, and identity.</p>',
        linkLabel: 'Workspace Branding',
        linkUrl: '#',
    },
    {
        title: 'Hiring Experiences',
        description: '<p>Create meaningful candidate journeys that leave lasting impressions from first interaction to final onboarding.</p>',
        linkLabel: 'Candidate Experience',
        linkUrl: '#',
    },
    {
        title: 'Skill Development',
        description: '<p>Interactive learning programs designed to upskill teams, enhance performance, and encourage continuous growth.</p>',
        linkLabel: 'Training and Workshops',
        linkUrl: '#',
    },
    {
        title: 'Team Messaging',
        description: '<p>Strengthen internal culture with communication strategies that keep teams aligned, informed, and engaged.</p>',
        linkLabel: 'Internal Communication',
        linkUrl: '#',
    },
];

export const schema: SectionSchema = {
    headingLine1: {
        type: 'text',
        label: 'Heading Line 1',
        default: 'Initiatives that matter,',
    },
    headingLine2: {
        type: 'text',
        label: 'Heading Line 2',
        default: 'the most!',
    },
    images: {
        type: 'array',
        label: 'Images (image slots only)',
        default: DEFAULT_IMAGES,
        itemSchema: {
            image: { type: 'image', label: 'Image' },
            alt: { type: 'text', label: 'Alt text', default: '' },
        },
    },
    items: {
        type: 'array',
        label: 'Content Cards (text slots only)',
        default: DEFAULT_ITEMS,
        itemSchema: {
            title: { type: 'text', label: 'Title', default: 'Card Title' },
            description: { type: 'richtext', label: 'Description', default: '<p>Card description.</p>' },
            linkLabel: { type: 'text', label: 'Link label', default: 'Learn more' },
            linkUrl: { type: 'url', label: 'Link URL', default: '#' },
        },
    },
};

type ImageSlot = { image?: string | null; alt?: string };
type ContentCard = {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
};

type Props = {
    headingLine1?: string;
    headingLine2?: string;
    images?: ImageSlot[];
    items?: ContentCard[];
};

// Checkerboard pattern for 4 columns:
// Row 0: img  txt  img  txt
// Row 1: txt  img  txt  img
function isImageSlot(index: number): boolean {

    const col = index % 4;
    const row = Math.floor(index / 4);

    return (col + row) % 2 === 0;
}

export default function AlternateCardsSection({ headingLine1, headingLine2, images, items }: Props) {
    const imageList: ImageSlot[] = (images ? Object.values(images) : []).length > 0
        ? Object.values(images ?? {})
        : DEFAULT_IMAGES;
    const contentList: ContentCard[] = (items ? Object.values(items) : []).length > 0
        ? Object.values(items ?? {})
        : DEFAULT_ITEMS;

    const [activeIndex, setActiveIndex] = React.useState(0);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        const cardWidth = el.scrollWidth / imageList.length;
        const index = Math.round(el.scrollLeft / cardWidth);
        setActiveIndex(index);
    };

    const scrollTo = (index: number) => {
        const el = scrollRef.current;

        if (!el) {
            return;
        }

        const cardWidth = el.scrollWidth / imageList.length;
        el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
        setActiveIndex(index);
    };

    // Build an 8-slot grid: 4 image slots + 4 text slots interleaved across 2 rows of 4 columns
    const totalSlots = 8;
    let imgIdx = 0;
    let txtIdx = 0;

    const slots = Array.from({ length: totalSlots }, (_, i) => {
        if (isImageSlot(i)) {
            return { type: 'image' as const, data: imageList[imgIdx++] ?? {}, num: imgIdx };
        } else {
            return { type: 'text' as const, data: contentList[txtIdx++] ?? {}, num: txtIdx };
        }
    });

    const renderCard = (slot: typeof slots[number]) => {
        if (slot.type === 'image') {
            const { data } = slot as { type: 'image'; data: ImageSlot };

            return (
                <div className="group relative aspect-square md:aspect-auto md:h-full rounded-2xl overflow-hidden bg-gray-100">
                    {data.image ? (
                        <img
                            src={data.image}
                            alt={data.alt ?? ''}
                            className="h-full w-full object-cover transition duration-500"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand/10 to-brand/20">
                            <span className="text-5xl font-black text-brand/40 select-none">
                                IMG
                            </span>
                        </div>
                    )}
                </div>
            );
        }

        const { data, num } = slot as { type: 'text'; data: ContentCard; num: number };
        const isBlueCard = num % 4 === 1 || num % 4 === 0;

        return (
            <div
                className={cn(
                    'flex flex-col justify-between p-6 rounded-2xl transition h-[320px] md:h-full',
                    isBlueCard ? 'bg-accent-brand' : 'bg-gray-100',
                )}
            >
                <div>
                    {data.title && (
                        <h3 className={cn('mb-2 text-3xl font-extrabold leading-snug', isBlueCard ? 'text-white' : 'text-gray-900')}>
                            {data.title}
                        </h3>
                    )}
                    {data.description && (
                        <>
                            <div
                                className={cn('text-base leading-relaxed line-clamp-4 prose prose-sm max-w-none [&_p]:m-0', isBlueCard ? `text-white prose-invert alternate-cards-blue-desc-${num}` : 'text-gray-900')}
                                dangerouslySetInnerHTML={{ __html: data.description }}
                            />
                        </>
                    )}
                </div>
                {data.linkLabel && data.linkUrl && (
                    <div className="flex items-center justify-between mt-6">
                        <BrandButton
                            variant={isBlueCard ? "white" : "secondary"}
                            href={data.linkUrl}
                            className="shadow-none"
                        >
                            {data.linkLabel}
                        </BrandButton>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-7">

                {/* Heading */}
                {(headingLine1 || headingLine2) && (
                    <div className="relative mb-12 text-center">
                        <div className="absolute size-16 rounded-full bg-accent-brand right-1/2 -translate-x-16 -top-4 z-0" />
                        <h2 className="relative z-10 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            {headingLine1 && <span className="block">{headingLine1}</span>}
                            {headingLine2 && <span className="block">{headingLine2}</span>}
                        </h2>
                    </div>
                )}

                {/* Mobile: horizontal scroll carousel — only one pair visible at a time */}
                <div className="md:hidden">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {imageList.map((imgData, i) => {
                            const cardData = contentList[i];

                            return (
                                <div key={i} className="shrink-0 w-[80vw] snap-center flex flex-col gap-4">
                                    {renderCard({ type: 'image', data: imgData, num: i + 1 })}
                                    {cardData && renderCard({ type: 'text', data: cardData, num: i + 1 })}
                                </div>
                            );
                        })}
                    </div>

                    {/* Dot indicators */}
                    <div className="mt-4 flex justify-center gap-2">
                        {imageList.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={cn(
                                    'h-2 rounded-full transition-all duration-300',
                                    i === activeIndex ? 'w-6 bg-brand' : 'w-2 bg-gray-300',
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: 4-column checkerboard grid */}
                <div className="hidden md:grid md:grid-cols-4 md:auto-rows-fr gap-4">
                    {slots.map((slot, i) => (
                        <div key={i}>{renderCard(slot)}</div>
                    ))}
                </div>

            </div>
        </section>
    );
}
