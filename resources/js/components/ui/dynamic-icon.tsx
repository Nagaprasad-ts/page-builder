import React, { useEffect, useState } from 'react';
import {
    Users,
    CalendarDays,
    BarChart2,
    Megaphone,
    LayoutGrid,
    FileText,
    Share2,
    Home,
    Video,
    Mail,
    BookOpen,
    Grid,
    Cpu,
    GraduationCap,
    Radio,
    ShoppingBag,
    User,
    HardDrive,
    Shield,
    UserCheck,
    LayoutList,
    Headphones,
    PlusSquare,
    Layers,
    Linkedin,
    Instagram,
    Facebook,
    Youtube,
    Star,
    Sparkles,
    Settings,
    ArrowRight,
    HelpCircle,
    Briefcase,
    Award,
    TrendingUp,
    Check,
    X,
    MessageSquare,
    MapPin,
    Phone,
    Clock,
    Search,
    Download
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    users: Users,
    calendardays: CalendarDays,
    barchart2: BarChart2,
    megaphone: Megaphone,
    layoutgrid: LayoutGrid,
    filetext: FileText,
    share2: Share2,
    home: Home,
    video: Video,
    mail: Mail,
    bookopen: BookOpen,
    grid: Grid,
    cpu: Cpu,
    graduationcap: GraduationCap,
    radio: Radio,
    shoppingbag: ShoppingBag,
    user: User,
    harddrive: HardDrive,
    shield: Shield,
    usercheck: UserCheck,
    layoutlist: LayoutList,
    headphones: Headphones,
    plussquare: PlusSquare,
    layers: Layers,
    linkedin: Linkedin,
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    star: Star,
    sparkles: Sparkles,
    settings: Settings,
    arrowright: ArrowRight,
    helpcircle: HelpCircle,
    briefcase: Briefcase,
    award: Award,
    trendingup: TrendingUp,
    check: Check,
    x: X,
    messagesquare: MessageSquare,
    mappin: MapPin,
    phone: Phone,
    clock: Clock,
    search: Search,
    download: Download,
};

const iconCache: Record<string, string> = {};

export function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [fetchFailed, setFetchFailed] = useState(false);

    const normalized = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const StaticIconComponent = iconMap[normalized];

    // Hooks must always run in the same order. Declare useEffect at the top before any early returns.
    useEffect(() => {
        if (!name || StaticIconComponent) {
            setSvgContent(null);
            setFetchFailed(false);
            return;
        }

        const kebabName = name
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
            .toLowerCase();

        if (iconCache[kebabName]) {
            setSvgContent(iconCache[kebabName]);
            setFetchFailed(false);
            return;
        }

        let isMounted = true;
        const url = `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${kebabName}.svg`;

        setFetchFailed(false);
        setSvgContent(null);

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Icon not found');
                }
                return res.text();
            })
            .then((svgText) => {
                if (isMounted) {
                    iconCache[kebabName] = svgText;
                    setSvgContent(svgText);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setFetchFailed(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [name, StaticIconComponent]);

    if (!name) {
        return null;
    }

    // If it's a pre-registered static icon, render it instantly
    if (StaticIconComponent) {
        return <StaticIconComponent className={className} />;
    }

    if (fetchFailed) {
        return <Sparkles className={className} />;
    }

    if (!svgContent) {
        return <span className={`inline-block w-5 h-5 bg-gray-200/50 animate-pulse rounded-sm ${className}`} />;
    }

    return (
        <span 
            className={`inline-flex items-center justify-center [&_svg]:w-full [&_svg]:h-full ${className}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
}
