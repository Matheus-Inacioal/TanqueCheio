
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
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';


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
  const isLoading = areVehiclesLoading || areFuelLogsLoading;
  
  const { summaryData, recentActivities, costData, consumptionData } = useMemo(() => {
    const emptyState = {
        summaryData: [
            { title: "Consumo Médio", value: "0.0", unit: "km/L" },
            { title: "Gasto Mensal", value: "R$ 0,00" },
            { title: "Último Abastecimento", value: "0 L", subValue: "R$ 0,00" },
            { title: "Distância Mensal", value: "0 km" },
        ],
        recentActivities: [],
        costData: Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(new Date(), i);
            const monthName = format(d, 'MMM', { locale: ptBR });
            return { month: monthName.charAt(0).toUpperCase() + monthName.slice(1), cost: 0 };
        }).reverse(),
        consumptionData: [],
    };

    if (!fuelLogs || fuelLogs.length === 0) {
        return emptyState;
    }

    const vehicleName = primaryVehicle?.name || 'Veículo';
    const lastFillUp = fuelLogs[0];
    
    const recentActivities = fuelLogs.slice(0, 4).map((log) => ({
        id: log.id,
        vehicle: vehicleName,
        description: `Abastecimento de ${log.liters.toFixed(1)}L`,
        date: format(log.date.toDate(), "dd MMM yyyy", { locale: ptBR }),
        type: "fill-up" as const,
    }));

    const now = new Date();
    const currentMonthLogs = fuelLogs.filter(log => {
        const logDate = log.date.toDate();
        return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    });

    const monthlyCost = currentMonthLogs.reduce((sum, log) => sum + log.cost, 0);

    let monthlyDistance = 0;
    if (currentMonthLogs.length > 1) {
        const sorted = [...currentMonthLogs].sort((a, b) => a.odometer - b.odometer);
        monthlyDistance = sorted[sorted.length - 1].odometer - sorted[0].odometer;
    }

    let avgConsumption = 0;
    if (fuelLogs.length > 1) {
        const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
        const totalDistance = sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer;
        const totalLiters = sortedLogs.slice(1).reduce((acc, log) => acc + log.liters, 0);
        if (totalLiters > 0) {
            avgConsumption = totalDistance / totalLiters;
        }
    }

    const summaryData = [
        { title: "Consumo Médio", value: avgConsumption.toFixed(1), unit: "km/L" },
        { title: "Gasto Mensal", value: `R$ ${monthlyCost.toFixed(2)}` },
        { title: "Último Abastecimento", value: `${lastFillUp.liters.toFixed(1)} L`, subValue: `R$ ${lastFillUp.cost.toFixed(2)}` },
        { title: "Distância Mensal", value: `${monthlyDistance.toLocaleString('pt-BR')} km` },
    ];

    const costData = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), i);
        const cost = fuelLogs.filter(log => {
            const logDate = log.date.toDate();
            return logDate.getMonth() === d.getMonth() && logDate.getFullYear() === d.getFullYear();
        }).reduce((sum, log) => sum + log.cost, 0);
        const monthName = format(d, 'MMM', { locale: ptBR });
        return { month: monthName.charAt(0).toUpperCase() + monthName.slice(1), cost };
    }).reverse();

    const consumptionData = fuelLogs.slice(0, 10).reverse().map((log, index, arr) => {
        if (index === 0) return null;
        const prevLog = arr[index - 1];
        if (!prevLog) return null;
        const distance = log.odometer - prevLog.odometer;
        const consumption = distance > 0 && log.liters > 0 ? distance / log.liters : 0;
        return {
            date: format(log.date.toDate(), "dd/MM"),
            consumption: parseFloat(consumption.toFixed(1))
        }
    }).filter(Boolean);

    return { summaryData, recentActivities, costData, consumptionData: consumptionData as { date: string; consumption: number }[] };
}, [fuelLogs, primaryVehicle]);


  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

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
        <span className="text-muted-foreground">
          Visão geral das suas despesas e consumo de combustível para o veículo: <strong>{isLoading ? <Skeleton className="h-4 w-24 inline-block" /> : primaryVehicle?.name || 'Nenhum'}</strong>
        </span>
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
            {!isLoading && recentActivities.map((activity) => (
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
