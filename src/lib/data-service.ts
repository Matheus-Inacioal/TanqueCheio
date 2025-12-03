
import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { FillUp, Vehicle } from './types';

const processData = (fuelLogs: FillUp[] | null, primaryVehicle: Vehicle | undefined) => {
    
    // Guarda de segurança para retornar um estado vazio se não houver abastecimentos
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
            noData: true,
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
    }).filter(Boolean);

    return { summaryData, recentActivities, costData, consumptionData, noData: false };
};


export const useDashboardData = (fuelLogs: FillUp[] | null, primaryVehicle: Vehicle | undefined, isLoading: boolean) => {
    return useMemo(() => {
        if (isLoading) {
             const emptyCostData = Array.from({ length: 6 }).map((_, i) => {
                const d = subMonths(new Date(), i);
                const monthName = format(d, 'MMM', { locale: ptBR });
                return { month: monthName.charAt(0).toUpperCase() + monthName.slice(1), cost: 0 };
            }).reverse();
            return {
                summaryData: Array(4).fill({}),
                recentActivities: [],
                costData: emptyCostData,
                consumptionData: [],
                noData: true,
            };
        }
        return processData(fuelLogs, primaryVehicle);
    }, [fuelLogs, primaryVehicle, isLoading]);
};

export const useReportsData = (fuelLogs: FillUp[] | null, currentDate: Date, isLoading: boolean) => {
    return useMemo(() => {
        if (isLoading || !fuelLogs || fuelLogs.length === 0) {
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
        
        const monthlyLogs = fuelLogs.filter(log => {
            const logDate = log.date.toDate();
            return logDate >= start && logDate <= end;
        });
    
        const monthlyCost = monthlyLogs.reduce((sum, log) => sum + log.cost, 0);
        const monthName = format(currentDate, "MMM", { locale: ptBR });
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        const monthlyCostData = [{ month: capitalizedMonth, cost: monthlyCost }];
    
        const monthlyConsumptionData = monthlyLogs.slice().sort((a,b) => a.odometer - b.odometer).map((log, index, arr) => {
            if (index === 0) return null;
            const prevLog = arr[index - 1];
            if (!prevLog) return null;
            const distance = log.odometer - prevLog.odometer;
            const consumption = distance > 0 && log.liters > 0 ? distance / log.liters : 0;
            return {
                date: format(log.date.toDate(), "dd/MM"),
                consumption: parseFloat(consumption.toFixed(1))
            };
        }).filter(Boolean) as { date: string; consumption: number; }[];
    
        const allTimeConsumptionData = fuelLogs.slice().sort((a,b) => a.odometer - b.odometer).slice(-10).map((log, index, arr) => {
            if (index === 0) return null;
            const prevLog = arr[index - 1];
            if (!prevLog) return null;
            const distance = log.odometer - prevLog.odometer;
            const consumption = distance > 0 && log.liters > 0 ? distance / log.liters : 0;
            return {
                date: format(log.date.toDate(), "dd/MM"),
                consumption: parseFloat(consumption.toFixed(1))
            };
        }).filter(Boolean) as { date: string; consumption: number; }[];
    
        const allTimeCostData = Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(new Date(), i);
            const cost = fuelLogs.filter(log => {
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
            noData: monthlyLogs.length === 0,
        };
      }, [fuelLogs, currentDate, isLoading]);
};
