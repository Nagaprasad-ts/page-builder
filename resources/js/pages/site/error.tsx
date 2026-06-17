import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { lazySectionRegistry } from '@/sections/lazy';
import Error404Section from '@/sections/error-404';
import ExploreServicesSection from '@/sections/explore-services';
import HelpCtaSection from '@/sections/help-cta';
import type { PageSection } from '@/types/builder';

type Props = {
    status: number;
    headerSections: PageSection[];
    footerSections: PageSection[];
};

export default function ErrorPage({ headerSections = [], footerSections = [] }: Props) {
    const fallback = <div className="min-h-16 animate-pulse bg-gray-50/50" />;

    return (
        <>
            <Head title="Page Not Found | EVP HQ" />

            {/* Header Sections */}
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

            {/* 404 Content */}
            <Error404Section />
            <ExploreServicesSection />
            <HelpCtaSection />

            {/* Footer Sections */}
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

ErrorPage.layout = null;
