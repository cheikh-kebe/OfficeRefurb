import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { formatCurrency } from "@/lib/calculations";
import { FurnitureType, Assessment } from "@/lib/types";

// Define types for our data
interface CombinedItem extends FurnitureType {
  assessment?: Assessment;
}

interface TypeDataItem {
  name: string;
  total: number;
  profitable: number;
  unprofitable: number;
}

interface ProfitDataItem {
  id: number;
  profit: number;
  margin: number;
  type: string;
}

interface ConditionDataItem {
  name: string;
  items: number;
  avgProfit: number;
}

interface PieDataItem {
  name: string;
  value: number;
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState("summary");

  // Fetch furniture data
  const { data: furniture = [], isLoading: isFurnitureLoading } = useQuery<FurnitureType[]>({
    queryKey: ["/api/furniture"],
    staleTime: 30000,
  });

  // Fetch assessments data
  const { data: assessments = [], isLoading: isAssessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
    staleTime: 30000,
  });

  const isLoading = isFurnitureLoading || isAssessmentsLoading;

  // Combine furniture and assessments data
  const combinedData: CombinedItem[] = furniture.map(item => {
    const assessment = assessments.find(a => a.furnitureId === item.id);
    return {
      ...item,
      assessment
    };
  });

  // Data for summary section
  const summaryData = {
    totalItems: furniture.length,
    assessedItems: assessments.length,
    profitableItems: assessments.filter(a => a.isProfitable).length,
    unprofitableItems: assessments.filter(a => !a.isProfitable).length,
    totalProfit: assessments.reduce((sum, a) => sum + parseFloat(a.profit || '0'), 0),
    averageMargin: assessments.length ? 
      assessments.reduce((sum, a) => sum + parseFloat(a.marginPercentage || '0'), 0) / assessments.length : 0,
  };

  // Data for furniture types chart
  const typeData: TypeDataItem[] = Array.from(new Set(furniture.map(item => item.type)))
    .map(type => {
      const itemsOfType = combinedData.filter(item => item.type === type);
      const profitableItems = itemsOfType.filter(item => item.assessment?.isProfitable).length;
      return {
        name: type,
        total: itemsOfType.length,
        profitable: profitableItems,
        unprofitable: itemsOfType.length - profitableItems,
      };
    });

  // Data for profit distribution chart
  const profitData: ProfitDataItem[] = assessments.map(assessment => ({
    id: assessment.id,
    profit: parseFloat(assessment.profit || '0'),
    margin: parseFloat(assessment.marginPercentage || '0'),
    type: furniture.find(f => f.id === assessment.furnitureId)?.type || 'Inconnu',
  }));

  // Data for profitability pie chart
  const pieData: PieDataItem[] = [
    { name: 'Profitable', value: summaryData.profitableItems },
    { name: 'Non Profitable', value: summaryData.unprofitableItems },
  ];
  const COLORS = ['#4CAF50', '#FF5252'];

  // Data for condition vs profit
  const conditionData: ConditionDataItem[] = Array.from(new Set(furniture.map(item => item.condition)))
    .map(condition => {
      const itemsInCondition = combinedData.filter(item => item.condition === condition);
      const profitableItems = itemsInCondition.filter(item => item.assessment);
      const totalProfit = profitableItems.reduce((sum, item) => 
        sum + parseFloat(item.assessment?.profit || '0'), 0);
      const avgProfit = profitableItems.length ? totalProfit / profitableItems.length : 0;
      
      return {
        name: condition,
        items: itemsInCondition.length,
        avgProfit: avgProfit,
      };
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
        <p className="text-gray-600">Analysez les performances de votre reconditionnement</p>
      </div>

      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="furniture">Types de Meubles</TabsTrigger>
          <TabsTrigger value="profitability">Rentabilité</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total des Meubles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{summaryData.totalItems}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Meubles Évalués</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{summaryData.assessedItems}</p>
                <p className="text-sm text-gray-500">
                  {Math.round((summaryData.assessedItems / summaryData.totalItems) * 100) || 0}% du total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Profit Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{formatCurrency(summaryData.totalProfit)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Marge Moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{Math.round(summaryData.averageMargin)}%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Répartition de la Rentabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value as number, 'Nombre d\'articles']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Furniture Types Tab */}
        <TabsContent value="furniture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Type de Meuble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={typeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="profitable" stackId="a" name="Profitable" fill="#4CAF50" />
                    <Bar dataKey="unprofitable" stackId="a" name="Non Profitable" fill="#FF5252" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profit Moyen par État</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conditionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [formatCurrency(value as number), 'Profit Moyen']} />
                    <Legend />
                    <Bar dataKey="avgProfit" name="Profit Moyen" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profitability Tab */}
        <TabsContent value="profitability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des Profits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profitData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="id" label={{ value: 'ID d\'évaluation', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [formatCurrency(value as number), 'Profit']} />
                    <Legend />
                    <Bar dataKey="profit" name="Profit" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marges par Type de Meuble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={typeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="Nombre Total" fill="#64748B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;