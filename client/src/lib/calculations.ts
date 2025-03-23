import { RepairItem, CleaningItem } from "./types";

/**
 * Calculate the total cost of repairs
 */
export const calculateRepairCost = (repairs: RepairItem[]): number => {
  return repairs
    .filter(repair => repair.isNeeded)
    .reduce((sum, repair) => sum + parseFloat(repair.cost), 0);
};

/**
 * Calculate the total time needed for repairs in minutes
 */
export const calculateRepairTime = (repairs: RepairItem[]): number => {
  return repairs
    .filter(repair => repair.isNeeded)
    .reduce((sum, repair) => sum + repair.timeMinutes, 0);
};

/**
 * Calculate the total cost of cleaning items
 */
export const calculateCleaningCost = (cleaningItems: CleaningItem[]): number => {
  return cleaningItems
    .filter(item => item.isNeeded)
    .reduce((sum, item) => sum + parseFloat(item.cost), 0);
};

/**
 * Calculate the total time needed for cleaning in minutes
 */
export const calculateCleaningTime = (cleaningItems: CleaningItem[]): number => {
  return cleaningItems
    .filter(item => item.isNeeded)
    .reduce((sum, item) => sum + item.timeMinutes, 0);
};

/**
 * Calculate the total labor cost based on minutes and hourly rate
 */
export const calculateLaborCost = (totalMinutes: number, hourlyRate: number): number => {
  return (totalMinutes / 60) * hourlyRate;
};

/**
 * Calculate the total cost of reconditioning
 */
export const calculateTotalCost = (
  acquisitionCost: number,
  materialCost: number,
  laborCost: number
): number => {
  return acquisitionCost + materialCost + laborCost;
};

/**
 * Calculate profit from reconditioning
 */
export const calculateProfit = (salePrice: number, totalCost: number): number => {
  return salePrice - totalCost;
};

/**
 * Calculate profit margin percentage
 */
export const calculateMarginPercentage = (profit: number, salePrice: number): number => {
  if (salePrice === 0) return 0;
  return (profit / salePrice) * 100;
};

/**
 * Determine if reconditioning is profitable
 */
export const isProfitable = (profit: number, marginThreshold: number = 20): boolean => {
  return profit > 0 && calculateMarginPercentage(profit, profit) >= marginThreshold;
};

/**
 * Format currency for display
 */
export const formatCurrency = (value: number | string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(numericValue);
};

/**
 * Format a date for display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};
