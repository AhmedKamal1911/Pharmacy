import type { ReturnInvoice, ReturnFilters } from "../types";

// Mock API functions - replace with actual API calls
export const returnsApi = {
  // Get all returns with filters
  getReturns: async (filters?: ReturnFilters): Promise<ReturnInvoice[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return [
      {
        id: "1",
        invoiceNumber: "RET-10023",
        originalInvoiceNumber: "SALE-10015",
        type: "sales_return",
        date: "2024-03-01T10:30:00Z",
        entityName: "أحمد محمد",
        entityId: "customer-1",
        totalAmount: 55.00,
        paymentMethod: "cash",
        createdBy: "محمد علي",
        reason: "منتهي الصلاحية",
        status: "completed",
      },
      {
        id: "2",
        invoiceNumber: "RET-10024",
        originalInvoiceNumber: "PUR-10008",
        type: "purchases_return",
        date: "2024-03-01T14:20:00Z",
        entityName: "شركة الأدوية المتحدة",
        entityId: "supplier-1",
        totalAmount: 250.00,
        paymentMethod: "credit",
        createdBy: "سارة أحمد",
        reason: "خطأ في التوريد",
        status: "pending",
      },
      {
        id: "3",
        invoiceNumber: "RET-10025",
        originalInvoiceNumber: "SALE-10020",
        type: "sales_return",
        date: "2024-03-01T16:45:00Z",
        entityName: "فاطمة خالد",
        entityId: "customer-2",
        totalAmount: 30.00,
        paymentMethod: "visa",
        createdBy: "محمد علي",
        reason: "زبون غير رأيه",
        status: "completed",
      },
    ];
  },

  // Get return by ID
  getReturnById: async (id: string): Promise<ReturnInvoice | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const returns = await returnsApi.getReturns();
    return returns.find(r => r.id === id) || null;
  },

  // Create new return
  createReturn: async (returnData: Omit<ReturnInvoice, "id">): Promise<ReturnInvoice> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReturn: ReturnInvoice = {
      ...returnData,
      id: Date.now().toString(),
    };
    
    return newReturn;
  },

  // Update return
  updateReturn: async (id: string, updates: Partial<ReturnInvoice>): Promise<ReturnInvoice> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingReturn = await returnsApi.getReturnById(id);
    if (!existingReturn) {
      throw new Error("Return not found");
    }
    
    return {
      ...existingReturn,
      ...updates,
    };
  },

  // Delete return
  deleteReturn: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingReturn = await returnsApi.getReturnById(id);
    if (!existingReturn) {
      throw new Error("Return not found");
    }
    
    // In a real app, this would make an API call to delete
    console.log(`Return ${id} deleted`);
  },
};
