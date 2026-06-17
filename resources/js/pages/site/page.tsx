import { Head } from '@inertiajs/react';
import { sectionRegistry } from '@/sections';
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
                const registration = sectionRegistry[section.section_type];

                if (!registration) {
                    return null;
                }

                const Component = registration.default;

                return <Component key={section.id} {...section.props} />;
            })}

            <div>
                {bodySections.map((section) => {
                    const registration = sectionRegistry[section.section_type];

                    if (!registration) {
                        return null;
                    }

                    const Component = registration.default;

                    return <Component key={section.id} {...section.props} />;
                })}
            </div>

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

PublicPage.layout = null;
