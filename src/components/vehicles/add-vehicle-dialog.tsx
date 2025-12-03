"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
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
import { useAuth, useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp, writeBatch, doc, getDocs, query, where } from "firebase/firestore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';


const addVehicleSchema = z.object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    licensePlate: z.string().optional(),
    initialOdometer: z.coerce.number().min(0, { message: "A quilometragem deve ser um valor positivo." }),
    fuelType: z.enum(["Gasoline", "Ethanol", "Diesel", "Flex", "Electric"]),
});

type AddVehicleFormValues = z.infer<typeof addVehicleSchema>;

export function AddVehicleDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<AddVehicleFormValues>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      name: "",
      licensePlate: "",
      initialOdometer: 0,
    },
  });

  const handleSubmit = async (values: AddVehicleFormValues) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Você precisa estar logado para adicionar um veículo."
        });
        return;
    }

    try {
        const vehiclesRef = collection(firestore, `users/${user.uid}/vehicles`);

        // Check if this is the first vehicle to be added
        const userVehiclesQuery = query(vehiclesRef);
        const userVehiclesSnapshot = await getDocs(userVehiclesQuery);
        const isFirstVehicle = userVehiclesSnapshot.empty;

        await addDoc(vehiclesRef, {
            ...values,
            userId: user.uid,
            isPrimary: isFirstVehicle, // Set as primary if it's the first one
            createdAt: serverTimestamp(),
        });
      
        toast({
            title: "Sucesso!",
            description: "Veículo adicionado com sucesso.",
        });

        form.reset();
        setOpen(false);
    } catch (error) {
        console.error("Erro ao adicionar veículo:", error);
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível adicionar o veículo. Tente novamente."
        });
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Veículo</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do seu veículo para começar a monitorar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Veículo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Carro Principal" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Placa (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: ABC-1234" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="initialOdometer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Odômetro Inicial (km)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Ex: 50000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Combustível</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o combustível" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Gasoline">Gasolina</SelectItem>
                                    <SelectItem value="Ethanol">Etanol</SelectItem>
                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                    <SelectItem value="Flex">Flex</SelectItem>
                                    <SelectItem value="Electric">Elétrico</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit">Salvar Veículo</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
