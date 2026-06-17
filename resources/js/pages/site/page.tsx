import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { lazySectionRegistry } from '@/sections/lazy';
import type { Page, PageSection } from '@/types/builder';

type Props = {
    page: Page;
    headerSections: PageSection[];
    bodySections: PageSection[];
    footerSections: PageSection[];
};

export default function PublicPage({
    page,
    headerSections,
    bodySections,
    footerSections,
}: Props) {
    const fallback = <div className="min-h-16 animate-pulse bg-gray-50/50" />;

    return (
        <>
            <Head title={page.meta_title ?? page.title}>
                {page.meta_description && (
                    <meta name="description" content={page.meta_description} />
                )}
                {page.meta_keywords && (
                    <meta name="keywords" content={page.meta_keywords} />
                )}
            </Head>

            {headerSections.map((section) => {
                const Component = lazySectionRegistry[section.section_type];

                if (!Component) {
                    return null;
                }

                return (
                    <Suspense key={section.id} fallback={fallback}>
                        <Component {...section.props} />
                    </Suspense>
                );
            })}

            <div>
                {bodySections.map((section) => {
                    const Component = lazySectionRegistry[section.section_type];

                    if (!Component) {
                        return null;
                    }

                    return (
                        <Suspense key={section.id} fallback={fallback}>
                            <Component {...section.props} />
                        </Suspense>
                    );
                })}
            </div>

            {footerSections.map((section) => {
                const Component = lazySectionRegistry[section.section_type];

                if (!Component) {
                    return null;
                }

                return (
                    <Suspense key={section.id} fallback={fallback}>
                        <Component {...section.props} />
                    </Suspense>
                );
            })}
        </>
    );
}

PublicPage.layout = null;
