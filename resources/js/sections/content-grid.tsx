import { DynamicIcon } from '@/components/ui/dynamic-icon';
import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'content-grid',
    category: 'Marketing',
    icon: 'LayoutGrid',
    description: 'Left text + CTA, right icon card grid. Icon names are editable.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: 'What We Create' },
    description: {
        type: 'richtext',
        label: 'Description',
        default:
            '<p>From compelling copy to scroll-stopping visuals, we create content that captures attention and drives results.</p>',
    },
    ctaLabel: { type: 'text', label: 'CTA label', default: 'Explore all services' },
    ctaUrl: { type: 'url', label: 'CTA URL', default: '#' },
    items: {
        type: 'array',
        label: 'Cards',
        default: [
            { icon: 'FileText', title: 'Blog Posts', body: '<p>Informative and SEO-friendly articles that build authority.</p>' },
            { icon: 'Share2', title: 'Social Media Content', body: '<p>Engaging posts that grow your brand presence.</p>' },
            { icon: 'Home', title: 'Website Copy', body: '<p>Clear, persuasive copy that converts visitors.</p>' },
            { icon: 'Video', title: 'Video Scripts', body: '<p>Stories that captivate and communicate your message.</p>' },
            { icon: 'Mail', title: 'Email Newsletters', body: '<p>Engaging campaigns that build relationship and loyalty.</p>' },
            { icon: 'BookOpen', title: 'Case Studies', body: '<p>Detailed success stories that showcase your expertise.</p>' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon (Lucide name e.g. FileText)', default: 'FileText' },
            title: { type: 'text', label: 'Title', default: 'Card title' },
            body: { type: 'richtext', label: 'Description', default: '<p>Short description.</p>' },
        },
    },
};

type CardItem = {
    icon?: string;
    title?: string;
    body?: string;
};

type Props = {
    number?: string;
    heading?: string;
    description?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    items?: CardItem[];
};



export default function ContentGridSection({
    heading,
    description,
    ctaLabel,
    ctaUrl,
    items = [],
}: Props) {
    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-7 lg:flex-row lg:items-start lg:gap-16">

                {/* ── Left ── */}
                <div className="w-full lg:w-[30%] lg:shrink-0">

                    {heading && (
                        <h2 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900">
                            {heading}
                        </h2>
                    )}

                    {description && (
                        <div
                            className="mb-8 prose prose-sm"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}

                    {ctaLabel && ctaUrl && (
                        <BrandButton variant="link" href={ctaUrl}>
                            {ctaLabel}
                        </BrandButton>
                    )}
                </div>

                {/* ── Right: 3-column card grid ── */}
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, i) => (
                        <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-brand/10 text-accent-brand">
                                <DynamicIcon name={item.icon} className="h-5 w-5" />
                            </div>
                            {item.title && (
                                <h3 className="mb-2 text-sm font-bold text-gray-900">{item.title}</h3>
                            )}
                            {item.body && (
                                <div 
                                    className="text-xs leading-relaxed text-gray-500 prose prose-sm max-w-none [&_p]:m-0"
                                    dangerouslySetInnerHTML={{ __html: item.body }}
                                />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
