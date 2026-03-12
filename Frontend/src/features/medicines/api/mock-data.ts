import type { Medicine } from "../types";

export const mockMedicines: Medicine[] = [
  // Pain Relief & Anti-inflammatory
  {
    id: "1",
    name: "بانادول اكسترا",
    code: "MED001",
    category: "مسكنات",
    description: "مسكن للألم وخافض للحرارة",
    basePrice: 25.5,
    cost: 18.75,
    unit: "علبة",
    minStock: 10,
    variants: [
      {
        id: "v1-1",
        price: 25.5,
        cost: 18.75,
        stock: 50,
        expiryDate: "2025-12-31",
        batchNumber: "B001",
      },
      {
        id: "v1-2",
        price: 26.0,
        cost: 19.2,
        stock: 30,
        expiryDate: "2026-03-15",
        batchNumber: "B002",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-10T15:30:00Z",
  },
  {
    id: "2",
    name: "أدفيل",
    code: "MED002",
    category: "مسكنات",
    description: "مسكن قوي للآلام",
    basePrice: 28.75,
    cost: 21.5,
    unit: "عبوة",
    minStock: 8,
    variants: [
      {
        id: "v2-1",
        price: 28.75,
        cost: 21.5,
        stock: 40,
        expiryDate: "2025-10-20",
        batchNumber: "A001",
      },
    ],
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-03-12T11:45:00Z",
  },
  {
    id: "3",
    name: "أسبيرين",
    code: "MED003",
    category: "مسكنات",
    description: "مضاد للالتهاب ومميع للدم",
    basePrice: 15.25,
    cost: 11.8,
    unit: "علبة",
    minStock: 15,
    variants: [
      {
        id: "v3-1",
        price: 15.25,
        cost: 11.8,
        stock: 80,
        expiryDate: "2026-01-10",
        batchNumber: "ASP001",
      },
      {
        id: "v3-2",
        price: 16.0,
        cost: 12.4,
        stock: 25,
        expiryDate: "2026-06-30",
        batchNumber: "ASP002",
      },
    ],
    createdAt: "2024-02-01T14:20:00Z",
    updatedAt: "2024-03-11T16:00:00Z",
  },
  {
    id: "4",
    name: "بروفين",
    code: "MED004",
    category: "مسكنات",
    description: "مسكن ومضاد للالتهاب",
    basePrice: 22.0,
    cost: 16.25,
    unit: "علبة",
    minStock: 12,
    variants: [
      {
        id: "v4-1",
        price: 22.0,
        cost: 16.25,
        stock: 35,
        expiryDate: "2025-11-15",
        batchNumber: "PRO001",
      },
    ],
    createdAt: "2024-02-10T08:30:00Z",
    updatedAt: "2024-03-09T12:15:00Z",
  },
  {
    id: "5",
    name: "فولتارين",
    code: "MED005",
    category: "مسكنات",
    description: "مسكن قوي لآلام المفاصل",
    basePrice: 35.5,
    cost: 28.9,
    unit: "شريط",
    minStock: 6,
    variants: [
      {
        id: "v5-1",
        price: 35.5,
        cost: 28.9,
        stock: 20,
        expiryDate: "2025-09-30",
        batchNumber: "VOL001",
      },
      {
        id: "v5-2",
        price: 36.25,
        cost: 29.5,
        stock: 0, // Empty batch - can be deleted
        expiryDate: "2024-12-31", // Expired
        batchNumber: "VOL002",
      },
    ],
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-03-13T10:30:00Z",
  },
  {
    id: "6",
    name: "أوجمنتين",
    code: "MED009",
    category: "مضادات حيوية",
    description: "مضاد حيوي واسع المدى",
    basePrice: 45.0,
    cost: 35.2,
    unit: "علبة",
    minStock: 8,
    variants: [
      {
        id: "v6-1",
        price: 45.0,
        cost: 35.2,
        stock: 25,
        expiryDate: "2025-08-20",
        batchNumber: "AUG001",
      },
    ],
    createdAt: "2024-01-25T13:45:00Z",
    updatedAt: "2024-03-14T09:20:00Z",
  },
  {
    id: "7",
    name: "زيثروماكس",
    code: "MED010",
    category: "مضادات حيوية",
    description: "مضاد حيوي فعال",
    basePrice: 52.75,
    cost: 41.3,
    unit: "عبوة",
    minStock: 5,
    variants: [
      {
        id: "v7-1",
        price: 52.75,
        cost: 41.3,
        stock: 18,
        expiryDate: "2025-12-10",
        batchNumber: "ZTH001",
      },
      {
        id: "v7-2",
        price: 54.0,
        cost: 42.5,
        stock: 12,
        expiryDate: "2026-04-15",
        batchNumber: "ZTH002",
      },
    ],
    createdAt: "2024-02-05T10:15:00Z",
    updatedAt: "2024-03-12T14:40:00Z",
  },
  {
    id: "8",
    name: "أموكسيسيلين",
    code: "MED011",
    category: "مضادات حيوية",
    description: "مضاد حيوي شائع الاستخدام",
    basePrice: 18.5,
    cost: 14.2,
    unit: "علبة",
    minStock: 20,
    variants: [
      {
        id: "v8-1",
        price: 18.5,
        cost: 14.2,
        stock: 0, // Empty batch - can be deleted
        expiryDate: "2024-06-30", // Expired
        batchNumber: "AMX001",
      },
      {
        id: "v8-2",
        price: 19.0,
        cost: 14.8,
        stock: 0, // Empty batch - can be deleted
        expiryDate: "2024-08-15", // Expired
        batchNumber: "AMX002",
      },
    ],
    createdAt: "2024-02-20T15:30:00Z",
    updatedAt: "2024-03-11T11:25:00Z",
  },
  {
    id: "9",
    name: "أوميبرازول",
    code: "MED023",
    category: "مضادات حموضة",
    description: "علاج للحموضة والقرحة",
    basePrice: 32.25,
    cost: 24.8,
    unit: "عبوة",
    minStock: 10,
    variants: [
      {
        id: "v9-1",
        price: 32.25,
        cost: 24.8,
        stock: 30,
        expiryDate: "2025-11-30",
        batchNumber: "OMZ001",
      },
      {
        id: "v9-2",
        price: 33.5,
        cost: 25.9,
        stock: 20,
        expiryDate: "2026-05-20",
        batchNumber: "OMZ002",
      },
    ],
    createdAt: "2024-01-30T12:00:00Z",
    updatedAt: "2024-03-13T16:15:00Z",
  },
  {
    id: "10",
    name: "ميتفورمين",
    code: "MED035",
    category: "سكري",
    description: "علاج لمرض السكري من النوع 2",
    basePrice: 28.0,
    cost: 19.5,
    unit: "علبة",
    minStock: 15,
    variants: [
      {
        id: "v10-1",
        price: 28.0,
        cost: 19.5,
        stock: 45,
        expiryDate: "2025-12-25",
        batchNumber: "MET001",
      },
      {
        id: "v10-2",
        price: 28.5,
        cost: 20.0,
        stock: 0, // Empty batch - can be deleted
        expiryDate: "2024-09-30", // Expired
        batchNumber: "MET002",
      },
      {
        id: "v10-3",
        price: 29.0,
        cost: 20.5,
        stock: 25,
        expiryDate: "2026-03-15",
        batchNumber: "MET003",
      },
    ],
    createdAt: "2024-02-25T09:45:00Z",
    updatedAt: "2024-03-14T13:30:00Z",
  },
];

// Test medicines for delete dialog scenarios
export const testMedicinesForDelete = [
  // Medicine with mixed batches (some with stock, some empty)
  {
    id: "test-1",
    name: "بانادول اختبار مختلط",
    code: "TEST001",
    category: "مسكنات",
    description: "دواء اختبار به batches مختلطة",
    basePrice: 25.5,
    cost: 18.75,
    unit: "علبة",
    minStock: 10,
    variants: [
      {
        id: "test-1-v1",
        price: 25.5,
        cost: 18.75,
        stock: 50, // Has stock - cannot delete
        expiryDate: "2025-12-31",
        batchNumber: "MIX001",
      },
      {
        id: "test-1-v2",
        price: 26.0,
        cost: 19.2,
        stock: 0, // Empty - can delete
        expiryDate: "2024-03-15", // Expired
        batchNumber: "MIX002",
      },
      {
        id: "test-1-v3",
        price: 27.0,
        cost: 20.5,
        stock: 25, // Has stock - cannot delete
        expiryDate: "2026-06-30",
        batchNumber: "MIX003",
      },
      {
        id: "test-1-v4",
        price: 24.5,
        cost: 18.0,
        stock: 0, // Empty - can delete
        expiryDate: "2026-01-15",
        batchNumber: "MIX004",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-10T15:30:00Z",
  },

  // Medicine with only empty batches (all can be deleted)
  {
    id: "test-2",
    name: "أدفيل اختبار فارغ",
    code: "TEST002",
    category: "مسكنات",
    description: "دواء اختبار به batches فارغة فقط",
    basePrice: 28.75,
    cost: 21.5,
    unit: "عبوة",
    minStock: 8,
    variants: [
      {
        id: "test-2-v1",
        price: 28.75,
        cost: 21.5,
        stock: 0, // Empty - can delete
        expiryDate: "2024-02-28", // Expired
        batchNumber: "EMP001",
      },
      {
        id: "test-2-v2",
        price: 29.0,
        cost: 22.0,
        stock: 0, // Empty - can delete
        expiryDate: "2024-12-31", // Will expire soon
        batchNumber: "EMP002",
      },
      {
        id: "test-2-v3",
        price: 30.0,
        cost: 23.5,
        stock: 0, // Empty - can delete
        expiryDate: "2026-08-15",
        batchNumber: "EMP003",
      },
    ],
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-03-12T11:45:00Z",
  },

  // Medicine with only batches with stock (none can be deleted)
  {
    id: "test-3",
    name: "أسبيرين اختبار ممتلئ",
    code: "TEST003",
    category: "مسكنات",
    description: "دواء اختبار به batches ممتلئة فقط",
    basePrice: 15.25,
    cost: 11.8,
    unit: "علبة",
    minStock: 15,
    variants: [
      {
        id: "test-3-v1",
        price: 15.25,
        cost: 11.8,
        stock: 80, // Has stock - cannot delete
        expiryDate: "2026-01-10",
        batchNumber: "FULL001",
      },
      {
        id: "test-3-v2",
        price: 16.0,
        cost: 12.4,
        stock: 45, // Has stock - cannot delete
        expiryDate: "2026-06-30",
        batchNumber: "FULL002",
      },
      {
        id: "test-3-v3",
        price: 15.75,
        cost: 12.0,
        stock: 120, // Has stock - cannot delete
        expiryDate: "2025-11-20",
        batchNumber: "FULL003",
      },
    ],
    createdAt: "2024-02-01T14:20:00Z",
    updatedAt: "2024-03-11T16:00:00Z",
  },

  // Medicine with single empty batch
  {
    id: "test-4",
    name: "بروفين اختبار منفرد",
    code: "TEST004",
    category: "مسكنات",
    description: "دواء اختبار به batch واحدة فارغة",
    basePrice: 22.0,
    cost: 16.25,
    unit: "علبة",
    minStock: 12,
    variants: [
      {
        id: "test-4-v1",
        price: 22.0,
        cost: 16.25,
        stock: 0, // Empty - can delete
        expiryDate: "2024-01-31", // Expired
        batchNumber: "SINGLE001",
      },
    ],
    createdAt: "2024-02-10T08:30:00Z",
    updatedAt: "2024-03-09T12:15:00Z",
  },

  // Medicine with no batches (edge case)
  {
    id: "test-5",
    name: "فولتارين اختبار فارغ",
    code: "TEST005",
    category: "مسكنات",
    description: "دواء اختبار بدون أي batches",
    basePrice: 35.5,
    cost: 28.9,
    unit: "شريط",
    minStock: 6,
    variants: [], // No variants at all
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-03-13T10:30:00Z",
  },

  // Medicine with many mixed batches for testing scroll
  {
    id: "test-6",
    name: "أوجمنتين اختبار طويل",
    code: "TEST006",
    category: "مضادات حيوية",
    description: "دواء اختبار به الكثير من_batches",
    basePrice: 45.0,
    cost: 35.2,
    unit: "علبة",
    minStock: 8,
    variants: [
      // Batches with stock
      {
        id: "test-6-v1",
        price: 45.0,
        cost: 35.2,
        stock: 30,
        expiryDate: "2025-08-20",
        batchNumber: "LONG001",
      },
      {
        id: "test-6-v2",
        price: 46.0,
        cost: 36.0,
        stock: 0, // Empty
        expiryDate: "2024-03-31", // Expired
        batchNumber: "LONG002",
      },
      {
        id: "test-6-v3",
        price: 44.5,
        cost: 34.8,
        stock: 25,
        expiryDate: "2026-02-15",
        batchNumber: "LONG003",
      },
      {
        id: "test-6-v4",
        price: 47.0,
        cost: 37.2,
        stock: 0, // Empty
        expiryDate: "2024-12-31",
        batchNumber: "LONG004",
      },
      {
        id: "test-6-v5",
        price: 45.5,
        cost: 35.8,
        stock: 40,
        expiryDate: "2026-07-30",
        batchNumber: "LONG005",
      },
      {
        id: "test-6-v6",
        price: 48.0,
        cost: 38.0,
        stock: 0, // Empty
        expiryDate: "2025-09-15",
        batchNumber: "LONG006",
      },
      {
        id: "test-6-v7",
        price: 46.5,
        cost: 36.8,
        stock: 15,
        expiryDate: "2026-04-20",
        batchNumber: "LONG007",
      },
      {
        id: "test-6-v8",
        price: 44.0,
        cost: 34.5,
        stock: 0, // Empty
        expiryDate: "2024-06-30", // Expired
        batchNumber: "LONG008",
      },
    ],
    createdAt: "2024-01-25T13:45:00Z",
    updatedAt: "2024-03-14T09:20:00Z",
  },
];

// Generate additional medicines to reach a comprehensive sample size
const additionalMedicines = [
  // More Antibiotics
  "إريثروميسين",
  "كلينداميسين",
  "فانكومايسين",
  "ميترونيدازول",
  "تيتراسيكلين",
  "بنسيلين",
  "أمبيسيلين",
  "نافسيلين",
  "أوكزاسيلين",
  "ديكلوكساسين",
  "ميثيسيلين",
  "تيكارسيلين",

  // More Cardiovascular
  "أتورفاستاتين",
  "سيمفاستاتين",
  "روزوفاستاتين",
  "لوفاستاتين",
  "برافاستاتين",
  "نياسين",
  "فينوفايبريت",
  "جيمفيبروزيل",
  "كوليستيرامين",
  "كوليستيبول",
  "أليسكرين",
  "وارفارين",

  // More Gastrointestinal
  "سيميتيدين",
  "نيزاتيدين",
  "سوكرفالات",
  "ميزوبروستول",
  "أوميبرازول",
  "لانسوبرازول",
  "رابيبرازول",
  "إسوميبرازول",
  "ديكستروميثورفان",
  "لوبيراميد",
  "بسموث سبساليسيلات",

  // More Pain Relief
  "نابروكسين",
  "كيتورولاك",
  "ميلوكسيكام",
  "بيروكسيكام",
  "ديكلوفيناك",
  "إندوميثاسين",
  "نابوميتون",
  "سولينداك",
  "تولميتين",
  "فلوربيبروفين",
  "كيتوبروفين",
  "أوكسابروزين",

  // More Respiratory
  "سالبيوتامول",
  "تيربوتالين",
  "فينوتيرول",
  "فورموتيرول",
  "سالميتيرول",
  "إبراتروبيوم",
  "تيوتروبيوم",
  "أكليدينيوم",
  "جليكوبيرونيوم",
  "تيوفيلين",
  "أمينوفيلين",
  "مونتيلوكاست",

  // More Neuro/Psychiatric
  "ألبرازولام",
  "لورازيبام",
  "ديازيبام",
  "كلونازيبام",
  "تمازيبام",
  "أوكسازيبام",
  "كلونيدين",
  "بروبرانولول",
  "أميتريبتيلين",
  "نورتريبتيلين",
  "إيميبرامين",
  "ديسيبرامين",

  // More Endocrine
  "جليبيزيد",
  "جليبيزيد",
  "تولبوتاميد",
  "كلوربروباميد",
  "جليبوريد",
  "أكاربوز",
  "بيوجليتازون",
  "روجليتازون",
  "إكسيناتيد",
  "سيتاجليبتين",
  "فيلداجليبتين",
  "ليناجليبتين",

  // More Vitamins/Supplements
  "فيتامين أ",
  "فيتامين هـ",
  "فيتامين ك",
  "ثيامين",
  "ريبوفلافين",
  "نياسيناميد",
  "بيريدوكسين",
  "سيانوكوبالامين",
  "بيوتين",
  "بانتوثنيك أسيد",
  "كولين",
  "إينوزيتول",

  // More Dermatological
  "كينوكرين",
  "كبريتات زنك",
  "ساليسيليك أسيد",
  "ريزورسينول",
  "كالامين",
  "تلفا",
  "أكرتين",
  "أدابالين",
  "بنزويل بيروكسايد",
  "أزيليك أسيد",
  "كبريتات نحاس",
  "جنتيان فيوليت",

  // More Eye Medications
  "أتروبين",
  "تروبيكاميد",
  "سيكلوبنتولات",
  "هوماتروبين",
  "فينيليفرين",
  "تيمولول",
  "لاتانوبروست",
  "بيماتوبروست",
  "تافلوبروست",
  "بروبرانولول",
  "أسيكلوفير",
  "جنتاميسين",

  // More Pediatric
  "باراسيتامول شراب",
  "إيبوبروفين شراب",
  "أموكسيسيلين شراب",
  "أزيثروميسين شراب",
  "سيتالوبرام شراب",
  "فيتامين د قطرات",
  "فيتامين أ قطرات",
  "حديد قطرات",
  "زنك قطرات",
  "كالسيوم شراب",
  "مغنيسيوم شراب",
];

// Helper function to generate medicine codes
function generateMedicineCode(index: number): string {
  return `MED${String(index).padStart(3, "0")}`;
}

// Add codes to existing medicines (first 80)
for (let i = 0; i < mockMedicines.length; i++) {
  if (!mockMedicines[i].code) {
    mockMedicines[i].code = generateMedicineCode(i + 1);
  }
}

// Generate 20 additional medicines (IDs 81-100) - enough for 2 pages with 10 per page
for (let i = 0; i < 20; i++) {
  const medicineName = additionalMedicines[i];
  const categories = [
    "مضادات حيوية",
    "مسكنات",
    "ضغط دم",
    "سكري",
    "فيتامينات",
    "جلدية",
    "ربو",
    "قلب",
    "مكملات",
    "هرمونات",
  ];
  const dosageForms = [
    "أقراص",
    "كبسولات",
    "شراب",
    "حقن",
    "كريم",
    "مرهم",
    "قطرة",
    "بخاخ",
    "جل",
  ];

  mockMedicines.push({
    id: (81 + i).toString(),
    name: medicineName,
    code: generateMedicineCode(81 + i),
    category: categories[Math.floor(Math.random() * categories.length)],
    description: `وصف دواء ${medicineName}`,
    basePrice: Math.round((Math.random() * 100 + 10) * 100) / 100,
    cost: Math.round((Math.random() * 80 + 5) * 100) / 100,
    unit: dosageForms[Math.floor(Math.random() * dosageForms.length)],
    minStock: Math.floor(Math.random() * 20) + 5,
    variants: [
      {
        id: `v${81 + i}-1`,
        price: Math.round((Math.random() * 100 + 10) * 100) / 100,
        cost: Math.round((Math.random() * 80 + 5) * 100) / 100,
        stock: Math.floor(Math.random() * 100),
        expiryDate: new Date(
          2025 + Math.floor(Math.random() * 2),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split("T")[0],
        batchNumber: `BATCH${String(81 + i).padStart(3, "0")}-1`,
      },
      {
        id: `v${81 + i}-2`,
        price: Math.round((Math.random() * 100 + 10) * 100) / 100,
        cost: Math.round((Math.random() * 80 + 5) * 100) / 100,
        stock: Math.floor(Math.random() * 100),
        expiryDate: new Date(
          2025 + Math.floor(Math.random() * 2),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split("T")[0],
        batchNumber: `BATCH${String(81 + i).padStart(3, "0")}-2`,
      },
    ],
    createdAt: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toISOString(),
    updatedAt: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toISOString(),
  });
}
