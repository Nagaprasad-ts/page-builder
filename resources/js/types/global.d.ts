import type { Auth } from '@/types/auth';
import type { Menu } from '@/types/menu';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            menus: Record<string, Menu>;
            [key: string]: unknown;
        };
    }
}
