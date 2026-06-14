import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'policy-accordion',
    category: 'Content',
    icon: 'List',
    description: 'Numbered accordion list on left with image + caption on right. Ideal for policy or structured content pages.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: 'Our Privacy Policy' },
    image: { type: 'image', label: 'Right Image', default: '' },
    imageAlt: { type: 'text', label: 'Image Alt Text', default: 'Policy illustration' },
    sideHeading: { type: 'text', label: 'Side Heading', default: 'Transparency You Can Count On' },
    sideDescription: {
        type: 'richtext',
        label: 'Side Description',
        default: '<p>We may update this Privacy Policy from time to time. We encourage you to review this page periodically to stay informed.</p>',
    },
    items: {
        type: 'array',
        label: 'Accordion Items',
        default: [
            { title: 'Information We Collect', content: '<p>We collect personal and non-personal information that you provide to us voluntarily when using our services.</p>' },
            { title: 'How We Use Your Information', content: '<p>We use your information to provide, improve, and personalize our services, and to communicate with you.</p>' },
            { title: 'Cookies & Tracking Technologies', content: '<p>We use cookies and similar tracking technologies to enhance your experience and analyze site traffic.</p>' },
            { title: 'Sharing of Information', content: '<p>We do not sell your personal information. We may share it with trusted partners only when necessary.</p>' },
            { title: 'Data Security', content: '<p>We implement appropriate security measures to protect your information from unauthorized access.</p>' },
            { title: 'Your Rights & Choices', content: '<p>You can access, update, or request deletion of your personal information at any time.</p>' },
            { title: 'Third-Party Links', content: '<p>Our website may contain links to third-party websites. We are not responsible for their privacy practices.</p>' },
            { title: 'Changes to This Policy', content: '<p>We may update this Privacy Policy from time to time. We will notify you of any significant changes.</p>' },
        ],
        itemSchema: {
            title: { type: 'text', label: 'Title', default: 'Policy Item' },
            content: { type: 'richtext', label: 'Content', default: '<p>Policy content here.</p>' },
        },
    },
};

type AccordionItem = {
    title?: string;
    content?: string;
};

type Props = {
    heading?: string;
    image?: string;
    imageAlt?: string;
    sideHeading?: string;
    sideDescription?: string;
    items?: AccordionItem[];
};

export default function PolicyAccordionSection({
    heading = 'Our Privacy Policy',
    image = '',
    imageAlt = 'Policy illustration',
    sideHeading = 'Transparency You Can Count On',
    sideDescription = '<p>We may update this Privacy Policy from time to time. We encourage you to review this page periodically to stay informed.</p>',
    items = [],
}: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Split heading: wrap last word with accent circle
    const words = heading.trim().split(' ');
    const lastWord = words.pop();
    const restWords = words.join(' ');

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start">

                    {/* ── Left: heading + accordion ── */}
                    <div className="w-full lg:w-3/5">
                        {/* Heading */}
                        <h2 className="mb-8 text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
                            {restWords && <span>{restWords} </span>}
                            {lastWord && (
                                <span className="relative inline-block">
                                    <span
                                        className="absolute rounded-full bg-accent-brand"
                                        style={{ width: 56, height: 56, top: '50%', right: -8, transform: 'translateY(-50%)', zIndex: 0 }}
                                    />
                                    <span className="relative" style={{ zIndex: 1 }}>{lastWord}</span>
                                </span>
                            )}
                        </h2>

                        {/* Accordion */}
                        <div className="divide-y divide-border rounded-xl border border-border">
                            {items.map((item, i) => {
                                const isOpen = openIndex === i;
                                const num = String(i + 1).padStart(2, '0');

                                return (
                                    <div key={i}>
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? null : i)}
                                            className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
                                        >
                                            <span className="w-8 shrink-0 text-sm font-extrabold text-accent-brand">
                                                {num}
                                            </span>
                                            <span className="flex-1 text-sm font-semibold text-gray-800">
                                                {item.title}
                                            </span>
                                            {isOpen
                                                ? <Minus className="h-4 w-4 shrink-0 text-accent-brand" />
                                                : <Plus className="h-4 w-4 shrink-0 text-gray-400" />
                                            }
                                        </button>
                                        {isOpen && item.content && (
                                            <div className="px-5 pb-4 pl-[3.25rem]">
                                                <div 
                                                    className="text-sm leading-relaxed text-gray-500 prose prose-sm max-w-none [&_p]:mb-2"
                                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right: image + caption ── */}
                    <div className="w-full lg:w-2/5">
                        {image ? (
                            <img
                                src={image}
                                alt={imageAlt}
                                className="mb-6 w-full rounded-2xl object-cover"
                                style={{ aspectRatio: '4/3' }}
                            />
                        ) : (
                            <div className="mb-6 flex w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400" style={{ aspectRatio: '4/3' }}>
                                <span className="text-sm">Add image</span>
                            </div>
                        )}

                        {sideHeading && (
                            <h3 className="mb-3 text-2xl font-extrabold leading-snug text-gray-900">
                                {sideHeading}
                            </h3>
                        )}
                        {sideDescription && (
                            <div 
                                className="text-sm leading-relaxed text-gray-500 prose prose-sm max-w-none [&_p]:mb-2"
                                dangerouslySetInnerHTML={{ __html: sideDescription }}
                            />
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
