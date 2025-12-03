import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type SummaryCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
  subValue?: string;
  change?: string;
  changeType?: "increase" | "decrease";
  isLoading?: boolean;
};

export default function SummaryCard({
  icon,
  title,
  value,
  unit,
  subValue,
  change,
  changeType,
  isLoading
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
        ) : (
            <div className="text-2xl font-bold">
            {value}
            {unit && <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>}
            </div>
        )}
        {isLoading ? (
            <Skeleton className="h-3 w-1/2 mt-1" />
        ) : subValue ? (
            <p className="text-xs text-muted-foreground">{subValue}</p>
        ) : null }
        
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
