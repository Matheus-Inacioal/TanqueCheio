import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { VehicleList } from "@/components/vehicles/vehicle-list";
import { AddVehicleDialog } from "@/components/vehicles/add-vehicle-dialog";

export default function VehiclesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Meus Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie sua frota de veículos.
          </p>
        </div>
        <AddVehicleDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Veículo
            </Button>
        </AddVehicleDialog>
      </div>

      <VehicleList />

    </div>
  );
}
