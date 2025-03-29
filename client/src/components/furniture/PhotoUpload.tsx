import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PhotoItem, PhotoUploadData, photoTypes } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, Image, Trash2, Upload } from "lucide-react";

interface PhotoUploadProps {
  furnitureId: number;
}

const PhotoUpload = ({ furnitureId }: PhotoUploadProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [photoTab, setPhotoTab] = useState<string>("before");
  const [photoData, setPhotoData] = useState<PhotoUploadData>({
    furnitureId,
    url: "",
    filename: "",
    type: "before" as const,
    description: "",
  });
  
  // Fonction pour simuler le téléchargement de fichier (dans un environnement réel, cela utiliserait un service de stockage de fichiers)
  const simulateUpload = (file: File): Promise<{ url: string, filename: string }> => {
    return new Promise((resolve) => {
      // Dans un environnement de production, cette fonction serait remplacée par un
      // appel à un service d'upload de fichiers comme AWS S3, Cloudinary, etc.
      setTimeout(() => {
        // Simuler une URL générée après téléchargement
        // La véritable URL serait fournie par le service de stockage après le téléchargement
        const mockUrl = URL.createObjectURL(file);
        resolve({
          url: mockUrl,
          filename: file.name
        });
      }, 1000);
    });
  };

  // Requête pour récupérer les photos existantes
  const { data: photos = [], isLoading } = useQuery({
    queryKey: [`/api/furniture/${furnitureId}/photos`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) throw new Error(`Erreur: ${res.status}`);
      return res.json();
    },
  });

  // Mutation pour ajouter une nouvelle photo
  const uploadMutation = useMutation({
    mutationFn: (photoData: PhotoUploadData) => 
      apiRequest('POST', '/api/photos', photoData),
    onSuccess: () => {
      // Réinitialiser le formulaire et invalider le cache
      setPhotoData({
        furnitureId,
        url: "",
        filename: "",
        type: photoTab as any,
        description: "",
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/furniture/${furnitureId}/photos`] });
      toast({
        title: "Photo ajoutée",
        description: "La photo a été ajoutée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter la photo: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer une photo
  const deleteMutation = useMutation({
    mutationFn: (photoId: number) => 
      apiRequest('DELETE', `/api/photos/${photoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/furniture/${furnitureId}/photos`] });
      toast({
        title: "Photo supprimée",
        description: "La photo a été supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la photo: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limiter aux types d'image courants
    if (!file.type.match('image.*')) {
      toast({
        title: "Type de fichier non pris en charge",
        description: "Veuillez sélectionner une image (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simuler le téléchargement (dans un cas réel, téléchargez vers un service de stockage)
      const { url, filename } = await simulateUpload(file);
      
      setPhotoData(prev => ({
        ...prev,
        url,
        filename,
        type: photoTab as any,
      }));
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoData.url) {
      toast({
        title: "Données manquantes",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate(photoData);
  };

  const handleTabChange = (value: string) => {
    setPhotoTab(value);
    setPhotoData(prev => ({
      ...prev,
      type: value as any,
    }));
  };

  const handleDeletePhoto = (photoId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
      deleteMutation.mutate(photoId);
    }
  };

  // Filtrer les photos en fonction de l'onglet actif
  const filteredPhotos = Array.isArray(photos) 
    ? photos.filter((photo: PhotoItem) => photo.type === photoTab)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Photos du meuble</CardTitle>
          <CardDescription>
            Ajoutez des photos pour documenter l'état du meuble avant et après reconditionnement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={photoTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {photoTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>{type.label}</TabsTrigger>
              ))}
            </TabsList>
            
            {photoTypes.map((type) => (
              <TabsContent key={type.value} value={type.value}>
                <div className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="photo">Sélectionner une image</Label>
                        <Input 
                          id="photo" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                      </div>
                      
                      {photoData.url && (
                        <div className="space-y-2">
                          <Label>Aperçu</Label>
                          <div className="relative rounded-md overflow-hidden border border-input h-40 w-full">
                            <img 
                              src={photoData.url} 
                              alt="Aperçu" 
                              className="h-full w-full object-contain" 
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="description">Description (optionnelle)</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Décrivez cette photo..." 
                          rows={3}
                          value={photoData.description || ''}
                          onChange={(e) => setPhotoData(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!photoData.url || uploadMutation.isPending}
                      className="w-full"
                    >
                      {uploadMutation.isPending ? "Téléchargement..." : "Ajouter la photo"}
                      <Upload className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Photos existantes</h3>
                    {isLoading ? (
                      <p>Chargement des photos...</p>
                    ) : filteredPhotos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                        <Image className="h-12 w-12 mb-2 opacity-50" />
                        <p>Aucune photo {type.label.toLowerCase()} disponible</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPhotos.map((photo: PhotoItem) => (
                          <Card key={photo.id} className="overflow-hidden">
                            <div className="relative h-48 w-full">
                              <img 
                                src={photo.url} 
                                alt={photo.description || `Photo ${photo.id}`} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <CardFooter className="flex justify-between items-center py-2">
                              <p className="text-sm truncate max-w-[200px]">
                                {photo.description || `${photo.filename}`}
                              </p>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeletePhoto(photo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoUpload;