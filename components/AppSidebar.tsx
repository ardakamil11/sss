import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Video,
  ImageIcon,
  Type,
  ImagePlus,
  Layers,
  TrendingUp,
  Users,
  Calendar,
  Home,
  Youtube,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    section: "HOME",
    items: [
      {
        title: "Ana Sayfa",
        url: "/",
        icon: Home,
      },
    ],
  },
  {
    section: "İÇERİK ÜRET",
    items: [
      {
        title: "Üründen Reklama",
        url: "/urun-reklama",
        icon: Video,
      },
      {
        title: "Fotoğraf Birleştirme",
        url: "/fotograf-birlestirme", 
        icon: ImageIcon,
      },
      {
        title: "Metinden Görüntü",
        url: "/metin-goruntu",
        icon: Type,
      },
      {
        title: "Görüntü İyileştirme",
        url: "/goruntu-iyilestirme",
        icon: ImagePlus,
      },
      {
        title: "Arka Plan Değiştirme",
        url: "/arka-plan-degistirme",
        icon: Layers,
      },
    ],
  },
  {
    section: "OTOMASYONLAR",
    items: [
      {
        title: "Trend Bulma",
        url: "/trend-bulma",
        icon: TrendingUp,
      },
      {
        title: "YouTube İnceleme",
        url: "/youtube-inceleme",
        icon: Youtube,
      },
      {
        title: "Rakip Analizi",
        url: "/rakip-analizi",
        icon: Users,
      },
    ],
  },
  {
    section: "TAKVİM",
    items: [
      {
        title: "İçerik Takvimi",
        url: "/icerik-takvimi",
        icon: Calendar,
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300`}
      style={{ 
        backgroundColor: '#0f0f0f',
        borderRight: '1px solid #2c2c2e',
        height: '100vh',
        overflow: 'hidden'
      }}
      collapsible="icon"
    >
      <SidebarContent className="py-2 h-full overflow-hidden">
        {menuItems.map((section, sectionIndex) => (
          <div key={section.section}>
            <SidebarGroup className="px-4 mb-3">
              {/* Section Header */}
              <SidebarGroupLabel 
                className="text-xs font-semibold uppercase tracking-wider mb-1 px-3"
                style={{ color: '#888888' }}
              >
                {!collapsed && section.section}
              </SidebarGroupLabel>

              {/* Menu Items */}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          end 
                           className={({ isActive }) => `
                             relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 group
                             ${isActive 
                               ? 'bg-primary/10 text-primary border-l-2 border-l-primary ml-3' 
                               : 'text-gray-300 hover:bg-white/5 hover:text-white ml-3'
                             }
                           `}
                        >
                          <item.icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
                          {!collapsed && (
                            <span className="font-medium text-sm truncate">
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Section Divider */}
            {sectionIndex < menuItems.length - 1 && (
              <div 
                className="mx-7 mb-2 border-t" 
                style={{ borderTopColor: '#2c2c2e' }}
              />
            )}
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}