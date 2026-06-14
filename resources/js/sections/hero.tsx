import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'hero',
    category: 'Marketing',
    icon: 'Sparkles',
    description: 'Hero banner — text left, image right, 50/50 split.',
};

export const schema: SectionSchema = {
    heading: {
        type: 'textarea',
        label: 'Heading',
        default: 'Stand Out.\nAs an Employer.\nFor All the Right Reasons.',
    },
    subtext: {
        type: 'richtext',
        label: 'Subtext',
        default:
            '<p>Great companies lose talent when perception fails to reflect reality. EVP Headquarters builds employer brands people notice, trust, and choose.</p>',
    },
    ctaLabel: { type: 'text', label: 'Button Label', default: 'Talk to Us' },
    ctaUrl: { type: 'url', label: 'Button URL', default: '/' },
    image: { type: 'image', label: 'Hero Image (right side)' },
    imageAlt: { type: 'text', label: 'Hero Image Alt Text', default: '' },
    textBgImage: { type: 'image', label: 'Text Background Image (decorative)' },
};

type Props = {
    heading?: string;
    subtext?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    image?: string | null;
    imageAlt?: string;
    backgroundImage?: string | null; // legacy compat
    textBgImage?: string | null;
};

export default function HeroSection({ heading, subtext, ctaLabel, ctaUrl, image, imageAlt, backgroundImage, textBgImage }: Props) {
    const heroImage = image ?? backgroundImage ?? null;

    return (
        <section className="relative overflow-hidden bg-white md:h-screen">
            <div className="h-full mx-auto max-w-7xl px-6">
                <div className="flex flex-col md:flex-row md:h-full md:items-center">

                    {/* ── Left 50%: Text ── */}
                    <div className="relative z-10 flex w-full flex-col justify-center py-10 md:w-1/2 md:py-24 md:pr-12">

                        {/* Arrow / decorative background image */}
                        {textBgImage && (
                            <img
                                src={textBgImage}
                                alt=""
                                className="pointer-events-none absolute inset-0 -top-18 md:-top-10 h-full w-full object-contain opacity-70 select-none"
                                style={{ zIndex: -1 }}
                            />
                        )}

                        {/* Decorative circles — text side */}
                        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-accent-brand/10" />
                        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-24 w-24 rounded-full bg-accent-brand/5" />
                        <div className="pointer-events-none absolute left-2/3 top-1/4 flex flex-col gap-2">
                            <div className="h-3 w-3 rounded-full bg-accent-brand/50" />
                            <div className="h-2 w-2 rounded-full bg-accent-brand/30" />
                        </div>

                        {heading && (
                            <h1 className="relative z-10 mb-6 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
                                {heading.split('\n').map((line, i) => (
                                    <span key={i} className="block">{line}</span>
                                ))}
                            </h1>
                        )}

                        {subtext && (
                            <div
                                className="relative z-10 mb-8 max-w-lg text-lg leading-relaxed text-gray-500 prose prose-sm [&_p]:mb-2 [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: subtext }}
                            />
                        )}

                        {ctaLabel && ctaUrl && (
                            <div className="relative z-10">
                                <BrandButton variant="secondary" href={ctaUrl}>
                                    {ctaLabel}
                                </BrandButton>
                            </div>
                        )}
                    </div>

                    {/* ── Right 50%: Image ── */}
                    <div className="relative w-full md:w-1/2">
                        {/* Decorative accent behind image */}
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-brand/10" />
                        <div className="pointer-events-none absolute -bottom-10 right-1/4 h-32 w-32 rounded-full bg-accent-brand/5" />
                        <div className="pointer-events-none absolute right-8 top-1/3 h-16 w-16 overflow-hidden rounded-full border-8 border-accent-brand/20" />

                        <div className="relative h-72 w-full overflow-hidden md:h-full md:aspect-auto">
                            {heroImage ? (
                                <img
                                    src={heroImage}
                                    alt={imageAlt ?? ''}
                                    className="w-130 rounded-3xl object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-[400px] rounded-3xl w-full items-center justify-center bg-gradient-to-br from-accent-brand/10 to-brand/10">
                                    <span className="text-sm text-gray-400">Add hero image</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
