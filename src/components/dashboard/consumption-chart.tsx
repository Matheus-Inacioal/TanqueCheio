
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "../ui/skeleton"

type ConsumptionData = {
    date: string;
    consumption: number;
}

const chartConfig = {
  consumption: {
    label: "KM/L",
    color: "hsl(var(--primary))",
  },
}

type ConsumptionChartProps = {
    data?: ConsumptionData[];
    isLoading?: boolean;
}

export default function ConsumptionChart({ data = [], isLoading }: ConsumptionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo (KM/L)</CardTitle>
        <CardDescription>Consumo médio por abastecimento</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <Skeleton className="h-[250px] w-full" />
        ) : (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 5)}
                />
                <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                unit=" km/L"
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="consumption" fill="var(--color-consumption)" radius={4} />
            </BarChart>
            </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
