
'use client';

import { useMemo } from 'react';
import type { WithId } from '@/firebase';
import type { FillUp, Vehicle } from '@/lib/types';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos para os dados processados
type SummaryData = {
  title: string;
  value: string;
  unit?: string;
  subValue?: string;
};

type RecentActivity = {
  id: string;
  vehicle: string;
  description: string;
  date: string;
  type: 'fill-up' | 'maintenance';
};

type ChartData = {
  month: string;
  cost: number;
};

type ConsumptionChartData = {
  date: string;
  consumption: number;
};

type ProcessedData = {
  summaryData: SummaryData[];
  recentActivities: RecentActivity[];
  costData: ChartData[];
  consumptionData: ConsumptionChartData[];
};

/**
 * Gera dados de exemplo para o dashboard quando não há dados reais.
 */
function getMockData(): ProcessedData {
  const now = new Date();

  // Gera 10 abastecimentos fictícios nos últimos 3 meses
  const mockFuelLogs: FillUp[] = Array.from({ length: 10 }).map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 8);
    const odometer = 50000 - i * 350;
    const liters = 35 + Math.random() * 10;
    const pricePerLiter = 5.5 + Math.random() * 0.5;
    const cost = liters * pricePerLiter;
    return {
      id: `mock-${i}`,
      vehicleId: 'mock-vehicle-id',
      userId: 'mock-user-id',
      date: { toDate: () => date } as any, // Simula o Timestamp do Firestore
      odometer,
      liters,
      cost,
      pricePerLiter,
      fuelType: 'Gasoline',
      createdAt: { toDate: () => date } as any,
    };
  });
  
  // Cria um veículo fictício apenas para a função de processamento
  const mockVehicle: WithId<Vehicle> = {
    id: 'mock-vehicle-id',
    name: 'Veículo de Exemplo',
    userId: 'mock-user-id',
    isPrimary: true,
    initialOdometer: 45000,
    odometer: 50000,
    fuelType: 'Flex',
    createdAt: { toDate: () => new Date() } as any,
  };

  return processData(mockFuelLogs as WithId<FillUp>[], mockVehicle);
}


/**
 * Processa os logs de combustível (reais ou fictícios) para gerar os dados do dashboard.
 * @param fuelLogs Array de logs de combustível.
 * @param primaryVehicle O veículo principal.
 */
function processData(fuelLogs: WithId<FillUp>[], primaryVehicle: WithId<Vehicle> | undefined): ProcessedData {
    // Se não houver logs, retorna um estado completamente zerado.
    if (!fuelLogs || fuelLogs.length === 0) {
        const emptyCostData = Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(new Date(), i);
            const monthName = format(d, 'MMM', { locale: ptBR });
            return { month: monthName.charAt(0).toUpperCase() + monthName.slice(1), cost: 0 };
        }).reverse();

        return {
            summaryData: [
                { title: "Consumo Médio", value: "0.0", unit: "km/L" },
                { title: "Gasto Mensal", value: "R$ 0,00" },
                { title: "Último Abastecimento", value: "0 L", subValue: "R$ 0,00" },
                { title: "Distância Mensal", value: "0 km" },
            ],
            recentActivities: [],
            costData: emptyCostData,
            consumptionData: [],
        };
    }
    
    const vehicleName = primaryVehicle?.name || 'Veículo';
    const lastFillUp = fuelLogs[0];

    const recentActivities = fuelLogs.slice(0, 4).map((log) => ({
      id: log.id,
      vehicle: vehicleName,
      description: `Abastecimento de ${log.liters.toFixed(1)}L`,
      date: format(log.date.toDate(), "dd MMM yyyy", { locale: ptBR }),
      type: "fill-up" as const,
    }));

    const now = new Date();
    const currentMonthLogs = fuelLogs.filter(log => {
      const logDate = log.date.toDate();
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    });

    const monthlyCost = currentMonthLogs.reduce((sum, log) => sum + log.cost, 0);

    let monthlyDistance = 0;
    if (currentMonthLogs.length > 1) {
        const sorted = [...currentMonthLogs].sort((a,b) => a.odometer - b.odometer);
        monthlyDistance = sorted[sorted.length - 1].odometer - sorted[0].odometer;
    }

    let avgConsumption = 0;
    if (fuelLogs.length > 1) {
        const sortedLogs = [...fuelLogs].sort((a,b) => a.odometer - b.odometer);
        const totalDistance = sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer;
        const totalLiters = sortedLogs.slice(1).reduce((acc, log) => acc + log.liters, 0);
        if (totalLiters > 0) {
            avgConsumption = totalDistance / totalLiters;
        }
    }

    const summaryData = [
      { title: "Consumo Médio", value: avgConsumption.toFixed(1), unit: "km/L" },
      { title: "Gasto Mensal", value: `R$ ${monthlyCost.toFixed(2)}`},
      { title: "Último Abastecimento", value: lastFillUp ? `${lastFillUp.liters.toFixed(1)} L` : '0 L', subValue: lastFillUp ? `R$ ${lastFillUp.cost.toFixed(2)}` : 'R$ 0,00'},
      { title: "Distância Mensal", value: `${monthlyDistance.toLocaleString('pt-BR')} km`},
    ];

    const costData = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), i);
        const cost = fuelLogs.filter(log => {
            const logDate = log.date.toDate();
            return logDate.getMonth() === d.getMonth() && logDate.getFullYear() === d.getFullYear();
        }).reduce((sum, log) => sum + log.cost, 0);
        const monthName = format(d, 'MMM', { locale: ptBR });
        return { month: monthName.charAt(0).toUpperCase() + monthName.slice(1), cost };
    }).reverse();

    const consumptionData = fuelLogs.slice(0, 10).reverse().map((log, index, arr) => {
        if (index === 0) return null;
        const prevLog = arr[index - 1];
        if(!prevLog) return null;
        const distance = log.odometer - prevLog.odometer;
        const consumption = distance > 0 && log.liters > 0 ? distance / log.liters : 0;
        return {
            date: format(log.date.toDate(), "dd/MM"),
            consumption: parseFloat(consumption.toFixed(1))
        }
    }).filter(Boolean) as ConsumptionChartData[];

    return { summaryData, recentActivities, costData, consumptionData };
}

export function useDashboardData(fuelLogs: WithId<FillUp>[] | null, primaryVehicle: WithId<Vehicle> | undefined, areFuelLogsLoading: boolean) {
  return useMemo(() => {
    // Se estiver carregando, retorne um estado vazio para os componentes de UI lidarem.
    if (areFuelLogsLoading) {
      return processData([], undefined);
    }
    // Se não houver logs de combustível, use os dados mockados.
    if (!fuelLogs || fuelLogs.length === 0) {
      return getMockData();
    }
    // Caso contrário, processe os dados reais.
    return processData(fuelLogs, primaryVehicle);
  }, [fuelLogs, primaryVehicle, areFuelLogsLoading]);
}

export function useReportsData(fuelLogs: WithId<FillUp>[] | null, primaryVehicle: WithId<Vehicle> | undefined, areFuelLogsLoading: boolean, currentDate: Date) {
    return useMemo(() => {
        const dataToProcess = (!fuelLogs || fuelLogs.length === 0) && !areFuelLogsLoading ? getMockData().recentActivities.map(a => ({...a, date: { toDate: () => new Date(a.date) }, liters: parseFloat(a.description.split(' ')[2]), cost: 100, odometer: 50000 - Math.random() * 1000 }) as unknown as WithId<FillUp>) : fuelLogs;

        if (!dataToProcess || dataToProcess.length === 0) {
            return {
                monthlyCostData: [],
                monthlyConsumptionData: [],
                allTimeConsumptionData: [],
                allTimeCostData: [],
                noData: true
            };
        }

        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const capitalizedMonth = format(currentDate, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase());

        const monthlyLogs = dataToProcess.filter(log => {
            const logDate = log.date.toDate();
            return logDate >= start && logDate <= end;
        });

        const monthlyCost = monthlyLogs.reduce((sum, log) => sum + log.cost, 0);
        const monthlyCostData = [{ month: capitalizedMonth.split(' ')[0], cost: monthlyCost }];

        const monthlyConsumptionData = monthlyLogs.slice().sort((a,b) => a.odometer - b.odometer).map((log, index, arr) => {
            if (index === 0) return null;
            const prevLog = arr[index - 1];
            const distance = log.odometer - prevLog.odometer;
            const consumption = distance > 0 && log.liters > 0 ? distance / log.liters : 0;
            return {
                date: format(log.date.toDate(), "dd/MM"),
                consumption: parseFloat(consumption.toFixed(1))
            };
        }).filter(Boolean) as ConsumptionChartData[];

        const allTimeConsumptionData = dataToProcess.slice().sort((a,b) => a.odometer - b.odometer).slice(-10).map((log, index, arr) => {
            if (index === 0) return null;
            const prevLog = arr[index - 1];
            const distance = log.odometer - prevLog.odometer;
            const consumption = distance > 0 && log.liters > 0 ? distance / log.liters : 0;
            return {
                date: format(log.date.toDate(), "dd/MM"),
                consumption: parseFloat(consumption.toFixed(1))
            };
        }).filter(Boolean) as ConsumptionChartData[];

        const allTimeCostData = Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(new Date(), i);
            const cost = dataToProcess.filter(log => {
                const logDate = log.date.toDate();
                return logDate.getMonth() === d.getMonth() && logDate.getFullYear() === d.getFullYear();
            }).reduce((sum, log) => sum + log.cost, 0);
            const monthName = format(d, 'MMM', { locale: ptBR });
            return { month: monthName.charAt(0).toUpperCase() + monthName.slice(1), cost };
        }).reverse();

        return {
            monthlyCostData,
            monthlyConsumptionData,
            allTimeConsumptionData,
            allTimeCostData,
            noData: false
        };

    }, [fuelLogs, primaryVehicle, areFuelLogsLoading, currentDate]);
}
