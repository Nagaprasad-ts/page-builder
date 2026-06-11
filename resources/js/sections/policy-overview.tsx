import * as LucideIcons from 'lucide-react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'policy-overview',
    category: 'Content',
    icon: 'FileText',
    description: 'Two-column intro with heading + description on left, image on right, and a 5-column icon feature grid below.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Heading', default: 'Introduction' },
    description1: {
        type: 'textarea',
        label: 'First Paragraph',
        default: 'At EP Presentations, we value your trust. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
    },
    description2: {
        type: 'textarea',
        label: 'Second Paragraph',
        default: 'By using our website, you agree to the practices described in this policy.',
    },
    image: { type: 'image', label: 'Right Image', default: '' },
    imageAlt: { type: 'text', label: 'Image Alt Text', default: 'Privacy policy illustration' },
    features: {
        type: 'array',
        label: 'Feature Items',
        default: [
            { icon: 'User', title: 'Information We Collect', description: 'We collect personal and non-personal information that you provide to us voluntarily.' },
            { icon: 'HardDrive', title: 'How We Use Your Information', description: 'We use your information to provide, improve, and personalize our services.' },
            { icon: 'Share2', title: 'Sharing of Information', description: 'We do not sell your personal information. We may share it with trusted partners only when necessary.' },
            { icon: 'Shield', title: 'Data Security', description: 'We implement appropriate security measures to protect your information from unauthorized access.' },
            { icon: 'UserCheck', title: 'Your Choices', description: 'You can access, update, or request deletion of your personal information anytime.' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon (Lucide name e.g. Shield)', default: 'Shield' },
            title: { type: 'text', label: 'Title', default: 'Feature Title' },
            description: { type: 'textarea', label: 'Description', default: 'Feature description.' },
        },
    },
};

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    const Icon = (LucideIcons as Record<string, unknown>)[name ?? ''] as React.ComponentType<{ className?: string }> | undefined;
    if (!Icon) return <span className={className}>{name}</span>;
    return <Icon className={className} />;
}

type FeatureItem = {
    icon?: string;
    title?: string;
    description?: string;
};

type Props = {
    heading?: string;
    description1?: string;
    description2?: string;
    image?: string;
    imageAlt?: string;
    features?: FeatureItem[];
};

export default function PolicyOverviewSection({
    heading = 'Introduction',
    description1 = 'At EP Presentations, we value your trust. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
    description2 = 'By using our website, you agree to the practices described in this policy.',
    image = '',
    imageAlt = 'Privacy policy illustration',
    features = [],
}: Props) {
    // Split heading: wrap last word with accent circle
    const words = heading.trim().split(' ');
    const lastWord = words.pop();
    const restWords = words.join(' ');

    return (
        <section className="bg-white">
            {/* ── Top: text + image ── */}
            <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-center">

                    {/* Left */}
                    <div className="w-full lg:w-3/5">
                        <h2 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 lg:text-5xl">
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

                        {description1 && (
                            <p className="mb-4 text-sm leading-relaxed text-gray-600">{description1}</p>
                        )}
                        {description2 && (
                            <p className="text-sm leading-relaxed text-gray-600">{description2}</p>
                        )}
                    </div>

                    {/* Right: image with accent block */}
                    <div className="relative w-full lg:w-2/5">
                        {/* Accent block behind image */}
                        <div
                            className="absolute rounded-3xl bg-accent-brand"
                            style={{ bottom: -16, right: -16, width: '75%', height: '70%', zIndex: 0 }}
                        />
                        {image ? (
                            <img
                                src={image}
                                alt={imageAlt}
                                className="relative z-10 h-72 w-full rounded-2xl object-cover shadow-lg lg:h-80"
                            />
                        ) : (
                            <div className="relative z-10 flex h-72 w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400 lg:h-80">
                                <span className="text-sm">Add image</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Bottom: feature grid ── */}
            {features.length > 0 && (
                <div className="bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
                            {features.map((f, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center">
                                        <DynamicIcon name={f.icon} className="h-8 w-8 text-accent-brand" />
                                    </div>
                                    <h3 className="mb-2 text-sm font-extrabold leading-snug text-gray-900">{f.title}</h3>
                                    <p className="text-xs leading-relaxed text-gray-500">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
