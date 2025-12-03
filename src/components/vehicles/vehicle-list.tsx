'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, type WithId } from '@/firebase';
import type { Vehicle } from '@/lib/types';
import { VehicleCard } from './vehicle-card';
import { Skeleton } from '../ui/skeleton';

export function VehicleList() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const vehiclesQuery = useMemo(() => {
    if (!user) return null;
    const ref = collection(firestore, `users/${user.uid}/vehicles`);
    return query(ref, orderBy('createdAt', 'desc'));
  }, [user, firestore]);
  
  const { data: vehicles, isLoading: areVehiclesLoading } = useCollection<Vehicle>(vehiclesQuery as any);

  if (isUserLoading || areVehiclesLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
        <h3 className="text-xl font-bold tracking-tight">Nenhum veículo encontrado</h3>
        <p className="text-sm text-muted-foreground">
          Adicione seu primeiro veículo para começar.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle: WithId<Vehicle>) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
