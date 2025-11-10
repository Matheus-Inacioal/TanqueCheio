
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
import { maintenanceAlerts } from "@/lib/dummy-data";

export function MaintenanceAlerts() {
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
            <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Alerta
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {maintenanceAlerts.map((alert) => (
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
                    <Button variant="ghost" size="icon">
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
