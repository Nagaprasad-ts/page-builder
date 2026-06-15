import { Download } from 'lucide-react';
import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'service-package',
    category: 'Marketing',
    icon: 'Package',
    description: 'Service package — number, label, heading with circle accent, CTAs, image right.',
};

export const schema: SectionSchema = {
    label: { type: 'text', label: 'Label', default: 'OUR SERVICE PACKAGE' },
    headingLine1: { type: 'text', label: 'Heading line 1', default: 'Content Creation' },
    headingLine2: { type: 'text', label: 'Heading line 2 (gets circle)', default: 'Package' },
    description: {
        type: 'richtext',
        label: 'Description',
        default: '<p>A complete content solution designed to build your brand, engage your audience, and drive real results.</p>',
    },
    primaryLabel: { type: 'text', label: 'Primary button label', default: 'Get started' },
    primaryUrl: { type: 'url', label: 'Primary button URL', default: '#' },
    secondaryLabel: { type: 'text', label: 'Secondary link label', default: 'Download brochure' },
    secondaryUrl: { type: 'url', label: 'Secondary link URL', default: '#' },
    image: { type: 'image', label: 'Image' },
    imageAlt: { type: 'text', label: 'Image Alt Text', default: '' },
};

type Props = {
    number?: string;
    label?: string;
    headingLine1?: string;
    headingLine2?: string;
    description?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
    image?: string | null;
    imageAlt?: string;
};

export default function ServicePackageSection({
    number: _number,
    label: _label,
    headingLine1,
    headingLine2,
    description,
    primaryLabel,
    primaryUrl,
    secondaryLabel,
    secondaryUrl,
    image,
    imageAlt,
}: Props) {
    return (
        <section className="bg-white py-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:gap-12 md:flex-row px-4 md:px-7 w-full">

                {/* ── Left: text ── */}
                <div className="relative flex-1">
                    {/* Heading */}
                    <h2 className="relative z-10 mb-5 text-5xl text-brand font-extrabold leading-tight">
                        {headingLine1 && <span className="block z-10">{headingLine1}</span>}
                        {headingLine2 && (
                            <span className="relative inline-block">
                                <span className="absolute -bottom-5 -right-36 -z-10 size-32 rounded-full bg-accent-brand" />
                                <span className="relative z-10">{headingLine2}</span>
                            </span>
                        )}
                    </h2>

                    {/* Description */}
                    {description && (
                        <div
                            className="mb-8 max-w-sm text-base font-semibold leading-relaxed text-gray-500 prose prose-sm [&_p]:mb-2 [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-6">
                        {primaryLabel && primaryUrl && (
                            <BrandButton variant="secondary" href={primaryUrl}>
                                {primaryLabel}
                            </BrandButton>
                        )}
                        {secondaryLabel && secondaryUrl && (
                            <BrandButton variant="outline" href={secondaryUrl} showArrow={false} className="gap-2">
                                {secondaryLabel}
                                <Download className="h-4 w-4" />
                            </BrandButton>
                        )}
                    </div>
                </div>

                {/* ── Right: image ── */}
                <div className="w-full md:w-1/2 shrink-0">
                    {image ? (
                        <img
                            src={image}
                            alt={imageAlt ?? ''}
                            className="w-full aspect-[4/3] rounded-3xl object-cover"
                        />
                    ) : (
                        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gray-100">
                            <span className="text-sm text-gray-400">Add image</span>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
