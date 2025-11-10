import { Car, Gauge, MoreVertical, Wallet } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">{vehicle.name}</CardTitle>
          <CardDescription>{vehicle.plate}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            {vehicle.isPrimary && <Badge>Principal</Badge>}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Definir como Principal</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <span>Última atualização do odômetro</span>
            <span className="font-semibold text-foreground">{vehicle.odometer.toLocaleString('pt-BR')} km</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                <div>
                    <p className="text-xs text-muted-foreground">Consumo Médio</p>
                    <p className="text-sm font-semibold">{vehicle.avgConsumption} km/L</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                    <p className="text-xs text-muted-foreground">Custo Mensal</p>
                    <p className="text-sm font-semibold">R$ {vehicle.monthlyCost.toFixed(2)}</p>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Ver Detalhes</Button>
      </CardFooter>
    </Card>
  );
}
