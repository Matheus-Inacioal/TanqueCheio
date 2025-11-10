
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { generateRandomData } from "@/lib/dummy-data";

export default function ReportsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const formattedMonth = format(currentDate, "MMMM yyyy", { locale: ptBR });
  const capitalizedMonth = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  const { newCostData, newConsumptionData } = useMemo(() => generateRandomData(currentDate), [currentDate]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Analise seus gastos e consumo em detalhes.
        </p>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Resumo Mensal</TabsTrigger>
          <TabsTrigger value="consumption">Consumo</TabsTrigger>
          <TabsTrigger value="costs">Custos</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Resumo de {capitalizedMonth}</CardTitle>
                        <CardDescription>Um resumo do seu desempenho e gastos este mês.</CardDescription>
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
                    <CostChart data={newCostData} />
                    <ConsumptionChart data={newConsumptionData} />
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
                    <ConsumptionChart data={newConsumptionData}/>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="costs" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Análise de Custos</CardTitle>
                    <CardDescription>Veja para onde seu dinheiro está indo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CostChart data={newCostData}/>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
