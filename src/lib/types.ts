import { Timestamp } from "firebase/firestore";

export type Vehicle = {
  id: string;
  userId: string;
  name: string;
  licensePlate?: string;
  fuelType: "Gasoline" | "Ethanol" | "Diesel" | "Flex" | "Electric";
  initialOdometer: number;
  odometer: number;
  isPrimary: boolean;
  createdAt: Timestamp;

  // Esses campos serão calculados e não armazenados diretamente no futuro
  avgConsumption?: number;
  monthlyCost?: number;
};

export type FillUp = {
  id: string;
  vehicleId: string;
  userId: string;
  date: Timestamp;
  station?: string;
  odometer: number;
  cost: number;
  pricePerLiter: number;
  liters: number;
  fuelType: "Gasoline" | "Ethanol" | "Diesel";
  createdAt: Timestamp;
};

export type MaintenanceAlert = {
    id: string;
    vehicleId: string;
    userId: string;
    vehicleName: string; // Denormalized for easy display
    name: string;
    intervalKm: number;
    lastServiceOdometer: number;
    createdAt: Timestamp;
}
