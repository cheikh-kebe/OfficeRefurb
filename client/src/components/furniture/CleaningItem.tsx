import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CleaningItem as CleaningItemType } from "@/lib/types";

interface CleaningItemProps {
  item: CleaningItemType;
  onChange: (item: CleaningItemType) => void;
  onDelete: (id: number) => void;
}

const CleaningItem: React.FC<CleaningItemProps> = ({ item, onChange, onDelete }) => {
  const handleChange = (key: keyof CleaningItemType, value: string | boolean | number) => {
    onChange({
      ...item,
      [key]: value
    });
  };

  return (
    <div className="flex items-start mb-3 pb-2 border-b border-gray-200">
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <Checkbox 
            id={`cleaning-${item.id}`} 
            checked={item.isNeeded} 
            onCheckedChange={(checked) => handleChange("isNeeded", Boolean(checked))}
          />
          <Label 
            htmlFor={`cleaning-${item.id}`} 
            className="ml-2 text-sm font-medium text-gray-700"
          >
            {item.name}
          </Label>
        </div>
        <div className="flex flex-wrap gap-4 ml-6">
          <div className="w-24">
            <Label htmlFor={`cleaning-${item.id}-cost`} className="text-xs text-gray-500">
              Coût (€)
            </Label>
            <Input
              id={`cleaning-${item.id}-cost`}
              type="number"
              value={item.cost}
              onChange={(e) => handleChange("cost", e.target.value)}
              className="w-full px-2 py-1 text-sm"
            />
          </div>
          <div className="w-24">
            <Label htmlFor={`cleaning-${item.id}-time`} className="text-xs text-gray-500">
              Temps (min)
            </Label>
            <Input
              id={`cleaning-${item.id}-time`}
              type="number"
              value={item.timeMinutes}
              onChange={(e) => handleChange("timeMinutes", parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-gray-600"
        onClick={() => onDelete(item.id)}
      >
        <X size={16} />
        <span className="sr-only">Supprimer</span>
      </Button>
    </div>
  );
};

export default CleaningItem;
