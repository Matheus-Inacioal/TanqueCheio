
'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/firebase";
import { FuelPumpIcon } from "@/components/icons";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <FuelPumpIcon className="size-12 text-primary animate-pulse" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

    