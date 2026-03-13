/**
 * Role codes for the pharmacy management system
 */
export const ROLE_CODES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SALES: "SALES",
} as const;

export type RoleCode = (typeof ROLE_CODES)[keyof typeof ROLE_CODES];

/**
 * Permission key format: module:screen:action
 */
export type PermissionKey = `${string}:${string}:${string}`;

/**
 * Permission keys for the pharmacy management system
 */
export const PERMISSION_KEYS = {
  // Medicines
  MEDICINES_VIEW: "medicines:list:view" as PermissionKey,
  MEDICINES_CREATE: "medicines:list:create" as PermissionKey,
  MEDICINES_EDIT: "medicines:detail:edit" as PermissionKey,
  MEDICINES_DELETE: "medicines:detail:delete" as PermissionKey,
  MEDICINES_STOCK_ADJUST: "medicines:stock:adjust" as PermissionKey,

  // Categories
  CATEGORIES_VIEW: "categories:list:view" as PermissionKey,
  CATEGORIES_CREATE: "categories:list:create" as PermissionKey,
  CATEGORIES_EDIT: "categories:detail:edit" as PermissionKey,
  CATEGORIES_DELETE: "categories:detail:delete" as PermissionKey,

  // Customers
  CUSTOMERS_VIEW: "customers:list:view" as PermissionKey,
  CUSTOMERS_CREATE: "customers:list:create" as PermissionKey,
  CUSTOMERS_EDIT: "customers:detail:edit" as PermissionKey,
  CUSTOMERS_DELETE: "customers:detail:delete" as PermissionKey,

  // Orders
  ORDERS_VIEW: "orders:list:view" as PermissionKey,
  ORDERS_CREATE: "orders:list:create" as PermissionKey,
  ORDERS_EDIT: "orders:detail:edit" as PermissionKey,
  ORDERS_DELETE: "orders:detail:delete" as PermissionKey,
  ORDERS_APPROVE: "orders:detail:approve" as PermissionKey,
  ORDERS_EXPORT: "orders:list:export" as PermissionKey,

  // Inventory
  INVENTORY_VIEW: "inventory:list:view" as PermissionKey,
  INVENTORY_CREATE: "inventory:list:create" as PermissionKey,
  INVENTORY_EDIT: "inventory:detail:edit" as PermissionKey,
  INVENTORY_DELETE: "inventory:detail:delete" as PermissionKey,
  INVENTORY_STOCK_ADJUST: "inventory:stock:adjust" as PermissionKey,

  // Suppliers
  SUPPLIERS_VIEW: "suppliers:list:view" as PermissionKey,
  SUPPLIERS_CREATE: "suppliers:list:create" as PermissionKey,
  SUPPLIERS_EDIT: "suppliers:detail:edit" as PermissionKey,
  SUPPLIERS_DELETE: "suppliers:detail:delete" as PermissionKey,

  // Purchase Orders
  PURCHASE_ORDERS_VIEW: "purchase_orders:list:view" as PermissionKey,
  PURCHASE_ORDERS_CREATE: "purchase_orders:list:create" as PermissionKey,
  PURCHASE_ORDERS_EDIT: "purchase_orders:detail:edit" as PermissionKey,
  PURCHASE_ORDERS_APPROVE: "purchase_orders:detail:approve" as PermissionKey,

  // Reports
  REPORTS_VIEW: "reports:list:view" as PermissionKey,
  REPORTS_SALES: "reports:sales:view" as PermissionKey,
  REPORTS_INVENTORY: "reports:inventory:view" as PermissionKey,
  REPORTS_FINANCIAL: "reports:financial:view" as PermissionKey,

  // Accounting
  ACCOUNTING_VIEW: "accounting:list:view" as PermissionKey,
  ACCOUNTING_CREATE: "accounting:list:create" as PermissionKey,
  ACCOUNTING_EDIT: "accounting:detail:edit" as PermissionKey,
  INVOICES_VIEW: "invoices:list:view" as PermissionKey,
  EXPENSES_VIEW: "expenses:list:view" as PermissionKey,

  // Settings
  SETTINGS_VIEW: "settings:general:view" as PermissionKey,
  SETTINGS_EDIT: "settings:general:edit" as PermissionKey,

  // Team Management
  TEAM_VIEW: "team:list:view" as PermissionKey,
  TEAM_CREATE: "team:list:create" as PermissionKey,
  TEAM_EDIT: "team:detail:edit" as PermissionKey,
  TEAM_DELETE: "team:detail:delete" as PermissionKey,

  // Roles & Permissions
  ROLES_VIEW: "roles:list:view" as PermissionKey,
  ROLES_CREATE: "roles:list:create" as PermissionKey,
  ROLES_EDIT: "roles:detail:edit" as PermissionKey,
  ROLES_MANAGE_PERMISSIONS: "roles:permissions:manage" as PermissionKey,

  // Audit Logs
  AUDIT_LOGS_VIEW: "audit_logs:list:view" as PermissionKey,

  // Dashboard
  DASHBOARD_VIEW: "dashboard:overview:view" as PermissionKey,
} as const;

/**
 * Role definitions with their default permissions
 */
export const ROLES = {
  [ROLE_CODES.SUPER_ADMIN]: {
    name: "مدير النظام",
    nameEn: "Super Admin",
    description: "صلاحيات كاملة على النظام (دور فريد)",
    permissions: Object.values(PERMISSION_KEYS),
  },
  [ROLE_CODES.ADMIN]: {
    name: "مدير",
    nameEn: "Admin",
    description: "صلاحيات إدارية واسعة على النظام",
    permissions: [
      // Dashboard
      PERMISSION_KEYS.DASHBOARD_VIEW,

      // Medicines
      PERMISSION_KEYS.MEDICINES_VIEW,
      PERMISSION_KEYS.MEDICINES_CREATE,
      PERMISSION_KEYS.MEDICINES_EDIT,
      PERMISSION_KEYS.MEDICINES_DELETE,
      PERMISSION_KEYS.MEDICINES_STOCK_ADJUST,

      // Categories
      PERMISSION_KEYS.CATEGORIES_VIEW,
      PERMISSION_KEYS.CATEGORIES_CREATE,
      PERMISSION_KEYS.CATEGORIES_EDIT,
      PERMISSION_KEYS.CATEGORIES_DELETE,

      // Customers
      PERMISSION_KEYS.CUSTOMERS_VIEW,
      PERMISSION_KEYS.CUSTOMERS_CREATE,
      PERMISSION_KEYS.CUSTOMERS_EDIT,
      PERMISSION_KEYS.CUSTOMERS_DELETE,

      // Orders
      PERMISSION_KEYS.ORDERS_VIEW,
      PERMISSION_KEYS.ORDERS_CREATE,
      PERMISSION_KEYS.ORDERS_EDIT,
      PERMISSION_KEYS.ORDERS_DELETE,
      PERMISSION_KEYS.ORDERS_APPROVE,
      PERMISSION_KEYS.ORDERS_EXPORT,

      // Inventory
      PERMISSION_KEYS.INVENTORY_VIEW,
      PERMISSION_KEYS.INVENTORY_CREATE,
      PERMISSION_KEYS.INVENTORY_EDIT,
      PERMISSION_KEYS.INVENTORY_DELETE,
      PERMISSION_KEYS.INVENTORY_STOCK_ADJUST,

      // Suppliers
      PERMISSION_KEYS.SUPPLIERS_VIEW,
      PERMISSION_KEYS.SUPPLIERS_CREATE,
      PERMISSION_KEYS.SUPPLIERS_EDIT,
      PERMISSION_KEYS.SUPPLIERS_DELETE,

      // Purchase Orders
      PERMISSION_KEYS.PURCHASE_ORDERS_VIEW,
      PERMISSION_KEYS.PURCHASE_ORDERS_CREATE,
      PERMISSION_KEYS.PURCHASE_ORDERS_EDIT,
      PERMISSION_KEYS.PURCHASE_ORDERS_APPROVE,

      // Reports
      PERMISSION_KEYS.REPORTS_VIEW,
      PERMISSION_KEYS.REPORTS_SALES,
      PERMISSION_KEYS.REPORTS_INVENTORY,
      PERMISSION_KEYS.REPORTS_FINANCIAL,

      // Accounting
      PERMISSION_KEYS.ACCOUNTING_VIEW,
      PERMISSION_KEYS.ACCOUNTING_CREATE,
      PERMISSION_KEYS.ACCOUNTING_EDIT,
      PERMISSION_KEYS.INVOICES_VIEW,
      PERMISSION_KEYS.EXPENSES_VIEW,

      // Settings
      PERMISSION_KEYS.SETTINGS_VIEW,
      PERMISSION_KEYS.SETTINGS_EDIT,

      // Team Management
      PERMISSION_KEYS.TEAM_VIEW,
      PERMISSION_KEYS.TEAM_CREATE,
      PERMISSION_KEYS.TEAM_EDIT,

      // Roles (limited)
      PERMISSION_KEYS.ROLES_VIEW,
    ],
  },
  [ROLE_CODES.SALES]: {
    name: "موظف مبيعات",
    nameEn: "Sales",
    description: "صلاحيات محدودة للمبيعات وخدمة العملاء",
    permissions: [
      // Dashboard
      PERMISSION_KEYS.DASHBOARD_VIEW,

      // Medicines (view only)
      PERMISSION_KEYS.MEDICINES_VIEW,

      // Categories (view only)
      PERMISSION_KEYS.CATEGORIES_VIEW,

      // Customers
      PERMISSION_KEYS.CUSTOMERS_VIEW,
      PERMISSION_KEYS.CUSTOMERS_CREATE,
      PERMISSION_KEYS.CUSTOMERS_EDIT,

      // Orders
      PERMISSION_KEYS.ORDERS_VIEW,
      PERMISSION_KEYS.ORDERS_CREATE,
      PERMISSION_KEYS.ORDERS_EDIT,

      // Inventory (view only)
      PERMISSION_KEYS.INVENTORY_VIEW,

      // Suppliers (view only)
      PERMISSION_KEYS.SUPPLIERS_VIEW,

      // Reports (limited)
      PERMISSION_KEYS.REPORTS_VIEW,
      PERMISSION_KEYS.REPORTS_SALES,
    ],
  },
} as const;

export type RoleDefinition = (typeof ROLES)[RoleCode];

/**
 * Permission groups for better organization in UI
 */
export const PERMISSION_GROUPS = {
  medicines: {
    title: "الأدوية",
    titleEn: "Medicines",
    permissions: [
      PERMISSION_KEYS.MEDICINES_VIEW,
      PERMISSION_KEYS.MEDICINES_CREATE,
      PERMISSION_KEYS.MEDICINES_EDIT,
      PERMISSION_KEYS.MEDICINES_DELETE,
      PERMISSION_KEYS.MEDICINES_STOCK_ADJUST,
    ],
  },
  categories: {
    title: "الفئات",
    titleEn: "Categories",
    permissions: [
      PERMISSION_KEYS.CATEGORIES_VIEW,
      PERMISSION_KEYS.CATEGORIES_CREATE,
      PERMISSION_KEYS.CATEGORIES_EDIT,
      PERMISSION_KEYS.CATEGORIES_DELETE,
    ],
  },
  customers: {
    title: "العملاء",
    titleEn: "Customers",
    permissions: [
      PERMISSION_KEYS.CUSTOMERS_VIEW,
      PERMISSION_KEYS.CUSTOMERS_CREATE,
      PERMISSION_KEYS.CUSTOMERS_EDIT,
      PERMISSION_KEYS.CUSTOMERS_DELETE,
    ],
  },
  orders: {
    title: "الطلبات",
    titleEn: "Orders",
    permissions: [
      PERMISSION_KEYS.ORDERS_VIEW,
      PERMISSION_KEYS.ORDERS_CREATE,
      PERMISSION_KEYS.ORDERS_EDIT,
      PERMISSION_KEYS.ORDERS_DELETE,
      PERMISSION_KEYS.ORDERS_APPROVE,
      PERMISSION_KEYS.ORDERS_EXPORT,
    ],
  },
  inventory: {
    title: "المخزون",
    titleEn: "Inventory",
    permissions: [
      PERMISSION_KEYS.INVENTORY_VIEW,
      PERMISSION_KEYS.INVENTORY_CREATE,
      PERMISSION_KEYS.INVENTORY_EDIT,
      PERMISSION_KEYS.INVENTORY_DELETE,
      PERMISSION_KEYS.INVENTORY_STOCK_ADJUST,
    ],
  },
  suppliers: {
    title: "الموردون",
    titleEn: "Suppliers",
    permissions: [
      PERMISSION_KEYS.SUPPLIERS_VIEW,
      PERMISSION_KEYS.SUPPLIERS_CREATE,
      PERMISSION_KEYS.SUPPLIERS_EDIT,
      PERMISSION_KEYS.SUPPLIERS_DELETE,
    ],
  },
  purchase_orders: {
    title: "أوامر الشراء",
    titleEn: "Purchase Orders",
    permissions: [
      PERMISSION_KEYS.PURCHASE_ORDERS_VIEW,
      PERMISSION_KEYS.PURCHASE_ORDERS_CREATE,
      PERMISSION_KEYS.PURCHASE_ORDERS_EDIT,
      PERMISSION_KEYS.PURCHASE_ORDERS_APPROVE,
    ],
  },
  reports: {
    title: "التقارير",
    titleEn: "Reports",
    permissions: [
      PERMISSION_KEYS.REPORTS_VIEW,
      PERMISSION_KEYS.REPORTS_SALES,
      PERMISSION_KEYS.REPORTS_INVENTORY,
      PERMISSION_KEYS.REPORTS_FINANCIAL,
    ],
  },
  accounting: {
    title: "المحاسبة",
    titleEn: "Accounting",
    permissions: [
      PERMISSION_KEYS.ACCOUNTING_VIEW,
      PERMISSION_KEYS.ACCOUNTING_CREATE,
      PERMISSION_KEYS.ACCOUNTING_EDIT,
      PERMISSION_KEYS.INVOICES_VIEW,
      PERMISSION_KEYS.EXPENSES_VIEW,
    ],
  },
  team: {
    title: "الفريق",
    titleEn: "Team",
    permissions: [
      PERMISSION_KEYS.TEAM_VIEW,
      PERMISSION_KEYS.TEAM_CREATE,
      PERMISSION_KEYS.TEAM_EDIT,
      PERMISSION_KEYS.TEAM_DELETE,
    ],
  },
  roles: {
    title: "الأدوار",
    titleEn: "Roles",
    permissions: [
      PERMISSION_KEYS.ROLES_VIEW,
      PERMISSION_KEYS.ROLES_CREATE,
      PERMISSION_KEYS.ROLES_EDIT,
      PERMISSION_KEYS.ROLES_MANAGE_PERMISSIONS,
    ],
  },
  system: {
    title: "النظام",
    titleEn: "System",
    permissions: [
      PERMISSION_KEYS.SETTINGS_VIEW,
      PERMISSION_KEYS.SETTINGS_EDIT,
      PERMISSION_KEYS.AUDIT_LOGS_VIEW,
      PERMISSION_KEYS.DASHBOARD_VIEW,
    ],
  },
} as const;

export type PermissionGroup =
  (typeof PERMISSION_GROUPS)[keyof typeof PERMISSION_GROUPS];

/**
 * Helper to format permission keys cleanly in Arabic (e.g., "orders:list:view" -> "عرض قائمة الطلبات")
 */
export const formatPermissionName = (key: string) => {
  const parts = key.split(":");
  if (parts.length === 3) {
    const module = parts[0].replace(/_/g, " ");
    const actionMap: Record<string, string> = {
      view: "عرض",
      create: "إنشاء",
      edit: "تعديل",
      delete: "حذف",
      approve: "موافقة",
      export: "تصدير",
      adjust: "تعديل",
      manage: "إدارة",
    };
    const screenMap: Record<string, string> = {
      list: "قائمة",
      detail: "تفاصيل",
      stock: "المخزون",
      sales: "المبيعات",
      inventory: "المخزون",
      financial: "المالية",
      general: "عام",
      overview: "نظرة عامة",
    };

    const action = actionMap[parts[2]] || parts[2];
    const screen = screenMap[parts[1]] || parts[1];

    const moduleMap: Record<string, string> = {
      medicines: "الأدوية",
      categories: "الفئات",
      customers: "العملاء",
      orders: "الطلبات",
      inventory: "المخزون",
      suppliers: "الموردون",
      "purchase orders": "أوامر الشراء",
      reports: "التقارير",
      accounting: "المحاسبة",
      invoices: "الفواتير",
      expenses: "المصروفات",
      settings: "الإعدادات",
      team: "الفريق",
      roles: "الأدوار",
      "audit logs": "سجلات التدقيق",
      dashboard: "لوحة التحكم",
    };

    const moduleName = moduleMap[module] || module;

    if (screen === "قائمة" && action === "عرض") {
      return `عرض قائمة ${moduleName}`;
    } else if (screen === "قائمة") {
      return `${action} قائمة ${moduleName}`;
    } else if (screen === "تفاصيل") {
      return `${action} تفاصيل ${moduleName}`;
    } else if (screen === "المخزون") {
      return `${action} مخزون ${moduleName}`;
    } else {
      return `${action} ${screen} ${moduleName}`;
    }
  }
  return key; // Fallback
};
