// Global type definitions for the Pharmacy Backend

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Currency types (stored as integers - smallest currency unit)
export type Money = number; // Represents cents/ smallest currency unit

// Pharmacy domain types
export interface MedicineStock {
  medicineId: string;
  currentStock: number;
  minStock: number;
  isLowStock: boolean;
}

export interface SaleCalculation {
  subtotal: Money;
  discount: Money;
  tax: Money;
  total: Money;
}

export interface StockMovement {
  medicineId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  referenceId?: string;
}

// User roles and permissions
export type UserRole = 'ADMIN' | 'PHARMACIST' | 'CASHIER';

export interface UserPermissions {
  canManageMedicines: boolean;
  canManagePatients: boolean;
  canProcessSales: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
}

// Error types
export class PharmacyError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends PharmacyError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends PharmacyError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class InsufficientStockError extends PharmacyError {
  constructor(medicineName: string, requested: number, available: number) {
    super(`Insufficient stock for ${medicineName}. Requested: ${requested}, Available: ${available}`, 409);
  }
}

export class DatabaseError extends PharmacyError {
  constructor(message: string) {
    super(`Database error: ${message}`, 500);
  }
}
