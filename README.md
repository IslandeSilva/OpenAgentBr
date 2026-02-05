# 🤖 OpenAgentBr - Plataforma de Agentes de IA

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**OpenAgentBr** é uma plataforma brasileira completa para criar, gerenciar e interagir com agentes de IA personalizados usando a API do OpenRouter. Com autenticação segura via Supabase e interface moderna em Next.js.

## 🚀 Início Rápido

> 📌 **Configurar Banco de Dados?** → Veja o [**Guia de Setup Completo**](SETUP_DATABASE.md) com schema SQL pronto para copiar!

## ✨ Features Principais

- 🔐 **Autenticação Completa** - Login/Signup com Supabase
- 🤖 **Agentes Personalizados** - Crie agentes com system prompts customizáveis
- 💬 **Interface de Chat** - Converse em tempo real com seus agentes
- 📊 **Dashboard de Uso** - Acompanhe métricas e custos do OpenRouter
- 🎨 **UI Moderna** - Design responsivo com Tailwind CSS
- 🔒 **Seguro** - Row Level Security (RLS) no Supabase
- 🚀 **Deploy Fácil** - Pronto para Vercel

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **IA**: OpenRouter API
- **Deploy**: Vercel
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn
- Conta no [Supabase](https://supabase.com)
- Conta no [OpenRouter](https://openrouter.ai)
- (Opcional) Conta na [Vercel](https://vercel.com) para deploy

## 🚀 Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/IslandeSilva/OpenAgentBr.git
cd OpenAgentBr
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o Supabase

> 📌 **GUIA COMPLETO**: Veja o [SETUP_DATABASE.md](SETUP_DATABASE.md) para instruções detalhadas passo-a-passo com o schema completo pronto para copiar!

#### 3.1. Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a API Key (anon/public)

#### 3.2. Execute o schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie e execute o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql) OU use o [guia completo](SETUP_DATABASE.md)
3. Isso criará as tabelas: `agents`, `user_settings`, `chat_messages`

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Obtenha uma API Key do OpenRouter

1. Acesse [openrouter.ai](https://openrouter.ai)
2. Crie uma conta
3. Vá em **Keys** e crie uma nova API key
4. Adicione créditos à sua conta (mínimo $5)
5. **Importante**: Você precisará configurar esta key no app após fazer login

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

## 📖 Como Usar

### 1. Criar uma conta

1. Clique em "Começar Grátis" na landing page
2. Crie sua conta com email e senha
3. Confirme seu email (verifique a caixa de entrada)

### 2. Configurar API Key do OpenRouter

⚠️ **Importante**: Por segurança, a API key do OpenRouter é armazenada no banco de dados do Supabase, não em variáveis de ambiente.

Para adicionar sua key:

1. Faça login na aplicação
2. Vá até o Dashboard
3. Configure sua API key do OpenRouter nas configurações do usuário
   - Você pode fazer isso criando um registro na tabela `user_settings`
   - Ou adicionando uma página de configurações (futuro)

Por enquanto, você pode adicionar manualmente via SQL Editor do Supabase:

```sql
INSERT INTO user_settings (user_id, openrouter_api_key)
VALUES ('seu-user-id-aqui', 'sk-or-v1-sua-key-aqui')
ON CONFLICT (user_id) DO UPDATE SET openrouter_api_key = EXCLUDED.openrouter_api_key;
```

Para pegar seu `user_id`, execute:

```sql
SELECT id, email FROM auth.users;
```

### 3. Criar um agente

1. No Dashboard, clique em "Criar Novo Agente"
2. Preencha os campos:
   - **Nome**: Ex: "Assistente de Vendas"
   - **Descrição**: Breve descrição do propósito
   - **System Prompt**: Define o comportamento do agente
   - **Modelo**: Escolha entre GPT-4, Claude, etc
   - **Temperatura**: 0 = Determinístico, 2 = Criativo
   - **Max Tokens**: Limite de tokens na resposta
3. Clique em "Criar Agente"

### 4. Conversar com o agente

1. Na lista de agentes, clique em "Chat"
2. Digite suas mensagens e converse!
3. O histórico é salvo automaticamente

## ☁️ Deploy na Vercel

### 1. Conecte seu repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente (mesmas do `.env.local`)

### 2. Configure as variáveis de ambiente

No painel da Vercel, adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

### 3. Deploy

Clique em "Deploy" e aguarde!

A cada push no branch `main`, a Vercel fará deploy automaticamente.

## 🗂️ Estrutura do Projeto

```
OpenAgentBr/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Landing page
│   ├── login/               # Página de login
│   ├── dashboard/           # Dashboard
│   ├── agents/              # Gerenciamento de agentes
│   │   ├── page.tsx         # Lista de agentes
│   │   ├── create/          # Criar agente
│   │   └── [id]/            # Chat com agente
│   └── api/                 # API Routes
│       ├── chat/            # Endpoint de chat
│       └── usage/           # Endpoint de métricas
├── components/              # Componentes reutilizáveis
│   ├── AgentCard.tsx
│   ├── AgentForm.tsx
│   ├── ChatInterface.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── UsageMetrics.tsx
├── lib/                     # Bibliotecas e utilidades
│   ├── supabase/
│   │   ├── client.ts        # Cliente Supabase (browser)
│   │   └── server.ts        # Cliente Supabase (server)
│   ├── openrouter.ts        # Integração OpenRouter
│   └── utils.ts             # Funções utilitárias
├── types/                   # TypeScript types
│   ├── agent.ts
│   └── usage.ts
├── supabase/
│   └── schema.sql           # Schema do banco de dados
└── public/                  # Arquivos estáticos
```

## 🗄️ Schema do Banco de Dados

### Tabela: `agents`

Armazena os agentes criados pelos usuários.

```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- name (text)
- description (text, nullable)
- system_prompt (text)
- model (text)
- temperature (decimal)
- max_tokens (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela: `user_settings`

Armazena configurações do usuário, incluindo a API key do OpenRouter.

```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, unique)
- openrouter_api_key (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela: `chat_messages`

Armazena o histórico de mensagens dos chats.

```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- agent_id (uuid, FK -> agents)
- role (text: 'user' | 'assistant')
- content (text)
- created_at (timestamp)
```

## 🎨 Modelos Disponíveis

- **OpenAI**: GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet
- **Google**: Gemini Pro
- **Meta**: Llama 3 70B
- **Mistral**: Mistral Medium

## 🔒 Segurança

- ✅ Row Level Security (RLS) ativo em todas as tabelas
- ✅ API Keys armazenadas de forma segura no Supabase
- ✅ Autenticação via Supabase Auth
- ✅ Validação de dados com TypeScript
- ✅ Proteção de rotas no frontend

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Roadmap

- [ ] Página de configurações para gerenciar API key
- [ ] Edição de agentes
- [ ] Export/Import de agentes
- [ ] Gráficos de uso com recharts
- [ ] Streaming de respostas
- [ ] Dark mode
- [ ] Suporte a imagens (vision models)
- [ ] Compartilhamento de agentes
- [ ] Rate limiting
- [ ] Testes automatizados

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🇧🇷 Feito no Brasil

Desenvolvido com ❤️ por desenvolvedores brasileiros para a comunidade brasileira de IA.

---

## 🆘 Suporte

Tem dúvidas ou problemas?

- 📧 Abra uma [issue](https://github.com/IslandeSilva/OpenAgentBr/issues)
- 💬 Entre em contato via GitHub

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [OpenRouter](https://openrouter.ai)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Feito com ❤️ usando Next.js, Supabase e OpenRouter** 🚀🇧🇷
