import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatCurrency, formatDate } from "@/lib/calculations";
import { SimilarItem } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface SimilarItemsProps {
  furnitureType: string;
}

const SimilarItems: React.FC<SimilarItemsProps> = ({ furnitureType }) => {
  const { data: similarItems, isLoading } = useQuery<SimilarItem[]>({
    queryKey: [`/api/similar-items/${encodeURIComponent(furnitureType)}`],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hidden md:block">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Articles Similaires Reconditionnés</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!similarItems || similarItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hidden md:block">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Articles Similaires Reconditionnés</h3>
      <ul className="space-y-3">
        {similarItems.map((item) => (
          <li key={item.id} className="border-b border-gray-200 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium">
                  {item.furniture?.brand || "Inconnu"} {item.furniture?.model || ""}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Reconditionné le {item.furniture?.createdAt ? formatDate(item.furniture.createdAt) : ""}
                </p>
              </div>
              <span className="font-medium text-green-600">
                {formatCurrency(item.profit)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/catalog">
        <span className="text-sm text-primary-600 hover:text-primary-800 mt-3 inline-block cursor-pointer">
          Voir tous les {furnitureType.toLowerCase()} reconditionnés →
        </span>
      </Link>
    </div>
  );
};

export default SimilarItems;
