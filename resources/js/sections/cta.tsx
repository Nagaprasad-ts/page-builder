import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'cta',
    category: 'Marketing',
    icon: 'ArrowRight',
    description:
        'A call-to-action section with a heading, body text, and two action buttons.',
};

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Heading',
        default: 'Ready to get started?',
    },
    body: {
        type: 'richtext',
        label: 'Body',
        default:
            '<p>Join thousands of customers already using our platform.</p>',
    },
    primaryLabel: {
        type: 'text',
        label: 'Primary Button Label',
        default: 'Get started',
    },
    primaryUrl: {
        type: 'url',
        label: 'Primary Button URL',
        default: '/register',
    },
    secondaryLabel: {
        type: 'text',
        label: 'Secondary Button Label',
        default: 'Learn more',
    },
    secondaryUrl: {
        type: 'url',
        label: 'Secondary Button URL',
        default: '/about',
    },
};

type Props = {
    heading?: string;
    body?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
};

export default function CtaSection({
    heading,
    body,
    primaryLabel,
    primaryUrl,
    secondaryLabel,
    secondaryUrl,
}: Props) {
    return (
        <section className="bg-gray-50 py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
                {heading && (
                    <h2 className="mb-4 text-3xl font-bold text-gray-900">
                        {heading}
                    </h2>
                )}
                {body && (
                    <div
                        className="mb-10 text-lg text-gray-600 [&_a]:underline [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                )}
                <div className="flex flex-wrap justify-center gap-4">
                    {primaryLabel && primaryUrl && (
                        <a
                            href={primaryUrl}
                            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                        >
                            {primaryLabel}
                        </a>
                    )}
                    {secondaryLabel && secondaryUrl && (
                        <a
                            href={secondaryUrl}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            {secondaryLabel}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
