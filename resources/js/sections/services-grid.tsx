import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'services-grid',
    category: 'Marketing',
    icon: 'LayoutDashboard',
    description: 'Services grid - one large featured card + two smaller cards, dark background with text and images.',
};

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Heading',
        default: 'Powering Modern Workspaces, Together',
    },

    // Featured card
    featuredTitle: {
        type: 'text',
        label: 'Featured - Title',
        default: 'Education Is Evolving Beyond Academics Towards Culture, Experiences, Future Opportunities, and Industry Connections',
    },
    featuredDescription: {
        type: 'textarea',
        label: 'Featured - Description',
        default: 'In today\'s rapidly evolving education landscape, attracting and retaining the right talent has become just as important as academic excellence. Institutions that build strong cultures, meaningful experiences, and credible identities are better positioned to stay competitive, strengthen industry relevance, and create lasting impact among students, educators, and future professionals.',
    },
    featuredButtonLabel: { type: 'text', label: 'Featured - Button label', default: 'Book a Call' },
    featuredButtonUrl: { type: 'url', label: 'Featured - Button URL', default: '#' },
    featuredImage1: { type: 'image', label: 'Featured - Image 1' },
    featuredImage2: { type: 'image', label: 'Featured - Image 2' },
    featuredImage3: { type: 'image', label: 'Featured - Image 3' },

    // Card 2
    card2Title: { type: 'text', label: 'Card 2 - Title', default: 'Create Future-Ready Tech Identity' },
    card2Description: {
        type: 'textarea',
        label: 'Card 2 - Description',
        default: 'Digital footprints today define how tech companies attract exceptional talent, build credibility, strengthen culture, and stay competitive in an evolving industry landscape.',
    },
    card2ButtonLabel: { type: 'text', label: 'Card 2 - Button label', default: 'Request a Proposal' },
    card2ButtonUrl: { type: 'url', label: 'Card 2 - Button URL', default: '#' },
    card2Image: { type: 'image', label: 'Card 2 - Image' },

    // Card 3
    card3Title: { type: 'text', label: 'Card 3 - Title', default: 'Startup Growth Begins With Culture' },
    card3Description: {
        type: 'textarea',
        label: 'Card 3 - Description',
        default: 'Strong workplace cultures help startups attract passionate talent, build trust, improve retention, and scale sustainably in competitive business environments.',
    },
    card3ButtonLabel: { type: 'text', label: 'Card 3 - Button label', default: 'Contact Us' },
    card3ButtonUrl: { type: 'url', label: 'Card 3 - Button URL', default: '#' },
    card3Image: { type: 'image', label: 'Card 3 - Image' },
};

type Props = {
    heading?: string;
    featuredTitle?: string;
    featuredDescription?: string;
    featuredButtonLabel?: string;
    featuredButtonUrl?: string;
    featuredImage1?: string | null;
    featuredImage2?: string | null;
    featuredImage3?: string | null;
    card2Title?: string;
    card2Description?: string;
    card2ButtonLabel?: string;
    card2ButtonUrl?: string;
    card2Image?: string | null;
    card3Title?: string;
    card3Description?: string;
    card3ButtonLabel?: string;
    card3ButtonUrl?: string;
    card3Image?: string | null;
};

function PlaceholderImage() {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#1e3460]">
            <span className="text-sm text-gray-500">Add image</span>
        </div>
    );
}

export default function ServicesGridSection({
    heading,
    featuredTitle,
    featuredDescription,
    featuredButtonLabel,
    featuredButtonUrl,
    featuredImage1,
    featuredImage2,
    featuredImage3,
    card2Title,
    card2Description,
    card2ButtonLabel,
    card2ButtonUrl,
    card2Image,
    card3Title,
    card3Description,
    card3ButtonLabel,
    card3ButtonUrl,
    card3Image,
}: Props) {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-6xl px-6">

                {/* Heading */}
                {heading && (
                    <div className="mb-10 text-center">
                        <div className="relative inline-block">
                            <div className="absolute -top-3 left-2 h-12 w-12 rounded-full bg-accent-brand opacity-80" />
                            <h2 className="relative text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                {heading}
                            </h2>
                        </div>
                    </div>
                )}

                {/* Featured card - full width */}
                <div className="mb-4 rounded-2xl bg-black p-8 md:p-10">
                    <div className="flex flex-col gap-8 md:flex-row md:items-center">

                        {/* Text */}
                        <div className="flex-1 space-y-4">
                            {featuredTitle && (
                                <h3 className="text-2xl font-extrabold leading-snug text-white md:text-3xl">
                                    {featuredTitle}
                                </h3>
                            )}
                            {featuredDescription && (
                                <p className="text-sm leading-relaxed text-gray-400">
                                    {featuredDescription}
                                </p>
                            )}
                            {featuredButtonLabel && (
                                <a
                                    href={featuredButtonUrl ?? '#'}
                                    className="inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
                                >
                                    {featuredButtonLabel}
                                </a>
                            )}
                        </div>

                        {/* Images - stacked */}
                        <div className="relative flex shrink-0 items-end justify-center gap-3 md:w-80">
                            {[featuredImage1, featuredImage2, featuredImage3].map((img, i) => (
                                <div
                                    key={i}
                                    className="h-32 w-24 overflow-hidden rounded-xl md:h-40 md:w-28"
                                    style={{ marginBottom: i === 1 ? '2rem' : '0' }}
                                >
                                    {img ? (
                                        <img src={img} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <PlaceholderImage />
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Two smaller cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                        { title: card2Title, description: card2Description, btnLabel: card2ButtonLabel, btnUrl: card2ButtonUrl, image: card2Image },
                        { title: card3Title, description: card3Description, btnLabel: card3ButtonLabel, btnUrl: card3ButtonUrl, image: card3Image },
                    ].map((card, i) => (
                        <div key={i} className="flex flex-row items-center gap-4 rounded-2xl bg-black p-6">

                            {/* Text */}
                            <div className="flex-1 space-y-3">
                                {card.title && (
                                    <h3 className="text-xl font-extrabold leading-snug text-white">
                                        {card.title}
                                    </h3>
                                )}
                                {card.description && (
                                    <p className="text-xs leading-relaxed text-gray-400 line-clamp-4">
                                        {card.description}
                                    </p>
                                )}
                                {card.btnLabel && (
                                    <a
                                        href={card.btnUrl ?? '#'}
                                        className="inline-block rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand/90"
                                    >
                                        {card.btnLabel}
                                    </a>
                                )}
                            </div>

                            {/* Image */}
                            <div className="h-36 w-32 shrink-0 overflow-hidden rounded-xl">
                                {card.image ? (
                                    <img src={card.image} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <PlaceholderImage />
                                )}
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
