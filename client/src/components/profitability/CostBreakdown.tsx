import { formatCurrency } from "@/lib/calculations";

interface CostBreakdownProps {
  acquisitionCost: number;
  repairCost: number;
  cleaningCost: number;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({
  acquisitionCost,
  repairCost,
  cleaningCost
}) => {
  const totalMaterialCost = acquisitionCost + repairCost + cleaningCost;

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-gray-700 mb-2">Ventilation des Coûts</h3>
      <ul className="space-y-2">
        <li className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Coût d'acquisition</span>
          <span className="font-medium">{formatCurrency(acquisitionCost)}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Coût des réparations</span>
          <span className="font-medium">{formatCurrency(repairCost)}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Coût du nettoyage</span>
          <span className="font-medium">{formatCurrency(cleaningCost)}</span>
        </li>
        <li className="flex justify-between items-center text-primary-700 border-t border-gray-200 pt-2 mt-2">
          <span className="font-medium">Coût total des matériaux</span>
          <span className="font-semibold">{formatCurrency(totalMaterialCost)}</span>
        </li>
      </ul>
    </div>
  );
};

export default CostBreakdown;
