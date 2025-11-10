"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicles } from "@/lib/dummy-data";
import { useToast } from "@/hooks/use-toast";

export function AddFillUpDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    // Aqui viria a lógica para salvar os dados no backend
    toast({
      title: "Sucesso!",
      description: "Abastecimento salvo com sucesso.",
    });
    setOpen(false); // Fecha o diálogo
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Abastecimento</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do seu último abastecimento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vehicle" className="text-right">
              Veículo
            </Label>
            <Select defaultValue="main-vehicle">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data
            </Label>
            <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="odometer" className="text-right">
              Odômetro (km)
            </Label>
            <Input id="odometer" type="number" placeholder="ex: 50123" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="liters" className="text-right">
              Litros
            </Label>
            <Input id="liters" type="number" step="0.01" placeholder="ex: 42.5" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total-cost" className="text-right">
              Custo Total (R$)
            </Label>
            <Input id="total-cost" type="number" step="0.01" placeholder="ex: 215.50" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Salvar Abastecimento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
