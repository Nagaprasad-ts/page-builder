import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'services-grid',
    category: 'Marketing',
    icon: 'LayoutDashboard',
    description: 'Services grid — one featured image + two smaller images, each fully clickable.',
};

export const schema: SectionSchema = {
    heading: {
        type: 'text',
        label: 'Heading',
        default: 'The Services We Offer For Your Business',
    },
    featuredImage: { type: 'image', label: 'Featured image (large)' },
    featuredUrl: { type: 'url', label: 'Featured link URL', default: '#' },
    image2: { type: 'image', label: 'Image 2 (bottom left)' },
    url2: { type: 'url', label: 'Image 2 link URL', default: '#' },
    image3: { type: 'image', label: 'Image 3 (bottom right)' },
    url3: { type: 'url', label: 'Image 3 link URL', default: '#' },
};

type Props = {
    heading?: string;
    featuredImage?: string | null;
    featuredUrl?: string;
    image2?: string | null;
    url2?: string;
    image3?: string | null;
    url3?: string;
};

function ImageCard({ image, url, large = false }: { image?: string | null; url?: string; large?: boolean }) {
    return (
        <a
            href={url ?? '#'}
            className={`group relative block overflow-hidden rounded-2xl bg-gray-200 ${large ? 'h-80 md:h-96' : 'h-64'}`}
        >
            {image ? (
                <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <span className="text-sm text-gray-400">Add image</span>
                </div>
            )}
        </a>
    );
}

export default function ServicesGridSection({ heading, featuredImage, featuredUrl, image2, url2, image3, url3 }: Props) {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-6xl px-6">

                {/* Heading */}
                {heading && (
                    <div className="mb-10 text-center">
                        <div className="relative inline-block">
                            <div className="absolute -top-3 left-2 h-12 w-12 rounded-full bg-blue-400 opacity-70" />
                            <h2 className="relative text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                {heading}
                            </h2>
                        </div>
                    </div>
                )}

                {/* Featured — full width */}
                <div className="mb-4">
                    <ImageCard image={featuredImage} url={featuredUrl} large />
                </div>

                {/* Two smaller cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ImageCard image={image2} url={url2} />
                    <ImageCard image={image3} url={url3} />
                </div>

            </div>
        </section>
    );
}
