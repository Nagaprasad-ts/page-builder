import { Clock, Mail, MapPin, Phone, Shield, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import BrandButton from '@/components/ui/brand-button';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'contact-form',
    category: 'Marketing',
    icon: 'Mail',
    description: 'A split-column contact layout featuring direct channel info cards on the left and a functional message form on the right.',
};

export const schema: SectionSchema = {
    heading: { type: 'text', label: 'Left Heading', default: "We're Here to Help" },
    subheading: { type: 'text', label: 'Left Subheading', default: 'Reach out to us through any of the following channels.' },
    emailAddress: { type: 'text', label: 'Email Address', default: 'hello@evphq.com' },
    emailNote: { type: 'text', label: 'Email Note', default: 'We typically reply within 24 hours.' },
    phoneNumber: { type: 'text', label: 'Phone Number', default: '+91 98440 38489' },
    phoneNote: { type: 'text', label: 'Phone Note', default: 'Mon - Fri, 10:00 AM - 6:00 PM IST' },
    addressText: { 
        type: 'richtext', 
        label: 'Address', 
        default: "<p>EVP Headquarters Pvt Ltd #15, 2nd Floor, 7th Main Road, Jnanaganga Nagar, Bengaluru, 560 056</p>" 
    },
    workingHours: { 
        type: 'richtext', 
        label: 'Working Hours', 
        default: "<p>Monday - Friday<br>10:00 AM - 6:00 PM IST<br>Saturday - Sunday<br>Closed</p>" 
    },
    formHeading: { type: 'text', label: 'Form Heading', default: 'Send Us a Message' },
    formSubheading: { type: 'text', label: 'Form Subheading', default: "Fill out the form below and we'll get back to you soon." },
    buttonLabel: { type: 'text', label: 'Button Label', default: 'Send Message' },
};

type Props = {
    heading?: string;
    subheading?: string;
    emailAddress?: string;
    emailNote?: string;
    phoneNumber?: string;
    phoneNote?: string;
    addressText?: string;
    workingHours?: string;
    formHeading?: string;
    formSubheading?: string;
    buttonLabel?: string;
};

export default function ContactFormSection({
    heading = "We're Here to Help",
    subheading = 'Reach out to us through any of the following channels.',
    emailAddress = 'hello@evphq.com',
    emailNote = 'We typically reply within 24 hours.',
    phoneNumber = '+91 98440 38489',
    phoneNote = 'Mon - Fri, 10:00 AM - 6:00 PM IST',
    addressText = "<p>EVP Headquarters Pvt Ltd #15, 2nd Floor, 7th Main Road, Jnanaganga Nagar, Bengaluru, 560 056</p>",
    workingHours = "<p>Monday - Friday<br>10:00 AM - 6:00 PM IST<br>Saturday - Sunday<br>Closed</p>",
    formHeading = 'Send Us a Message',
    formSubheading = "Fill out the form below and we'll get back to you soon.",
    buttonLabel = 'Send Message',
}: Props) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        designation: '',
        company: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const { recaptcha_site_key } = usePage().props as any;

    useEffect(() => {
        if (!recaptcha_site_key) return;

        // Check if script is already loaded
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
                    .then((token: string) => {
                        resolve(token);
                    })
                    .catch(() => {
                        resolve(null);
                    });
            });
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrorMsg(null);
        setErrors({});

        const token = await executeRecaptcha();

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

        try {
            const response = await fetch('/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ ...formData, recaptcha_token: token }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    designation: '',
                    company: '',
                    description: '',
                });
            } else {
                if (response.status === 422 && data.errors) {
                    setErrors(data.errors);
                }
                setErrorMsg(data.message || 'Failed to submit message. Please try again.');
            }
        } catch (err) {
            setErrorMsg('An error occurred. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-white py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-7">
                <div className="flex flex-col gap-12 lg:flex-row">
                
                {/* ── Left Column: Contact Channels ── */}
                <div className="w-full space-y-8 lg:w-2/5">
                    {/* Header */}
                    <div className="space-y-3">
                        <h2 className="font-heading relative inline-block text-3xl font-extrabold text-brand sm:text-4xl">
                            {heading}
                            {/* Decorative Accent Blue Circle behind the final word */}
                            <span className="absolute -bottom-1 -right-2 -z-10 h-8 w-8 rounded-full bg-accent-brand/20 sm:h-10 sm:w-10" />
                        </h2>
                        {subheading && (
                            <p className="font-sans text-sm text-gray-500 max-w-sm">
                                {subheading}
                            </p>
                        )}
                    </div>

                    {/* Channel Cards */}
                    <div className="space-y-4">
                        {/* Email Card */}
                        {emailAddress && (
                            <div className="flex items-start gap-4 rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-shadow hover:shadow-xs">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-brand text-white">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-heading text-sm font-bold text-brand">Email</h3>
                                    <p className="font-sans text-sm font-medium text-gray-700">{emailAddress}</p>
                                    {emailNote && <p className="font-sans text-xs text-gray-400">{emailNote}</p>}
                                </div>
                            </div>
                        )}

                        {/* Phone Card */}
                        {phoneNumber && (
                            <div className="flex items-start gap-4 rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-shadow hover:shadow-xs">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-brand text-white">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-heading text-sm font-bold text-brand">Phone</h3>
                                    <p className="font-sans text-sm font-medium text-gray-700">{phoneNumber}</p>
                                    {phoneNote && <p className="font-sans text-xs text-gray-400">{phoneNote}</p>}
                                </div>
                            </div>
                        )}

                        {/* Address Card */}
                        {addressText && (
                            <div className="flex items-start gap-4 rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-shadow hover:shadow-xs">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-brand text-white">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-heading text-sm font-bold text-brand">Address</h3>
                                    <div 
                                        className="font-medium text-gray-700 prose prose-sm max-w-none [&_p]:m-0"
                                        dangerouslySetInnerHTML={{ __html: addressText }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Working Hours Card */}
                        {workingHours && (
                            <div className="flex items-start gap-4 rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-shadow hover:shadow-xs">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-brand text-white">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-heading text-sm font-bold text-brand">Working Hours</h3>
                                    <div 
                                        className="font-medium text-gray-700 prose prose-sm max-w-none [&_p]:m-0"
                                        dangerouslySetInnerHTML={{ __html: workingHours }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right Column: Message Form ── */}
                <div className="w-full lg:w-3/5">
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 sm:p-10 shadow-xs transition-shadow hover:shadow-md">
                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
                                    <CheckCircle className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-xl font-bold text-brand">Thank You!</h3>
                                    <p className="font-sans text-sm text-gray-500 max-w-sm">
                                        Your message has been sent successfully. We will get back to you as soon as possible.
                                    </p>
                                </div>
                                <BrandButton
                                    type="button"
                                    onClick={() => setIsSubmitted(false)}
                                    variant="outline"
                                    showArrow={false}
                                    className="text-xs py-2 px-6"
                                >
                                    Send another message
                                </BrandButton>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <h3 className="font-heading text-2xl font-bold text-brand sm:text-3xl">
                                        {formHeading}
                                    </h3>
                                    {formSubheading && (
                                        <p className="font-sans text-sm text-gray-500">
                                            {formSubheading}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Name Input */}
                                    <div className="space-y-1.5 text-left">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Full Name*"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-rose-600 mt-1 text-left">{errors.name[0]}</p>
                                        )}
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-1.5 text-left">
                                        <input
                                            type="email"
                                            required
                                            placeholder="Email Address*"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-rose-600 mt-1 text-left">{errors.email[0]}</p>
                                        )}
                                    </div>

                                    {/* Phone Input */}
                                    <div className="space-y-1.5 text-left">
                                        <input
                                            type="tel"
                                            required
                                            placeholder="Phone Number*"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-rose-600 mt-1 text-left">{errors.phone[0]}</p>
                                        )}
                                    </div>

                                    {/* Designation Input */}
                                    <div className="space-y-1.5 text-left">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Designation*"
                                            value={formData.designation}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        {errors.designation && (
                                            <p className="text-xs text-rose-600 mt-1 text-left">{errors.designation[0]}</p>
                                        )}
                                    </div>

                                    {/* Company Name Input */}
                                    <div className="space-y-1.5 text-left sm:col-span-2">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Company Name*"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                        {errors.company && (
                                            <p className="text-xs text-rose-600 mt-1 text-left">{errors.company[0]}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description Input */}
                                <div className="space-y-1.5 text-left">
                                    <textarea
                                        required
                                        placeholder="Description*"
                                        rows={5}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent-brand resize-none disabled:opacity-50"
                                        disabled={isSubmitting}
                                    />
                                    {errors.description ? (
                                        <p className="text-xs text-rose-600 mt-1 text-left">{errors.description[0]}</p>
                                    ) : (
                                        <p className="text-xs text-gray-400">Tell us about your project or how we can help you...</p>
                                    )}
                                </div>

                                {errorMsg && (
                                    <p className="text-sm text-rose-500 font-medium text-left">
                                        {errorMsg}
                                    </p>
                                )}

                                {/* Submit button */}
                                <div className="text-left">
                                    {errors.recaptcha_token && (
                                        <p className="text-xs text-rose-600 mb-2 text-left">{errors.recaptcha_token[0]}</p>
                                    )}
                                    <BrandButton
                                        type="submit"
                                        disabled={isSubmitting}
                                        variant="primary"
                                    >
                                        {isSubmitting ? 'Sending...' : buttonLabel}
                                    </BrandButton>
                                    <p className="text-[10px] text-gray-400/60 leading-normal mt-3 max-w-md">
                                        This site is protected by reCAPTCHA.
                                    </p>
                                </div>
                            </form>
                        )}

                        {/* Privacy Banner */}
                        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-left">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-brand/10 text-accent-brand">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-sans text-xs font-bold text-brand">Your information is secure with us.</h4>
                                <p className="font-sans text-[11px] text-gray-400">We respect your privacy and will never share your details.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            </div>
        </section>
    );
}
