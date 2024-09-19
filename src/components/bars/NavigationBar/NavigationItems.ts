import { LucideIcon, Newspaper, Settings } from "lucide-react";


export interface NavigationItem {
    name: string;
    icon: LucideIcon
    href: string;
}

export const navigationItems: NavigationItem[] = [
    {
        name: "Novedades",
        icon: Newspaper,
        href: "/novedades"
    },
    {
        name: "Ajustes",
        icon: Settings,
        href: "/ajustes"
    }
]