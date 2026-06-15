import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'newsletter',
    category: 'Marketing',
    icon: 'Mail',
    description:
        'Email subscription section with a heading, rich body text, and a subscribe button.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: 'Stay in the loop' },
    body: {
        type: 'richtext',
        label: 'Body',
        default:
            '<p>Subscribe to our newsletter for the latest news and updates.</p>',
    },
    buttonLabel: { type: 'text', label: 'Button Label', default: 'Subscribe' },
    buttonUrl: { type: 'url', label: 'Button URL', default: '#' },
};

type Props = {
    heading?: string;
    body?: string;
    buttonLabel?: string;
    buttonUrl?: string;
};

export default function NewsletterSection({
    heading,
    body,
    buttonLabel,
    buttonUrl,
}: Props) {
    return (
        <section className="bg-indigo-600 py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 md:px-7 text-center">
                {heading && (
                    <h2 className="mb-4 text-3xl font-bold">{heading}</h2>
                )}
                {body && (
                    <div
                        className="mb-8 text-indigo-100 [&_a]:underline [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                )}
                {buttonLabel && buttonUrl && (
                    <BrandButton variant="white" href={buttonUrl}>
                        {buttonLabel}
                    </BrandButton>
                )}
            </div>
        </section>
    );
}
