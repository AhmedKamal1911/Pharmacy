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
  // Additional categories for comprehensive testing
  {
    categoryId: "CAT-011",
    categoryName: "فيتامينات ومكملات",
    description: "فيتامينات ومكملات غذائية",
    totalItems: 8,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-012",
    categoryName: "جلدية",
    description: "أدوية علاج الأمراض الجلدية",
    totalItems: 4,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-013",
    categoryName: "قلب وأوعية دموية",
    description: "أدوية أمراض القلب والأوعية الدموية",
    totalItems: 6,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-014",
    categoryName: "جهاز تنفس",
    description: "أدوية علاج أمراض الجهاز التنفسي",
    totalItems: 3,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-015",
    categoryName: "عظام ومفاصل",
    description: "أدوية علاج أمراض العظام والمفاصل",
    totalItems: 2,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-016",
    categoryName: "عصبية ونفسية",
    description: "أدوية علاج الأمراض العصبية والنفسية",
    totalItems: 7,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-017",
    categoryName: "هرمونات",
    description: "أدوية هرمونية وغدد صماء",
    totalItems: 4,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-018",
    categoryName: "أمراض نساء",
    description: "أدوية أمراض النساء والتوليد",
    totalItems: 5,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-019",
    categoryName: "أطفال",
    description: "أدوية الأطفال والرضع",
    totalItems: 6,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-020",
    categoryName: "عيون",
    description: "أدوية علاج أمراض العيون",
    totalItems: 3,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-021",
    categoryName: "أذن وأنف وحنجرة",
    description: "أدوية علاج أمراض الأذن والأنف والحنجرة",
    totalItems: 4,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-022",
    categoryName: "كلى ومسالك بولية",
    description: "أدوية علاج أمراض الكلى والمسالك البولية",
    totalItems: 2,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-023",
    categoryName: "جهاز هضمي",
    description: "أدوية علاج أمراض الجهاز الهضمي",
    totalItems: 8,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-024",
    categoryName: "أمراض مناعية",
    description: "أدوية علاج أمراض المناعة",
    totalItems: 1,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-025",
    categoryName: "تخدير وعمليات",
    description: "أدوية التخدير والعمليات الجراحية",
    totalItems: 3,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-026",
    categoryName: "سوائل وحقن",
    description: "سوائل وريدية وحقن طبية",
    totalItems: 5,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-027",
    categoryName: "مطهرات ومعقمات",
    description: "مطهرات ومعقمات طبية",
    totalItems: 4,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-028",
    categoryName: "أورام",
    description: "أدوية علاج الأورام والسرطان",
    totalItems: 2,
    items: [],
    isActive: false,
  },
  {
    categoryId: "CAT-029",
    categoryName: "ألم مزمن",
    description: "أدوية علاج الآلام المزمنة",
    totalItems: 3,
    items: [],
    isActive: true,
  },
  {
    categoryId: "CAT-030",
    categoryName: "إسعافات أولية",
    description: "مواد وأدوية الإسعافات الأولية",
    totalItems: 6,
    items: [],
    isActive: true,
  },
];
