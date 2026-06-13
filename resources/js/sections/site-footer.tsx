import type { SectionMeta, SectionSchema } from '@/types/builder';

export const meta: SectionMeta = {
    name: 'site-footer',
    category: 'Layout',
    icon: 'Layers',
    description: 'Site footer with site name, tagline, and copyright text.',
};

export const schema: SectionSchema = {
    siteName: { type: 'text', label: 'Site name', default: 'EVP Headquarters' },
    tagline: { type: 'text', label: 'Tagline', default: 'Building great things.' },
    copyrightText: { type: 'text', label: 'Copyright text', default: '© 2025 EVP Headquarters. All rights reserved.' },
};

type Props = {
    siteName?: string;
    tagline?: string;
    copyrightText?: string;
};

export default function SiteFooterSection({ siteName, tagline, copyrightText }: Props) {
    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-base font-bold text-gray-900">{siteName ?? 'My Site'}</p>
                        {tagline && <p className="mt-1 text-sm text-gray-500">{tagline}</p>}
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-7">
                    <p className="text-sm text-gray-400">{copyrightText ?? '© 2025 My Site. All rights reserved.'}</p>
                </div>
            </div>
        </footer>
    );
}
