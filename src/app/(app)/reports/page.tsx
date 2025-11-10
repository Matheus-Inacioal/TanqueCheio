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

export default function ReportsPage() {
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
                    <CardTitle>Resumo de Novembro 2024</CardTitle>
                    <CardDescription>Um resumo do seu desempenho e gastos este mês.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <CostChart />
                    <ConsumptionChart />
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
                    <ConsumptionChart />
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
                    <CostChart />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
