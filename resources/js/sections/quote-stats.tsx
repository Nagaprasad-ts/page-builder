import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'quote-stats',
    category: 'Marketing',
    icon: 'Quote',
    description: 'Testimonial quote with image and achievement stats.',
};

export const schema: SectionSchema = {
    quote: {
        type: 'textarea',
        label: 'Quote',
        default: 'We understand your needs better than anybody and we know boring when we see it. So we will keep your audience engaged.',
    },
    authorName: { type: 'text', label: 'Author name', default: 'Jane Brooklyn' },
    authorTitle: { type: 'text', label: 'Author title', default: 'New company director' },
    authorImage: { type: 'image', label: 'Author photo' },
    mainImage: { type: 'image', label: 'Main image' },
    achievementHeading: { type: 'text', label: 'Achievement heading', default: 'What we achieved' },
    achievementText: {
        type: 'textarea',
        label: 'Achievement text',
        default: 'We know how to make the science behind content interesting. So you can drive home great content and keep your audience engaged.',
    },
    stat1Value: { type: 'text', label: 'Stat 1 value', default: '158+' },
    stat1Label: { type: 'text', label: 'Stat 1 label', default: 'number of videos produced' },
    stat2Value: { type: 'text', label: 'Stat 2 value', default: '625' },
    stat2Label: { type: 'text', label: 'Stat 2 label', default: 'combined years of team experience' },
    stat3Value: { type: 'text', label: 'Stat 3 value', default: '730+' },
    stat3Label: { type: 'text', label: 'Stat 3 label', default: 'number of Specialists' },
};

type Props = {
    quote?: string;
    authorName?: string;
    authorTitle?: string;
    authorImage?: string | null;
    mainImage?: string | null;
    achievementHeading?: string;
    achievementText?: string;
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    stat3Value?: string;
    stat3Label?: string;
};

export default function QuoteStatsSection({
    quote,
    authorName,
    authorTitle,
    authorImage,
    mainImage,
    achievementHeading,
    achievementText,
    stat1Value,
    stat1Label,
    stat2Value,
    stat2Label,
    stat3Value,
    stat3Label,
}: Props) {
    const stats = [
        { value: stat1Value, label: stat1Label },
        { value: stat2Value, label: stat2Label },
        { value: stat3Value, label: stat3Label },
    ];

    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-6">

                {/* ── Top row: quote left | image right ── */}
                <div className="relative mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

                    {/* Quote */}
                    <div className="relative">
                        <span className="pointer-events-none absolute -left-20 -top-20 select-none text-[18rem] font-black leading-none text-blue-400" style={{ zIndex: 0 }}>&ldquo;</span>
                        {quote && (
                            <p className="relative mb-8 text-xl font-bold leading-snug text-gray-900 md:text-3xl" style={{ zIndex: 1 }}>
                                {quote}
                            </p>
                        )}
                        <div className="flex items-center gap-3">
                            {authorImage ? (
                                <img
                                    src={authorImage}
                                    alt={authorName ?? ''}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-500">
                                    {authorName?.charAt(0) ?? 'A'}
                                </div>
                            )}
                            <div>
                                {authorName && <p className="text-sm font-bold text-gray-900">{authorName}</p>}
                                {authorTitle && <p className="text-xs text-gray-500">{authorTitle}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Image with blue decoration */}
                    <div className="flex justify-center">
                        <div className="relative aspect-square w-full max-w-md">
                            {/* Blue tilted bg */}
                            <div className="absolute inset-0 rotate-6 rounded-2xl bg-blue-400" />

                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt=""
                                    className="absolute inset-0 h-full w-full rounded-2xl object-cover shadow-lg"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-200 shadow-inner">
                                    <span className="text-sm text-gray-400">Add main image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mb-10 h-px bg-gray-200" />

                {/* ── Bottom row: achievement left | stats right ── */}
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">

                    {/* Achievement text */}
                    <div>
                        {achievementHeading && (
                            <p className="mb-2 text-sm font-semibold text-blue-500">
                                {achievementHeading}
                            </p>
                        )}
                        {achievementText && (
                            <p className="text-sm leading-relaxed text-gray-500">
                                {achievementText}
                            </p>
                        )}
                    </div>

                    {/* Stats — always 3 in a row */}
                    <div className="grid grid-cols-3 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                {stat.value && (
                                    <p className="text-4xl font-black text-gray-900 sm:text-5xl">
                                        {stat.value}
                                    </p>
                                )}
                                {stat.label && (
                                    <p className="mt-1 text-xs leading-snug text-gray-500">
                                        {stat.label}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
