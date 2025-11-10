export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  fuelType: "Gasoline" | "Ethanol" | "Diesel" | "Flex" | "Electric";
  initialOdometer: number;
  odometer: number;
  avgConsumption: number;
  monthlyCost: number;
  isPrimary: boolean;
};

export type FillUp = {
  id: string;
  vehicleId: string;
  date: string; // or Date
  station?: string;
  odometer: number;
  cost: number;
  pricePerLiter: number;
  liters: number;
  fuelType: "Gasoline" | "Ethanol" | "Diesel";
};

export type MaintenanceAlert = {
    id: string;
    vehicleId: string;
    vehicleName: string;
    name: string;
    intervalKm: number;
    lastServiceOdometer: number;
}
