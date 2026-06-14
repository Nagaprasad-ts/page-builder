import * as LucideIcons from 'lucide-react';
import React, { useState } from 'react';
import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'site-footer',
    category: 'Layout',
    icon: 'Layers',
    description: 'Multi-column premium footer with logo, description, social icons, link groups, contact channels, and copyright bar.',
};

export const schema: SectionSchema = {
    logoUrl: { type: 'image', label: 'Logo' },
    descriptionText: {
        type: 'richtext',
        label: 'Description text',
        default: '<p>We help businesses communicate better with presentations and visuals that inform, inspire, and make a lasting impact.</p>',
    },
    email: { type: 'text', label: 'Email Address', default: 'hello@evphq.com' },
    emailIcon: { type: 'text', label: 'Email Icon', default: 'Mail' },
    phone: { type: 'text', label: 'Phone Number', default: '+91 98440 38489' },
    phoneIcon: { type: 'text', label: 'Phone Icon', default: 'Phone' },
    address: {
        type: 'richtext',
        label: 'Address',
        default: '<p>EVP Headquarters Pvt Ltd #15, 2nd Floor, 7th Main Road, Jnanaganga Nagar, Bengaluru, 560 056</p>',
    },
    addressIcon: { type: 'text', label: 'Address Icon', default: 'MapPin' },
    copyrightText: { type: 'text', label: 'Copyright text', default: 'EVP Headquarters. All rights reserved.' },
    servicesLinks: {
        type: 'array',
        label: 'Services Links',
        default: [
            { label: 'Employer Branding', url: '#' },
            { label: 'Recruitment Branding', url: '#' },
            { label: 'Personal Branding', url: '#' },
            { label: 'Workspace Branding', url: '#' },
            { label: 'Placement Branding', url: '#' },
        ],
        itemSchema: {
            label: { type: 'text', label: 'Label', default: 'Link label' },
            url: { type: 'url', label: 'URL', default: '#' },
        },
    },
    companyLinks: {
        type: 'array',
        label: 'Company Links',
        default: [
            { label: 'About Us', url: '#' },
            { label: 'Careers', url: '#' },
            { label: 'Work', url: '#' },
            { label: 'Case Studies', url: '#' },
            { label: 'Contact Us', url: '#' },
        ],
        itemSchema: {
            label: { type: 'text', label: 'Label', default: 'Link label' },
            url: { type: 'url', label: 'URL', default: '#' },
        },
    },
    resourcesLinks: {
        type: 'array',
        label: 'Resources Links',
        default: [
            { label: 'Articles', url: '#' },
            { label: 'Whitepapers', url: '#' },
            { label: 'Trends', url: '#' },
            { label: 'Templates', url: '#' },
            { label: 'Checklists', url: '#' },
        ],
        itemSchema: {
            label: { type: 'text', label: 'Label', default: 'Link label' },
            url: { type: 'url', label: 'URL', default: '#' },
        },
    },
    newsletterHeading: { type: 'text', label: 'Newsletter Heading', default: "Let's Stay in Touch" },
    newsletterText: {
        type: 'richtext',
        label: 'Newsletter Text',
        default: '<p>Get insights, tips, and updates on visual storytelling straight to your inbox.</p>',
    },
    newsletterPlaceholder: { type: 'text', label: 'Newsletter Placeholder', default: 'Enter your email address' },
    newsletterButtonLabel: { type: 'text', label: 'Newsletter Button Label', default: 'Subscribe' },
    newsletterIcon: { type: 'text', label: 'Newsletter Icon', default: 'Send' },
    socialLinks: {
        type: 'array',
        label: 'Social Links',
        default: [
            { icon: 'Linkedin', url: '#' },
            { icon: 'Instagram', url: '#' },
            { icon: 'Facebook', url: '#' },
            { icon: 'Youtube', url: '#' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Icon name (e.g. Linkedin, Twitter, Youtube)', default: 'Linkedin' },
            url: { type: 'url', label: 'URL', default: '#' },
        },
    },
    policyLinks: {
        type: 'array',
        label: 'Policy Links',
        default: [
            { label: 'Privacy Policy', url: '#' },
            { label: 'Terms of Service', url: '#' },
            { label: 'Refund Policy', url: '#' },
        ],
        itemSchema: {
            label: { type: 'text', label: 'Label', default: 'Link label' },
            url: { type: 'url', label: 'URL', default: '#' },
        },
    },
    signatureText: {
        type: 'text',
        label: 'Signature Text',
        default: 'Made with 🧡 for impactful stories.',
    },
};

type LinkItem = {
    label?: string;
    url?: string;
};

type SocialLinkItem = {
    icon?: string;
    url?: string;
};

type Props = {
    logoUrl?: string | null;
    descriptionText?: string;
    email?: string;
    emailIcon?: string;
    phone?: string;
    phoneIcon?: string;
    address?: string;
    addressIcon?: string;
    copyrightText?: string;
    servicesLinks?: LinkItem[];
    companyLinks?: LinkItem[];
    resourcesLinks?: LinkItem[];
    newsletterHeading?: string;
    newsletterText?: string;
    newsletterPlaceholder?: string;
    newsletterButtonLabel?: string;
    newsletterIcon?: string;
    socialLinks?: SocialLinkItem[];
    policyLinks?: LinkItem[];
    signatureText?: string;
};

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    if (!name) {
return null;
}

    const pascalName = name
        .replace(/[-_ ]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (c) => c.toUpperCase());
    const Icon = (LucideIcons as Record<string, unknown>)[pascalName] as React.ComponentType<{ className?: string }> | undefined;

    if (!Icon) {
return <span className={className}>{name}</span>;
}

    return <Icon className={className} />;
}

export default function SiteFooterSection({
    logoUrl,
    descriptionText,
    email = 'hello@evphq.com',
    emailIcon = 'Mail',
    phone = '+91 98440 38489',
    phoneIcon = 'Phone',
    address = '<p>EVP Headquarters Pvt Ltd #15, 2nd Floor, 7th Main Road, Jnanaganga Nagar, Bengaluru, 560 056</p>',
    addressIcon = 'MapPin',
    copyrightText,
    servicesLinks = [],
    companyLinks = [],
    resourcesLinks = [],
    newsletterHeading = "Let's Stay in Touch",
    newsletterText = "<p>Get insights, tips, and updates on visual storytelling straight to your inbox.</p>",
    newsletterPlaceholder = "Enter your email address",
    newsletterButtonLabel = "Subscribe",
    newsletterIcon = 'Send',
    socialLinks = [],
    policyLinks = [],
    signatureText = 'Made with 🧡 for impactful stories.',
}: Props) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        services: false,
        company: false,
        resources: false,
        contact: false,
    });

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const activeSocialLinks = socialLinks.length > 0 ? socialLinks : [
        { icon: 'Linkedin', url: '#' },
        { icon: 'Instagram', url: '#' },
        { icon: 'Facebook', url: '#' },
        { icon: 'Youtube', url: '#' },
    ];

    const activePolicyLinks = policyLinks.length > 0 ? policyLinks : [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' },
        { label: 'Refund Policy', url: '#' },
    ];

    const activeServicesLinks = servicesLinks.length > 0 ? servicesLinks : [
        { label: 'Employer Branding', url: '#' },
        { label: 'Recruitment Branding', url: '#' },
        { label: 'Personal Branding', url: '#' },
        { label: 'Workspace Branding', url: '#' },
        { label: 'Placement Branding', url: '#' },
    ];

    const activeCompanyLinks = companyLinks.length > 0 ? companyLinks : [
        { label: 'About Us', url: '#' },
        { label: 'Careers', url: '#' },
        { label: 'Work', url: '#' },
        { label: 'Case Studies', url: '#' },
        { label: 'Contact Us', url: '#' },
    ];

    const activeResourcesLinks = resourcesLinks.length > 0 ? resourcesLinks : [
        { label: 'Articles', url: '#' },
        { label: 'Whitepapers', url: '#' },
        { label: 'Trends', url: '#' },
        { label: 'Templates', url: '#' },
        { label: 'Checklists', url: '#' },
    ];

    const cleanCopyright = copyrightText
        ? copyrightText.replace(/^\s*©\s*\d{4}\s*/, '').replace(/^\s*©\s*/, '')
        : (copyrightText === '' ? '' : 'EVP Headquarters. All rights reserved.');

    return (
        <footer className="bg-[#0f1115] text-gray-400 py-16">
            <div className="mx-auto max-w-7xl px-6">
                {/* Newsletter Card */}
                <div className="relative mb-16 overflow-hidden rounded-3xl border border-white/5 bg-[#181a1f] p-8 lg:p-12">
                    <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between w-full">
                        {/* Left: Icon & Text */}
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#121316]">
                                <DynamicIcon name={newsletterIcon} className="h-6 w-6 -rotate-12 text-accent-brand" />
                                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[#181a1f] bg-accent-brand" />
                            </div>
                            <div className="space-y-1.5 text-left">
                                <h3 className="font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
                                    {newsletterHeading}
                                </h3>
                                {newsletterText && (
                                    <div
                                        className="max-w-md text-sm text-gray-400 prose prose-invert prose-sm [&_p]:mb-0 [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: newsletterText }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right: Subscribe Form */}
                        <form onSubmit={(e) => e.preventDefault()} className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                            <input
                                type="email"
                                placeholder={newsletterPlaceholder}
                                className="w-full rounded-xl border border-white/10 bg-[#121316] px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:border-accent-brand focus:outline-none focus:ring-1 focus:ring-accent-brand lg:w-80"
                            />
                            <BrandButton
                                type="submit"
                                variant="secondary"
                                className="shrink-0 cursor-pointer px-6 py-3"
                            >
                                {newsletterButtonLabel}
                            </BrandButton>
                        </form>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute right-0 bottom-0 pointer-events-none select-none z-0">
                        {/* Large Orange Circle */}
                        <div className="w-48 h-48 rounded-full bg-accent-brand translate-x-16 translate-y-16" />
                        {/* Overlapping Gray Circle */}
                        <div className="absolute bottom-[-20px] right-[130px] w-20 h-20 rounded-full bg-gray-500/30" />
                    </div>
                </div>
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">

                    {/* Column 1: Logo & Tagline */}
                    <div className="w-full lg:w-[30%] space-y-6 lg:pr-10 lg:border-r lg:border-white/5">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="h-10 w-36 bg-white/5 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-xs text-gray-500 select-none">
                                Upload Logo Image
                            </div>
                        )}
                        {descriptionText && (
                            <div
                                className="text-sm leading-relaxed text-gray-300 max-w-sm prose prose-sm prose-invert [&_p]:mb-2 [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: descriptionText }}
                            />
                        )}
                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {activeSocialLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url ?? '#'}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-accent-brand hover:text-white transition"
                                    title={link.icon}
                                >
                                    <DynamicIcon name={link.icon} className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columns 2-5 Container: Collapsible accordion on mobile, flex row on desktop */}
                    <div className="w-full lg:w-[68%] flex flex-col gap-4 lg:flex-row lg:justify-between lg:gap-0">
                        {/* Column 2: Services */}
                        <div className="w-full lg:w-[22%] border-b border-white/5 pb-4 lg:border-none lg:pb-0">
                            <h3
                                onClick={() => toggleSection('services')}
                                className="text-white font-heading font-bold text-base relative pb-2 flex items-center justify-between cursor-pointer lg:cursor-default lg:pb-2.5 w-full select-none"
                            >
                                <span>Services</span>
                                <LucideIcons.ChevronDown
                                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 lg:hidden ${openSections.services ? 'rotate-180' : ''}`}
                                />
                                <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent-brand hidden lg:block" />
                            </h3>
                            <div className={`mt-4 lg:mt-5 lg:block transition-all duration-300 overflow-hidden ${openSections.services ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}>
                                <ul className="space-y-3.5 text-sm pt-2 lg:pt-0">
                                    {activeServicesLinks.map((link, i) => (
                                        <li key={i}>
                                            <a href={link.url ?? '#'} className="text-gray-300 hover:text-accent-brand transition">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Column 3: Company */}
                        <div className="w-full lg:w-[22%] border-b border-white/5 pb-4 lg:border-none lg:pb-0">
                            <h3
                                onClick={() => toggleSection('company')}
                                className="text-white font-heading font-bold text-base relative pb-2 flex items-center justify-between cursor-pointer lg:cursor-default lg:pb-2.5 w-full select-none"
                            >
                                <span>Company</span>
                                <LucideIcons.ChevronDown
                                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 lg:hidden ${openSections.company ? 'rotate-180' : ''}`}
                                />
                                <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent-brand hidden lg:block" />
                            </h3>
                            <div className={`mt-4 lg:mt-5 lg:block transition-all duration-300 overflow-hidden ${openSections.company ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}>
                                <ul className="space-y-3.5 text-sm pt-2 lg:pt-0">
                                    {activeCompanyLinks.map((link, i) => (
                                        <li key={i}>
                                            <a href={link.url ?? '#'} className="text-gray-300 hover:text-accent-brand transition">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Column 4: Resources */}
                        <div className="w-full lg:w-[22%] border-b border-white/5 pb-4 lg:border-none lg:pb-0 lg:pr-6 lg:border-r lg:border-white/5">
                            <h3
                                onClick={() => toggleSection('resources')}
                                className="text-white font-heading font-bold text-base relative pb-2 flex items-center justify-between cursor-pointer lg:cursor-default lg:pb-2.5 w-full select-none"
                            >
                                <span>Resources</span>
                                <LucideIcons.ChevronDown
                                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 lg:hidden ${openSections.resources ? 'rotate-180' : ''}`}
                                />
                                <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent-brand hidden lg:block" />
                            </h3>
                            <div className={`mt-4 lg:mt-5 lg:block transition-all duration-300 overflow-hidden ${openSections.resources ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}>
                                <ul className="space-y-3.5 text-sm pt-2 lg:pt-0">
                                    {activeResourcesLinks.map((link, i) => (
                                        <li key={i}>
                                            <a href={link.url ?? '#'} className="text-gray-300 hover:text-accent-brand transition">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Column 5: Contact Us */}
                        <div className="w-full lg:w-[34%] border-b border-white/5 pb-4 lg:border-none lg:pb-0 lg:pl-6">
                            <h3
                                onClick={() => toggleSection('contact')}
                                className="text-white font-heading font-bold text-base relative pb-2 flex items-center justify-between cursor-pointer lg:cursor-default lg:pb-2.5 w-full select-none"
                            >
                                <span>Contact Us</span>
                                <LucideIcons.ChevronDown
                                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 lg:hidden ${openSections.contact ? 'rotate-180' : ''}`}
                                />
                                <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent-brand hidden lg:block" />
                            </h3>
                            <div className={`mt-4 lg:mt-5 lg:block transition-all duration-300 overflow-hidden ${openSections.contact ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}>
                                <ul className="space-y-4 text-sm pt-2 lg:pt-0">
                                    {email && (
                                        <li className="flex items-center gap-3 text-gray-300">
                                            <DynamicIcon name={emailIcon} className="h-4 w-4 shrink-0 text-accent-brand" />
                                            <a href={`mailto:${email}`} className="hover:text-accent-brand transition text-gray-300">{email}</a>
                                        </li>
                                    )}
                                    {phone && (
                                        <li className="flex items-center gap-3 text-gray-300">
                                            <DynamicIcon name={phoneIcon} className="h-4 w-4 shrink-0 text-accent-brand" />
                                            <a href={`tel:${phone}`} className="hover:text-accent-brand transition text-gray-300">{phone}</a>
                                        </li>
                                    )}
                                    {address && (
                                        <li className="flex items-start gap-3 leading-relaxed text-gray-300">
                                            <DynamicIcon name={addressIcon} className="h-4 w-4 shrink-0 text-accent-brand mt-1" />
                                            <div
                                                className="prose prose-sm prose-invert [&_p]:mb-0 [&_p]:leading-relaxed text-gray-300"
                                                dangerouslySetInnerHTML={{ __html: address }}
                                            />
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-16 border-t border-white/5 pt-8 flex flex-col items-center justify-between gap-5 md:flex-row text-xs text-gray-400 w-full">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} {cleanCopyright}
                    </p>
                    {activePolicyLinks.length > 0 && (
                        <div className="flex items-center gap-4">
                            {activePolicyLinks.map((link, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <span className="text-accent-brand/40">&bull;</span>}
                                    <a
                                        href={link.url ?? '#'}
                                        className="text-gray-400 hover:text-accent-brand transition hover:underline"
                                    >
                                        {link.label}
                                    </a>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                    {signatureText && (
                        <p className="text-gray-400 flex items-center gap-1.5">
                            {signatureText}
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
}
