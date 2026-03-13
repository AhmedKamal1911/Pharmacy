// Temporary mock apiClient until the real one is implemented
const mockApiClient = {
  get: async (url: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data for development
    if (url.includes("/users")) {
      return {
        data: [
          {
            id: "1",
            name: "مدير النظام",
            email: "admin@pharmacy.com",
            phone: "+966 50 123 4567",
            isActive: true,
            createdAt: "2024-01-01T09:00:00Z",
            updatedAt: "2025-03-13T10:30:00Z",
            roles: [
              {
                id: "1",
                userId: "1",
                roleId: "SUPER_ADMIN",
                user: {
                  id: "1",
                  name: "مدير النظام",
                  email: "admin@pharmacy.com",
                  isActive: true,
                  createdAt: "2024-01-01T09:00:00Z",
                  updatedAt: "2025-03-13T10:30:00Z",
                  roles: [],
                },
                role: {
                  id: "SUPER_ADMIN",
                  name: "SUPER_ADMIN",
                  description: "مدير النظام",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
          {
            id: "2",
            name: "أحمد محمد",
            email: "ahmed@pharmacy.com",
            phone: "+966 50 234 5678",
            isActive: true,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2025-03-12T14:20:00Z",
            roles: [
              {
                id: "2",
                userId: "2",
                roleId: "ADMIN",
                user: {
                  id: "2",
                  name: "أحمد محمد",
                  email: "ahmed@pharmacy.com",
                  isActive: true,
                  createdAt: "2024-01-15T10:30:00Z",
                  updatedAt: "2025-03-12T14:20:00Z",
                  roles: [],
                },
                role: {
                  id: "ADMIN",
                  name: "ADMIN",
                  description: "صيدلي",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
          {
            id: "3",
            name: "فاطمة علي",
            email: "fatima@pharmacy.com",
            phone: "+966 50 345 6789",
            isActive: false,
            createdAt: "2024-01-20T14:15:00Z",
            updatedAt: "2025-02-28T16:45:00Z",
            roles: [
              {
                id: "3",
                userId: "3",
                roleId: "ADMIN",
                user: {
                  id: "3",
                  name: "فاطمة علي",
                  email: "fatima@pharmacy.com",
                  isActive: false,
                  createdAt: "2024-01-20T14:15:00Z",
                  updatedAt: "2025-02-28T16:45:00Z",
                  roles: [],
                },
                role: {
                  id: "ADMIN",
                  name: "ADMIN",
                  description: "صيدلي",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
          {
            id: "4",
            name: "محمد عبدالله",
            email: "mohammed@pharmacy.com",
            phone: "+966 50 456 7890",
            isActive: true,
            createdAt: "2024-02-01T08:45:00Z",
            updatedAt: "2025-03-13T08:15:00Z",
            roles: [
              {
                id: "4",
                userId: "4",
                roleId: "SALES",
                user: {
                  id: "4",
                  name: "محمد عبدالله",
                  email: "mohammed@pharmacy.com",
                  isActive: true,
                  createdAt: "2024-02-01T08:45:00Z",
                  updatedAt: "2025-03-13T08:15:00Z",
                  roles: [],
                },
                role: {
                  id: "SALES",
                  name: "SALES",
                  description: "مساعد صيدلي",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
          {
            id: "5",
            name: "نورا حسن",
            email: "nora@pharmacy.com",
            phone: "+966 50 567 8901",
            isActive: true,
            createdAt: "2024-02-10T11:30:00Z",
            updatedAt: "2025-03-11T17:30:00Z",
            roles: [
              {
                id: "5",
                userId: "5",
                roleId: "SALES",
                user: {
                  id: "5",
                  name: "نورا حسن",
                  email: "nora@pharmacy.com",
                  phone: "+966 50 567 8901",
                  isActive: true,
                  createdAt: "2024-02-10T11:30:00Z",
                  updatedAt: "2025-03-11T17:30:00Z",
                  roles: [],
                },
                role: {
                  id: "SALES",
                  name: "SALES",
                  description: "مساعد صيدلي",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
          {
            id: "6",
            name: "خالد سعيد",
            email: "khalid@pharmacy.com",
            phone: "+966 50 678 9012",
            isActive: true,
            createdAt: "2024-03-01T13:20:00Z",
            updatedAt: "2025-03-10T12:00:00Z",
            roles: [
              {
                id: "6",
                userId: "6",
                roleId: "ADMIN",
                user: {
                  id: "6",
                  name: "خالد سعيد",
                  email: "khalid@pharmacy.com",
                  phone: "+966 50 678 9012",
                  isActive: true,
                  createdAt: "2024-03-01T13:20:00Z",
                  updatedAt: "2025-03-10T12:00:00Z",
                  roles: [],
                },
                role: {
                  id: "ADMIN",
                  name: "ADMIN",
                  description: "صيدلي",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
          {
            id: "7",
            name: "سارة أحمد",
            email: "sara@pharmacy.com",
            phone: "+966 50 789 0123",
            isActive: false,
            createdAt: "2024-03-15T15:45:00Z",
            updatedAt: "2025-01-20T09:30:00Z",
            roles: [
              {
                id: "7",
                userId: "7",
                roleId: "3",
                user: {
                  id: "7",
                  name: "سارة أحمد",
                  email: "sara@pharmacy.com",
                  phone: "+966 50 789 0123",
                  isActive: false,
                  createdAt: "2024-03-15T15:45:00Z",
                  updatedAt: "2025-01-20T09:30:00Z",
                  roles: [],
                },
                role: {
                  id: "3",
                  name: "SALES",
                  description: "مساعد صيدلي",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
          {
            id: "8",
            name: "ياسر محمود",
            email: "yasser@pharmacy.com",
            phone: "+966 50 890 1234",
            isActive: true,
            createdAt: "2024-04-01T10:00:00Z",
            updatedAt: "2025-03-13T07:45:00Z",
            roles: [
              {
                id: "8",
                userId: "8",
                roleId: "2",
                user: {
                  id: "8",
                  name: "ياسر محمود",
                  email: "yasser@pharmacy.com",
                  phone: "+966 50 890 1234",
                  isActive: true,
                  createdAt: "2024-04-01T10:00:00Z",
                  updatedAt: "2025-03-13T07:45:00Z",
                  roles: [],
                },
                role: {
                  id: "2",
                  name: "ADMIN",
                  description: "صيدلي",
                  users: [],
                  permissions: [],
                },
              },
            ],
          },
        ],
      };
    }

    if (url.includes("/roles")) {
      return {
        data: [
          { id: "1", name: "SUPER_ADMIN", displayName: "مدير النظام" },
          { id: "2", name: "ADMIN", displayName: "مدير" },
          { id: "3", name: "SALES", displayName: "موظف مبيعات" },
        ],
      };
    }

    if (url.includes("/permissions")) {
      return {
        data: [
          { id: "1", action: "USER_CREATE", description: "إنشاء مستخدم جديد" },
          { id: "2", action: "USER_READ", description: "عرض المستخدمين" },
          { id: "3", action: "USER_UPDATE", description: "تعديل المستخدمين" },
          { id: "4", action: "USER_DELETE", description: "حذف المستخدمين" },
          { id: "5", action: "ROLE_CREATE", description: "إنشاء أدوار" },
          { id: "6", action: "ROLE_READ", description: "عرض الأدوار" },
          { id: "7", action: "ROLE_UPDATE", description: "تعديل الأدوار" },
          { id: "8", action: "ROLE_DELETE", description: "حذف الأدوار" },
        ],
      };
    }

    return { data: [] };
  },

  post: async (url: string, data: unknown) => {
    console.log("Mock POST to:", url, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userData = data as CreateUserRequest;
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: [], // Will be populated based on roleIds
    };
    return { data: newUser };
  },

  patch: async (url: string, data: unknown) => {
    console.log("Mock PATCH to:", url, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userId = url.split("/")[2];
    const updateData = data as UpdateUserRequest | { isActive: boolean };

    // Return a mock updated user
    const updatedUser: User = {
      id: userId,
      name: "محدث",
      email: "updated@pharmacy.com",
      phone: "+966 50 000 0000",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
      roles: [],
    };

    // Apply the update data
    if ("name" in updateData && updateData.name)
      updatedUser.name = updateData.name;
    if ("email" in updateData && updateData.email)
      updatedUser.email = updateData.email;
    if ("phone" in updateData && updateData.phone)
      updatedUser.phone = updateData.phone;

    if ("isActive" in updateData && typeof updateData.isActive === "boolean")
      updatedUser.isActive = updateData.isActive;

    return { data: updatedUser };
  },

  delete: async (url: string) => {
    console.log("Mock DELETE to:", url);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: {} };
  },
};

import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
} from "../types";

export const teamsApi = {
  // Get all users with optional filters
  getUsers: async (filters?: UserFilters): Promise<User[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);

    const response = await mockApiClient.get(`/users?${params.toString()}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    // Return a mock user for now
    const mockUser: User = {
      id,
      name: "مستخدم وهمي",
      email: "mock@pharmacy.com",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
      roles: [],
    };
    return mockUser;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await mockApiClient.post("/users", userData);
    return response.data;
  },

  // Update user
  updateUser: async (
    id: string,
    userData: UpdateUserRequest,
  ): Promise<User> => {
    const response = await mockApiClient.patch(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await mockApiClient.delete(`/users/${id}`);
  },

  // Toggle user active status
  toggleUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    const response = await mockApiClient.patch(`/users/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  // Get all roles
  getRoles: async (): Promise<unknown[]> => {
    const response = await mockApiClient.get("/roles");
    return response.data;
  },

  // Get all permissions
  getPermissions: async (): Promise<unknown[]> => {
    const response = await mockApiClient.get("/permissions");
    return response.data;
  },
};
