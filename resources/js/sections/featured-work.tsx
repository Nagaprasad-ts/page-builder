import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'featured-work',
    category: 'Marketing',
    icon: 'Images',
    description: 'Label, heading with circle accent, description, CTA, and 3 portfolio image cards.',
};

export const schema: SectionSchema = {
    label: { type: 'text', label: 'Label', default: 'Featured Work' },
    headingLine1: { type: 'text', label: 'Heading line 1', default: 'Work That' },
    headingLine2: { type: 'text', label: 'Heading line 2 (circle on last word)', default: 'Speaks for Itself' },
    description: {
        type: 'richtext',
        label: 'Description',
        default: '<p>See how we help brands bring their stories to life.</p>',
    },
    ctaLabel: { type: 'text', label: 'CTA label', default: 'View all projects' },
    ctaUrl: { type: 'url', label: 'CTA URL', default: '#' },
    items: {
        type: 'array',
        label: 'Portfolio cards',
        default: [
            { title: 'Brand Campaign', category: 'Photography', image: null },
            { title: 'Social Media Series', category: 'Content Creation', image: null },
            { title: 'Product Shoot', category: 'Photography', image: null },
        ],
        itemSchema: {
            image: { type: 'image', label: 'Image' },
            imageAlt: { type: 'text', label: 'Image Alt Text', default: '' },
            title: { type: 'text', label: 'Title', default: 'Project title' },
            category: { type: 'text', label: 'Category', default: 'Photography' },
        },
    },
};

type WorkItem = {
    image?: string | null;
    imageAlt?: string;
    title?: string;
    category?: string;
};

type Props = {
    label?: string;
    headingLine1?: string;
    headingLine2?: string;
    description?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    items?: WorkItem[];
};

function HeadingWithCircle({ line }: { line: string }) {
    const words = line.split(' ');
    const last = words.pop();
    const rest = words.join(' ');

    return (
        <span className="relative z-10 inline-block">
            {rest && <>{rest} </>}
            {last && (
                <span className="relative inline-block">
                    {last}
                    <span
                        className="absolute rounded-full bg-accent-brand -z-10"
                        style={{
                            width: '1.5em',
                            height: '1.5em',
                            left: '-0.75em',
                            top: '50%',
                            transform: 'translateY(-35%)',
                        }}
                    />
                </span>
            )}
        </span>
    );
}

export default function FeaturedWorkSection({
    label,
    headingLine1,
    headingLine2,
    description,
    ctaLabel,
    ctaUrl,
    items = [],
}: Props) {
    return (
        <section className="bg-white py-16">
            <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-4 md:px-7 lg:flex-row lg:items-center">

                {/* ── Left ── */}
                <div className="w-full lg:w-[36%] lg:shrink-0">
                    {label && (
                        <p className="mb-3 text-sm font-bold text-accent-brand">{label}</p>
                    )}

                    <h2 className="mb-4 font-extrabold leading-tight text-gray-900 text-4xl">
                        {headingLine1 && <span className="block">{headingLine1}</span>}
                        {headingLine2 && (
                            <span className="block">
                                <HeadingWithCircle line={headingLine2} />
                            </span>
                        )}
                    </h2>

                    {description && (
                        <div 
                            className="mb-8 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}

                    {ctaLabel && ctaUrl && (
                        <BrandButton variant="link" href={ctaUrl}>
                            {ctaLabel}
                        </BrandButton>
                    )}
                </div>

                {/* ── Right: 3 cards ── */}
                <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                    {items.map((item, i) => (
                        <div key={i} className="flex flex-col">
                            <div className="mb-3 overflow-hidden rounded-2xl bg-gray-200" style={{ aspectRatio: '3/4' }}>
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.imageAlt || item.title || ''}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <span className="text-xs text-gray-400">Add image</span>
                                    </div>
                                )}
                            </div>
                            {item.title && (
                                <p className="text-base font-bold text-gray-900">{item.title}</p>
                            )}
                            {item.category && (
                                <p className="text-sm text-gray-400">{item.category}</p>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
