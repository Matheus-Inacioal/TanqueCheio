
"use client";

import { BellRing, PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useUser, type WithId } from "@/firebase";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import type { MaintenanceAlert } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function MaintenanceAlerts() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const alertsQuery = useMemoFirebase(() => {
        if (!user) return null;
        // This query is simplified. In a real app, you would likely query across all vehicle subcollections.
        // For now, we assume a flat structure or need to improve this query later.
        const ref = collection(firestore, `users/${user.uid}/maintenanceAlerts`);
        return query(ref, orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const { data: maintenanceAlerts, isLoading: areAlertsLoading } = useCollection<MaintenanceAlert>(alertsQuery);

    const handleDelete = async (alertId: string) => {
        if (!user) return;
        const alertRef = doc(firestore, `users/${user.uid}/maintenanceAlerts`, alertId);
        try {
            await deleteDoc(alertRef);
            toast({
                title: "Alerta removido",
                description: "O alerta de manutenção foi excluído.",
            });
        } catch (error) {
            console.error("Erro ao excluir alerta:", error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível remover o alerta.",
            });
        }
    };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Alertas de Manutenção</CardTitle>
                <CardDescription>
                Configure alertas baseados na quilometragem para nunca mais esquecer a manutenção.
                </CardDescription>
            </div>
            <Button size="sm" disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Alerta
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {(isUserLoading || areAlertsLoading) && (
                <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </>
            )}
            {maintenanceAlerts && maintenanceAlerts.length === 0 && !areAlertsLoading &&(
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                    <h3 className="text-xl font-bold tracking-tight">Nenhum alerta configurado</h3>
                    <p className="text-sm text-muted-foreground">
                    Crie seu primeiro alerta de manutenção.
                    </p>
                </div>
            )}
            {maintenanceAlerts && maintenanceAlerts.map((alert: WithId<MaintenanceAlert>) => (
                <div key={alert.id} className="flex items-start justify-between p-3 rounded-lg border bg-background hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                           <BellRing className="w-5 h-5 text-muted-foreground"/>
                        </div>
                        <div className="grid gap-1">
                            <p className="text-sm font-semibold leading-none">
                                {alert.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {alert.vehicleName} - A cada {alert.intervalKm.toLocaleString('pt-BR')} km
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                        <span className="sr-only">Excluir Alerta</span>
                    </Button>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
