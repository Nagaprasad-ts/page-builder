import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'faq',
    category: 'Content',
    icon: 'HelpCircle',
    description: 'Left label + heading + description, right accordion FAQ list.',
};

export const schema: SectionSchema = {
    label: { type: 'text', label: 'Label', default: 'FAQ' },
    heading: { type: 'text', label: 'Heading', default: 'Frequently Asked Questions' },
    description: {
        type: 'richtext',
        label: 'Description',
        default: '<p>We compiled a list of answers to address your most pressing questions regarding our Services.</p>',
    },
    items: {
        type: 'array',
        label: 'FAQ items',
        default: [
            { question: 'How can I contact customer support?', answer: '<p>We provide a range of services, including digital banking solutions, payment processing, risk management, and compliance tools.</p>' },
            { question: 'What services do you offer?', answer: '<p>We provide a range of services, including digital banking solutions, payment processing, risk management, and compliance tools.</p>' },
            { question: 'How secure are your digital banking solutions?', answer: '<p>We provide a range of services, including digital banking solutions, payment processing, risk management, and compliance tools.</p>' },
            { question: 'What types of payment methods do you support?', answer: '<p>We provide a range of services, including digital banking solutions, payment processing, risk management, and compliance tools.</p>' },
            { question: 'Can your software integrate with existing systems?', answer: '<p>We provide a range of services, including digital banking solutions, payment processing, risk management, and compliance tools.</p>' },
        ],
        itemSchema: {
            question: { type: 'text', label: 'Question', default: 'Your question here?' },
            answer: { type: 'richtext', label: 'Answer', default: '<p>Your answer here.</p>' },
        },
    },
};

type FaqItem = {
    question?: string;
    answer?: string;
};

type Props = {
    label?: string;
    heading?: string;
    description?: string;
    items?: FaqItem[];
};

export default function FaqSection({ label, heading, description, items = [] }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="bg-white py-16">
            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:px-7 lg:flex-row lg:items-start">

                {/* ── Left ── */}
                <div className="w-full lg:w-2/5 lg:shrink-0">
                    {label && (
                        <p className="mb-3 text-sm font-bold text-accent-brand">{label}</p>
                    )}
                    {heading && (
                        <h2 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 ">
                            {heading}
                        </h2>
                    )}
                    {description && (
                        <div 
                            className="text-sm leading-relaxed text-gray-500 prose prose-sm max-w-none [&_p]:mb-2"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}
                </div>

                {/* ── Right: accordion ── */}
                <div className="w-full divide-y divide-border lg:w-3/5">
                    {items.map((item, i) => {
                        const isOpen = openIndex === i;

                        return (
                            <div key={i}>
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-gray-900 transition hover:text-accent-brand"
                                >
                                    <span>{item.question}</span>
                                    {isOpen
                                        ? <Minus className="h-4 w-4 shrink-0 text-accent-brand" />
                                        : <Plus className="h-4 w-4 shrink-0 text-gray-400" />
                                    }
                                </button>
                                {isOpen && item.answer && (
                                    <div 
                                        className="pb-4 text-sm leading-relaxed text-gray-500 prose prose-sm max-w-none [&_p]:mb-2"
                                        dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
