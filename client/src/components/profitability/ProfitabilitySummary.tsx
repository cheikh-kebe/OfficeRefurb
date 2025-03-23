import { useMemo } from "react";
import CostBreakdown from "./CostBreakdown";
import LaborCosts from "./LaborCosts";
import ProfitabilityResult from "./ProfitabilityResult";
import SimilarItems from "./SimilarItems";
import { 
  calculateRepairCost, 
  calculateCleaningCost, 
  calculateRepairTime, 
  calculateCleaningTime,
  calculateLaborCost,
  calculateTotalCost,
  calculateProfit,
  calculateMarginPercentage,
  isProfitable
} from "@/lib/calculations";
import { RepairItem, CleaningItem } from "@/lib/types";

interface ProfitabilitySummaryProps {
  furnitureType: string;
  acquisitionCost: number;
  repairItems: RepairItem[];
  cleaningItems: CleaningItem[];
  salePrice: number;
  hourlyRate?: number;
}

const ProfitabilitySummary: React.FC<ProfitabilitySummaryProps> = ({
  furnitureType,
  acquisitionCost,
  repairItems,
  cleaningItems,
  salePrice,
  hourlyRate = 20
}) => {
  // Calculate all the cost components
  const repairCost = useMemo(() => calculateRepairCost(repairItems), [repairItems]);
  const cleaningCost = useMemo(() => calculateCleaningCost(cleaningItems), [cleaningItems]);
  const repairTime = useMemo(() => calculateRepairTime(repairItems), [repairItems]);
  const cleaningTime = useMemo(() => calculateCleaningTime(cleaningItems), [cleaningItems]);
  const totalTime = repairTime + cleaningTime;
  const laborCost = useMemo(() => calculateLaborCost(totalTime, hourlyRate), [totalTime, hourlyRate]);
  const totalCost = useMemo(() => calculateTotalCost(acquisitionCost, repairCost + cleaningCost, laborCost), 
    [acquisitionCost, repairCost, cleaningCost, laborCost]
  );
  const profit = useMemo(() => calculateProfit(salePrice, totalCost), [salePrice, totalCost]);
  const marginPercentage = useMemo(() => 
    calculateMarginPercentage(profit, salePrice), [profit, salePrice]
  );
  const profitable = useMemo(() => isProfitable(profit), [profit]);

  return (
    <div className="w-full md:w-1/3 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analyse de Rentabilité</h2>
        
        <CostBreakdown 
          acquisitionCost={acquisitionCost} 
          repairCost={repairCost} 
          cleaningCost={cleaningCost} 
        />
        
        <LaborCosts 
          totalMinutes={totalTime} 
          hourlyRate={hourlyRate} 
        />
        
        <ProfitabilityResult 
          totalCost={totalCost}
          salePrice={salePrice}
          profit={profit}
          marginPercentage={marginPercentage}
          isProfitable={profitable}
        />
      </div>
      
      {furnitureType && (
        <SimilarItems furnitureType={furnitureType} />
      )}
    </div>
  );
};

export default ProfitabilitySummary;
