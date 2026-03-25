/**
 * Currency utility functions for the Pharmacy Backend
 * All monetary values are stored as integers (smallest currency unit)
 */

export type Money = number; // Represents cents/ smallest currency unit

/**
 * Convert decimal amount to money (cents)
 * @param amount - Decimal amount (e.g., 10.50)
 * @returns Amount in cents (e.g., 1050)
 */
export function toMoney(amount: number): Money {
  return Math.round(amount * 100);
}

/**
 * Convert money (cents) to decimal amount
 * @param money - Amount in cents (e.g., 1050)
 * @returns Decimal amount (e.g., 10.50)
 */
export function fromMoney(money: Money): number {
  return money / 100;
}

/**
 * Format money as currency string
 * @param money - Amount in cents
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatMoney(money: Money, currency: string = 'USD'): string {
  const amount = fromMoney(money);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculate subtotal from items
 * @param items - Array of items with quantity and unitPrice
 * @returns Subtotal in cents
 */
export function calculateSubtotal(items: { quantity: number; unitPrice: Money }[]): Money {
  return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
}

/**
 * Apply discount to amount
 * @param amount - Original amount in cents
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discounted amount in cents
 */
export function applyDiscount(amount: Money, discountPercent: number): Money {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }
  return Math.round(amount * (1 - discountPercent / 100));
}

/**
 * Calculate tax amount
 * @param amount - Amount before tax in cents
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Tax amount in cents
 */
export function calculateTax(amount: Money, taxRate: number): Money {
  if (taxRate < 0) {
    throw new Error('Tax rate must be non-negative');
  }
  return Math.round(amount * taxRate);
}

/**
 * Calculate final amount with discount and tax
 * @param subtotal - Subtotal in cents
 * @param discount - Discount amount in cents
 * @param taxRate - Tax rate as decimal
 * @returns Final amount in cents
 */
export function calculateFinalAmount(subtotal: Money, discount: Money, taxRate: number): Money {
  const afterDiscount = subtotal - discount;
  const tax = calculateTax(afterDiscount, taxRate);
  return afterDiscount + tax;
}
