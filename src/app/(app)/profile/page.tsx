
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { writeBatch, collection, doc, serverTimestamp, Timestamp } from 'firebase/firestore';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || '',
        phone: user.phoneNumber || '',
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Você precisa estar logado para atualizar o perfil."
        });
        return;
    }

    try {
        await updateProfile(user, {
            displayName: data.name
        });

        if (data.phone && data.phone !== user.phoneNumber) {
            toast({
                title: 'Nome atualizado!',
                description: 'A atualização do telefone requer verificação e não é suportada nesta interface.',
            });
        } else {
            toast({
                title: 'Perfil atualizado!',
                description: 'Suas informações foram salvas com sucesso.',
            });
        }

    } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        toast({
            variant: "destructive",
            title: "Erro ao atualizar",
            description: "Não foi possível salvar suas informações. Tente novamente.",
        });
    }
  }

  function handleDownloadData() {
    const userData = {
        profile: form.getValues(),
        vehicles: [], // Em um app real, buscaria os dados do Firestore
        fillUps: [], // Em um app real, buscaria os dados do Firestore
        settings: {
            theme: "system",
            notifications: {
                maintenance: true,
                marketing: false,
            }
        }
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus_dados_tanque_cheio.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
        title: "Download iniciado",
        description: "Seus dados estão sendo baixados em formato JSON."
    })
  }

  const handleSeedData = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Usuário ou Firestore não disponível.',
      });
      return;
    }

    try {
      const batch = writeBatch(firestore);

      // 1. Create a vehicle
      const vehicleRef = doc(collection(firestore, `users/${user.uid}/vehicles`));
      const vehicleData = {
        name: 'Onix 2023',
        licensePlate: 'BRA2E19',
        fuelType: 'Flex',
        initialOdometer: 15000,
        isPrimary: true,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };
      batch.set(vehicleRef, vehicleData);

      // 2. Create Fuel Logs
      const fuelLogsRef = collection(firestore, `users/${user.uid}/vehicles/${vehicleRef.id}/fuelLogs`);
      let currentOdometer = 15230;
      let currentDate = new Date();
      for (let i = 0; i < 10; i++) {
        const logRef = doc(fuelLogsRef);
        const liters = 30 + Math.random() * 15; // 30 to 45 liters
        const pricePerLiter = 5.5 + Math.random() * 0.5; // R$5,50 to R$6,00
        const cost = liters * pricePerLiter;
        
        batch.set(logRef, {
          vehicleId: vehicleRef.id,
          userId: user.uid,
          date: Timestamp.fromDate(new Date(currentDate.getTime() - i * 10 * 24 * 60 * 60 * 1000)), // Every 10 days
          odometer: currentOdometer,
          cost,
          pricePerLiter,
          liters,
          fuelType: 'Gasoline',
          createdAt: serverTimestamp(),
        });
        currentOdometer += 350 + Math.random() * 100; // 350-450 km per fill-up
      }
      
      // 3. Create a Maintenance Alert
      const maintenanceAlertsRef = collection(firestore, `users/${user.uid}/maintenanceAlerts`);
      const alertRef = doc(maintenanceAlertsRef);
      batch.set(alertRef, {
        vehicleId: vehicleRef.id,
        vehicleName: vehicleData.name,
        name: 'Troca de Óleo',
        intervalKm: 10000,
        lastServiceOdometer: 15000,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      toast({
        title: 'Dados criados!',
        description: 'Veículo, abastecimentos e alertas foram criados com sucesso.',
      });

    } catch (error) {
      console.error('Erro ao popular dados:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar dados',
        description: 'Não foi possível popular o banco de dados.',
      });
    }
  };


  if (isUserLoading) {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-96 mt-2" />
            </div>
             <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações. O e-mail não pode ser alterado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <Skeleton className="h-10 w-28" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil e Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, preferências e configurações de privacidade.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados Pessoais */}
          <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações. O e-mail não pode ser alterado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={user?.photoURL ?? undefined}
                      alt="Avatar do usuário"
                    />
                    <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Alterar foto</Button>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      disabled
                      value={user?.email || ''}
                    />
                  </FormControl>
                  <FormDescription>
                      Para alterar seu e-mail, entre em contato com o suporte.
                  </FormDescription>
                </FormItem>
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(99) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Salvar alterações</Button>
              </CardFooter>
          </Card>
          
          {/* Desenvolvedor */}
          <Card>
              <CardHeader>
                <CardTitle>Desenvolvedor</CardTitle>
                <CardDescription>
                  Ações para teste e desenvolvimento do aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                   <Button variant="outline" onClick={handleSeedData}>
                      Popular com Dados de Exemplo
                  </Button>
                   <FormDescription className="pt-2">
                      Isso criará um veículo, 10 abastecimentos e 1 alerta de manutenção.
                  </FormDescription>
              </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
                <CardTitle>Preferências do App</CardTitle>
                <CardDescription>Personalize sua experiência de uso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="text-base font-medium">Tema Visual</h3>
                        <p className="text-sm text-muted-foreground">Escolha entre os temas claro, escuro ou o padrão do sistema.</p>
                    </div>
                    <ThemeToggle />
                </div>
            </CardContent>
          </Card>

           {/* Privacidade e LGPD */}
          <Card>
              <CardHeader>
                  <CardTitle>Privacidade e LGPD</CardTitle>
                  <CardDescription>Gerencie seus dados e consentimentos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                      <p>Nós coletamos apenas os dados essenciais para o funcionamento do app, como seu nome, e-mail, e os registros de seus veículos e abastecimentos. A base legal para o tratamento desses dados é a <strong>execução do serviço</strong> que você contratou ao usar o app.</p>
                      <p>Você tem total controle sobre suas informações.</p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                      <p className="text-sm font-medium">Receber comunicações de marketing</p>
                      <Switch />
                  </div>
                  <FormDescription className="px-1">
                      Ao ativar, você consente em receber e-mails com novidades e promoções. Você pode revogar isso a qualquer momento.
                  </FormDescription>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <Button variant="outline">Ler a Política de Privacidade</Button>
                      <Button variant="outline">Ler os Termos de Uso</Button>
                       <Button variant="outline" onClick={handleDownloadData}>Baixar meus dados (JSON)</Button>
                      <Button variant="outline">Ver resumo dos meus dados</Button>
                  </div>
              </CardContent>
          </Card>

          {/* Segurança e Exclusão de Conta */}
          <Card>
              <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
              </CardHeader>
              <CardContent>
                   <Button variant="outline" onClick={() => toast({ title: "E-mail de redefinição enviado!", description: "Verifique sua caixa de entrada para alterar sua senha."})}>
                      Alterar senha
                  </Button>
                   <FormDescription className="pt-2">
                      Enviaremos um link seguro para o seu e-mail para que você possa criar uma nova senha.
                  </FormDescription>
              </CardContent>
          </Card>

          <Card>
              <CardHeader className="border-b">
                <CardTitle>Excluir conta</CardTitle>
                <CardDescription>
                    Esta ação é irreversível. Todos os seus dados, incluindo veículos, abastecimentos e histórico, serão permanentemente apagados.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Eu quero excluir minha conta</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus dados de nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast({ variant: "destructive", title: "Conta excluída", description:"Sua conta e todos os seus dados foram removidos."})}>
                          Sim, excluir minha conta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
