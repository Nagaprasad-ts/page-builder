import React from 'react';
import { ArrowRight } from 'lucide-react';
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
        type: 'textarea',
        label: 'Description',
        default: 'Your laboratory instruments should serve you, not the other way around. We\'re happy to help you.',
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
    description = "Your laboratory instruments should serve you, not the other way around. We're happy to help you.",
    primaryLabel = "Book a discovery call",
    primaryUrl = "#",
    secondaryLabel = "Test Your Samples",
    secondaryUrl = "#",
}: Props) {
    return (
        <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-7xl">
                
                {/* Main Brand-Themed CTA Card
                    Added an custom `--ring-base` CSS variable that dynamically clamps between 500px and 1400px 
                    based on the viewport width, ensuring seamless responsiveness across any screen size.
                */}
                <div 
                    className="relative overflow-hidden px-8 py-16 sm:px-12 sm:py-20 md:px-16 lg:py-24 rounded-3xl"
                    style={{ 
                        backgroundColor: 'var(--color-brand, #142345)',
                        color: '#ffffff',
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
                            className="font-heading text-pretty text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                            style={{ color: '#ffffff' }}
                        >
                            {title}
                        </h2>

                        {/* Subtitle / Description */}
                        {description && (
                            <p 
                                className="mt-8 text-pretty text-base font-normal leading-relaxed antialiased sm:text-lg max-w-xl"
                                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                            >
                                {description}
                            </p>
                        )}

                        {/* Action buttons matching the sleek black pills with metallic sphere accents */}
                        <div className="mt-8 flex flex-wrap gap-4 sm:gap-6">
                            
                            {/* Primary Pill Button */}
                            {primaryLabel && (
                                <a
                                    href={primaryUrl}
                                    className="group inline-flex items-center justify-between gap-6 rounded-full bg-black py-3 pl-6 px-3 text-sm font-bold text-white transition-all duration-300 hover:bg-slate-950 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                >
                                    <span>{primaryLabel}</span>
                                    {/* Glassmorphic/Metallic gloss sphere containing arrow icon */}
                                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-b from-white via-slate-100 to-slate-400 shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.4)] ring-1 ring-white/20">
                                        <ArrowRight className="h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </span>
                                </a>
                            )}

                            {/* Secondary Pill Button */}
                            {secondaryLabel && (
                                <a
                                    href={secondaryUrl}
                                    className="group inline-flex items-center justify-between gap-6 rounded-full bg-black py-3 pl-6 px-3 text-sm font-bold text-white transition-all duration-300 hover:bg-slate-950 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                >
                                    <span>{secondaryLabel}</span>
                                    {/* Glassmorphic/Metallic gloss sphere containing arrow icon */}
                                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-b from-white via-slate-100 to-slate-400 shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.3),0_2px_5px_rgba(0,0,0,0.4)] ring-1 ring-white/20">
                                        <ArrowRight className="h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </span>
                                </a>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}