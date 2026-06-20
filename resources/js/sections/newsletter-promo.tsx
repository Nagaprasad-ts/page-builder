import { DynamicIcon } from '@/components/ui/dynamic-icon';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'newsletter-promo',
    category: 'Marketing',
    icon: 'Mail',
    description: 'Dark-themed newsletter promo section featuring high-contrast typography, horizontal attributes list, main illustration, and floating card overlays.',
};

export const schema: SectionSchema = {
    badgeText: { type: 'text', label: 'Badge Text', default: 'HR LIBRARY NEWSLETTER' },
    headingText: {
        type: 'textarea',
        label: 'Heading Text',
        default: 'Insights that\nmove people\nand businesses\nforward.',
    },
    highlightWord: { type: 'text', label: 'Highlight Word', default: 'forward.' },
    description: {
        type: 'richtext',
        label: 'Description',
        default:
            '<p>Join HR Library, an exclusive newsletter for HR and People leaders who want sharp insights, practical resources, and real-world strategies straight to their inbox.</p>',
    },
    features: {
        type: 'array',
        label: 'Features List',
        default: [
            { icon: 'Users', label: 'Curated by HR Experts' },
            { icon: 'Shield', label: 'Zero Spam Promise' },
            { icon: 'Award', label: 'Actionable Every Time' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Lucide Icon Name', default: 'Check' },
            label: { type: 'text', label: 'Feature Description', default: '' },
        },
    },
    mainImage: { type: 'image', label: 'Main Group Image' },
    mainImageAlt: { type: 'text', label: 'Main Image Alt Text', default: 'HR team looking at a laptop' },
    overlayText: { type: 'textarea', label: 'Overlay Badge Text', default: 'Practical insights.\nReal impact.' },
    overlayIcon: { type: 'text', label: 'Overlay Badge Icon', default: 'Check' },
    bookletImage: { type: 'image', label: 'Overlay Booklet Image' },
    bookletImageAlt: { type: 'text', label: 'Booklet Image Alt Text', default: 'HR Library booklet cover' },
};

type Feature = {
    icon?: string;
    label?: string;
};

type Props = {
    badgeText?: string;
    headingText?: string;
    highlightWord?: string;
    description?: string;
    features?: Feature[];
    mainImage?: string | null;
    mainImageAlt?: string;
    overlayText?: string;
    overlayIcon?: string;
    bookletImage?: string | null;
    bookletImageAlt?: string;
};

export default function NewsletterPromoSection({
    badgeText = 'HR LIBRARY NEWSLETTER',
    headingText = 'Insights that\nmove people\nand businesses\nforward.',
    highlightWord = 'forward.',
    description = '<p>Join HR Library, an exclusive newsletter for HR and People leaders who want sharp insights, practical resources, and real-world strategies straight to their inbox.</p>',
    features = [
        { icon: 'Users', label: 'Curated by HR Experts' },
        { icon: 'Shield', label: 'Zero Spam Promise' },
        { icon: 'Award', label: 'Actionable Every Time' },
    ],
    mainImage = null,
    mainImageAlt = 'HR team looking at a laptop',
    overlayText = 'Practical insights.\nReal impact.',
    overlayIcon = 'Check',
    bookletImage = null,
    bookletImageAlt = 'HR Library booklet cover',
}: Props) {

    // Render heading lines, coloring the highlighted word in orange
    const renderHeading = (text: string, highlight: string) => {
        if (!text) {
            return null;
        }

        const lines = text.split('\n');

        return lines.map((line, i) => {
            if (highlight && line.includes(highlight)) {
                const parts = line.split(highlight);
                return (
                    <span key={i} className="block">
                        {parts[0]}
                        <span className="text-accent-brand">{highlight}</span>
                        {parts[1]}
                    </span>
                );
            }

            return (
                <span key={i} className="block">
                    {line}
                </span>
            );
        });
    };

    return (
        <section className="relative overflow-hidden bg-brand md:h-screen md:min-h-[700px] md:max-h-[950px] flex items-center py-20 md:py-0 px-3 md:px-0 text-white select-none">

            {/* Absolute Decorative Circles Background */}
            <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
                {/* Medium Grey circle next to heading */}
                <div className="absolute top-[40%] left-[45%] w-7 h-7 rounded-full bg-gray-500/25" />
                {/* Small orange circle on the right */}
                <div className="absolute top-[25%] right-10 w-4 h-4 rounded-full bg-accent-brand/80" />
                {/* Medium grey circle on the right edge */}
                <div className="absolute bottom-[28%] -right-5 w-10 h-10 rounded-full bg-gray-500/30" />
                {/* Large Orange Teardrop/Half-Circle at bottom-center */}
                <div className="absolute bottom-[-15px] left-[50%] w-12 h-16 rounded-t-full bg-accent-brand rotate-12 opacity-95" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-7">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

                    {/* ── Left Column: Text & Features ── */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        {badgeText && (
                            <span className="text-xs font-bold tracking-wider text-accent-brand uppercase">
                                {badgeText}
                            </span>
                        )}

                        {headingText && (
                            <h2 className="font-heading mt-4 text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-tight tracking-tight text-white">
                                {renderHeading(headingText, highlightWord)}
                            </h2>
                        )}

                        {description && (
                            <div
                                className="mt-6 text-base text-gray-400 leading-relaxed max-w-md prose prose-invert prose-sm"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}

                        {/* Features List */}
                        {features && features.length > 0 && (
                            <div className="mt-10 grid grid-cols-1 gap-6 pt-8 border-t border-white/10 sm:grid-cols-3">
                                {features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-brand/10 text-accent-brand">
                                            <DynamicIcon name={feat.icon} className="h-4.5 w-4.5" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-300 leading-tight">
                                            {feat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right Column: Image Layout ── */}
                    <div className="relative lg:col-span-7 flex items-center justify-center">

                        {/* Wrapper for main image & overlays */}
                        <div className="relative w-full max-w-[580px] z-10">

                            {/* Main Group Image */}
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={mainImageAlt}
                                    className="w-full h-auto rounded-[32px] object-cover shadow-2xl border border-white/5"
                                />
                            ) : (
                                <div className="flex aspect-[1.4/1] w-full items-center justify-center rounded-[32px] bg-white/5 text-white/20 border border-white/10">
                                    <span className="text-sm">Main Group Image</span>
                                </div>
                            )}

                            {/* Floating Overlay Card (Bottom-Left) */}
                            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-2xl max-w-[210px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-brand/10 text-accent-brand">
                                    <DynamicIcon name={overlayIcon} className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-bold text-gray-900 leading-tight">
                                    {overlayText.split('\n').map((line, i) => (
                                        <span key={i} className="block">{line}</span>
                                    ))}
                                </span>
                            </div>

                            {/* Overlay Booklet Cover Image (Bottom-Right) */}
                            <div className="absolute -bottom-10 -right-4 z-20 w-40 sm:w-48 shadow-2xl rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 animate-in fade-in slide-in-from-right-4 duration-500">
                                {bookletImage ? (
                                    <img
                                        src={bookletImage}
                                        alt={bookletImageAlt}
                                        className="w-full h-auto object-contain"
                                    />
                                ) : (
                                    <div className="flex aspect-[0.7/1] w-full items-center justify-center rounded-2xl bg-white/10 text-white/30 border border-white/10 backdrop-blur-md">
                                        <span className="text-[10px]">Booklet Cover</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
