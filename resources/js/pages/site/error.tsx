import { Head } from '@inertiajs/react';
import { sectionRegistry } from '@/sections';
import Error404Section from '@/sections/error-404';
import ExploreServicesSection from '@/sections/explore-services';
import HelpCtaSection from '@/sections/help-cta';
import type { PageSection } from '@/types/builder';

type Props = {
    status: number;
    headerSections: PageSection[];
    footerSections: PageSection[];
};

export default function ErrorPage({ status, headerSections = [], footerSections = [] }: Props) {
    return (
        <>
            <Head title="Page Not Found | EVP HQ" />

            {/* Header Sections */}
            {headerSections.map((section) => {
                const registration = sectionRegistry[section.section_type];

                if (!registration) {
                    return null;
                }

                const Component = registration.default;

                return <Component key={section.id} {...section.props} />;
            })}

            {/* 404 Content */}
            <Error404Section />
            <ExploreServicesSection />
            <HelpCtaSection />

            {/* Footer Sections */}
            {footerSections.map((section) => {
                const registration = sectionRegistry[section.section_type];

                if (!registration) {
                    return null;
                }

                const Component = registration.default;

                return <Component key={section.id} {...section.props} />;
            })}
        </>
    );
}

ErrorPage.layout = null;
