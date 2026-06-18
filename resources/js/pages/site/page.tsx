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
    const isHomePage = page.path === '/' || page.path === 'home';
    const isSolutionsPage = page.path?.startsWith('solutions/');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://evphq.com';

    const jsonLd = isHomePage ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'EVP Headquarters',
        'url': origin,
        'logo': `${origin}/apple-touch-icon.png`,
        'favicon': `${origin}/favicon.ico`,
    } : isSolutionsPage ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': page.title,
        'serviceType': page.title,
        'description': page.meta_description || `Learn more about our ${page.title} solution.`,
        'provider': {
            '@type': 'Organization',
            'name': 'EVP Headquarters',
            'url': origin,
        },
        'url': `${origin}/${page.path}`,
    } : null;

    return (
        <>
            <Head title={page.meta_title ?? page.title}>
                {page.meta_description && (
                    <meta name="description" content={page.meta_description} />
                )}
                {page.meta_keywords && (
                    <meta name="keywords" content={page.meta_keywords} />
                )}
                {page.no_index && (
                    <meta name="robots" content="noindex, nofollow" />
                )}
                {jsonLd && (
                    <script type="application/ld+json">
                        {JSON.stringify(jsonLd)}
                    </script>
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
