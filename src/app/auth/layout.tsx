
import { FuelPumpIcon } from "@/components/icons";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="absolute top-8 flex items-center gap-2">
                 <Link href="/" className="flex items-center gap-2">
                    <FuelPumpIcon className="size-8 text-primary" />
                    <h1 className="text-xl font-semibold">TanqueCheio</h1>
                </Link>
            </div>
            {children}
        </div>
    );
}
