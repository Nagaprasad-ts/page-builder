import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'error-404',
    category: 'Marketing',
    icon: 'AlertCircle',
    description: 'A premium 404 error page layout with custom signpost illustration, typography, and button.',
};

export const schema: SectionSchema = {
    errorCode: { type: 'text', label: 'Error Code', default: '404' },
    heading: { type: 'text', label: 'Heading', default: "Can't Help you with that." },
    description: {
        type: 'richtext',
        label: 'Description',
        default: "<p>Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.</p>",
    },
    buttonLabel: { type: 'text', label: 'Button Label', default: 'Back to Homepage' },
    buttonUrl: { type: 'url', label: 'Button URL', default: '/' },
    sign1Text: { type: 'text', label: 'Top Sign Text', default: 'This Way?' },
    sign2Text: { type: 'text', label: 'Bottom Sign Text', default: 'Not Here!' },
};

type Props = {
    errorCode?: string;
    heading?: string;
    description?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    sign1Text?: string;
    sign2Text?: string;
};

export default function Error404Section({
    errorCode = '404',
    heading = "Can't Help you with that.",
    description = "<p>Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.</p>",
    buttonLabel = 'Back to Homepage',
    buttonUrl = '/',
    sign1Text = 'This Way?',
    sign2Text = 'Not Here!',
}: Props) {
    return (
        <section className="relative overflow-hidden bg-white py-8 md:py-6">
            <div className="mx-auto max-w-7xl px-4 md:px-7">
                <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">

                    {/* ── Left side: Text Content ── */}
                    <div className="w-full space-y-8 lg:w-1/2">
                        {/* Title and 404 block */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <span className="font-heading text-7xl font-extrabold text-brand sm:text-8xl">
                                {errorCode}
                            </span>
                            {/* Vertical line divider on desktop */}
                            <div className="hidden h-20 w-px bg-gray-300 sm:block" />
                            <h1 className="font-heading mt-5 text-3xl font-bold leading-tight text-brand sm:text-4xl">
                                {heading}
                            </h1>
                        </div>

                        {/* Description */}
                        {description && (
                            <div
                                className="max-w-md text-base sm:text-lg prose prose-sm"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}

                        {/* CTA button */}
                        {buttonLabel && buttonUrl && (
                            <div className="pt-2">
                                <BrandButton variant="primary" href={buttonUrl}>
                                    {buttonLabel}
                                </BrandButton>
                            </div>
                        )}
                    </div>

                    {/* ── Right side: Signpost Illustration ── */}
                    <div className="relative flex w-full items-center justify-center lg:w-1/2">
                        <div className="relative flex aspect-square w-full max-w-md items-center justify-center select-none">
                            {/* Decorative background shapes */}
                            {/* Large light grey circle */}
                            <div className="absolute top-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-gray-50/90" />

                            {/* Accent Brand (blue) semi-circle */}
                            <div className="absolute bottom-12 left-12 -z-10 h-24 w-48 rounded-t-full bg-accent-brand/10" />

                            {/* Small decorative circles */}
                            <div className="absolute top-1/3 left-1/4 h-3 w-3 rounded-full bg-accent-brand/30" />
                            <div className="absolute bottom-1/3 right-12 h-4 w-4 rounded-full bg-accent-brand/60" />
                            <div className="absolute bottom-1/4 right-24 h-2.5 w-2.5 rounded-full bg-brand/40" />

                            {/* Signpost */}
                            <div className="relative flex flex-col items-center">
                                {/* Post */}
                                <div className="relative h-72 w-4 bg-brand shadow-sm">
                                    {/* Top ball */}
                                    <div className="absolute -top-5 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-brand shadow-xs" />

                                    {/* Base stand */}
                                    <div className="absolute -bottom-1 left-1/2 h-3.5 w-32 -translate-x-1/2 rounded-full bg-brand shadow-xs" />
                                </div>

                                {/* Top Sign: "This Way?" pointing left */}
                                {sign1Text && (
                                    <div className="absolute top-16 -left-28 flex items-center transition duration-300 hover:scale-105 cursor-pointer">
                                        <div className="relative min-w-36 rounded-xl bg-accent-brand px-6 py-2.5 text-center font-heading text-base font-bold text-white shadow-md">
                                            {sign1Text}
                                            {/* Arrow tip pointing left */}
                                            <div className="absolute top-1/2 -left-2.5 h-0 w-0 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[10px] border-r-accent-brand" />
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Sign: "Not Here!" pointing right */}
                                {sign2Text && (
                                    <div className="absolute top-36 -right-28 flex items-center transition duration-300 hover:scale-105 cursor-pointer">
                                        <div className="relative min-w-36 rounded-xl bg-brand px-6 py-2.5 text-center font-heading text-base font-bold text-white shadow-md">
                                            {sign2Text}
                                            {/* Arrow tip pointing right */}
                                            <div className="absolute top-1/2 -right-2.5 h-0 w-0 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[10px] border-l-brand" />
                                        </div>
                                    </div>
                                )}

                                {/* Leaf decorations at the base */}
                                <svg className="absolute bottom-0 -left-12 h-14 w-12 text-gray-300 fill-current opacity-70" viewBox="0 0 120 120">
                                    <path d="M60,10 C40,40 20,80 60,110 C100,80 80,40 60,10 Z" />
                                </svg>
                                <svg className="absolute bottom-0 -right-12 h-14 w-12 text-gray-300 fill-current opacity-70 transform scale-x-[-1]" viewBox="0 0 120 120">
                                    <path d="M60,10 C40,40 20,80 60,110 C100,80 80,40 60,10 Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
