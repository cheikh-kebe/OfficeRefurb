import { formatCurrency } from "@/lib/calculations";
import { CheckIcon, XIcon } from "lucide-react";

interface ProfitabilityResultProps {
  totalCost: number;
  salePrice: number;
  profit: number;
  marginPercentage: number;
  isProfitable: boolean;
}

const ProfitabilityResult: React.FC<ProfitabilityResultProps> = ({
  totalCost,
  salePrice,
  profit,
  marginPercentage,
  isProfitable
}) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Coût total de reconditionnement</span>
          <span className="font-semibold">{formatCurrency(totalCost)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-700">Prix de vente estimé</span>
          <span className="font-semibold">{formatCurrency(salePrice)}</span>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 text-lg">
          <span className="font-medium">Marge brute</span>
          <span className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(profit)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-gray-600">Marge en pourcentage</span>
          <span className={`font-medium ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {marginPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
      
      {isProfitable ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
              <CheckIcon className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-green-800 font-medium">Recommandation</h3>
              <p className="text-green-700 text-sm">
                Le reconditionnement de ce meuble est financièrement intéressant.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <XIcon className="h-4 w-4 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Recommandation</h3>
              <p className="text-red-700 text-sm">
                Le reconditionnement n'est pas financièrement intéressant. Envisagez le recyclage ou le don.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-base font-medium text-gray-700 mb-2">Visualisation de la Rentabilité</h3>
        <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isProfitable ? 'bg-green-500' : 'bg-red-500'} rounded-full`} 
            style={{ width: `${Math.max(0, Math.min(100, marginPercentage))}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Seuil de rentabilité</span>
          <span>Marge {marginPercentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityResult;
