
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
import { recentActivities } from "@/lib/dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function DashboardPage() {
  const summaryData = [
    {
      icon: <Gauge className="text-primary" />,
      title: "Consumo Médio",
      value: "12.5",
      unit: "km/L",
      change: "+2.1%",
      changeType: "increase",
    },
    {
      icon: <Wallet className="text-primary" />,
      title: "Gasto Mensal",
      value: "R$ 480,50",
      change: "-5.3%",
      changeType: "decrease",
    },
    {
      icon: <Droplets className="text-primary" />,
      title: "Último Abastecimento",
      value: "42.5 L",
      subValue: "R$ 215,00",
    },
    {
      icon: <Car className="text-primary" />,
      title: "Distância Mensal",
      value: "1.250 km",
      change: "+10%",
      changeType: "increase",
    },
  ];
  
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas despesas e consumo de combustível.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data, index) => (
          <SummaryCard key={index} {...data} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CostChart />
        <ConsumptionChart />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={userAvatar?.imageUrl} alt="Avatar" data-ai-hint={userAvatar?.imageHint} />
                    <AvatarFallback>{activity.vehicle.charAt(0)}</AvatarFallback>
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
