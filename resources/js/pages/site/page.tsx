import { sectionRegistry } from '@/sections';
import type { Page, PageSection } from '@/types/builder';
import { Head } from '@inertiajs/react';

type Props = {
    page: Page;
    sections: PageSection[];
};

export default function PublicPage({ page, sections }: Props) {
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

            <div>
                {sections.map((section) => {
                    const registration = sectionRegistry[section.section_type];
                    if (!registration) {
                        return null;
                    }
                    const Component = registration.default;
                    return <Component key={section.id} {...section.props} />;
                })}
            </div>
        </>
    );
}

PublicPage.layout = null;
