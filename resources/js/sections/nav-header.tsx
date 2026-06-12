import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import type { SectionMeta, SectionSchema } from '@/types/builder';
import type { MenuItem } from '@/types/menu';

export const meta: SectionMeta = {
    name: 'nav-header',
    category: 'Layout',
    icon: 'Menu',
    description: 'Site navigation header with logo, desktop nav menu links, and a CTA button.',
};

export const schema: SectionSchema = {
    siteName: { type: 'text', label: 'Site name', default: 'My Site' },
    logoUrl: { type: 'image', label: 'Logo' },
    ctaLabel: { type: 'text', label: 'CTA button label', default: 'Get started' },
    ctaUrl: { type: 'url', label: 'CTA button URL', default: '/' },
};

type Props = {
    siteName?: string;
    logoUrl?: string | null;
    ctaLabel?: string;
    ctaUrl?: string;
};

function itemHref(item: MenuItem): string {
    if (item.type === 'page' && item.page) {
        const slug = item.page.slug;
        
        return slug.startsWith('/') ? slug : `/${slug}`;
    }

    return item.url ?? '#';
}

// ─── Mobile accordion item ────────────────────────────────────────────────────
function MobileNavItem({ item, onClose }: { item: MenuItem; onClose: () => void }) {
    const hasChildren = item.children?.length > 0;
    const [open, setOpen] = useState(false);

    if (!hasChildren) {
        return (
            <a
                href={itemHref(item)}
                target={item.target}
                onClick={onClose}
                className="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
            >
                {item.label}
            </a>
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
            >
                {item.label}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="ml-4 border-l border-gray-100 pl-3">
                    {item.children.map((child) => (
                        <a
                            key={child.id}
                            href={itemHref(child)}
                            target={child.target}
                            onClick={onClose}
                            className="flex items-center rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                            {child.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function NavHeaderSection({ siteName, logoUrl, ctaLabel, ctaUrl }: Props) {
    const { menus } = usePage().props;
    const desktopNav = menus?.desktop_nav;
    const navItems: MenuItem[] = desktopNav?.items ?? [];
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        
        return () => { 
            document.body.style.overflow = ''; 
        };
    }, [mobileOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

                    {/* Logo / site name */}
                    <a href="/" className="flex shrink-0 items-center gap-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt={siteName ?? 'Logo'} className="w-auto h-16" />
                        ) : (
                            <span className="text-lg font-bold text-gray-900">{siteName ?? 'My Site'}</span>
                        )}
                    </a>

                    {/* ── Desktop nav using shadcn NavigationMenu ── */}
                    {navItems.length > 0 && (
                        <NavigationMenu viewport={false} className="hidden md:flex">
                            <NavigationMenuList className="gap-0.5">
                                {navItems.map((item) => {
                                    const hasChildren = item.children?.length > 0;

                                    return (
                                        <NavigationMenuItem key={item.id}>
                                            {hasChildren ? (
                                                <>
                                                    <NavigationMenuTrigger
                                                        className="h-auto bg-transparent px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900"
                                                    >
                                                        {item.label}
                                                    </NavigationMenuTrigger>
                                                    <NavigationMenuContent className="min-w-45 bg-white! text-gray-900! border-gray-200! shadow-md!">
                                                        <ul className="flex flex-col py-1">
                                                            {item.children.map((child) => (
                                                                <li key={child.id}>
                                                                    <NavigationMenuLink asChild>
                                                                        <a
                                                                            href={itemHref(child)}
                                                                            target={child.target}
                                                                            className="block select-none rounded-sm px-4 py-2.5 text-sm text-gray-700 no-underline outline-none transition-colors hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900"
                                                                        >
                                                                            {child.label}
                                                                        </a>
                                                                    </NavigationMenuLink>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </NavigationMenuContent>
                                                </>
                                            ) : (
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        href={itemHref(item)}
                                                        target={item.target}
                                                        className="inline-flex h-auto items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                                    >
                                                        {item.label}
                                                    </a>
                                                </NavigationMenuLink>
                                            )}
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    )}

                    <div className="flex items-center gap-2">
                        {/* Desktop CTA */}
                        {ctaLabel && ctaUrl && (
                            <a
                                href={ctaUrl}
                                className="hidden shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 md:inline-flex"
                            >
                                {ctaLabel}
                            </a>
                        )}

                        {/* Hamburger — mobile only */}
                        <button
                            type="button"
                            aria-label="Open menu"
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen(true)}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Backdrop */}
            <div
                onClick={() => setMobileOpen(false)}
                className={cn(
                    'fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
                    mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                )}
            />

            {/* Slide-in drawer from right */}
            <div
                className={cn(
                    'fixed inset-y-0 right-0 z-[70] flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
                    mobileOpen ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    {logoUrl ? (
                        <img src={logoUrl} alt={siteName ?? 'Logo'} className="h-7 w-auto" />
                    ) : (
                        <span className="text-base font-bold text-gray-900">{siteName ?? 'My Site'}</span>
                    )}
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Nav items with accordion support */}
                <nav className="flex-1 overflow-y-auto px-3 py-3">
                    {navItems.map((item) => (
                        <MobileNavItem
                            key={item.id}
                            item={item}
                            onClose={() => setMobileOpen(false)}
                        />
                    ))}
                </nav>

                {/* CTA pinned at bottom */}
                {ctaLabel && ctaUrl && (
                    <div className="border-t border-gray-100 px-5 py-5">
                        <a
                            href={ctaUrl}
                            className="block w-full rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                            {ctaLabel}
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
