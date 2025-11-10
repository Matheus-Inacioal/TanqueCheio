"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
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

export function AddVehicleDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Veículo</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do seu veículo para começar a monitorar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input id="name" placeholder="Ex: Carro Principal" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plate" className="text-right">
              Placa
            </Label>
            <Input id="plate" placeholder="Ex: ABC-1234" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="initial-odometer" className="text-right">
              Odômetro Inicial
            </Label>
            <Input id="initial-odometer" type="number" placeholder="Ex: 50000" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fuel-type" className="text-right">
              Combustível
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasolina</SelectItem>
                <SelectItem value="ethanol">Etanol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="electric">Elétrico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar Veículo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
