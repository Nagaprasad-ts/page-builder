import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'alternate-cards',
    category: 'Marketing',
    icon: 'Layers',
    description: 'Checkerboard grid of alternating image and text cards.',
};

const DEFAULT_IMAGES = [
    { image: null },
    { image: null },
    { image: null },
    { image: null },
];

const DEFAULT_ITEMS = [
    {
        title: 'Branded Workspaces',
        description: 'Turn everyday office spaces into immersive brand experiences that reflect your culture, vision, and identity.',
        linkLabel: 'Workspace Branding',
        linkUrl: '#',
    },
    {
        title: 'Hiring Experiences',
        description: 'Create meaningful candidate journeys that leave lasting impressions from first interaction to final onboarding.',
        linkLabel: 'Candidate Experience',
        linkUrl: '#',
    },
    {
        title: 'Skill Development',
        description: 'Interactive learning programs designed to upskill teams, enhance performance, and encourage continuous growth.',
        linkLabel: 'Training and Workshops',
        linkUrl: '#',
    },
    {
        title: 'Team Messaging',
        description: 'Strengthen internal culture with communication strategies that keep teams aligned, informed, and engaged.',
        linkLabel: 'Internal Communication',
        linkUrl: '#',
    },
];

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Heading',
        default: 'Initiatives that matter, the most!',
    },
    images: {
        type: 'array',
        label: 'Images (image slots only)',
        default: DEFAULT_IMAGES,
        itemSchema: {
            image: { type: 'image', label: 'Image' },
        },
    },
    items: {
        type: 'array',
        label: 'Content Cards (text slots only)',
        default: DEFAULT_ITEMS,
        itemSchema: {
            title: { type: 'text', label: 'Title', default: 'Card Title' },
            description: { type: 'textarea', label: 'Description', default: 'Card description.' },
            linkLabel: { type: 'text', label: 'Link label', default: 'Learn more' },
            linkUrl: { type: 'url', label: 'Link URL', default: '#' },
        },
    },
};

type ImageSlot = { image?: string | null };
type ContentCard = {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
};

type Props = {
    heading?: string;
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

export default function AlternateCardsSection({ heading, images, items }: Props) {
    const imageList: ImageSlot[] = (images ? Object.values(images) : []).length > 0
        ? Object.values(images ?? {})
        : DEFAULT_IMAGES;
    const contentList: ContentCard[] = (items ? Object.values(items) : []).length > 0
        ? Object.values(items ?? {})
        : DEFAULT_ITEMS;

    // Build an 8-slot grid: 4 image slots + 4 text slots interleaved
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

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-8xl px-6">

                {/* Heading */}
                {heading && (
                    <div className="mb-12 text-center">
                        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-blue-600" />
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            {heading}
                        </h2>
                    </div>
                )}

                {/* 4-column checkerboard grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {slots.map((slot, i) => {
                        if (slot.type === 'image') {
                            const { data } = slot as { type: 'image'; data: ImageSlot };
                            
                            return (
                                <div
                                    key={i}
                                    className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
                                >
                                    {data.image ? (
                                        <img
                                            src={data.image}
                                            alt=""
                                            className="h-full w-full object-cover transition duration-500"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-100 to-blue-200">
                                            <span className="text-5xl font-black text-blue-300 select-none">
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
                                key={i}
                                className={cn(
                                    'flex aspect-square flex-col justify-between p-6 rounded-2xl transition',
                                    isBlueCard ? 'bg-blue-100' : 'bg-gray-100',
                                )}
                            >
                                <div>
                                    {data.title && (
                                        <h3 className="mb-2 text-3xl font-extrabold leading-snug text-gray-900">
                                            {data.title}
                                        </h3>
                                    )}

                                    {data.description && (
                                        <p className="text-base leading-relaxed text-gray-900 line-clamp-4">
                                            {data.description}
                                        </p>
                                    )}
                                </div>

                                {data.linkLabel && data.linkUrl && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-md font-semibold text-gray-900">{data.linkLabel}</p>
                                        <a
                                            href={data.linkUrl}
                                            className={cn(
                                                'flex w-fit items-center rounded-full border p-3 transition',
                                                isBlueCard
                                                    ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-50 hover:text-blue-500'
                                                    : 'border-gray-800 bg-gray-900 text-white hover:bg-white hover:text-gray-900 hover:border-gray-800',
                                            )}
                                        >
                                            <ArrowRight className="h-5 w-5 transition-all duration-300" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
