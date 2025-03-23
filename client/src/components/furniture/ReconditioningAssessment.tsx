import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RepairItem as RepairItemType, CleaningItem as CleaningItemType } from "@/lib/types";
import RepairItem from "./RepairItem";
import CleaningItem from "./CleaningItem";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReconditioningAssessmentProps {
  repairItems: RepairItemType[];
  cleaningItems: CleaningItemType[];
  onRepairItemsChange: (items: RepairItemType[]) => void;
  onCleaningItemsChange: (items: CleaningItemType[]) => void;
  furnitureId: number;
}

const ReconditioningAssessment: React.FC<ReconditioningAssessmentProps> = ({
  repairItems,
  cleaningItems,
  onRepairItemsChange,
  onCleaningItemsChange,
  furnitureId
}) => {
  const [isRepairDialogOpen, setIsRepairDialogOpen] = useState(false);
  const [isCleaningDialogOpen, setIsCleaningDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const handleRepairChange = (changedItem: RepairItemType) => {
    const updatedItems = repairItems.map(item => 
      item.id === changedItem.id ? changedItem : item
    );
    onRepairItemsChange(updatedItems);
  };

  const handleCleaningChange = (changedItem: CleaningItemType) => {
    const updatedItems = cleaningItems.map(item => 
      item.id === changedItem.id ? changedItem : item
    );
    onCleaningItemsChange(updatedItems);
  };

  const handleRepairDelete = (id: number) => {
    onRepairItemsChange(repairItems.filter(item => item.id !== id));
  };

  const handleCleaningDelete = (id: number) => {
    onCleaningItemsChange(cleaningItems.filter(item => item.id !== id));
  };

  const handleAddRepair = () => {
    if (newItemName.trim()) {
      const newRepair: RepairItemType = {
        id: Date.now(),
        furnitureId,
        name: newItemName,
        isNeeded: true,
        cost: "0",
        timeMinutes: 0
      };
      onRepairItemsChange([...repairItems, newRepair]);
      setNewItemName("");
      setIsRepairDialogOpen(false);
    }
  };

  const handleAddCleaning = () => {
    if (newItemName.trim()) {
      const newCleaning: CleaningItemType = {
        id: Date.now(),
        furnitureId,
        name: newItemName,
        isNeeded: true,
        cost: "0",
        timeMinutes: 0
      };
      onCleaningItemsChange([...cleaningItems, newCleaning]);
      setNewItemName("");
      setIsCleaningDialogOpen(false);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Évaluation des Besoins de Reconditionnement</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Réparations Nécessaires</h4>
        
        {repairItems.length > 0 ? (
          repairItems.map(item => (
            <RepairItem 
              key={item.id} 
              item={item} 
              onChange={handleRepairChange} 
              onDelete={handleRepairDelete} 
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 mb-3">Aucune réparation ajoutée.</p>
        )}
        
        <Button
          type="button"
          variant="ghost"
          className="mt-2 text-sm text-primary-600 hover:text-primary-800"
          onClick={() => setIsRepairDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter une réparation
        </Button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Nettoyage et Finition</h4>
        
        {cleaningItems.length > 0 ? (
          cleaningItems.map(item => (
            <CleaningItem 
              key={item.id} 
              item={item} 
              onChange={handleCleaningChange} 
              onDelete={handleCleaningDelete} 
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 mb-3">Aucun nettoyage ajouté.</p>
        )}
        
        <Button
          type="button"
          variant="ghost"
          className="mt-2 text-sm text-primary-600 hover:text-primary-800"
          onClick={() => setIsCleaningDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un traitement
        </Button>
      </div>

      {/* Add Repair Dialog */}
      <Dialog open={isRepairDialogOpen} onOpenChange={setIsRepairDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une réparation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="repair-name">Nom de la réparation</Label>
            <Input
              id="repair-name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Ex: Remplacement des roulettes"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRepairDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddRepair}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Cleaning Dialog */}
      <Dialog open={isCleaningDialogOpen} onOpenChange={setIsCleaningDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un traitement de nettoyage</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cleaning-name">Nom du traitement</Label>
            <Input
              id="cleaning-name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Ex: Nettoyage des tissus"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCleaningDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCleaning}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReconditioningAssessment;
