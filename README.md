🛢️ TanqueCheio – Sistema de Gestão de Abastecimentos e Desempenho Veicular
<p align="left"> <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js"/> <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"/> <img src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?style=for-the-badge&logo=firebase"/> <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=vercel"/> <img src="https://img.shields.io/badge/Version-1.0.0-blueviolet?style=for-the-badge"/> <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge"/> </p>

O TanqueCheio é uma aplicação Web desenvolvida com Next.js, Firebase e Firestore, projetada para facilitar o controle de abastecimentos, consumo médio, gastos e desempenho veicular.
É uma solução moderna, rápida e inteligente para quem deseja acompanhar seus gastos com combustível de maneira organizada e eficiente.

📌 Funcionalidades Principais
🔐 Autenticação

Login via Google utilizando Firebase Auth

Sessão persistente e proteção automática de rotas

⛽ Registro de Abastecimentos

Litros abastecidos

Preço total

Quilometragem (odômetro)

Tipo de combustível

Observações opcionais

Histórico por período

📊 Dashboard Inteligente

Consumo médio (km/L)

Total gasto por período

Quilometragem acumulada

Litros consumidos

Visualização instantânea com dados em tempo real

🛠️ Alertas de Manutenção

Baseado em quilometragem e regras definidas

Integração com dados do Firestore

☁️ Infraestrutura Serverless

Firestore em tempo real

Firebase Hosting/App Hosting

Renderização híbrida com Next.js

🧰 Tecnologias Utilizadas

Next.js 14 (App Router)

React 18

TypeScript

Firebase Auth

Firestore

shadcn/ui

Tailwind CSS

Firebase Studio Starter Template

📁 Arquitetura do Projeto
/
├── .idx/                 → Metadados do Firebase Studio
├── .next/                → Build do Next.js
├── docs/                 → Documentação adicional
├── node_modules/
├── patches/              → Patches aplicados via patch-package
├── public/               → Assets públicos
│
├── src/
│   ├── ai/               → Automação/IA (Firebase Studio)
│   ├── app/              → Rotas do Next.js (App Router)
│   ├── components/       → Componentes de UI (shadcn/ui)
│   ├── firebase/         → Integração com Firebase (auth/firestore/hooks)
│   ├── hooks/            → Hooks utilitários
│   └── lib/              → Helpers, cálculos, lógica de negócio
│
├── .env                  → Variáveis de ambiente
├── .firebaserc           → Config Firebase CLI
├── apphosting.yaml       → Config Firebase App Hosting
├── firestore.rules       → Regras de segurança Firestore
├── next-env.d.ts         → Tipagem Next.js
├── next.config.ts        → Configurações Next.js
├── tailwind.config.ts    → Configurações Tailwind
├── package.json
└── README.md

🏗️ Arquitetura Interna
📦 Camadas Internas
UI (Next.js + shadcn/ui)
        │
        ▼
Hooks de Negócio (src/hooks)
        │
        ▼
Camada Firebase (useCollection, useDoc, Auth)
        │
        ▼
Firestore (Streaming em tempo real)

🔥 Pasta src/firebase/

Essa é a camada mais poderosa do projeto.

✔ auth/use-user.tsx

Hook que sincroniza o usuário logado em tempo real.

✔ firestore/use-collection.tsx

Cria listeners para coleções.

✔ firestore/use-doc.tsx

Cria listeners para documentos individuais.

✔ hooks/use-memo-firebase.ts

Obrigatório para memoizar queries.
Evita recriação de listeners e loops infinitos.

✔ hooks/client-provider.tsx

Inicializa Firebase, Auth e Firestore na camada do cliente.

⚙️ Instalação e Execução
1️⃣ Clonar o repositório
git clone https://github.com/Matheus-Inacioal/TanqueCheio.git
cd TanqueCheio

2️⃣ Instalar dependências
npm install

3️⃣ Criar arquivo .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...


Valores obtidos no Firebase Console → Configurações do Projeto → App Web.

4️⃣ Rodar o projeto
npm run dev


Acesse:

http://localhost:3000

🚀 Deploy
Firebase Hosting
firebase deploy

Vercel
vercel deploy

📚 FAQ – Perguntas Frequentes
1. Como funciona a autenticação?

Via Google OAuth, usando Firebase Auth.

2. Onde os dados ficam armazenados?

No Firestore, com regras de segurança personalizadas.

3. As informações atualizam em tempo real?

Sim! Os hooks useCollection e useDoc criam listeners automáticos.

4. O sistema suporta vários veículos?

Ainda não, mas está no roadmap.

5. E se aparecer erro de “uncontrolled to controlled input”?

Adicione valores iniciais em defaultValues no useForm.

6. Como calcular o consumo médio?
consumo = km_total / litros_totais

🧭 Roadmap

 Modo offline

 Suporte a múltiplos veículos

 Exportador PDF/CSV

 Dashboard avançado com gráficos

 OCR para leitura de painel/nota de abastecimento

 Integração com notificações push

 App mobile (React Native)

🤝 Contribuindo

Contribuições são bem-vindas!
Envie um pull request ou abra uma issue.

📄 Licença

Este projeto está sob a licença MIT.
