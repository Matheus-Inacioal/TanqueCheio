"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp, query } from "firebase/firestore";
import type { Vehicle } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";

const addFillUpSchema = z.object({
  vehicleId: z.string({ required_error: "Selecione um veículo." }).min(1, "Selecione um veículo."),
  date: z.date({ required_error: "Selecione uma data." }),
  odometer: z.coerce.number().min(1, "O odômetro deve ser maior que zero."),
  liters: z.coerce.number().min(0.1, "A quantidade de litros deve ser maior que zero."),
  totalCost: z.coerce.number().min(0.1, "O custo total deve ser maior que zero."),
  fuelType: z.enum(["Gasoline", "Ethanol", "Diesel"], { required_error: "Selecione o tipo de combustível."}),
});

type AddFillUpFormValues = z.infer<typeof addFillUpSchema>;


export function AddFillUpDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const vehiclesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/vehicles`));
  }, [user, firestore]);
  const { data: vehicles } = useCollection<Vehicle>(vehiclesQuery);

  const form = useForm<AddFillUpFormValues>({
    resolver: zodResolver(addFillUpSchema),
    defaultValues: {
      vehicleId: "",
      date: new Date(),
      odometer: 0,
      liters: 0,
      totalCost: 0,
      fuelType: undefined,
    }
  });

  React.useEffect(() => {
    if (open && vehicles && vehicles.length > 0) {
        const primaryVehicle = vehicles.find(v => v.isPrimary);
        if (primaryVehicle) {
            form.setValue("vehicleId", primaryVehicle.id);
        } else if (vehicles.length > 0) {
            form.setValue("vehicleId", vehicles[0].id);
        }
    }
    if (!open) {
        form.reset({
            vehicleId: "",
            date: new Date(),
            odometer: 0,
            liters: 0,
            totalCost: 0,
            fuelType: undefined,
        });
    }
  }, [vehicles, open, form]);

  const handleSubmit = async (values: AddFillUpFormValues) => {
    if (!user) return;

    const pricePerLiter = values.totalCost / values.liters;

    try {
        const fillUpsRef = collection(firestore, `users/${user.uid}/vehicles/${values.vehicleId}/fuelLogs`);
        await addDoc(fillUpsRef, {
            ...values,
            pricePerLiter,
            userId: user.uid,
            createdAt: serverTimestamp(),
        });
        
        toast({
            title: "Sucesso!",
            description: "Abastecimento salvo com sucesso.",
        });
        setOpen(false);
    } catch (error) {
        console.error("Erro ao salvar abastecimento:", error);
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível salvar o abastecimento."
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4">
        <DialogHeader>
          <DialogTitle>Adicionar Abastecimento</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do seu último abastecimento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Veículo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um veículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles?.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR})
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="odometer" render={({ field }) => (
                    <FormItem><FormLabel>Odômetro (km)</FormLabel><FormControl><Input type="number" placeholder="ex: 50123" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="liters" render={({ field }) => (
                    <FormItem><FormLabel>Litros</FormLabel><FormControl><Input type="number" step="0.01" placeholder="ex: 42.5" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="totalCost" render={({ field }) => (
                    <FormItem><FormLabel>Custo Total (R$)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="ex: 215.50" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>

                <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Combustível</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo de combustível" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Gasoline">Gasolina</SelectItem>
                                    <SelectItem value="Ethanol">Etanol</SelectItem>
                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="submit">Salvar Abastecimento</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
