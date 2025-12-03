'use client';

import { Car, Gauge, MoreVertical, Wallet, Trash2, Star, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useUser, type WithId } from "@/firebase";
import { doc, deleteDoc, writeBatch, collection, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import * as React from "react";


export function VehicleCard({ vehicle }: { vehicle: WithId<Vehicle> }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!user) return;
        const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, vehicle.id);
        try {
            await deleteDoc(vehicleRef);
            toast({
                title: "Veículo excluído",
                description: `${vehicle.name} foi removido com sucesso.`,
            });
        } catch (error) {
            console.error("Erro ao excluir veículo:", error);
            toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: "Não foi possível remover o veículo. Tente novamente.",
            });
        }
    };

    const handleSetAsPrimary = async () => {
        if (!user || vehicle.isPrimary) return;

        const vehiclesRef = collection(firestore, `users/${user.uid}/vehicles`);
        const batch = writeBatch(firestore);

        try {
            // Find the current primary vehicle and set it to false
            const q = query(vehiclesRef, where("isPrimary", "==", true));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((document) => {
                batch.update(document.ref, { isPrimary: false });
            });

            // Set the new vehicle as primary
            const newPrimaryRef = doc(firestore, `users/${user.uid}/vehicles`, vehicle.id);
            batch.update(newPrimaryRef, { isPrimary: true });

            await batch.commit();
            toast({
                title: "Veículo principal atualizado!",
                description: `${vehicle.name} é agora seu veículo principal.`,
            });
        } catch (error) {
            console.error("Erro ao definir veículo principal:", error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível definir o veículo como principal.",
            });
        }
    };


  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">{vehicle.name}</CardTitle>
          <CardDescription>{vehicle.licensePlate}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            {vehicle.isPrimary && <Badge>Principal</Badge>}
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSetAsPrimary} disabled={vehicle.isPrimary}>
                            <Star className="mr-2 h-4 w-4" />
                            Definir como Principal
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o veículo e todos os seus dados associados (abastecimentos, manutenções, etc.).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                          Sim, excluir veículo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <span>Odômetro</span>
            <span className="font-semibold text-foreground">{(vehicle.odometer || vehicle.initialOdometer).toLocaleString('pt-BR')} km</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                <div>
                    <p className="text-xs text-muted-foreground">Consumo Médio</p>
                    <p className="text-sm font-semibold">{vehicle.avgConsumption || "N/A"}</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                    <p className="text-xs text-muted-foreground">Custo Mensal</p>
                    <p className="text-sm font-semibold">{vehicle.monthlyCost ? `R$ ${vehicle.monthlyCost.toFixed(2)}` : "N/A"}</p>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" disabled>Ver Detalhes</Button>
      </CardFooter>
    </Card>
  );
}
