// Categories data types and interfaces
import type { Medicine } from "./medicines";

export interface Category {
  categoryId: string;
  categoryName: string;
  description: string;
  totalItems: number;
  items: Medicine[];
  isActive: boolean;
}

export interface CategoryFormData {
  categoryName: string;
  description: string;
}

// Sample categories data
export const categories: Category[] = [
  {
    categoryId: "CAT-001",
    categoryName: "مسكنات",
    description: "أدوية لتخفيف الألم وخفض الحرارة",
    totalItems: 7,
    items: [], // Will be populated from medicines data
    isActive: true,
  },
  {
    categoryId: "CAT-002",
    categoryName: "مضادات حيوية",
    description: "أدوية لعلاج العدوى البكتيرية",
    totalItems: 5,
    items: [], // Will be populated from medicines data
    isActive: false,
  },
  {
    categoryId: "CAT-003",
    categoryName: "مضادات حموضة",
    description: "أدوية لعلاج حموضة المعدة والارتجاع",
    totalItems: 0,
    items: [], // Will be populated from medicines data
    isActive: true,
  },
  {
    categoryId: "CAT-004",
    categoryName: "أمراض معدية",
    description: "أدوية لعلاج الأمراض المعدية والطفيليات",
    totalItems: 1,
    items: [], // Will be populated from medicines data
    isActive: false,
  },
  {
    categoryId: "CAT-005",
    categoryName: "غثيان",
    description: "أدوية لعلاج الغثيان والقيء",
    totalItems: 0,
    items: [], // Will be populated from medicines data
    isActive: false,
  },
  {
    categoryId: "CAT-006",
    categoryName: "منشطات حركة",
    description: "أدوية لتنشيط حركة الجهاز الهضمي",
    totalItems: 1,
    items: [], // Will be populated from medicines data
    isActive: true,
  },
  {
    categoryId: "CAT-007",
    categoryName: "مزيلات احتقان",
    description: "أدوية لتخفيف احتقان الأنف والجيوب الأنفية",
    totalItems: 0,
    items: [], // Will be populated from medicines data
    isActive: true,
  },
  {
    categoryId: "CAT-008",
    categoryName: "مضادات هيستامين",
    description: "أدوية لعلاج الحساسية والحكة",
    totalItems: 3,
    items: [], // Will be populated from medicines data
    isActive: false,
  },
  {
    categoryId: "CAT-009",
    categoryName: "ضغط دم",
    description: "أدوية لعلاج ارتفاع ضغط الدم",
    totalItems: 5,
    items: [], // Will be populated from medicines data
    isActive: true,
  },
  {
    categoryId: "CAT-010",
    categoryName: "سكري",
    description: "أدوية لعلاج مرض السكري",
    totalItems: 0,
    items: [], // Will be populated from medicines data
    isActive: false,
  },
];
