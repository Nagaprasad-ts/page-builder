import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'page-hero',
    category: 'Hero',
    icon: 'Shield',
    description: 'Dark inner-page hero with label pill, large heading, description, and a right-side image with accent decorative shapes.',
};

export const schema: SectionSchema = {
    label: { type: 'text', label: 'Label (pill)', default: 'Privacy Policy' },
    headingLine1: { type: 'text', label: 'Heading Line 1', default: 'Your Privacy' },
    headingLine2: { type: 'text', label: 'Heading Line 2', default: 'Matters to Us' },
    description: {
        type: 'richtext',
        label: 'Description',
        default: '<p>We are committed to protecting your personal information and being transparent about how we use it.</p>',
    },
    image: { type: 'image', label: 'Right Image', default: '' },
    imageAlt: { type: 'text', label: 'Image Alt Text', default: 'Privacy shield illustration' },
};

type Props = {
    label?: string;
    headingLine1?: string;
    headingLine2?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
};

export default function PageHeroSection({
    label = 'Privacy Policy',
    headingLine1 = 'Your Privacy',
    headingLine2 = 'Matters to Us',
    description = '<p>We are committed to protecting your personal information and being transparent about how we use it.</p>',
    image = '',
    imageAlt = 'Privacy shield illustration',
}: Props) {
    return (
        <section
            className="relative overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
        >
            <div className="relative mx-auto flex max-w-7xl items-center gap-8 px-4 md:px-7 py-16 lg:py-20">

                {/* ── Left content ── */}
                <div className="relative z-10 flex-1">
                    {/* Label pill */}
                    {label && (
                        <span className="mb-6 inline-block rounded-full border border-accent-brand px-4 py-1 text-xs font-semibold text-accent-brand">
                            {label}
                        </span>
                    )}

                    {/* Heading */}
                    <h1 className="font-heading text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                        {headingLine1 && <span className="block">{headingLine1}</span>}
                        {headingLine2 && <span className="block">{headingLine2}</span>}
                    </h1>

                    {/* Description */}
                    {description && (
                        <div 
                            className="mt-6 max-w-sm text-sm leading-relaxed text-white prose prose-invert prose-sm [&_p]:mb-2"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}
                </div>

                {/* ── Right image + decorative shapes ── */}
                <div className="relative hidden shrink-0 lg:flex lg:w-36 lg:items-center lg:justify-center">
                    {/* Accent semicircle — top right */}
                    <div
                        className="pointer-events-none absolute bg-accent-brand opacity-90"
                        style={{
                            width: 80,
                            height: 40,
                            top: -10,
                            right: -20,
                            borderRadius: '80px 80px 0 0',
                        }}
                    />

                    {/* Accent large semicircle — bottom left of image */}
                    <div
                        className="pointer-events-none absolute bg-accent-brand opacity-85"
                        style={{
                            width: 180,
                            height: 90,
                            bottom: -30,
                            left: -80,
                            borderRadius: '0 0 180px 180px',
                        }}
                    />

                    {/* Small accent quarter-pill — far right */}
                    <div
                        className="pointer-events-none absolute"
                        style={{
                            width: 48,
                            height: 24,
                            bottom: 40,
                            right: -10,
                            borderRadius: '0 0 48px 48px',
                            backgroundColor: '#555',
                            opacity: 0.7,
                        }}
                    />

                    {/* Image */}
                    {image ? (
                        <img
                            src={image}
                            alt={imageAlt}
                            className="relative z-10 w-56 h-56 object-contain drop-shadow-2xl rounded-3xl"
                        />
                    ) : (
                        <div className="relative z-10 flex h-56 w-56 items-center justify-center rounded-2xl bg-white/5 text-white/20">
                            <span className="text-sm">Add image</span>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
