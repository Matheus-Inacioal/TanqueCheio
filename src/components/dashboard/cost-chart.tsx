
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

type CostChartData = {
    month: string;
    cost: number;
}

const chartConfig = {
  cost: {
    label: "Custo",
    color: "hsl(var(--accent))",
  },
}

type CostChartProps = {
    data?: CostChartData[];
    isLoading?: boolean;
}

export default function CostChart({ data = [], isLoading }: CostChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gasto com Combustível</CardTitle>
        <CardDescription>Gasto mensal nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
      {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="cost"
              type="monotone"
              stroke="var(--color-cost)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
