import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FurnitureFormData, furnitureTypes, conditions } from "@/lib/types";

const furnitureSchema = z.object({
  type: z.string().min(1, "Le type de meuble est requis"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  condition: z.string().min(1, "L'état est requis"),
  age: z.coerce.number().min(0, "L'âge doit être positif"),
  acquisitionCost: z.string().regex(/^\d+(\.\d{1,2})?$/, "Format de prix invalide"),
  description: z.string().optional(),
  hasPhoto: z.boolean().default(false),
  hasDamage: z.boolean().default(false),
  isComplete: z.boolean().default(true),
});

interface FurnitureDetailsProps {
  defaultValues?: Partial<FurnitureFormData>;
  onValuesChange: (values: FurnitureFormData) => void;
}

const FurnitureDetails: React.FC<FurnitureDetailsProps> = ({ 
  defaultValues = {
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
  }, 
  onValuesChange 
}) => {
  const form = useForm<FurnitureFormData>({
    resolver: zodResolver(furnitureSchema),
    defaultValues,
    mode: "onChange"
  });

  // Watch all form values and notify parent component of changes
  const formValues = form.watch();
  
  // Use effect to notify parent when values change
  useEffect(() => {
    onValuesChange(formValues);
  }, [formValues, onValuesChange]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Détails du Meuble</h3>
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de Meuble</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {furnitureTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modèle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>État Général</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un état" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Âge Estimé (années)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acquisitionCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coût d'Acquisition (€)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description / Notes</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <FormField
              control={form.control}
              name="hasPhoto"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Photo prise</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasDamage"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Dommages constatés</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isComplete"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Meuble complet</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FurnitureDetails;
