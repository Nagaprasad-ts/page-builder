import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'trusted-partners',
    category: 'Marketing',
    icon: 'Handshake',
    description: 'Trusted partners logo grid — heading left, 3 rows of 4 logos right.',
};

const DEFAULT_LOGOS = Array.from({ length: 12 }, (_, i) => ({ image: null, alt: `Partner ${i + 1}` }));

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Heading',
        default: 'Trusted by our customers & partners',
    },
    logos: {
        type: 'array',
        label: 'Logos',
        default: DEFAULT_LOGOS,
        itemSchema: {
            image: { type: 'image', label: 'Logo image' },
            alt: { type: 'text', label: 'Alt text', default: 'Partner logo' },
        },
    },
};

type Logo = {
    image?: string | null;
    alt?: string;
};

type Props = {
    heading?: string;
    logos?: Logo[];
};

export default function TrustedPartners({ heading, logos }: Props) {
    const logoList: Logo[] = (logos ? Object.values(logos) : []).length > 0
        ? Object.values(logos ?? {})
        : DEFAULT_LOGOS;

    // Always show exactly 12 slots (3 rows × 4)
    const slots = Array.from({ length: 12 }, (_, i) => logoList[i] ?? {});

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-0">

                    {/* Left 30%: heading */}
                    <div className="lg:w-[30%] lg:pr-12">
                        {heading && (
                            <h2 className="text-4xl font-extrabold leading-snug tracking-tight text-gray-900">
                                {heading}
                            </h2>
                        )}
                    </div>

                    {/* Right 70%: 3 rows × 4 logos */}
                    <div className="lg:w-[70%]">
                        <div className="grid grid-cols-4 gap-px">
                            {slots.map((logo, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-center p-6"
                                >
                                    {logo.image && (
                                        <img
                                            src={logo.image}
                                            alt={logo.alt ?? ''}
                                            className="w-26 h-26 object-contain"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
