export interface FurnitureType {
  id: number;
  type: string;
  brand: string;
  model: string;
  condition: string;
  age: number;
  acquisitionCost: string;
  description: string;
  hasPhoto: boolean;
  hasDamage: boolean;
  isComplete: boolean;
  createdAt: Date;
}

export interface RepairItem {
  id: number;
  furnitureId: number;
  name: string;
  isNeeded: boolean;
  cost: string;
  timeMinutes: number;
}

export interface CleaningItem {
  id: number;
  furnitureId: number;
  name: string;
  isNeeded: boolean;
  cost: string;
  timeMinutes: number;
}

export interface Assessment {
  id: number;
  furnitureId: number;
  marketValue: string;
  expectedSellTime: number;
  salesNotes: string;
  totalMaterialCost: string;
  totalLaborMinutes: number;
  hourlyLaborRate: string;
  totalLaborCost: string;
  totalCost: string;
  profit: string;
  marginPercentage: string;
  isProfitable: boolean;
  createdAt: Date;
  repairItems: RepairItem[];
  cleaningItems: CleaningItem[];
}

export interface FurnitureFormData {
  type: string;
  brand: string;
  model: string;
  condition: string;
  age: number;
  acquisitionCost: string;
  description: string;
  hasPhoto: boolean;
  hasDamage: boolean;
  isComplete: boolean;
}

export interface SalesProjectionData {
  marketValue: string;
  expectedSellTime: number;
  salesNotes: string;
}

export interface SimilarItem {
  id: number;
  furnitureId: number;
  profit: string;
  furniture?: {
    brand: string;
    model: string;
    createdAt: Date;
  };
}

export type ConditionType = "Excellent" | "Bon" | "Moyen" | "Mauvais";

export type FurnitureTypeOption = 
  | "Chaise de Bureau" 
  | "Bureau" 
  | "Armoire" 
  | "Étagère" 
  | "Caisson";

export const furnitureTypes: FurnitureTypeOption[] = [
  "Chaise de Bureau",
  "Bureau",
  "Armoire",
  "Étagère",
  "Caisson"
];

export const conditions: ConditionType[] = [
  "Excellent",
  "Bon",
  "Moyen",
  "Mauvais"
];
