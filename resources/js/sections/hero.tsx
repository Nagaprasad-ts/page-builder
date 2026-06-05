import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'hero',
    category: 'Marketing',
    icon: 'Sparkles',
    description:
        'Full-width hero banner with heading, subtext, and a call-to-action button.',
};

export const schema: SectionSchema = {
    heading: {
        type: 'textarea',
        label: 'Heading',
        default: 'Stand Out.\nAs an Employer.\nFor All the Right Reasons.',
    },
    subtext: {
        type: 'textarea',
        label: 'Subtext',
        default:
            'Great companies lose talent when perception fails to reflect reality. EVP Headquarters builds employer brands people notice, trust, and choose.',
    },
    ctaLabel: { type: 'text', label: 'Button Label', default: 'Talk to Us' },
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

export default function HeroSection({ heading, subtext, ctaLabel, ctaUrl, backgroundImage }: Props) {
    return (
        <section
            className="relative flex h-screen items-center justify-center overflow-hidden bg-white"
            style={
                backgroundImage
                    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : undefined
            }
        >
            {backgroundImage && <div className="absolute inset-0 bg-white/70" />}

            {/* ── Decorative geometric shapes ── */}

            {/* Top-left quarter circle */}
            <div className="pointer-events-none absolute -left-16 top-12 h-40 w-40 rounded-full bg-blue-100 opacity-70" />

            {/* Top-right small half-circle */}
            <div className="pointer-events-none absolute right-24 top-8 h-16 w-16 overflow-hidden">
                <div className="h-16 w-16 rounded-full border-12 border-blue-200 opacity-60" />
            </div>

            {/* Mid-left pill */}
            <div className="pointer-events-none absolute left-8 top-1/2 h-10 w-20 -translate-y-1/2 rounded-full bg-blue-50 opacity-80" />

            {/* Large accent circle — top center */}
            <div className="pointer-events-none absolute -top-10 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-blue-500 opacity-90" />

            {/* Bottom-right half circle */}
            <div className="pointer-events-none absolute -right-10 bottom-16 h-32 w-32 rounded-full bg-blue-100 opacity-60" />

            {/* Bottom-left arc */}
            <div className="pointer-events-none absolute bottom-8 left-1/4 h-12 w-24 overflow-hidden">
                <div className="h-24 w-24 rounded-full border-10 border-blue-300 opacity-50" />
            </div>

            {/* Mid-right dot cluster */}
            <div className="pointer-events-none absolute right-16 top-1/3 flex flex-col gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-400 opacity-70" />
                <div className="h-2 w-2 rounded-full bg-blue-300 opacity-50" />
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-8 text-center">
                {heading && (
                    <h1 className="mb-8 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                        {heading.split('\n').map((line, i) => (
                            <span key={i} className="block">
                                {line}
                            </span>
                        ))}
                    </h1>
                )}

                {subtext && (
                    <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-500">
                        {subtext}
                    </p>
                )}

                {ctaLabel && ctaUrl && (
                    <a
                        href={ctaUrl}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300"
                    >
                        {ctaLabel}
                    </a>
                )}
            </div>
        </section>
    );
}
