import React from 'react';
import { SendHorizontal } from 'lucide-react';
import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'community-cta',
    category: 'Marketing',
    icon: 'Megaphone',
    description: 'Horizontal banner card with heading, description, paper plane visual, and a prominent call-to-action button.',
};

export const schema: SectionSchema = {
    headingText: {
        type: 'text',
        label: 'Heading Text',
        default: 'Be part of a community that leads the future of work.',
    },
    descriptionText: {
        type: 'text',
        label: 'Description Text',
        default: 'Apply today and get exclusive access to HR Library Newsletter.',
    },
    buttonLabel: { type: 'text', label: 'Button Label', default: 'Request Access Now' },
    buttonUrl: { type: 'url', label: 'Button URL', default: '#' },
    showDecorativePattern: { type: 'boolean', label: 'Show Decorative Pattern', default: true },
};

type Props = {
    headingText?: string;
    descriptionText?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    showDecorativePattern?: boolean;
};

export default function CommunityCtaSection({
    headingText = 'Be part of a community that leads the future of work.',
    descriptionText = 'Apply today and get exclusive access to HR Library Newsletter.',
    buttonLabel = 'Request Access Now',
    buttonUrl = '#',
    showDecorativePattern = true,
}: Props) {
    return (
        <section className="bg-white py-12 lg:py-16 select-none">
            <div className="mx-auto max-w-7xl px-4 md:px-7">
                <div className="rounded-[2.5rem] border border-gray-100 bg-[#f4f7fc] p-8 md:p-10 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
                        
                        {/* Left Side: Visual Illustration + Text */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 lg:gap-8 flex-1">
                            {/* Paper plane visual badge */}
                            {showDecorativePattern && (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-brand/10 text-accent-brand relative overflow-hidden select-none">
                                    <SendHorizontal className="h-8 w-8 rotate-[-30deg]" />
                                    {/* Dotted flight trail */}
                                    <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full border border-dashed border-accent-brand/30" />
                                </div>
                            )}

                            {/* Text content block */}
                            <div className="space-y-2">
                                {headingText && (
                                    <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-extrabold text-brand leading-tight max-w-xl">
                                        {headingText}
                                    </h2>
                                )}
                                {descriptionText && (
                                    <p className="font-sans text-sm text-gray-500 max-w-md">
                                        {descriptionText}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Side: CTA Button */}
                        {buttonLabel && buttonUrl && (
                            <div className="shrink-0 w-full sm:w-auto text-center">
                                <BrandButton 
                                    href={buttonUrl} 
                                    variant="primary" 
                                    className="py-3.5 px-6 font-bold w-full sm:w-auto shadow-md"
                                >
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
