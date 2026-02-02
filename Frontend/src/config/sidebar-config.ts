export interface SidebarItem {
  title: string
  href: string
  permission: boolean
  group?: string
}

export interface SidebarGroup {
  title: string
  items: SidebarItem[]
}

export const sidebarConfig: SidebarGroup[] = [
  {
    title: "الرئيسية",
    items: [
      {
        title: "لوحة التحكم",
        href: "/dashboard",
        permission: true,
      },
    ],
  },
  {
    title: "الإدارة",
    items: [
      {
        title: "العملاء",
        href: "/customers",
        permission: true,
      },
      {
        title: "المبيعات",
        href: "/sales",
        permission: true,
      },
      {
        title: "الأصناف",
        href: "/inventory",
        permission: true,
      },
    ],
  },
  {
    title: "النظام",
    items: [
      {
        title: "الإعدادات",
        href: "/settings",
        permission: true,
      },
      {
        title: "المساعدة",
        href: "/help",
        permission: true,
      },
    ],
  },
]
