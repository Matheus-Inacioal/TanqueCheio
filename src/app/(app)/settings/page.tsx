import { Separator } from "@/components/ui/separator";
import { MaintenanceAlerts } from "@/components/settings/maintenance-alerts";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e do aplicativo.
        </p>
      </div>
      <Separator />
      
      <MaintenanceAlerts />

    </div>
  );
}
