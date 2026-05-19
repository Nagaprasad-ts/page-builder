import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'hero',
    category: 'Marketing',
    icon: 'Sparkles',
    description:
        'Full-width hero banner with heading, subtext, and a call-to-action button.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: 'Welcome to our site' },
    subtext: {
        type: 'textarea',
        label: 'Subtext',
        default: 'A short description of what you do.',
    },
    ctaLabel: { type: 'text', label: 'Button Label', default: 'Get started' },
    ctaUrl: { type: 'url', label: 'Button URL', default: '/' },
    backgroundImage: { type: 'image', label: 'Background Image' },
};

type Props = {
    heading?: string;
    subtext?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    backgroundImage?: string | null;
};

export default function HeroSection({
    heading,
    subtext,
    ctaLabel,
    ctaUrl,
    backgroundImage,
}: Props) {
    return (
        <section
            className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-gray-900 text-white"
            style={
                backgroundImage
                    ? {
                          backgroundImage: `url(${backgroundImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                      }
                    : undefined
            }
        >
            {backgroundImage && (
                <div className="absolute inset-0 bg-black/50" />
            )}
            <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
                {heading && (
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                        {heading}
                    </h1>
                )}
                {subtext && (
                    <p className="mb-8 text-lg text-gray-200">{subtext}</p>
                )}
                {ctaLabel && ctaUrl && (
                    <a
                        href={ctaUrl}
                        className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
                    >
                        {ctaLabel}
                    </a>
                )}
            </div>
        </section>
    );
}
