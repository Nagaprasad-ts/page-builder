import { usePage, Link } from '@inertiajs/react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'breadcrumbs',
    category: 'Navigation',
    icon: 'FolderOpen',
    description: 'Displays the dynamic hierarchical navigation path to the current page.',
};

export const schema: SectionSchema = {
    showHomeIcon: { type: 'boolean', label: 'Show Home page in trail', default: true },
};

type Props = {
    showHomeIcon?: boolean;
};

export default function BreadcrumbsSection({ showHomeIcon = true }: Props) {
    const { props } = usePage();
    const rawBreadcrumbs = (props.breadcrumbs as { title: string; url: string }[]) || [];

    // Filter out home if showHomeIcon is false
    const breadcrumbs = showHomeIcon
        ? rawBreadcrumbs
        : rawBreadcrumbs.filter((b) => b.url !== '/');

    if (breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <section className="bg-gray-50/50 py-4 border-b border-gray-100/80">
            <div className="mx-auto max-w-7xl px-6">
                <Breadcrumb>
                    <BreadcrumbList className="flex flex-wrap items-center gap-1.5 text-sm">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <div key={index} className="inline-flex items-center gap-1.5">
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-semibold text-gray-900 capitalize">
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.url} className="text-gray-500 hover:text-gray-900 transition-colors capitalize">
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </div>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </section>
    );
}
