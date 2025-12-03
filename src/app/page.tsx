'use client';
import { useUser } from "@/firebase";
import { FuelPumpIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <FuelPumpIcon className="size-12 text-primary animate-pulse" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
