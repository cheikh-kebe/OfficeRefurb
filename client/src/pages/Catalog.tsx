import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/calculations";
import { FurnitureType, Assessment } from "@/lib/types";
import { PlusCircle, Search, Eye, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Catalog = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Fetch all furniture items
  const { data: furniture, isLoading: isFurnitureLoading } = useQuery<FurnitureType[]>({
    queryKey: ["/api/furniture"]
  });
  
  // Fetch all assessments
  const { data: assessments, isLoading: isAssessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"]
  });
  
  const isLoading = isFurnitureLoading || isAssessmentsLoading;
  
  // Get unique furniture types
  const furnitureTypes = furniture 
    ? Array.from(new Set(furniture.map(item => item.type)))
    : [];
  
  // Combine furniture and assessments data
  const combinedData = furniture && assessments
    ? furniture.map(item => {
        const assessment = assessments.find(a => a.furnitureId === item.id);
        return {
          ...item,
          assessment
        };
      })
    : [];
  
  // Apply filters
  const filteredData = combinedData
    .filter(item => {
      // Apply search filter
      const searchLower = search.toLowerCase();
      const matchesSearch = search === "" || 
        item.brand.toLowerCase().includes(searchLower) ||
        item.model.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower);
      
      // Apply type filter
      const matchesType = typeFilter === "" || typeFilter === "all" || item.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  
  // Paginate data
  const paginatedData = filteredData
    .slice((page - 1) * pageSize, page * pageSize);
  
  const totalPages = Math.ceil(filteredData.length / pageSize);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <Skeleton className="h-12 w-full" />
        
        <Skeleton className="h-[400px] w-full" />
        
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catalogue de Mobilier</h1>
          <p className="text-gray-600">Consultez et gérez vos meubles reconditionnés</p>
        </div>
        <Link href="/assessment">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par marque, modèle..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {furnitureTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {paginatedData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Marque / Modèle</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead className="text-right">Prix de vente</TableHead>
                    <TableHead className="text-right">Marge</TableHead>
                    <TableHead>Date d'évaluation</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="font-medium">
                        {item.brand} {item.model}
                      </TableCell>
                      <TableCell>{item.condition}</TableCell>
                      <TableCell className="text-right">
                        {item.assessment 
                          ? formatCurrency(item.assessment.marketValue)
                          : "-"
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        {item.assessment ? (
                          <span className={item.assessment.isProfitable ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(item.assessment.profit)} ({item.assessment.marginPercentage}%)
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        {item.createdAt ? formatDate(item.createdAt) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Link href={`/assessment/${item.id}`}>
                            <Button variant="ghost" size="icon" title="Voir l'évaluation">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-gray-500">Aucun meuble ne correspond à votre recherche</p>
            </div>
          )}
          
          {filteredData.length > pageSize && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) < 3 || p === 1 || p === totalPages)
                    .map((p, i, arr) => {
                      // Add ellipsis
                      if (i > 0 && p > arr[i-1] + 1) {
                        return (
                          <PaginationItem key={`ellipsis-${p}`}>
                            <span className="px-4">...</span>
                          </PaginationItem>
                        );
                      }
                      
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })
                  }
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                      className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Catalog;
