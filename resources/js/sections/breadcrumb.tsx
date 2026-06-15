import { ChevronRight } from 'lucide-react';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'breadcrumb',
    category: 'Navigation',
    icon: 'ChevronRight',
    description: 'Breadcrumb navigation — multiple levels of links with separators.',
};

const DEFAULT_ITEMS = [
    { label: 'Home', url: '/' },
    { label: 'Solutions', url: '/solutions' },
    { label: 'Branding', url: '' },
];

export const schema: SectionSchema = {
    items: {
        type: 'array',
        label: 'Breadcrumb items',
        default: DEFAULT_ITEMS,
        itemSchema: {
            label: { type: 'text', label: 'Label', default: 'Page' },
            url: { type: 'url', label: 'URL (leave empty for current page)', default: '' },
        },
    },
};

type BreadcrumbItem = {
    label?: string;
    url?: string;
};

type Props = {
    items?: BreadcrumbItem[];
};

export default function BreadcrumbSection({ items }: Props) {
    const crumbs: BreadcrumbItem[] = items && Object.values(items).length > 0
        ? Object.values(items)
        : DEFAULT_ITEMS;

    return (
        <section className="bg-white py-3">
            <div className="mx-auto max-w-7xl px-4 md:px-7">
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1 text-sm">
                        {crumbs.map((crumb, i) => {
                            const isLast = i === crumbs.length - 1;

                            return (
                                <li key={i} className="flex items-center gap-1">
                                    {i > 0 && (
                                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                    )}
                                    {!isLast && crumb.url ? (
                                        <a
                                            href={crumb.url}
                                            className="text-gray-500 transition-colors hover:text-brand"
                                        >
                                            {crumb.label}
                                        </a>
                                    ) : (
                                        <span className={isLast ? 'font-medium text-gray-900' : 'text-gray-500'}>
                                            {crumb.label}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </section>
    );
}
