import { ArrowRight, Download } from 'lucide-react';
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
        type: 'textarea',
        label: 'Description',
        default: 'A complete content solution designed to build your brand, engage your audience, and drive real results.',
    },
    primaryLabel: { type: 'text', label: 'Primary button label', default: 'Get started' },
    primaryUrl: { type: 'url', label: 'Primary button URL', default: '#' },
    secondaryLabel: { type: 'text', label: 'Secondary link label', default: 'Download brochure' },
    secondaryUrl: { type: 'url', label: 'Secondary link URL', default: '#' },
    image: { type: 'image', label: 'Image' },
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
};

export default function ServicePackageSection({
    number,
    label,
    headingLine1,
    headingLine2,
    description,
    primaryLabel,
    primaryUrl,
    secondaryLabel,
    secondaryUrl,
    image,
}: Props) {
    return (
        <section className="bg-white py-8 px-4 md:px-0 mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row">

            {/* ── Left: text ── */}
            <div>
                {/* Heading */}
                <div className='bg-accent-brand absolute z-0 size-16 rounded-full -top-9 -left-12'></div>
                <h2 className="mb-5 text-5xl text-brand font-extrabold leading-tight z-10 relative">
                    {headingLine1 && <span className="block">{headingLine1}</span>}
                    {headingLine2 && (
                        <span className="relative" style={{ zIndex: 1 }}>{headingLine2}</span>
                    )}
                </h2>

                {/* Description */}
                {description && (
                    <p className="mb-8 max-w-sm text-base font-semibold leading-relaxed text-gray-500">{description}</p>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-6">
                    {primaryLabel && primaryUrl && (
                        <a
                            href={primaryUrl}
                            className="flex items-center gap-3 rounded-full bg-brand py-3 px-5 text-sm font-semibold text-white transition hover:bg-brand/90"
                        >
                            {primaryLabel}
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-brand">
                                <ArrowRight className="h-4 w-4 text-white" />
                            </span>
                        </a>
                    )}
                    {secondaryLabel && secondaryUrl && (
                        <a
                            href={secondaryUrl}
                            className="flex items-center gap-2 rounded-full py-3 px-5 text-sm font-semibold text-gray-700 transition hover:text-brand border-2 border-brand hover:bg-accent-brand/10"
                        >
                            {secondaryLabel}
                            <Download className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* ── Right: image ── */}
            <div className="w-87.5 shrink-0">
                {image ? (
                    <img
                        src={image}
                        alt=""
                        className="w-full h-87.5 rounded-3xl object-cover"
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-3xl bg-gray-100">
                        <span className="text-sm text-gray-400">Add image</span>
                    </div>
                )}
            </div>

        </section>
    );
}
