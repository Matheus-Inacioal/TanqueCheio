
import { FuelPumpIcon } from "@/components/icons";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="absolute top-8 flex items-center gap-2">
                <FuelPumpIcon className="size-8 text-primary" />
                <