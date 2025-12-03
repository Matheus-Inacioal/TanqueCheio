
'use client';

import { Car, Droplets, Gauge, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SummaryCard from "@/components/dashboard/summary-card";
import CostChart from "@/components/dashboard/cost-chart";
import ConsumptionChart from "@/components/dashboard/consumption-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { FillUp, Vehicle } from "@/lib/types";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/lib/data-service";

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const vehiclesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/vehicles`));
  }, [user, firestore]);

  const { data: vehicles, isLoading: areVehiclesLoading } = useCollection<Vehicle>(vehiclesQuery);

  const primaryVehicle = useMemo(() => vehicles?.find(v => v.isPrimary), [vehicles]);

  const fuelLogsQuery = useMemoFirebase(() => {
    if (!user || !primaryVehicle) return null;
    return query(
      collection(firestore, `users/${user.uid}/vehicles/${primaryVehicle.id}/fuelLogs`),
      orderBy("date", "desc"),
      limit(50) // Limit to last 50 for performance
    );
  }, [user, firestore, primaryVehicle]);

  const { data: fuelLogs, isLoading: areFuelLogsLoading } = useCollection<FillUp>(fuelLogsQuery);

  const { summaryData, recentActivities, costData, consumptionData } = useDashboardData(fuelLogs, primaryVehicle, areFuelLogsLoading);

  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const isLoading = areVehiclesLoading || areFuelLogsLoading;

  const finalSummaryData = useMemo(() => [
    { icon: <Gauge className="text-primary" />, ...summaryData[0] },
    { icon: <Wallet className="text-primary" />, ...summaryData[1] },
    { icon: <Droplets className="text-primary" />, ...summaryData[2] },
    { icon: <Car className="text-primary" />, ...summaryData[3] },
  ], [summaryData]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas despesas e consumo de combustível para o veículo: <strong>{primaryVehicle?.name || 'Nenhum'}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {finalSummaryData.map((data, index) => (
          <SummaryCard key={index} {...data} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CostChart data={costData} isLoading={isLoading} />
        <ConsumptionChart data={consumptionData} isLoading={isLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
            {!isLoading && recentActivities.length === 0 && (
                <div className="text-center py-12">
                     <p className="text-sm text-muted-foreground">Nenhuma atividade recente para exibir.</p>
                </div>
            )}
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={userAvatar?.imageUrl} alt="Avatar" data-ai-hint={userAvatar?.imageHint} />
                    <AvatarFallback>{primaryVehicle?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.vehicle} - {activity.date}
                    </p>
                  </div>
                </div>
                <Badge variant={activity.type === "fill-up" ? "default" : "secondary"} className="whitespace-nowrap">
                   {activity.type === "fill-up" ? "Abastecimento" : "Manutenção"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
