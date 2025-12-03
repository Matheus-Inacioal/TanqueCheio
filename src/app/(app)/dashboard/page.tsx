
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
import { useUser, useFirestore, useCollection, type WithId } from "@/firebase";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import type { Vehicle, FillUp } from "@/lib/types";
import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const { summaryData, recentActivities, costData, consumptionData } = useMemo(() => {
    if (!fuelLogs || fuelLogs.length === 0) {
      const emptySummary = [
        { icon: <Gauge className="text-primary" />, title: "Consumo Médio", value: "0", unit: "km/L" },
        { icon: <Wallet className="text-primary" />, title: "Gasto Mensal", value: "R$ 0,00" },
        { icon: <Droplets className="text-primary" />, title: "Último Abastecimento", value: "0 L", subValue: "R$ 0,00" },
        { icon: <Car className="text-primary" />, title: "Distância Mensal", value: "0 km" },
      ];
      return { summaryData: emptySummary, recentActivities: [], costData: [], consumptionData: [] };
    }

    // Recent Activities
    const recentActivities = fuelLogs.slice(0, 4).map((log: WithId<FillUp>) => ({
      id: log.id,
      vehicle: primaryVehicle?.name || 'Veículo',
      description: `Abastecimento de ${log.liters.toFixed(1)}L`,
      date: format(log.date.toDate(), "dd MMM yyyy", { locale: ptBR }),
      type: "fill-up",
    }));

    // Summary Cards Calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyLogs = fuelLogs.filter(log => {
      const logDate = log.date.toDate();
      return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    });

    const monthlyCost = monthlyLogs.reduce((sum, log) => sum + log.cost, 0);

    const firstOdometerThisMonth = monthlyLogs.length > 0 ? Math.min(...monthlyLogs.map(l => l.odometer)) : 0;
    const lastOdometerThisMonth = monthlyLogs.length > 0 ? Math.max(...monthlyLogs.map(l => l.odometer)) : 0;
    const monthlyDistance = lastOdometerThisMonth - firstOdometerThisMonth;

    const lastFillUp = fuelLogs[0];

    // Average consumption
    let avgConsumption = 0;
    if (fuelLogs.length > 1) {
        const sortedLogs = [...fuelLogs].sort((a,b) => a.odometer - b.odometer);
        const totalDistance = sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer;
        const totalLiters = sortedLogs.slice(1).reduce((acc, log) => acc + log.liters, 0);
        if (totalLiters > 0) {
            avgConsumption = totalDistance / totalLiters;
        }
    }


    const summaryData = [
      {
        icon: <Gauge className="text-primary" />,
        title: "Consumo Médio",
        value: avgConsumption.toFixed(1),
        unit: "km/L",
      },
      {
        icon: <Wallet className="text-primary" />,
        title: "Gasto Mensal",
        value: `R$ ${monthlyCost.toFixed(2)}`,
      },
      {
        icon: <Droplets className="text-primary" />,
        title: "Último Abastecimento",
        value: `${lastFillUp.liters.toFixed(1)} L`,
        subValue: `R$ ${lastFillUp.cost.toFixed(2)}`,
      },
      {
        icon: <Car className="text-primary" />,
        title: "Distância Mensal",
        value: `${monthlyDistance.toLocaleString('pt-BR')} km`,
      },
    ];

    // Chart Data
    const costData = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const month = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        const monthlyCost = fuelLogs.filter(log => {
            const logDate = log.date.toDate();
            return logDate.getMonth() === d.getMonth() && logDate.getFullYear() === year;
        }).reduce((sum, log) => sum + log.cost, 0);
        return { month, cost: monthlyCost };
    }).reverse();

    const consumptionData = fuelLogs.slice(0, 6).reverse().map((log, index, arr) => {
        if (index === 0) return null;
        const prevLog = arr[index - 1];
        const distance = log.odometer - prevLog.odometer;
        const consumption = distance > 0 && log.liters > 0 ? distance / log.liters : 0;
        return {
            date: format(log.date.toDate(), "dd/MM"),
            consumption: parseFloat(consumption.toFixed(1))
        }
    }).filter(Boolean);


    return { summaryData, recentActivities, costData, consumptionData: consumptionData as any };

  }, [fuelLogs, primaryVehicle]);

  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const isLoading = areVehiclesLoading || areFuelLogsLoading;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas despesas e consumo de combustível para o veículo: <strong>{primaryVehicle?.name || 'Nenhum'}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data, index) => (
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
            {isLoading && <p>Carregando atividades...</p>}
            {!isLoading && recentActivities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma atividade recente para exibir.</p>
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
