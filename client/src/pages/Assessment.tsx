import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FurnitureDetails from "@/components/furniture/FurnitureDetails";
import ReconditioningAssessment from "@/components/furniture/ReconditioningAssessment";
import SalesProjection from "@/components/furniture/SalesProjection";
import PhotoUpload from "@/components/furniture/PhotoUpload";
import ProfitabilitySummary from "@/components/profitability/ProfitabilitySummary";
import { 
  FurnitureFormData, 
  SalesProjectionData, 
  RepairItem, 
  CleaningItem,
  FurnitureType,
  Assessment as AssessmentType
} from "@/lib/types";

const Assessment = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [furnitureData, setFurnitureData] = useState<FurnitureFormData>({
    type: "Chaise de Bureau",
    brand: "",
    model: "",
    condition: "Bon",
    age: 0,
    acquisitionCost: "0",
    description: "",
    hasPhoto: false,
    hasDamage: false,
    isComplete: true
  });
  
  const [salesData, setSalesData] = useState<SalesProjectionData>({
    marketValue: "0",
    expectedSellTime: 14,
    salesNotes: ""
  });
  
  const [repairItems, setRepairItems] = useState<RepairItem[]>([]);
  const [cleaningItems, setCleaningItems] = useState<CleaningItem[]>([]);
  
  // Fetch furniture data if ID is provided
  const { data: furniture, isLoading: isFurnitureLoading } = useQuery<FurnitureType>({
    queryKey: id ? [`/api/furniture/${id}`] : [],
    enabled: !!id
  });
  
  // Fetch repairs if ID is provided
  const { data: repairs, isLoading: isRepairsLoading } = useQuery<RepairItem[]>({
    queryKey: id ? [`/api/furniture/${id}/repairs`] : [],
    enabled: !!id
  });
  
  // Fetch cleaning items if ID is provided
  const { data: cleaning, isLoading: isCleaningLoading } = useQuery<CleaningItem[]>({
    queryKey: id ? [`/api/furniture/${id}/cleaning`] : [],
    enabled: !!id
  });
  
  // Fetch assessment if ID is provided
  const { data: assessment, isLoading: isAssessmentLoading } = useQuery<AssessmentType>({
    queryKey: id ? [`/api/furniture/${id}/assessment`] : [],
    enabled: !!id
  });
  
  // Set data from API if available
  useEffect(() => {
    if (furniture) {
      setFurnitureData({
        type: furniture.type,
        brand: furniture.brand,
        model: furniture.model,
        condition: furniture.condition,
        age: furniture.age,
        acquisitionCost: furniture.acquisitionCost,
        description: furniture.description,
        hasPhoto: furniture.hasPhoto,
        hasDamage: furniture.hasDamage,
        isComplete: furniture.isComplete
      });
    }
    
    if (repairs) {
      setRepairItems(repairs);
    }
    
    if (cleaning) {
      setCleaningItems(cleaning);
    }
    
    if (assessment) {
      setSalesData({
        marketValue: assessment.marketValue,
        expectedSellTime: assessment.expectedSellTime,
        salesNotes: assessment.salesNotes
      });
    }
  }, [furniture, repairs, cleaning, assessment]);
  
  // Create furniture mutation
  const createFurnitureMutation = useMutation({
    mutationFn: async (data: FurnitureFormData) => {
      const res = await apiRequest("POST", "/api/furniture", data);
      return await res.json();
    },
    onSuccess: (newFurniture) => {
      toast({
        title: "Meuble enregistré",
        description: "Le meuble a été créé avec succès.",
      });
      
      // Create assessment after furniture is created
      saveFurnitureDetails(newFurniture.id);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le meuble. " + error,
        variant: "destructive",
      });
    }
  });
  
  // Update furniture mutation
  const updateFurnitureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FurnitureFormData }) => {
      const res = await apiRequest("PUT", `/api/furniture/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Meuble mis à jour",
        description: "Les détails du meuble ont été mis à jour.",
      });
      
      if (id) {
        queryClient.invalidateQueries({ queryKey: [`/api/furniture/${id}`] });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le meuble. " + error,
        variant: "destructive",
      });
    }
  });
  
  // Create repair mutations
  const createRepairMutation = useMutation({
    mutationFn: async (data: RepairItem) => {
      const res = await apiRequest("POST", "/api/repairs", data);
      return await res.json();
    }
  });
  
  // Create cleaning mutations
  const createCleaningMutation = useMutation({
    mutationFn: async (data: CleaningItem) => {
      const res = await apiRequest("POST", "/api/cleaning", data);
      return await res.json();
    }
  });
  
  // Create assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/assessments", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Évaluation terminée",
        description: "L'évaluation a été enregistrée avec succès.",
      });
      
      // Navigate to catalog after successful assessment
      navigate("/catalog");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'évaluation. " + error,
        variant: "destructive",
      });
    }
  });
  
  // Handle furniture details changes
  const handleFurnitureDetailsChange = (data: FurnitureFormData) => {
    setFurnitureData(data);
  };
  
  // Handle sales projection changes
  const handleSalesProjectionChange = (data: SalesProjectionData) => {
    setSalesData(data);
  };
  
  // Handle saving as draft
  const handleSaveDraft = () => {
    if (id) {
      // Update existing furniture
      updateFurnitureMutation.mutate({ id: parseInt(id), data: furnitureData });
    } else {
      // Create new furniture
      createFurnitureMutation.mutate(furnitureData);
    }
  };
  
  // Handle saving furniture details (repairs, cleaning, assessment)
  const saveFurnitureDetails = async (furnitureId: number) => {
    // Calculate all costs for assessment
    const repairCost = repairItems
      .filter(item => item.isNeeded)
      .reduce((sum, item) => sum + parseFloat(item.cost), 0);
    
    const cleaningCost = cleaningItems
      .filter(item => item.isNeeded)
      .reduce((sum, item) => sum + parseFloat(item.cost), 0);
    
    const totalMaterialCost = repairCost + cleaningCost;
    
    const repairTime = repairItems
      .filter(item => item.isNeeded)
      .reduce((sum, item) => sum + item.timeMinutes, 0);
    
    const cleaningTime = cleaningItems
      .filter(item => item.isNeeded)
      .reduce((sum, item) => sum + item.timeMinutes, 0);
    
    const totalLaborMinutes = repairTime + cleaningTime;
    const hourlyLaborRate = 20; // Default rate
    const totalLaborCost = (totalLaborMinutes / 60) * hourlyLaborRate;
    
    const acquisitionCost = parseFloat(furnitureData.acquisitionCost);
    const totalCost = acquisitionCost + totalMaterialCost + totalLaborCost;
    const salePrice = parseFloat(salesData.marketValue);
    const profit = salePrice - totalCost;
    const marginPercentage = (profit / salePrice) * 100;
    const isProfitable = profit > 0 && marginPercentage >= 20;
    
    // Create assessment
    const assessmentData = {
      furnitureId,
      marketValue: salesData.marketValue,
      expectedSellTime: salesData.expectedSellTime,
      salesNotes: salesData.salesNotes,
      totalMaterialCost: totalMaterialCost.toFixed(2),
      totalLaborMinutes,
      hourlyLaborRate: hourlyLaborRate.toFixed(2),
      totalLaborCost: totalLaborCost.toFixed(2),
      totalCost: totalCost.toFixed(2),
      profit: profit.toFixed(2),
      marginPercentage: marginPercentage.toFixed(2),
      isProfitable,
      repairItems: [],
      cleaningItems: []
    };
    
    // Save assessment
    await createAssessmentMutation.mutateAsync(assessmentData);
    
    // Save repair items
    for (const item of repairItems) {
      await createRepairMutation.mutateAsync({
        ...item,
        furnitureId
      });
    }
    
    // Save cleaning items
    for (const item of cleaningItems) {
      await createCleaningMutation.mutateAsync({
        ...item,
        furnitureId
      });
    }
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (id) {
      // Update furniture then save details
      updateFurnitureMutation.mutate({ 
        id: parseInt(id), 
        data: furnitureData 
      }, {
        onSuccess: () => saveFurnitureDetails(parseInt(id))
      });
    } else {
      // Create new furniture, which will trigger saveFurnitureDetails on success
      createFurnitureMutation.mutate(furnitureData);
    }
  };
  
  const isLoading = isFurnitureLoading || isRepairsLoading || isCleaningLoading || isAssessmentLoading;
  const isSubmitting = 
    createFurnitureMutation.isPending || 
    updateFurnitureMutation.isPending || 
    createRepairMutation.isPending || 
    createCleaningMutation.isPending || 
    createAssessmentMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-2/3 p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-8" />
          <Skeleton className="h-[400px] w-full" />
        </Card>
        <div className="w-full md:w-1/3">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Évaluation de Reconditionnement</h2>
          <p className="text-sm text-gray-600">Analysez la rentabilité du reconditionnement de ce mobilier</p>
        </div>
        
        <Tabs defaultValue="details" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="reconditioning">Reconditionnement</TabsTrigger>
            <TabsTrigger value="sales">Projections</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <FurnitureDetails 
              defaultValues={furnitureData} 
              onValuesChange={handleFurnitureDetailsChange} 
            />
          </TabsContent>
          
          <TabsContent value="reconditioning">
            <ReconditioningAssessment 
              repairItems={repairItems}
              cleaningItems={cleaningItems}
              onRepairItemsChange={setRepairItems}
              onCleaningItemsChange={setCleaningItems}
              furnitureId={id ? parseInt(id) : 0}
            />
          </TabsContent>
          
          <TabsContent value="sales">
            <SalesProjection 
              defaultValues={salesData}
              onValuesChange={handleSalesProjectionChange}
            />
          </TabsContent>
          
          <TabsContent value="photos">
            {id ? (
              <PhotoUpload furnitureId={parseInt(id)} />
            ) : (
              <div className="p-6 text-center bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-700">Veuillez d'abord enregistrer ce meuble comme brouillon avant d'ajouter des photos.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Enregistrer comme brouillon
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Valider l'évaluation
          </Button>
        </div>
      </div>
      
      <ProfitabilitySummary 
        furnitureType={furnitureData.type}
        acquisitionCost={parseFloat(furnitureData.acquisitionCost) || 0}
        repairItems={repairItems}
        cleaningItems={cleaningItems}
        salePrice={parseFloat(salesData.marketValue) || 0}
        hourlyRate={20}
      />
    </div>
  );
};

export default Assessment;
