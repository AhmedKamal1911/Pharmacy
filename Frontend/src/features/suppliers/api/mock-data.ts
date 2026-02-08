import type { Supplier, SupplierDebitStatus } from "../types";

// Function to generate short name from supplier name
function generateShortName(name: string): string {
  // Remove common prefixes and get the main words
  const cleanName = name
    .replace(/^(شركة|مؤسسة|مجموعة|مخزن)\s+/i, "")
    .replace(
      /\s+(للتجارة|للخدمات|للإمدادات|للتوريدات|للدواء|الطبية|للصناعة|للنقل|للتوزيع|للاستثمار)$/i,
      "",
    );

  // Get the first letters of each word
  const words = cleanName.trim().split(/\s+/);
  const letters = words.map((word) => {
    // Get the first letter, handling Arabic letters
    const firstChar = word.charAt(0);
    // Convert to uppercase Latin equivalent for common Arabic letters
    const arabicToLatin: Record<string, string> = {
      ا: "A",
      أ: "A",
      إ: "A",
      آ: "A",
      ب: "B",
      ت: "T",
      ث: "TH",
      ج: "J",
      ح: "H",
      خ: "KH",
      د: "D",
      ذ: "DH",
      ر: "R",
      ز: "Z",
      س: "S",
      ش: "SH",
      ص: "S",
      ض: "DH",
      ط: "T",
      ظ: "DH",
      ع: "A",
      غ: "GH",
      ف: "F",
      ق: "Q",
      ك: "K",
      ل: "L",
      م: "M",
      ن: "N",
      ه: "H",
      و: "W",
      ي: "Y",
      ى: "A",
    };
    return arabicToLatin[firstChar] || firstChar.toUpperCase();
  });

  // Return first 3 letters or all if less than 3
  return letters.slice(0, 3).join("");
}

export const mockSuppliers: Supplier[] = [
  {
    id: "1",
    short: "MAU",
    name: "مؤسسة الأدوية المتحدة",
    supplierType: "COMPANY",
    debit: 15000,
    debitStatus: "DUE",
    paymentPeriodMonths: 3,
    landlinePhone: "0123456789",
    mobilePhone: "0109876543",
    settlementDate: "2024-01-15",
    checksDueDate: "2024-02-15",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    short: "MAM",
    name: "مستودع الأدوية المركزي",
    supplierType: "WAREHOUSE",
    debit: 25000,
    debitStatus: "OVERDUE",
    paymentPeriodMonths: 6,
    landlinePhone: "0123456789",
    mobilePhone: "0109876543",
    settlementDate: "2024-01-20",
    checksDueDate: "2024-02-20",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    short: "AMA",
    name: "أحمد محمد العلي",
    supplierType: "PERSON",
    debit: 5000,
    debitStatus: "PAID",
    paymentPeriodMonths: 1,
    mobilePhone: "0501234567",
    settlementDate: "2024-01-10",
    checksDueDate: "2024-02-10",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    short: "SNT",
    name: "شركة النور للتجارة",
    supplierType: "COMPANY",
    debit: 30000,
    debitStatus: "OVERDUE",
    paymentPeriodMonths: 4,
    landlinePhone: "0112345678",
    mobilePhone: "0123456789",
    settlementDate: "2024-01-25",
    checksDueDate: "2024-02-25",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "5",
    short: "MAS",
    name: "مخزن الأدوية الشامل",
    supplierType: "WAREHOUSE",
    debit: 18000,
    debitStatus: "DUE",
    paymentPeriodMonths: 2,
    landlinePhone: "0134567890",
    mobilePhone: "0145678901",
    settlementDate: "2024-01-18",
    checksDueDate: "2024-02-18",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

// Generate additional suppliers to reach a good sample size
const firstNames = [
  "أحمد",
  "محمد",
  "عبدالله",
  "عبدالرحمن",
  "خالد",
  "سعود",
  "فيصل",
  "تركي",
  "نايف",
  "بندر",
  "سلطان",
  "عمر",
  "علي",
  "حسن",
  "إبراهيم",
  "يوسف",
  "محمود",
  "عبدالعزيز",
  "سعد",
  "ناصر",
  "فهد",
  "مشاري",
  "راشد",
  "طلال",
];

const lastNames = [
  "العلي",
  "السعيد",
  "الرشيد",
  "القحطاني",
  "العنزي",
  "الشمري",
  "الدوسري",
  "الغامدي",
  "العتيبي",
  "الحربي",
  "المالكي",
  "الشهراني",
  "البداح",
  "السبيعي",
];

const companyNames = ["شركة", "مؤسسة", "مجموعة", "شركة", "مؤسسة", "مجموعة"];

const companySuffixes = [
  "للتجارة",
  "للخدمات",
  "للإمدادات",
  "للتوريدات",
  "للدواء",
  "الطبية",
  "للصناعة",
  "للنقل",
  "للتوزيع",
  "للاستثمار",
];

function generateRandomSupplier(id: string): Supplier {
  const isCompany = Math.random() > 0.4;
  const isWarehouse = Math.random() > 0.8;

  let supplierType: "PERSON" | "COMPANY" | "WAREHOUSE";
  let name: string;

  if (isWarehouse) {
    supplierType = "WAREHOUSE";
    name = `مخزن ${companyNames[Math.floor(Math.random() * companyNames.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
  } else if (isCompany) {
    supplierType = "COMPANY";
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    name = `${companyNames[Math.floor(Math.random() * companyNames.length)]} ${firstName} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
  } else {
    supplierType = "PERSON";
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    name = `${firstName} ${lastName}`;
  }

  const landlinePhone = `01${Math.floor(Math.random() * 90000000) + 10000000}`;
  const mobilePhone = `05${Math.floor(Math.random() * 90000000) + 10000000}`;

  const debit = Math.floor(Math.random() * 50000 + 1000);
  const paymentPeriodMonths = Math.floor(Math.random() * 12) + 1;

  // Generate random debit status
  const debitStatuses: SupplierDebitStatus[] = ["PAID", "DUE", "OVERDUE"];
  const debitStatus =
    debitStatuses[Math.floor(Math.random() * debitStatuses.length)];

  const daysAgo = Math.floor(Math.random() * 30);
  const settlementDate = new Date();
  settlementDate.setDate(settlementDate.getDate() - daysAgo);

  const checksDueDate = new Date(settlementDate);
  checksDueDate.setMonth(checksDueDate.getMonth() + 1);

  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 365));

  return {
    id,
    short: generateShortName(name),
    name,
    supplierType,
    debit,
    debitStatus,
    paymentPeriodMonths,
    landlinePhone: supplierType !== "PERSON" ? landlinePhone : undefined,
    mobilePhone,
    settlementDate: settlementDate.toISOString().split("T")[0],
    checksDueDate: checksDueDate.toISOString().split("T")[0],
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  };
}

// Generate 20 additional suppliers (IDs 6-25)
for (let i = 6; i <= 25; i++) {
  mockSuppliers.push(generateRandomSupplier(i.toString()));
}
