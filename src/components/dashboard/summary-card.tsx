import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
  subValue?: string;
  change?: string;
  changeType?: "increase" | "decrease";
};

export default function SummaryCard({
  icon,
  title,
  value,
  unit,
  subValue,
  change,
  changeType,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
        {change && (
          <p
            className={cn(
              "text-xs text-muted-foreground",
              changeType === "increase" && "text-emerald-500",
              changeType === "decrease" && "text-red-500"
            )}
          >
            {change} em relação ao mês passado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
