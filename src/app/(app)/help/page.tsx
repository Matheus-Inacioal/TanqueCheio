
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator";
  
export default function HelpSupportPage() {
    const faqItems = [
        {
          value: "item-1",
          question: "O que é o Tanque Cheio?",
          answer: "O Tanque Cheio é um aplicativo para ajudar você a registrar e acompanhar seus abastecimentos, consumo de combustível, gastos e manutenções dos seus veículos de forma simples e organizada."
        },
        {
            value: "item-2",
            question: "Guia rápido",
            answer: (
                <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Como cadastrar um veículo:</strong> Vá para a seção 'Veículos' e clique em 'Adicionar Veículo'. Preencha os detalhes e salve.</li>
                    <li><strong>Como registrar um abastecimento:</strong> Clique no botão 'Novo Abastecimento', preencha os dados do odômetro, litros e custo total.</li>
                    <li><strong>Onde ver o consumo médio e os relatórios:</strong> Acesse a página 'Relatórios' para análises detalhadas de consumo e custos por período.</li>
                    <li><strong>Como configurar lembretes de manutenção:</strong> Na página de 'Configurações', você pode adicionar alertas de manutenção baseados na quilometragem para itens como troca de óleo e rodízio de pneus.</li>
                </ul>
            )
        },
        {
          value: "item-3",
          question: "Dúvidas frequentes (FAQ)",
          answer: (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                    <AccordionTrigger>Por que meu consumo médio parece incorreto?</AccordionTrigger>
                    <AccordionContent>
                    O cálculo do consumo médio depende de registros de abastecimento consistentes. Certifique-se de que você está registrando o odômetro corretamente a cada parada no posto. O cálculo se torna mais preciso com mais dados.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                    <AccordionTrigger>O app não sincronizou com a nuvem, o que eu faço?</AccordionTrigger>
                    <AccordionContent>
                    Verifique sua conexão com a internet. O aplicativo tentará sincronizar seus dados automaticamente. Se o problema persistir, tente reiniciar o aplicativo. Seus dados locais permanecem seguros.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                    <AccordionTrigger>Como recuperar minha conta ou senha?</AccordionTrigger>
                    <AccordionContent>
                    Na tela de login, utilize a opção "Esqueci minha senha" para iniciar o processo de recuperação, que geralmente envolve o envio de um link para seu e-mail cadastrado.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          )
        },
        {
            value: "item-4",
            question: "Sincronização e backup",
            answer: "Seus dados são salvos localmente no seu dispositivo para acesso offline. Quando conectado à internet, o app sincroniza automaticamente com o Firebase para garantir que suas informações estejam seguras e acessíveis de qualquer lugar. Um ícone ou mensagem no painel principal indicará o status da sincronização."
        },
        {
            value: "item-5",
            question: "Alertas e notificações",
            answer: "O app envia lembretes de manutenção com base na quilometragem que você configura. As notificações podem ser gerenciadas nas configurações do aplicativo e também nas configurações de notificação do seu sistema operacional."
        },
        {
            value: "item-6",
            question: "Fale com o suporte",
            answer: (
                <div className="space-y-2">
                    <p>Encontrou um problema ou tem uma sugestão? Entre em contato conosco.</p>
                    <p><strong>E-mail:</strong> <a href="mailto:suporte@tanquecheio.app" className="text-primary hover:underline">suporte@tanquecheio.app</a></p>
                    <p><strong>Horário de atendimento:</strong> Segunda a Sexta, das 9h às 18h.</p>
                </div>
            )
        },
        {
            value: "item-7",
            question: "Sobre o aplicativo",
            answer: (
                <div className="space-y-1">
                     <p><strong>Nome:</strong> Tanque Cheio</p>
                     <p><strong>Versão:</strong> 1.0.0</p>
                     <p><strong>Tecnologias:</strong> Next.js, React, Tailwind CSS, ShadCN, Firebase.</p>
                </div>
            )
        },
        {
            value: "item-8",
            question: "Privacidade e segurança",
            answer: "Os dados de seus veículos e abastecimentos são usados exclusivamente para seu controle pessoal. As informações salvas na nuvem são protegidas e associadas apenas à sua conta. A exclusão de dados pode ser solicitada através do nosso canal de suporte."
        }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ajuda e Suporte</h1>
          <p className="text-muted-foreground">
            Encontre respostas para suas dúvidas e saiba mais sobre o aplicativo.
          </p>
        </div>
        <Separator />
        
        <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map(item => (
                <AccordionItem value={item.value} key={item.value} className="border-b-0">
                    <AccordionTrigger className="p-4 bg-muted/50 hover:bg-muted rounded-lg text-left">
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-2">
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                            {item.answer}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
  
      </div>
    );
  }
  