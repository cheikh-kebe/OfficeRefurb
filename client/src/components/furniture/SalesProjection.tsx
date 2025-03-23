import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { SalesProjectionData } from "@/lib/types";

const salesProjectionSchema = z.object({
  marketValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Format de prix invalide"),
  expectedSellTime: z.coerce.number().min(1, "Le délai doit être d'au moins 1 jour"),
  salesNotes: z.string().optional(),
});

interface SalesProjectionProps {
  defaultValues?: Partial<SalesProjectionData>;
  onValuesChange: (values: SalesProjectionData) => void;
}

const SalesProjection: React.FC<SalesProjectionProps> = ({ 
  defaultValues = {
    marketValue: "0",
    expectedSellTime: 14,
    salesNotes: ""
  }, 
  onValuesChange 
}) => {
  const form = useForm<SalesProjectionData>({
    resolver: zodResolver(salesProjectionSchema),
    defaultValues,
    mode: "onChange"
  });

  // Watch for form value changes
  const formValues = form.watch();
  
  // Notify parent component of value changes
  useEffect(() => {
    onValuesChange(formValues);
  }, [formValues, onValuesChange]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Projection des Ventes</h3>
      <Form {...form}>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marketValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de Vente Estimé (€)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedSellTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Délai de Vente Estimé (jours)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="salesNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes sur la Commercialisation</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SalesProjection;
