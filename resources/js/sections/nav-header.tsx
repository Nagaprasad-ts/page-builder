import { usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import BrandButton from '@/components/ui/brand-button';
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
    siteName: { type: 'text', label: 'Site name', default: 'EVP HQ' },
    logoUrl: { type: 'image', label: 'Logo' },
    clientLoginLabel: { type: 'text', label: 'Client Login label', default: '' },
    clientLoginUrl: { type: 'url', label: 'Client Login URL', default: '' },
    ctaLabel: { type: 'text', label: 'CTA button label', default: 'Get started' },
    ctaUrl: { type: 'url', label: 'CTA button URL', default: '/' },
};

type Props = {
    siteName?: string;
    logoUrl?: string | null;
    clientLoginLabel?: string;
    clientLoginUrl?: string;
    ctaLabel?: string;
    ctaUrl?: string;
};

function itemHref(item: MenuItem): string {
    if (item.type === 'page' && item.page) {
        const path = item.page.path ?? item.page.slug;

        return path.startsWith('/') ? path : `/${path}`;
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
            <div className="flex w-full items-center justify-between rounded-lg hover:bg-gray-50/70">
                <a
                    href={itemHref(item)}
                    target={item.target}
                    onClick={onClose}
                    className="flex-1 rounded-l-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:text-gray-900"
                >
                    {item.label}
                </a>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-11 w-11 items-center justify-center rounded-r-lg text-gray-500 transition hover:text-gray-900 border-l border-gray-100/50"
                    aria-label={open ? 'Collapse menu' : 'Expand menu'}
                >
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
            </div>

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
export default function NavHeaderSection({
    siteName,
    logoUrl,
    clientLoginLabel = '',
    clientLoginUrl = '',
    ctaLabel,
    ctaUrl,
}: Props) {
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
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">

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
                                                        className="h-auto bg-transparent px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 cursor-pointer"
                                                        onClick={(e) => {
                                                            const href = itemHref(item);

                                                            if (href && href !== '#') {
                                                                const isTouch = window.matchMedia('(pointer: coarse)').matches;

                                                                if (isTouch) {
                                                                    const isOpen = e.currentTarget.getAttribute('data-state') === 'open';

                                                                    if (!isOpen) {
                                                                        return;
                                                                    }
                                                                }

                                                                if (e.metaKey || e.ctrlKey) {
                                                                    window.open(href, '_blank');

                                                                    return;
                                                                }

                                                                router.visit(href);
                                                            }
                                                        }}
                                                    >
                                                        <a
                                                            href={itemHref(item)}
                                                            target={item.target}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {item.label}
                                                        </a>
                                                    </NavigationMenuTrigger>
                                                    <NavigationMenuContent className="min-w-[240px] rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg shadow-black/[0.08]">
                                                        {item.children.map((child, idx) => (
                                                            <a
                                                                key={child.id}
                                                                href={itemHref(child)}
                                                                target={child.target}
                                                                className={cn(
                                                                    'block rounded-lg px-4 py-2.5 text-[13.5px] font-medium text-gray-600 transition-all duration-150 hover:bg-accent-brand/[0.06] hover:text-gray-900 whitespace-nowrap',
                                                                    idx > 0 && 'mt-0.5',
                                                                )}
                                                            >
                                                                {child.label}
                                                            </a>
                                                        ))}
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

                    <div className="flex items-center gap-4">
                        {/* Desktop Client Login */}
                        {clientLoginLabel && clientLoginUrl && (
                            <a
                                href={clientLoginUrl}
                                className="hidden md:inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mr-1"
                            >
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                {clientLoginLabel}
                            </a>
                        )}

                        {/* Desktop CTA */}
                        {ctaLabel && ctaUrl && (
                            <BrandButton
                                href={ctaUrl}
                                variant="brand"
                                className="hidden md:inline-flex shrink-0 py-2.5 px-6 text-sm"
                            >
                                {ctaLabel}
                            </BrandButton>
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
                <div className="flex items-center justify-end border-b border-gray-100 px-5 py-4">
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

                {/* CTA & Client Login pinned at bottom */}
                {(ctaLabel || clientLoginLabel) && (
                    <div className="border-t border-gray-100 px-5 py-5 flex flex-col gap-3">
                        {clientLoginLabel && clientLoginUrl && (
                            <a
                                href={clientLoginUrl}
                                onClick={() => setMobileOpen(false)}
                                className="flex w-full items-center justify-center py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg transition hover:bg-gray-50/50"
                            >
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                {clientLoginLabel}
                            </a>
                        )}
                        {ctaLabel && ctaUrl && (
                            <BrandButton
                                href={ctaUrl}
                                variant="brand"
                                className="w-full py-3 px-6 text-sm"
                            >
                                {ctaLabel}
                            </BrandButton>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
