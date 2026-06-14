import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'contact-cta',
    category: 'Marketing',
    icon: 'Mail',
    description: "A dark brand-themed contact CTA banner featuring a premium 3D-style SVG illustration, serif heading, and 'Let's Talk' button.",
};

export const schema: SectionSchema = {
    badgeText: { type: 'text', label: 'Badge Label', default: 'Get In Touch' },
    heading: { type: 'text', label: 'Heading', default: "Let's Create Something Great Together" },
    description: {
        type: 'richtext',
        label: 'Description',
        default: "<p>Have a project in mind or just want to say hello? We'd love to hear from you.</p>",
    },
    buttonLabel: { type: 'text', label: 'Button Label', default: "Let's Talk" },
    buttonUrl: { type: 'url', label: 'Button URL', default: '#' },
};

type Props = {
    badgeText?: string;
    heading?: string;
    description?: string;
    buttonLabel?: string;
    buttonUrl?: string;
};

export default function ContactCtaSection({
    badgeText = 'Get In Touch',
    heading = "Let's Create Something Great Together",
    description = "<p>Have a project in mind or just want to say hello? We'd love to hear from you.</p>",
    buttonLabel = "Let's Talk",
    buttonUrl = '#',
}: Props) {
    return (
        <section className="w-full bg-brand text-white py-16 md:py-24 relative overflow-hidden">
            
            {/* Decorative background shapes */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-accent-brand/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-accent-brand/5 blur-2xl pointer-events-none" />

            <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-12 lg:flex-row relative z-10">
                    
                    {/* ── Left side: Text Content ── */}
                    <div className="w-full space-y-6 lg:w-1/2 text-left">
                        {badgeText && (
                            <div className="inline-block rounded-full border border-accent-brand/60 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent-brand uppercase">
                                {badgeText}
                            </div>
                        )}

                        <h2 className="font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl max-w-lg">
                            {heading}
                        </h2>

                        {description && (
                            <div 
                                className="font-sans text-sm text-gray-300 sm:text-base leading-relaxed max-w-md prose prose-invert prose-sm [&_p]:mb-2"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}

                        {buttonLabel && buttonUrl && (
                            <div className="pt-2">
                                <BrandButton variant="primary" href={buttonUrl}>
                                    {buttonLabel}
                                </BrandButton>
                            </div>
                        )}
                    </div>

                    {/* ── Right side: Premium 3D-style SVG Illustration ── */}
                    <div className="relative flex w-full items-center justify-center lg:w-1/2 select-none">
                        <svg
                            className="w-full max-w-md aspect-[4/3] drop-shadow-2xl"
                            viewBox="0 0 500 370"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Decorative Floating Element: Accent Blue Semi-Circle */}
                            <path
                                d="M260 80 A20 20 0 0 1 300 80 Z"
                                className="animate-bounce fill-accent-brand"
                                style={{ animationDuration: '4s' }}
                            />

                            {/* Decorative Floating Element: Grey/Blue Semi-Circle (Right) */}
                            <path
                                d="M410 130 A18 18 0 0 1 446 130 Z"
                                fill="#94a3b8"
                                opacity="0.4"
                                transform="rotate(180 428 130)"
                            />

                            {/* Shadow under the platform */}
                            <ellipse cx="330" cy="305" rx="140" ry="25" fill="#0c152a" opacity="0.6" />

                            {/* White 3D Platform Base */}
                            <ellipse cx="330" cy="298" rx="130" ry="30" fill="#ffffff" />
                            <ellipse cx="330" cy="302" rx="130" ry="28" fill="#f8fafc" />
                            <ellipse cx="330" cy="305" rx="120" ry="25" fill="#e2e8f0" />

                            {/* Leaf branches behind on the left */}
                            <g transform="translate(200, 240) rotate(-20)" opacity="0.85">
                                {/* Stem */}
                                <path d="M0,60 L-30,-70" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
                                
                                {/* Leaves */}
                                <path d="M-15,30 Q-45,15 -35,-5 Q-15,10 -15,30 Z" fill="#94a3b8" />
                                <path d="M-10,0 Q-35,-20 -20,-35 Q-5,-15 -10,0 Z" fill="#cbd5e1" />
                                <path d="M-22,-30 Q-42,-55 -25,-65 Q-10,-40 -22,-30 Z" fill="#e2e8f0" />
                                <path d="M-27,-60 Q-42,-85 -27,-95 Q-15,-70 -27,-60 Z" fill="#ffffff" />
                            </g>

                            {/* 3D-styled Dark Chat Bubble (Back layer) */}
                            {/* Main bubble body */}
                            <rect x="235" y="85" width="180" height="120" rx="28" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                            {/* Bubble pointer/tail */}
                            <path d="M280,203 L270,235 L305,203 Z" fill="#0f172a" />
                            
                            {/* 3D highlights on the dark bubble */}
                            <rect x="238" y="88" width="174" height="114" rx="25" fill="none" stroke="white" strokeWidth="1" opacity="0.08" />
                            
                            {/* Three accent blue dots (styled with linear gradients/lighting effect) */}
                            <g>
                                <circle cx="280" cy="145" r="12" className="fill-accent-brand" />
                                <circle cx="280" cy="143" r="12" fill="#7ba0eb" opacity="0.3" />
                                <circle cx="276" cy="141" r="3" fill="#ffffff" opacity="0.6" />
                            </g>
                            <g>
                                <circle cx="325" cy="145" r="12" className="fill-accent-brand" />
                                <circle cx="325" cy="143" r="12" fill="#7ba0eb" opacity="0.3" />
                                <circle cx="321" cy="141" r="3" fill="#ffffff" opacity="0.6" />
                            </g>
                            <g>
                                <circle cx="370" cy="145" r="12" className="fill-accent-brand" />
                                <circle cx="370" cy="143" r="12" fill="#7ba0eb" opacity="0.3" />
                                <circle cx="366" cy="141" r="3" fill="#ffffff" opacity="0.6" />
                            </g>

                            {/* 3D-styled Accent Blue Envelope (Front layer) */}
                            {/* Envelope base shadow */}
                            <rect x="295" y="178" width="170" height="105" rx="16" fill="#0c152a" opacity="0.3" />
                            {/* Envelope base rect */}
                            <rect x="290" y="172" width="170" height="105" rx="16" className="fill-accent-brand" />
                            {/* Envelope flap / folds */}
                            {/* Top triangle flap */}
                            <path d="M290,172 L375,228 L460,172" fill="#7297e6" stroke="#4b70be" strokeWidth="2.5" strokeLinejoin="round" />
                            {/* Left side fold */}
                            <path d="M290,172 L350,225 L290,277" fill="#5b86db" stroke="#4b70be" strokeWidth="2.5" strokeLinejoin="round" />
                            {/* Right side fold */}
                            <path d="M460,172 L400,225 L460,277" fill="#5b86db" stroke="#4b70be" strokeWidth="2.5" strokeLinejoin="round" />
                            {/* Bottom fold */}
                            <path d="M290,277 L375,220 L460,277" fill="#6590e0" stroke="#4b70be" strokeWidth="2.5" strokeLinejoin="round" />

                            {/* Inner highlight rim for envelope */}
                            <rect x="292" y="174" width="166" height="101" rx="14" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />
                        </svg>
                    </div>

                </div>
        </section>
    );
}
