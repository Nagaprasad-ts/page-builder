import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, FolderGit2, Image, Layout, LayoutGrid, Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const isEditorOrAdmin =
        auth.user.role === 'admin' || auth.user.role === 'editor';

    const adminNavItems: NavItem[] = [
        {
            title: 'Pages',
            href: '/admin/pages',
            icon: FileText,
        },
        {
            title: 'Media',
            href: '/admin/media',
            icon: Image,
        },
        ...(isAdmin
            ? [
                  {
                      title: 'Menus',
                      href: '/admin/menus',
                      icon: Menu,
                  } as NavItem,
                  {
                      title: 'Layout',
                      href: '/admin/layout',
                      icon: Layout,
                  } as NavItem,
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isEditorOrAdmin && <NavAdmin items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

function NavAdmin({ items }: { items: NavItem[] }) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-2 py-0">
            <p className="mb-1 px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                Admin
            </p>
            <div className="space-y-0.5">
                {items.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={[
                            'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                            isCurrentOrParentUrl(item.href)
                                ? 'bg-accent font-medium text-accent-foreground'
                                : 'text-muted-foreground',
                        ].join(' ')}
                    >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
