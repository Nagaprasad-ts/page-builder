export type MenuItem = {
    id: number;
    menu_id: number;
    parent_id: number | null;
    label: string;
    type: 'page' | 'url';
    page_id: number | null;
    url: string | null;
    target: '_self' | '_blank';
    sort_order: number;
    children: MenuItem[];
    page?: { id: number; title: string; slug: string } | null;
};

export type Menu = {
    id: number;
    name: string;
    location: 'desktop_nav' | 'mobile_nav' | 'footer';
    items: MenuItem[];
};
