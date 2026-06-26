import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import BrandButton from '@/components/ui/brand-button';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { COUNTRY_CODES, COUNTRIES, validatePhone } from '@/lib/phone-countries';
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

type FieldErrors = Record<string, string>;

function validateField(name: string, value: string): string {
    switch (name) {
        case 'name':
            if (!value.trim()) return 'Full Name is required.';
            if (value.trim().length < 2) return 'Please enter a valid Full Name.';
            if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Full Name should only contain letters.';
            return '';
        case 'email':
            if (!value.trim()) return 'Email ID is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid Email ID.';
            return '';
        case 'linkedin':
            if (!value.trim()) return 'LinkedIn URL is required.';
            try { new URL(value.trim()); return ''; } catch { return 'Please enter a valid URL (e.g. https://linkedin.com/in/...).'; }
        case 'designation':
            if (!value.trim()) return 'Designation is required.';
            if (value.trim().length < 2) return 'Please enter a valid Designation.';
            return '';
        case 'company':
            if (!value.trim()) return 'Company / Organization is required.';
            if (value.trim().length < 2) return 'Please enter a valid Company name.';
            return '';
        case 'country':
            if (!value) return 'Please select a Country.';
            return '';
        case 'city':
            if (!value.trim()) return 'City is required.';
            if (value.trim().length < 2) return 'Please enter a valid City.';
            return '';
        case 'whatDescribesYou':
            if (!value) return 'Please select what best describes you.';
            return '';
        default:
            return '';
    }
}

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
        countryCode: '+91',
        phone: '',
        linkedin: '',
        designation: '',
        company: '',
        country: 'India',
        city: '',
        whatDescribesYou: '',
        consent: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const setFieldError = (name: string, msg: string) =>
        setFieldErrors(prev => ({ ...prev, [name]: msg }));

    const blurValidate = (name: string, value: string) =>
        setFieldError(name, validateField(name, value));

    const changeValidate = (name: string, value: string) => {
        if (fieldErrors[name]) setFieldError(name, validateField(name, value));
    };

    const { recaptcha_site_key } = usePage().props as any;

    useEffect(() => {
        if (!recaptcha_site_key) return;
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="recaptcha/api.js"]')) {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${recaptcha_site_key}`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    }, [recaptcha_site_key]);

    const executeRecaptcha = (): Promise<string | null> => {
        return new Promise((resolve) => {
            if (!recaptcha_site_key || typeof window === 'undefined' || !(window as any).grecaptcha) {
                resolve(null);
                return;
            }
            const grecaptcha = (window as any).grecaptcha;
            grecaptcha.ready(() => {
                grecaptcha.execute(recaptcha_site_key, { action: 'submit' })
                    .then((token: string) => resolve(token))
                    .catch(() => resolve(null));
            });
        });
    };

    const renderTextWithHighlight = (text: string, highlight: string) => {
        if (!text) return null;
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
            return <span key={i} className="block">{line}</span>;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        const textFields = ['name', 'email', 'linkedin', 'designation', 'company', 'country', 'city', 'whatDescribesYou'] as const;
        const newErrors: FieldErrors = {};
        textFields.forEach(f => { newErrors[f] = validateField(f, formData[f] as string); });
        setFieldErrors(newErrors);
        const hasFieldErrors = Object.values(newErrors).some(Boolean);

        const pErr = validatePhone(formData.countryCode, formData.phone);
        setPhoneError(pErr);

        if (pErr || hasFieldErrors) return;

        setIsSubmitting(true);
        setErrorMsg(null);
        setErrors({});
        setPhoneError(null);

        const token = await executeRecaptcha();
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

        try {
            const response = await fetch('/access-request/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    ...formData,
                    phone: `${formData.countryCode} ${formData.phone}`,
                    recaptcha_token: token,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsSubmitted(true);
                setFormData({
                    name: '', email: '', countryCode: '+91', phone: '',
                    linkedin: '', designation: '', company: '',
                    country: 'India', city: '', whatDescribesYou: '', consent: false,
                });
                setPhoneError(null);
                setFieldErrors({});
            } else {
                if (response.status === 422 && data.errors) {
                    setErrors(data.errors);
                }
                setErrorMsg(data.message || 'Failed to submit request. Please try again.');
            }
        } catch {
            setErrorMsg('An error occurred. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50 ${fieldErrors[field] ? 'border-rose-400' : 'border-gray-200'}`;

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
                                    {renderTextWithHighlight(headingText, highlightWord ?? '')}
                                </h2>
                            )}
                            {features && features.length > 0 && (
                                <div className="space-y-5 pt-4">
                                    {features.map((feat, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-brand/10 text-accent-brand mt-0.5">
                                                <DynamicIcon name={feat.icon} className="h-3.5 w-3.5" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{feat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

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
                            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                                <div className="space-y-2 text-left">
                                    <h3 className="font-heading text-2xl font-bold text-brand sm:text-3xl">
                                        {renderTextWithHighlight(formTitle ?? '', formHighlightWord ?? '')}
                                    </h3>
                                    {formSubtitle && (
                                        <p className="font-sans text-sm text-gray-500 leading-relaxed">{formSubtitle}</p>
                                    )}
                                </div>

                                {errorMsg && (
                                    <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-100 text-left">
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* Full Name */}
                                    <div className="text-left">
                                        <input
                                            type="text"
                                            placeholder="Full Name*"
                                            value={formData.name}
                                            onChange={(e) => { setFormData({ ...formData, name: e.target.value }); changeValidate('name', e.target.value); }}
                                            onBlur={(e) => blurValidate('name', e.target.value)}
                                            className={inputClass('name')}
                                            disabled={isSubmitting}
                                        />
                                        {(fieldErrors.name || errors.name) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.name || errors.name?.[0]}</p>}
                                    </div>

                                    {/* Email ID */}
                                    <div className="text-left">
                                        <input
                                            type="text"
                                            placeholder="Work Email ID*"
                                            value={formData.email}
                                            onChange={(e) => { setFormData({ ...formData, email: e.target.value }); changeValidate('email', e.target.value); }}
                                            onBlur={(e) => blurValidate('email', e.target.value)}
                                            className={inputClass('email')}
                                            disabled={isSubmitting}
                                        />
                                        {(fieldErrors.email || errors.email) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.email || errors.email?.[0]}</p>}
                                    </div>

                                    {/* Mobile Number with country code — full row */}
                                    <div className="text-left sm:col-span-2">
                                        <div className={`flex overflow-hidden rounded-xl border bg-white focus-within:border-accent-brand transition-colors ${phoneError ? 'border-rose-400' : 'border-gray-200'}`}>
                                            <div className="relative flex shrink-0 items-center border-r border-gray-200">
                                                <span className="pointer-events-none pl-3 pr-6 text-sm text-gray-700">
                                                    {formData.countryCode}
                                                </span>
                                                <select
                                                    value={formData.countryCode}
                                                    onChange={(e) => {
                                                        const newCode = e.target.value;
                                                        const matchedCountry = COUNTRY_CODES.find(c => c.code === newCode)?.name ?? '';
                                                        setFormData(prev => ({ ...prev, countryCode: newCode, country: matchedCountry }));
                                                        setFieldErrors(prev => ({ ...prev, country: '' }));
                                                        if (formData.phone) setPhoneError(validatePhone(newCode, formData.phone));
                                                    }}
                                                    disabled={isSubmitting}
                                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                                                >
                                                    {COUNTRY_CODES.map((c) => (
                                                        <option key={`${c.name}-${c.code}`} value={c.code}>
                                                            {c.name} ({c.code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="Mobile Number*"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    const digits = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, phone: digits });
                                                    if (phoneError) setPhoneError(validatePhone(formData.countryCode, digits));
                                                }}
                                                onBlur={() => setPhoneError(validatePhone(formData.countryCode, formData.phone))}
                                                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none disabled:opacity-50"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        {(phoneError || errors.phone) && (
                                            <p className="mt-1 text-xs text-rose-600">{phoneError ?? errors.phone?.[0]}</p>
                                        )}
                                    </div>

                                    {/* LinkedIn URL — full row */}
                                    <div className="text-left sm:col-span-2">
                                        <input
                                            type="text"
                                            placeholder="LinkedIn Profile URL*"
                                            value={formData.linkedin}
                                            onChange={(e) => { setFormData({ ...formData, linkedin: e.target.value }); changeValidate('linkedin', e.target.value); }}
                                            onBlur={(e) => blurValidate('linkedin', e.target.value)}
                                            className={inputClass('linkedin')}
                                            disabled={isSubmitting}
                                        />
                                        {(fieldErrors.linkedin || errors.linkedin) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.linkedin || errors.linkedin?.[0]}</p>}
                                    </div>

                                    {/* Designation */}
                                    <div className="text-left">
                                        <input
                                            type="text"
                                            placeholder="Designation*"
                                            value={formData.designation}
                                            onChange={(e) => { setFormData({ ...formData, designation: e.target.value }); changeValidate('designation', e.target.value); }}
                                            onBlur={(e) => blurValidate('designation', e.target.value)}
                                            className={inputClass('designation')}
                                            disabled={isSubmitting}
                                        />
                                        {(fieldErrors.designation || errors.designation) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.designation || errors.designation?.[0]}</p>}
                                    </div>

                                    {/* Company / Organization */}
                                    <div className="text-left">
                                        <input
                                            type="text"
                                            placeholder="Company / Organization*"
                                            value={formData.company}
                                            onChange={(e) => { setFormData({ ...formData, company: e.target.value }); changeValidate('company', e.target.value); }}
                                            onBlur={(e) => blurValidate('company', e.target.value)}
                                            className={inputClass('company')}
                                            disabled={isSubmitting}
                                        />
                                        {(fieldErrors.company || errors.company) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.company || errors.company?.[0]}</p>}
                                    </div>

                                    {/* Country */}
                                    <div className="text-left">
                                        <select
                                            value={formData.country}
                                            onChange={(e) => { setFormData({ ...formData, country: e.target.value }); changeValidate('country', e.target.value); }}
                                            onBlur={(e) => blurValidate('country', e.target.value)}
                                            disabled={isSubmitting}
                                            className={`${inputClass('country')} text-gray-700`}
                                        >
                                            <option value="" disabled>Country*</option>
                                            {COUNTRIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        {(fieldErrors.country || errors.country) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.country || errors.country?.[0]}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="text-left">
                                        <input
                                            type="text"
                                            placeholder="City*"
                                            value={formData.city}
                                            onChange={(e) => { setFormData({ ...formData, city: e.target.value }); changeValidate('city', e.target.value); }}
                                            onBlur={(e) => blurValidate('city', e.target.value)}
                                            className={inputClass('city')}
                                            disabled={isSubmitting}
                                        />
                                        {(fieldErrors.city || errors.city) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.city || errors.city?.[0]}</p>}
                                    </div>

                                    {/* What best describes you — full row */}
                                    <div className="text-left sm:col-span-2">
                                        <select
                                            value={formData.whatDescribesYou}
                                            onChange={(e) => { setFormData({ ...formData, whatDescribesYou: e.target.value }); changeValidate('whatDescribesYou', e.target.value); }}
                                            onBlur={(e) => blurValidate('whatDescribesYou', e.target.value)}
                                            disabled={isSubmitting}
                                            className={`${inputClass('whatDescribesYou')} ${formData.whatDescribesYou === '' ? 'text-gray-400' : 'text-gray-900'}`}
                                        >
                                            <option value="" disabled>What best describes you?*</option>
                                            <option value="Employer Branding Agency">Employer Branding Agency</option>
                                            <option value="Corporate HR Leader">Corporate HR Leader</option>
                                            <option value="Independent EB Consultant">Independent EB Consultant</option>
                                            <option value="HR Tech Platform / Provider">HR Tech Platform / Provider</option>
                                            <option value="Job Seeker / Candidate">Job Seeker / Candidate</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {(fieldErrors.whatDescribesYou || errors.whatDescribesYou) && <p className="mt-1 text-xs text-rose-600">{fieldErrors.whatDescribesYou || errors.whatDescribesYou?.[0]}</p>}
                                    </div>

                                </div>

                                {/* Consent Checkbox */}
                                <div className="space-y-1">
                                    <div className="flex items-start gap-3 text-left">
                                        <input
                                            type="checkbox"
                                            id="consent"
                                            checked={formData.consent}
                                            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                            className="h-4 w-4 rounded border-gray-300 text-accent-brand focus:ring-accent-brand mt-1 accent-accent-brand cursor-pointer disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="consent" className="text-xs font-medium text-gray-500 leading-normal cursor-pointer select-none">
                                            I agree to receive communications from EVP HQ via email and WhatsApp.
                                        </label>
                                    </div>
                                    {errors.consent && (
                                        <p className="text-xs text-rose-600 mt-1 text-left">{errors.consent[0]}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="space-y-3 pt-2">
                                    {errors.recaptcha_token && (
                                        <p className="text-xs text-rose-600 text-center">{errors.recaptcha_token[0]}</p>
                                    )}
                                    <BrandButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full py-4 text-base font-bold"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending Request...' : 'Request Access'}
                                    </BrandButton>
                                    <p className="text-[10px] text-gray-400/60 leading-normal text-center mt-2">
                                        This site is protected by reCAPTCHA.
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
