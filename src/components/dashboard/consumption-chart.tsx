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
import { consumptionData as defaultConsumptionData } from "@/lib/dummy-data"

const chartConfig = {
  consumption: {
    label: "KM/L",
    color: "hsl(var(--primary))",
  },
}

type ConsumptionChartProps = {
    data?: typeof defaultConsumptionData;
}

export default function ConsumptionChart({ data = defaultConsumptionData }: ConsumptionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo (KM/L)</CardTitle>
        <CardDescription>Consumo médio por abastecimento</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
