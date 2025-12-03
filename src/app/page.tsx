'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FuelPumpIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <FuelPumpIcon className="size-12 text-primary animate-pulse" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
