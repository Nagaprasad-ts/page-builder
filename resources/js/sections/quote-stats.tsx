import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'quote-stats',
    category: 'Marketing',
    icon: 'Quote',
    description: 'Testimonial quote with image and achievement stats.',
};

export const schema: SectionSchema = {
    quote: {
        type: 'richtext',
        label: 'Quote',
        default: '<p>Great talent doesn\'t just join companies, they join cultures. And branding problems, they hide in plain sight. At EVP HQ, we help organizations identify them and build organic, long-term solutions that strengthen perception, trust, and lasting business growth.</p>',
    },
    authorName: { type: 'text', label: 'Author name', default: 'Pradeep Gowda' },
    authorTitle: { type: 'text', label: 'Author title', default: 'Chief Executive Officer, EVP HQ' },
    authorImage: { type: 'image', label: 'Author photo' },
    mainImage: { type: 'image', label: 'Main image' },
    mainImageAlt: { type: 'text', label: 'Main Image Alt Text', default: '' },
    achievementHeading: { type: 'text', label: 'Achievement heading', default: 'We want you to stand out' },
    achievementText: {
        type: 'richtext',
        label: 'Achievement text',
        default: '<p>We know how to make an employer feel authentic. So you can attract the right talent, strengthen culture, and build a workplace people genuinely connect with.</p>',
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
    mainImageAlt?: string;
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
    mainImageAlt,
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
                        <span className="pointer-events-none absolute -left-20 -top-20 select-none text-[18rem] font-black leading-none text-accent-brand/40" style={{ zIndex: 0 }}>&ldquo;</span>
                        {quote && (
                            <div 
                                className="relative mb-8 text-xl font-bold leading-snug text-gray-900 md:text-3xl prose prose-sm max-w-none [&_p]:mb-2" 
                                style={{ zIndex: 1 }}
                                dangerouslySetInnerHTML={{ __html: quote }}
                            />
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
                            <div className="absolute inset-0 rotate-6 rounded-2xl bg-accent-brand/70" />

                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={mainImageAlt ?? ''}
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
                            <p className="mb-2 text-sm font-semibold text-brand">
                                {achievementHeading}
                            </p>
                        )}
                        {achievementText && (
                            <div 
                                className="text-sm leading-relaxed text-gray-500 prose prose-sm max-w-none [&_p]:mb-2"
                                dangerouslySetInnerHTML={{ __html: achievementText }}
                            />
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
