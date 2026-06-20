import React, { useState } from 'react';
import { Lock, Users, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';
import BrandButton from '@/components/ui/brand-button';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'access-request',
    category: 'Marketing',
    icon: 'Lock',
    description: 'Split section with membership advantages on the left and a detailed Access Request form on the right.',
};

export const schema: SectionSchema = {
    badgeText: { type: 'text', label: 'Left Badge', default: 'EXCLUSIVE BY DESIGN' },
    headingText: {
        type: 'textarea',
        label: 'Left Heading',
        default: 'Not for everyone.\nBuilt for the right HR leaders.',
    },
    highlightWord: { type: 'text', label: 'Left Highlight Word', default: 'right' },
    features: {
        type: 'array',
        label: 'Left Features List',
        default: [
            { icon: 'UserCheck', label: 'Curated for HR professionals, Talent Leaders, Employer Branding experts and People Managers.' },
            { icon: 'Shield', label: 'A private community that values quality over quantity.' },
            { icon: 'Users', label: 'We personally review every sign up to maintain the quality and trust of our network.' },
            { icon: 'Sparkles', label: 'No promotional clutter. Only meaningful content that helps you lead better.' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Lucide Icon Name', default: 'Check' },
            label: { type: 'text', label: 'Feature Description', default: '' },
        },
    },
    bottomFeatures: {
        type: 'array',
        label: 'Bottom Pill Features',
        default: [
            { icon: 'Lock', label: 'Exclusive Access' },
            { icon: 'UserCheck', label: 'Manually Reviewed' },
            { icon: 'Shield', label: 'Quality Assured' },
        ],
        itemSchema: {
            icon: { type: 'text', label: 'Lucide Icon Name', default: 'Check' },
            label: { type: 'text', label: 'Label', default: '' },
        },
    },
    formTitle: { type: 'text', label: 'Form Title', default: 'Request Your Access' },
    formSubtitle: {
        type: 'text',
        label: 'Form Subtitle',
        default: 'Fill in your details. Our team will review your application and approve it shortly.',
    },
    formHighlightWord: { type: 'text', label: 'Form Highlight Word', default: 'Access' },
};

type FeatureItem = {
    icon?: string;
    label?: string;
};

type Props = {
    badgeText?: string;
    headingText?: string;
    highlightWord?: string;
    features?: FeatureItem[];
    bottomFeatures?: FeatureItem[];
    formTitle?: string;
    formSubtitle?: string;
    formHighlightWord?: string;
};

export default function AccessRequestSection({
    badgeText = 'EXCLUSIVE BY DESIGN',
    headingText = 'Not for everyone.\nBuilt for the right HR leaders.',
    highlightWord = 'right',
    features = [
        { icon: 'UserCheck', label: 'Curated for HR professionals, Talent Leaders, Employer Branding experts and People Managers.' },
        { icon: 'Shield', label: 'A private community that values quality over quantity.' },
        { icon: 'Users', label: 'We personally review every sign up to maintain the quality and trust of our network.' },
        { icon: 'Sparkles', label: 'No promotional clutter. Only meaningful content that helps you lead better.' },
    ],
    bottomFeatures = [
        { icon: 'Lock', label: 'Exclusive Access' },
        { icon: 'UserCheck', label: 'Manually Reviewed' },
        { icon: 'Shield', label: 'Quality Assured' },
    ],
    formTitle = 'Request Your Access',
    formSubtitle = 'Fill in your details. Our team will review your application and approve it shortly.',
    formHighlightWord = 'Access',
}: Props) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        designation: '',
        teamSize: '',
        linkedin: '',
        phone: '',
        whatDescribesYou: '',
        consent: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const renderTextWithHighlight = (text: string, highlight: string) => {
        if (!text) {
            return null;
        }

        const lines = text.split('\n');

        return lines.map((line, i) => {
            if (highlight && line.includes(highlight)) {
                const parts = line.split(highlight);
                return (
                    <span key={i} className="block">
                        {parts[0]}
                        <span className="text-accent-brand">{highlight}</span>
                        {parts[1]}
                    </span>
                );
            }

            return (
                <span key={i} className="block">
                    {line}
                </span>
            );
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }

        if (
            !formData.name ||
            !formData.email ||
            !formData.company ||
            !formData.designation ||
            !formData.teamSize ||
            !formData.linkedin ||
            !formData.phone ||
            !formData.whatDescribesYou ||
            !formData.consent
        ) {
            setErrorMsg('Please fill in all mandatory fields and accept the terms.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg(null);

        // Simulate local form submission without calling any backend route
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                company: '',
                designation: '',
                teamSize: '',
                linkedin: '',
                phone: '',
                whatDescribesYou: '',
                consent: false,
            });
        }, 800);
    };

    return (
        <section className="bg-gray-50/50 py-12 lg:py-16 select-none">
            <div className="mx-auto max-w-7xl px-4 md:px-7">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-stretch">

                    {/* ── Left Card: Core Advantages ── */}
                    <div className="lg:col-span-5 flex flex-col justify-between rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-10 shadow-xs hover:shadow-md transition-shadow duration-300">
                        <div className="space-y-6">
                            {badgeText && (
                                <span className="text-xs font-bold tracking-wider text-accent-brand uppercase">
                                    {badgeText}
                                </span>
                            )}

                            {headingText && (
                                <h2 className="font-heading text-3xl md:text-4xl font-extrabold leading-tight text-brand">
                                    {renderTextWithHighlight(headingText, highlightWord)}
                                </h2>
                            )}

                            {features && features.length > 0 && (
                                <div className="space-y-5 pt-4">
                                    {features.map((feat, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-brand/10 text-accent-brand mt-0.5">
                                                <DynamicIcon name={feat.icon} className="h-3.5 w-3.5" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                                {feat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom Solid Bar */}
                        {bottomFeatures && bottomFeatures.length > 0 && (
                            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-brand text-white px-6 py-6 rounded-2xl border border-white/5">
                                {bottomFeatures.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="text-accent-brand">
                                            <DynamicIcon name={feat.icon} className="h-4 w-4" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-200">
                                            {feat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right Card: Application Form ── */}
                    <div className="lg:col-span-7 rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-10 shadow-xs hover:shadow-md transition-shadow duration-300">
                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
                                    <CheckCircle className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-2xl font-bold text-brand">Access Requested!</h3>
                                    <p className="font-sans text-sm text-gray-500 max-w-sm">
                                        Thank you for your application. Our team will manually review your profile and approve access details shortly.
                                    </p>
                                </div>
                                <BrandButton
                                    type="button"
                                    onClick={() => setIsSubmitted(false)}
                                    variant="outline"
                                    showArrow={false}
                                    className="text-xs py-2 px-6 mt-4"
                                >
                                    Request another access
                                </BrandButton>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <h3 className="font-heading text-2xl font-bold text-brand sm:text-3xl">
                                        {renderTextWithHighlight(formTitle, formHighlightWord)}
                                    </h3>
                                    {formSubtitle && (
                                        <p className="font-sans text-sm text-gray-500 leading-relaxed">
                                            {formSubtitle}
                                        </p>
                                    )}
                                </div>

                                {errorMsg && (
                                    <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-100 text-left">
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Full Name Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Full Name*"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Work Email Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="email"
                                            required
                                            placeholder="Work Email*"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Company Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Company / Organization*"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Row 4: Designation & Team Size (Grid) */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <select
                                                required
                                                value={formData.designation}
                                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent-brand text-gray-700 disabled:opacity-50"
                                                disabled={isSubmitting}
                                            >
                                                <option value="" disabled>Designation*</option>
                                                <option value="HR Director / VP">HR Director / VP</option>
                                                <option value="HR Manager">HR Manager</option>
                                                <option value="Talent Acquisition Leader">Talent Acquisition Leader</option>
                                                <option value="Employer Branding Specialist">Employer Branding Specialist</option>
                                                <option value="People Business Partner">People Business Partner</option>
                                                <option value="CEO / Executive">CEO / Executive</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <select
                                                required
                                                value={formData.teamSize}
                                                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent-brand text-gray-700 disabled:opacity-50"
                                                disabled={isSubmitting}
                                            >
                                                <option value="" disabled>Team Size*</option>
                                                <option value="1 - 10">1 - 10</option>
                                                <option value="11 - 50">11 - 50</option>
                                                <option value="51 - 200">51 - 200</option>
                                                <option value="201 - 500">201 - 500</option>
                                                <option value="500+">500+</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* LinkedIn Profile Input */}
                                    <div className="space-y-1">
                                        <input
                                            type="url"
                                            required
                                            placeholder="LinkedIn Profile URL*"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Mobile Number Input with custom prefix wrapper */}
                                    <div className="relative flex rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-accent-brand transition-colors">
                                        <span className="flex items-center px-4 bg-gray-50 border-r border-gray-100 text-sm font-semibold text-gray-500">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="Mobile Number (WhatsApp)*"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 text-sm outline-none bg-transparent disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Describes You Input */}
                                    <div className="space-y-1">
                                        <select
                                            required
                                            value={formData.whatDescribesYou}
                                            onChange={(e) => setFormData({ ...formData, whatDescribesYou: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent-brand text-gray-700 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            <option value="" disabled>What best describes you?*</option>
                                            <option value="Employer Branding Agency">Employer Branding Agency</option>
                                            <option value="Corporate HR Leader">Corporate HR Leader</option>
                                            <option value="Independent EB Consultant">Independent EB Consultant</option>
                                            <option value="HR Tech Platform / Provider">HR Tech Platform / Provider</option>
                                            <option value="Job Seeker / Candidate">Job Seeker / Candidate</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row 9: Consent Checkbox */}
                                <div className="flex items-start gap-3 text-left">
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        required
                                        checked={formData.consent}
                                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-accent-brand focus:ring-accent-brand mt-1 accent-accent-brand cursor-pointer disabled:opacity-50"
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="consent" className="text-xs font-medium text-gray-500 leading-normal cursor-pointer select-none">
                                        I agree to receive communications from EVP HQ via email and WhatsApp.
                                    </label>
                                </div>

                                {/* Request Access Button & Footer note */}
                                <div className="space-y-3 pt-2">
                                    <BrandButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full py-4 text-base font-bold"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending Request...' : 'Request Access'}
                                    </BrandButton>
                                    <p className="text-center text-xs text-gray-400 font-medium">
                                        We respect your privacy. No spam, ever.
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
