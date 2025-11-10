'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  // Valores padrão para o formulário. Em um app real, viriam do seu backend.
  const defaultValues: Partial<ProfileFormValues> = {
    name: 'Usuário',
    phone: '(99) 99999-9999',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas com sucesso.',
    });
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil e Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, preferências e configurações de privacidade.
        </p>
      </div>

      {/* Dados Pessoais */}
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    src={userAvatar?.imageUrl}
                    alt="Avatar do usuário"
                  />
                  <AvatarFallback>U</AvatarFallback>
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
                    value="usuario@exemplo.com"
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
          </form>
        </Form>
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
        <Form {...form}>
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
        </Form>
      </Card>

      {/* Segurança e Exclusão de Conta */}
      <Card>
        <Form {...form}>
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
            <CardFooter className="flex-col items-start gap-4 border-t px-6 py-4">
                <h3 className="font-semibold">Excluir conta</h3>
                <p className="text-sm text-muted-foreground">
                    Esta ação é irreversível. Todos os seus dados, incluindo veículos, abastecimentos e histórico, serão permanentemente apagados.
                </p>
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
            </CardFooter>
        </Form>
      </Card>

    </div>
  );
}
