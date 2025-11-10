import { vehicles } from "@/lib/dummy-data";
import { VehicleCard } from "./vehicle-card";

export function VehicleList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
