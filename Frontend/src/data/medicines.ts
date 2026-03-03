// Shared medicines data for the entire application
export interface MedicineVariant {
  id: string;
  price: number;
  stock: number;
  expiryDate?: string;
  batchNumber?: string;
}

export interface Medicine {
  id: string;
  name: string;
  code?: string;
  category: string;
  description?: string;
  basePrice?: number; // السعر الأساسي للصنف
  cost?: number; // تكلفة الشراء الأساسية
  unit?: string; // الوحدة (مثال: علبة، زجاجة)
  minStock?: number; // الحد الأدنى للمخزون
  variants: MedicineVariant[];
}

// Consolidated medicines list from all features
export const medicines: Medicine[] = [
  // Pain Relief & Anti-inflammatory
  {
    id: "MED001",
    name: "بانادول 500مجم",
    code: "MED001",
    category: "مسكنات",
    description:
      "مسكن ألم وخافض حرارة، يستخدم لتخفيف الآلام الخفيفة إلى المتوسطة",
    basePrice: 30.0,
    cost: 25.0,
    unit: "علبة",
    minStock: 20,
    variants: [
      {
        id: "MED001-V1",
        price: 25.5,
        stock: 150,
        expiryDate: "04/26",
        batchNumber: "B001",
      },
      {
        id: "MED001-V2",
        price: 28.0,
        stock: 80,
        expiryDate: "12/26",
        batchNumber: "B002",
      },
    ],
  },
  {
    id: "MED002",
    name: "أدفيل",
    code: "MED002",
    category: "مسكنات",
    description: "مسكن ألم ومضاد التهاب، يستخدم لتخفيف الآلام والالتهابات",
    basePrice: 22.0,
    cost: 18.0,
    unit: "علبة",
    minStock: 15,
    variants: [
      {
        id: "MED002-V1",
        price: 18.0,
        stock: 89,
        expiryDate: "05/26",
        batchNumber: "B003",
      },
    ],
  },
  {
    id: "MED003",
    name: "أسبيرين",
    code: "MED003",
    category: "مسكنات",
    description: "مسكن ألم ومضاد التهاب، يمنع تكون جلطات الدم",
    basePrice: 18.0,
    cost: 15.5,
    unit: "علبة",
    minStock: 25,
    variants: [
      {
        id: "MED003-V1",
        price: 15.5,
        stock: 180,
        expiryDate: "03/26",
        batchNumber: "B004",
      },
      {
        id: "MED003-V2",
        price: 17.0,
        stock: 120,
        expiryDate: "09/26",
        batchNumber: "B005",
      },
    ],
  },
  {
    id: "MED004",
    name: "بروفين 200مجم",
    code: "MED004",
    category: "مسكنات",
    description: "مسكن ألم ومضاد التهاب، يستخدم لتخفيف الآلام والالتهابات",
    basePrice: 15.0,
    cost: 12.5,
    unit: "علبة",
    minStock: 30,
    variants: [
      {
        id: "MED004-V1",
        price: 12.5,
        stock: 200,
        expiryDate: "06/26",
        batchNumber: "B006",
      },
    ],
  },
  {
    id: "MED005",
    name: "أوجسيت 400مجم",
    code: "MED005",
    category: "مسكنات",
    description: "مسكن ألم قوي، يستخدم للآلام الشديدة",
    basePrice: 35.0,
    cost: 28.5,
    unit: "علبة",
    minStock: 10,
    variants: [
      {
        id: "MED005-V1",
        price: 28.5,
        stock: 140,
        expiryDate: "03/26",
        batchNumber: "B007",
      },
      {
        id: "MED005-V2",
        price: 32.0,
        stock: 60,
        expiryDate: "11/26",
        batchNumber: "B008",
      },
    ],
  },
  {
    id: "MED006",
    name: "كيتورول 50مجم",
    code: "MED006",
    category: "مسكنات",
    variants: [
      {
        id: "MED006-V1",
        price: 32.0,
        stock: 95,
        expiryDate: "04/26",
        batchNumber: "B009",
      },
    ],
  },
  {
    id: "MED007",
    name: "فولتارين 50مجم",
    code: "MED007",
    category: "مسكنات",
    variants: [
      {
        id: "MED007-V1",
        price: 55.0,
        stock: 78,
        expiryDate: "05/26",
        batchNumber: "B010",
      },
      {
        id: "MED007-V2",
        price: 58.0,
        stock: 45,
        expiryDate: "02/27",
        batchNumber: "B011",
      },
    ],
  },
  {
    id: "MED008",
    name: "أوجمنتين 1جم",
    code: "MED008",
    category: "مضادات حيوية",
    variants: [
      {
        id: "MED008-V1",
        price: 65.0,
        stock: 23,
        expiryDate: "03/26",
        batchNumber: "B012",
      },
    ],
  },
  {
    id: "MED009",
    name: "زيثروماكس",
    code: "MED009",
    category: "مضادات حيوية",
    variants: [
      {
        id: "MED009-V1",
        price: 35.0,
        stock: 67,
        expiryDate: "04/26",
        batchNumber: "B013",
      },
    ],
  },
  {
    id: "MED010",
    name: "أموكسيل 500مجم",
    code: "MED010",
    category: "مضادات حيوية",
    variants: [
      {
        id: "MED010-V1",
        price: 38.0,
        stock: 90,
        expiryDate: "06/26",
        batchNumber: "B014",
      },
      {
        id: "MED010-V2",
        price: 42.0,
        stock: 55,
        expiryDate: "01/27",
        batchNumber: "B015",
      },
    ],
  },
  {
    id: "MED011",
    name: "زيتامول 500مجم",
    category: "مضادات حيوية",
    variants: [
      {
        id: "MED011-V1",
        price: 48.0,
        stock: 65,
        expiryDate: "08/26",
        batchNumber: "B016",
      },
    ],
  },
  {
    id: "MED012",
    name: "أموكسيل 250مجم",
    category: "مضادات حيوية",
    variants: [
      {
        id: "MED012-V1",
        price: 22.0,
        stock: 140,
        expiryDate: "07/26",
        batchNumber: "B017",
      },
    ],
  },

  // Gastrointestinal
  {
    id: "MED013",
    name: "كونجستال",
    category: "أمراض معدية",
    variants: [
      {
        id: "MED013-V1",
        price: 28.0,
        stock: 34,
        expiryDate: "09/26",
        batchNumber: "B018",
      },
    ],
  },
  {
    id: "MED014",
    name: "موتيليوم",
    category: "غثيان",
    variants: [
      {
        id: "MED014-V1",
        price: 42.0,
        stock: 56,
        expiryDate: "10/26",
        batchNumber: "B019",
      },
    ],
  },
  {
    id: "MED015",
    name: "فاموتيدين",
    category: "منشطات حركة",
    variants: [
      {
        id: "MED015-V1",
        price: 22.0,
        stock: 120,
        expiryDate: "11/26",
        batchNumber: "B020",
      },
    ],
  },
  {
    id: "MED016",
    name: "أوميبرازول",
    category: "مضادات حموضة",
    variants: [
      {
        id: "MED016-V1",
        price: 15.0,
        stock: 85,
        expiryDate: "05/26",
        batchNumber: "B021",
      },
      {
        id: "MED016-V2",
        price: 18.0,
        stock: 40,
        expiryDate: "12/26",
        batchNumber: "B022",
      },
    ],
  },
  {
    id: "MED017",
    name: "بانتوبرازول",
    category: "مضادات حموضة",
    variants: [
      {
        id: "MED017-V1",
        price: 25.0,
        stock: 92,
        expiryDate: "06/26",
        batchNumber: "B023",
      },
    ],
  },
  {
    id: "MED018",
    name: "رانيتيدين",
    category: "مضادات حموضة",
    variants: [
      {
        id: "MED018-V1",
        price: 45.0,
        stock: 150,
        expiryDate: "07/26",
        batchNumber: "B024",
      },
    ],
  },
  {
    id: "MED019",
    name: "لانزوبرازول",
    category: "مضادات حموضة",
    variants: [
      {
        id: "MED019-V1",
        price: 18.0,
        stock: 75,
        expiryDate: "08/26",
        batchNumber: "B025",
      },
    ],
  },
  {
    id: "MED020",
    name: "سيتامول",
    category: "مزيلات احتقان",
    variants: [
      {
        id: "MED020-V1",
        price: 12.0,
        stock: 200,
        expiryDate: "09/26",
        batchNumber: "B026",
      },
    ],
  },
  {
    id: "MED021",
    name: "أكتيفيد",
    category: "مضادات هيستامين",
    variants: [
      {
        id: "MED021-V1",
        price: 8.0,
        stock: 60,
        expiryDate: "10/26",
        batchNumber: "B027",
      },
    ],
  },
  {
    id: "MED022",
    name: "زيرتيك",
    category: "مضادات هيستامين",
    variants: [
      {
        id: "MED022-V1",
        price: 25.0,
        stock: 45,
        expiryDate: "11/26",
        batchNumber: "B028",
      },
      {
        id: "MED022-V2",
        price: 28.0,
        stock: 30,
        expiryDate: "03/27",
        batchNumber: "B029",
      },
    ],
  },
  {
    id: "MED023",
    name: "أليرجيك",
    category: "مضادات هيستامين",
    variants: [
      {
        id: "MED023-V1",
        price: 2.0,
        stock: 30,
        expiryDate: "12/26",
        batchNumber: "B030",
      },
    ],
  },
  {
    id: "MED024",
    name: "لوزارتان",
    category: "ضغط دم",
    variants: [
      {
        id: "MED024-V1",
        price: 50.0,
        stock: 40,
        expiryDate: "01/27",
        batchNumber: "B031",
      },
    ],
  },
  {
    id: "MED025",
    name: "أموديبيين",
    category: "ضغط دم",
    variants: [
      {
        id: "MED025-V1",
        price: 5.0,
        stock: 35,
        expiryDate: "02/27",
        batchNumber: "B032",
      },
    ],
  },
  {
    id: "MED026",
    name: "إنالابريل",
    category: "ضغط دم",
    variants: [
      {
        id: "MED026-V1",
        price: 10.0,
        stock: 25,
        expiryDate: "03/27",
        batchNumber: "B033",
      },
    ],
  },
  {
    id: "MED027",
    name: "أتينولول",
    category: "ضغط دم",
    variants: [
      {
        id: "MED027-V1",
        price: 50.0,
        stock: 20,
        expiryDate: "04/27",
        batchNumber: "B034",
      },
    ],
  },
  {
    id: "MED028",
    name: "بروبرانولول",
    category: "ضغط دم",
    variants: [
      {
        id: "MED028-V1",
        price: 40.0,
        stock: 15,
        expiryDate: "05/27",
        batchNumber: "B035",
      },
    ],
  },
  {
    id: "MED029",
    name: "كابتوبريل",
    category: "سكري",
    variants: [
      {
        id: "MED029-V1",
        price: 8.0,
        stock: 180,
        expiryDate: "06/27",
        batchNumber: "B036",
      },
    ],
  },
  {
    id: "MED030",
    name: "إنسولين",
    category: "سكري",
    variants: [
      {
        id: "MED030-V1",
        price: 15.0,
        stock: 220,
        expiryDate: "07/27",
        batchNumber: "B037",
      },
      {
        id: "MED030-V2",
        price: 18.0,
        stock: 150,
        expiryDate: "01/28",
        batchNumber: "B038",
      },
    ],
  },
  {
    id: "MED031",
    name: "جليكلازيد",
    category: "سكري",
    variants: [
      {
        id: "MED031-V1",
        price: 80.0,
        stock: 45,
        expiryDate: "08/27",
        batchNumber: "B039",
      },
    ],
  },
  {
    id: "MED032",
    name: "لانتوس",
    category: "سكري",
    variants: [
      {
        id: "MED032-V1",
        price: 25.0,
        stock: 90,
        expiryDate: "09/27",
        batchNumber: "B040",
      },
    ],
  },
  {
    id: "MED033",
    name: "همالوج",
    category: "سكري",
    variants: [
      {
        id: "MED033-V1",
        price: 12.0,
        stock: 160,
        expiryDate: "10/27",
        batchNumber: "B041",
      },
    ],
  },
  {
    id: "MED034",
    name: "نوفورابيد",
    category: "سكري",
    variants: [
      {
        id: "MED034-V1",
        price: 35.0,
        stock: 70,
        expiryDate: "11/27",
        batchNumber: "B042",
      },
    ],
  },
  {
    id: "MED035",
    name: "أسبارت",
    category: "سكري",
    variants: [
      {
        id: "MED035-V1",
        price: 20.0,
        stock: 100,
        expiryDate: "12/27",
        batchNumber: "B043",
      },
    ],
  },
  {
    id: "MED036",
    name: "تراميكون",
    category: "سكري",
    variants: [
      {
        id: "MED036-V1",
        price: 45.0,
        stock: 55,
        expiryDate: "01/28",
        batchNumber: "B044",
      },
    ],
  },
  {
    id: "MED037",
    name: "ليفيمير",
    category: "سكري",
    variants: [
      {
        id: "MED037-V1",
        price: 30.0,
        stock: 80,
        expiryDate: "02/28",
        batchNumber: "B045",
      },
    ],
  },
  {
    id: "MED038",
    name: "جلاربيكليد",
    category: "سكري",
    variants: [
      {
        id: "MED038-V1",
        price: 55.0,
        stock: 40,
        expiryDate: "03/28",
        batchNumber: "B046",
      },
    ],
  },
  {
    id: "MED039",
    name: "توفيل",
    category: "سكري",
    variants: [
      {
        id: "MED039-V1",
        price: 8.0,
        stock: 120,
        expiryDate: "04/28",
        batchNumber: "B047",
      },
    ],
  },
  {
    id: "MED040",
    name: "لانتوس إكسترا",
    category: "سكري",
    variants: [
      {
        id: "MED040-V1",
        price: 15.0,
        stock: 85,
        expiryDate: "05/28",
        batchNumber: "B048",
      },
    ],
  },
];
