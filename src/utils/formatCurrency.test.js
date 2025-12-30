import { describe, it, expect } from 'vitest';
import { formatINR } from './formatCurrency';

describe('formatINR', () => {
  it('should format positive numbers correctly', () => {
    expect(formatINR(1000)).toBe('₹1,000.00');
    expect(formatINR(5000)).toBe('₹5,000.00');
    expect(formatINR(100000)).toBe('₹1,00,000.00');
  });

  it('should format decimal numbers correctly', () => {
    expect(formatINR(1234.56)).toBe('₹1,234.56');
    expect(formatINR(99.99)).toBe('₹99.99');
  });

  it('should handle zero', () => {
    expect(formatINR(0)).toBe('₹0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatINR(-500)).toBe('-₹500.00');
  });

  it('should return empty string for null/undefined/empty', () => {
    expect(formatINR(null)).toBe('');
    expect(formatINR(undefined)).toBe('');
    expect(formatINR('')).toBe('');
  });

  it('should return original value if NaN', () => {
    expect(formatINR('invalid')).toBe('invalid');
    expect(formatINR('abc')).toBe('abc');
  });

  it('should respect minimumFractionDigits option', () => {
    expect(formatINR(1000, { minimumFractionDigits: 0 })).toBe('₹1,000');
  });

  it('should respect maximumFractionDigits option', () => {
    expect(formatINR(1000.9999, { maximumFractionDigits: 3 })).toContain('1,001');
  });

  it('should format string numbers', () => {
    expect(formatINR('5000')).toBe('₹5,000.00');
  });

  it('should handle large numbers', () => {
    expect(formatINR(10000000)).toBe('₹1,00,00,000.00');
  });
});
