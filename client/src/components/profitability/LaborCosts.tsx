import { formatCurrency } from "@/lib/calculations";

interface LaborCostsProps {
  totalMinutes: number;
  hourlyRate: number;
}

const LaborCosts: React.FC<LaborCostsProps> = ({ totalMinutes, hourlyRate }) => {
  const laborCost = (totalMinutes / 60) * hourlyRate;

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-gray-700 mb-2">Coûts de Main d'Œuvre</h3>
      <div className="px-3 py-2 bg-gray-50 rounded-md mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Temps total estimé</span>
          <span className="font-medium">{totalMinutes} min</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Taux horaire</span>
          <span className="font-medium">{formatCurrency(hourlyRate)}/h</span>
        </div>
      </div>
      <div className="flex justify-between items-center text-primary-700">
        <span className="font-medium">Coût total main d'œuvre</span>
        <span className="font-semibold">{formatCurrency(laborCost)}</span>
      </div>
    </div>
  );
};

export default LaborCosts;
