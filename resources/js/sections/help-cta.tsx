import type { SectionMeta, SectionSchema } from '@/types/builder';
import BrandButton from '@/components/ui/brand-button';

export const meta: SectionMeta = {
    name: 'help-cta',
    category: 'Marketing',
    icon: 'MessageSquare',
    description: 'A premium, soft-background call-to-action banner with custom vector chat bubble and CTA button.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: "Still can't find what you're looking for?" },
    subtext: {
        type: 'text',
        label: 'Subtext',
        default: "Let's connect and we'll point you in the right direction.",
    },
    buttonLabel: { type: 'text', label: 'Button Label', default: "Let's Talk" },
    buttonUrl: { type: 'url', label: 'Button URL', default: '#' },
};

type Props = {
    heading?: string;
    subtext?: string;
    buttonLabel?: string;
    buttonUrl?: string;
};

export default function HelpCtaSection({
    heading = "Still can't find what you're looking for?",
    subtext = "Let's connect and we'll point you in the right direction.",
    buttonLabel = "Let's Talk",
    buttonUrl = '#',
}: Props) {
    return (
        <section className="mx-auto max-w-7xl bg-white py-12">
            <div className="rounded-[2.5rem] bg-accent-brand/[0.06] p-8 md:p-12 transition-all duration-300 hover:shadow-xs">
                <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">

                    {/* ── Left side: Beautiful SVG Chat Bubble Illustration ── */}
                    <div className="relative flex h-32 w-32 items-center justify-center shrink-0 select-none">
                        {/* Decorative background blobs */}
                        <div className="absolute top-2 left-2 h-4 w-4 rounded-full bg-accent-brand/20" />
                        <div className="absolute bottom-5 left-1 h-6 w-6 rounded-full bg-brand/90" />
                        <div className="absolute top-1 right-5 h-2.5 w-2.5 rounded-full bg-accent-brand/40" />

                        {/* Thick-stroke Chat Bubble */}
                        <svg
                            className="h-24 w-24 text-accent-brand transition-transform duration-300 hover:scale-105"
                            viewBox="0 0 100 100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {/* Hand-drawn style chat bubble path */}
                            <path d="M50 18 C70 18 84 32 84 48 C84 64 70 76 53 78 L55 86 L45 79 C40 80 35 80 30 78 C19 72 16 56 23 43 C29 31 38 18 50 18 Z" />
                            {/* Three internal dots */}
                            <circle cx="38" cy="48" r="3.5" fill="currentColor" stroke="none" />
                            <circle cx="50" cy="48" r="3.5" fill="currentColor" stroke="none" />
                            <circle cx="62" cy="48" r="3.5" fill="currentColor" stroke="none" />
                        </svg>
                    </div>

                    {/* ── Right side: Text & Action Button ── */}
                    <div className="flex-1 text-center space-y-6 md:text-left">
                        <div className="space-y-2">
                            {heading && (
                                <h2 className="font-heading text-2xl font-extrabold text-brand sm:text-3xl">
                                    {heading}
                                </h2>
                            )}
                            {subtext && (
                                <p className="font-sans text-sm text-gray-500 sm:text-base leading-relaxed">
                                    {subtext}
                                </p>
                            )}
                        </div>

                        {/* Custom Button */}
                        {buttonLabel && buttonUrl && (
                            <div>
                                <BrandButton variant="primary" href={buttonUrl}>
                                    {buttonLabel}
                                </BrandButton>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
