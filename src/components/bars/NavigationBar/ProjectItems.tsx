import { Home, Users, Settings, FileText, Camera, Car, LucideIcon, Newspaper } from "lucide-react";


export interface ProjectItem {
  name: string;
  icon: LucideIcon; // Update the type here
  href?:string;
  navigationItems?: {
    name: string;
    href: string;
    icon: LucideIcon;
  }[];
}

export const projectItems: ProjectItem[] = [
  {
    name: "Novedades",
    icon: Newspaper,
    href:'/novedades'
  },
  {
    name: "Apple Vision Pro",
    icon: Home,
    navigationItems: [
      { name: "Overview", href: "/vision-pro/overview", icon: Home },
      { name: "Documentation", href: "/vision-pro/docs", icon: FileText },
      { name: "Camera", href: "/vision-pro/camera", icon: Camera },
    ],
  },
  {
    name: "Porsche",
    icon: Home,
    navigationItems: [
      { name: "Models", href: "/porsche/models", icon: Car },
      { name: "Customization", href: "/porsche/customize", icon: Settings },
      { name: "Dealers", href: "/porsche/dealers", icon: Users },
    ],
  },
  {
    name: "Secret Project",
    icon: Home,
    href: "/",
  },

];