import type { Vehicle, MaintenanceAlert } from "./types";

export const vehicles: Vehicle[] = [
  {
    id: "main-vehicle",
    name: "Onix Plus",
    plate: "BRA-2E19",
    fuelType: "Flex",
    initialOdometer: 50000,
    odometer: 62500,
    avgConsumption: 14.2,
    monthlyCost: 450.75,
    isPrimary: true,
  },
  {
    id: "secondary-vehicle",
    name: "Moto CG 160",
    plate: "FAN-160C",
    fuelType: "Gasoline",
    initialOdometer: 15000,
    odometer: 18230,
    avgConsumption: 41.0,
    monthlyCost: 120.50,
    isPrimary: false,
  },
];

export const costData = [
  { month: "Jun", cost: 350 },
  { month: "Jul", cost: 420 },
  { month: "Ago", cost: 390 },
  { month: "Set", cost: 510 },
  { month: "Out", cost: 470 },
  { month: "Nov", cost: 480.50 },
];

export const consumptionData = [
    { date: "15/10", consumption: 11.8 },
    { date: "22/10", consumption: 12.1 },
    { date: "30/10", consumption: 11.5 },
    { date: "05/11", consumption: 12.5 },
    { date: "12/11", consumption: 12.3 },
    { date: "20/11", consumption: 12.8 },
];

export const recentActivities = [
    { id: 1, vehicle: "Onix Plus", description: "Abastecimento de 40L", date: "20 Nov 2024", type: "fill-up"},
    { id: 2, vehicle: "Onix Plus", description: "Troca de óleo realizada", date: "15 Nov 2024", type: "maintenance"},
    { id: 3, vehicle: "Moto CG 160", description: "Abastecimento de 10L", date: "12 Nov 2024", type: "fill-up"},
    { id: 4, vehicle: "Onix Plus", description: "Abastecimento de 38.5L", date: "05 Nov 2024", type: "fill-up"},
];


export const maintenanceAlerts: MaintenanceAlert[] = [
    {
        id: "alert-1",
        vehicleId: "main-vehicle",
        vehicleName: "Onix Plus",
        name: "Troca de Óleo",
        intervalKm: 10000,
        lastServiceOdometer: 60000,
    },
    {
        id: "alert-2",
        vehicleId: "main-vehicle",
        vehicleName: "Onix Plus",
        name: "Rodízio de Pneus",
        intervalKm: 5000,
        lastServiceOdometer: 60000,
    },
    {
        id: "alert-3",
        vehicleId: "secondary-vehicle",
        vehicleName: "Moto CG 160",
        name: "Troca de Óleo",
        intervalKm: 4000,
        lastServiceOdometer: 16000,
    }
]
