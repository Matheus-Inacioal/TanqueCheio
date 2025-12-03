
'use client';

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CostChart from "@/components/dashboard/cost-chart";
import ConsumptionChart from "@/components/dashboard/consumption-chart";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { FillUp, Vehicle } from "@/lib/types";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import { useReportsData } from "@/lib/data-service";

export default function ReportsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
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
      orderBy("date", "desc")
    );
  }, [user, firestore, primaryVehicle]);
  const { data: fuelLogs, isLoading: areFuelLogsLoading } = useCollection<FillUp>(fuelLogsQuery);
  const isLoading = areVehiclesLoading || areFuelLogsLoading;

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const formattedMonth = useMemo(() => {
    const month = format(currentDate, "MMMM yyyy", { locale: ptBR });
    return month.charAt(0).toUpperCase() + month.slice(1);
  }, [currentDate]);

  const { monthlyCostData, monthlyConsumptionData, allTimeConsumptionData, allTimeCostData, noData } = useReportsData(fuelLogs, currentDate, isLoading);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Analise seus gastos e consumo em detalhes para o veículo: <strong>{primaryVehicle?.name || 'Nenhum'}</strong>
        </p>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Resumo Mensal</TabsTrigger>
          <TabsTrigger value="consumption">Consumo Geral</TabsTrigger>
          <TabsTrigger value="costs">Custos Gerais</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Resumo de {formattedMonth}</CardTitle>
                        <CardDescription>Um resumo do seu desempenho e gastos neste mês.</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                              <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={handleNextMonth}>
                              <ChevronRight className="h-4 w-4" />
                          </Button>
                      </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {noData && !isLoading ? (
                     <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground" />
                        <h3 className="text-xl font-bold tracking-tight mt-4">Sem dados para exibir</h3>
                        <p className="text-sm text-muted-foreground">
                        Comece a adicionar abastecimentos para ver seus relatórios.
                        </p>
                    </div>
                  ) : (
                    <>
                      <CostChart data={monthlyCostData} isLoading={isLoading} />
                      <ConsumptionChart data={monthlyConsumptionData} isLoading={isLoading} />
                    </>
                  )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="consumption" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Análise de Consumo</CardTitle>
                    <CardDescription>Acompanhe a eficiência do seu veículo ao longo do tempo.</CardDescription>
                </CardHeader>
                <CardContent>
                    {noData && !isLoading ? (
                        <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                            <BarChart3 className="w-12 h-12 text-muted-foreground" />
                            <h3 className="text-xl font-bold tracking-tight mt-4">Sem dados para exibir</h3>
                            <p className="text-sm text-muted-foreground">
                            O histórico de consumo aparecerá aqui.
                            </p>
                        </div>
                    ) : (
                      <ConsumptionChart data={allTimeConsumptionData} isLoading={isLoading} />
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="costs" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Análise de Custos</CardTitle>
                    <CardDescription>Veja a evolução dos seus gastos com combustível nos últimos 6 meses.</CardDescription>
                </CardHeader>
                <CardContent>
                    {noData && !isLoading ? (
                        <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                            <BarChart3 className="w-12 h-12 text-muted-foreground" />
                            <h3 className="text-xl font-bold tracking-tight mt-4">Sem dados para exibir</h3>
                            <p className="text-sm text-muted-foreground">
                            O histórico de custos aparecerá aqui.
                            </p>
                        </div>
                    ) : (
                      <CostChart data={allTimeCostData} isLoading={isLoading}/>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
