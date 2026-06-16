import React from 'react';
import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'get-in-touch',
    category: 'Marketing',
    icon: 'MessageSquare',
    description: 'Vibrant CTA card with dynamic brand background color, concentric wave graphics, and premium action pills.',
};

export const schema: SectionSchema = {
    title: { type: 'text', label: 'Title', default: "Let's Get In Touch." },
    description: {
        type: 'richtext',
        label: 'Description',
        default: '<p>Your laboratory instruments should serve you, not the other way around. We\'re happy to help you.</p>',
    },
    primaryLabel: { type: 'text', label: 'Primary Button Label', default: 'Book a discovery call' },
    primaryUrl: { type: 'url', label: 'Primary Button URL', default: '#' },
    secondaryLabel: { type: 'text', label: 'Secondary Button Label', default: 'Test Your Samples' },
    secondaryUrl: { type: 'url', label: 'Secondary Button URL', default: '#' },
};

type Props = {
    title?: string;
    description?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
};

export default function GetInTouchSection({
    title = "Let's Get In Touch.",
    description = "<p>Your laboratory instruments should serve you, not the other way around. We're happy to help you.</p>",
    primaryLabel = "Book a discovery call",
    primaryUrl = "#",
    secondaryLabel = "Test Your Samples",
    secondaryUrl = "#",
}: Props) {
    return (
        <section className="bg-background py-16 font-sans">
            <div className="mx-auto max-w-7xl px-4 md:px-7">

                {/* Main Brand-Themed CTA Card
                    Added an custom `--ring-base` CSS variable that dynamically clamps between 500px and 1400px 
                    based on the viewport width, ensuring seamless responsiveness across any screen size.
                */}
                <div
                    className="relative overflow-hidden bg-brand text-white px-8 py-16 sm:px-12 sm:py-20 md:px-16 lg:py-24 rounded-3xl"
                    style={{
                        '--ring-base': 'clamp(500px, 85vw, 1400px)'
                    } as React.CSSProperties}
                >

                    {/* ————— Concentric Accent Glow Circles (Right Side) ————— 
                        By tying all ring sizes to the single responsive `--ring-base` variable, 
                        all circles scale perfectly in sync across all device widths.
                    */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {[700, 530, 370, 230, 120, 50].map((size, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    width: size,
                                    height: size,
                                    top: '50%',
                                    right: -size / 2,
                                    transform: 'translateY(-50%)',
                                    border: `2px solid rgba(255,255,255,${0.12 + i * 0.08})`,
                                    backgroundColor: `rgba(255,255,255,${0.03 + i * 0.03})`,
                                }}
                            />
                        ))}
                    </div>

                    {/* ————— Content Block ————— */}
                    <div className="relative z-10 max-w-2xl text-left">
                        {/* Title using font-heading (Fraunces) */}
                        <h2
                            className="font-heading text-pretty text-4xl font-extrabold tracking-tight"
                            style={{ color: '#ffffff' }}
                        >
                            {title}
                        </h2>

                        {/* Subtitle / Description */}
                        {description && (
                            <div
                                className="mt-8 text-pretty text-base font-normal antialiased sm:text-lg max-w-xl prose prose-invert prose-sm"
                                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}

                        {/* Action buttons matching the sleek black pills with metallic sphere accents */}
                        <div className="mt-8 flex flex-wrap gap-4 sm:gap-6">

                            {/* Primary Pill Button */}
                            {primaryLabel && (
                                <BrandButton variant="black-pill" href={primaryUrl}>
                                    {primaryLabel}
                                </BrandButton>
                            )}

                            {/* Secondary Pill Button */}
                            {secondaryLabel && (
                                <BrandButton variant="black-pill" href={secondaryUrl}>
                                    {secondaryLabel}
                                </BrandButton>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}