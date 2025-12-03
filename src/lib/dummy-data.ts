import type { Vehicle, MaintenanceAlert } from "./types";

export const vehicles: Vehicle[] = [];

export const costData: { month: string; cost: number }[] = [];

export const consumptionData: { date: string; consumption: number }[] = [];

export const recentActivities: any[] = [];

export const maintenanceAlerts: MaintenanceAlert[] = [];
