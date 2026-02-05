# 🤖 OpenAgentBr - Plataforma de Agentes de IA

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**OpenAgentBr** é uma plataforma brasileira completa para criar, gerenciar e interagir com agentes de IA personalizados usando a API do OpenRouter. Com autenticação segura via Supabase e interface moderna em Next.js.

## 🚀 Início Rápido

> 📌 **Configurar Banco de Dados?** → [**Setup Database**](SETUP_DATABASE.md) | [**Schema SQL**](SCHEMA.md)
> 
> 🚀 **Fazer Deploy?** → [**Deploy Completo**](DEPLOY.md) | [**Deploy Rápido (15min)**](DEPLOY_RAPIDO.md)

## ✨ Features Principais

- 🔐 **Autenticação Completa** - Login/Signup com Supabase
- 🤖 **Agentes Personalizados** - Crie agentes com system prompts customizáveis
- 💬 **Interface de Chat** - Converse em tempo real com seus agentes
- 🔧 **Configurações de API** - Página dedicada para gerenciar API Key do OpenRouter
- 🤖 **Modelos Dinâmicos** - Busca automática de modelos disponíveis do OpenRouter
- 📎 **Upload de Arquivos** - Suporte para imagens, PDFs e documentos com drag & drop
- 👁️ **Modelos Vision** - Envie imagens para modelos que suportam visão
- 📊 **Dashboard de Uso** - Acompanhe métricas, créditos e custos do OpenRouter
- 🎨 **UI Moderna** - Design responsivo com Tailwind CSS e contraste aprimorado
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
3. Isso criará as tabelas: `agents`, `user_settings`, `chat_messages`, `available_models`, `file_uploads`

**Se você já tem o banco configurado**, execute o arquivo [`supabase/migration.sql`](supabase/migration.sql) para adicionar as novas tabelas.

#### 3.3. Configure o Storage para uploads

1. No dashboard do Supabase, vá em **Storage**
2. Clique em "Create a new bucket"
3. Nome do bucket: `chat-files`
4. Marque como **Public**
5. Configure as políticas de acesso:
   - Allowed MIME types: `image/*`, `application/pdf`, `text/*`
   - Max file size: 10MB

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

Agora com a **página de configurações dedicada**! 🎉

1. Faça login na aplicação
2. Clique em **"Configurações"** no menu de navegação
3. Cole sua API Key do OpenRouter (formato: `sk-or-v1-...`)
4. Clique em **"Validar e Salvar API Key"**
5. A aplicação irá:
   - Validar sua key
   - Buscar seus créditos disponíveis
   - Carregar automaticamente todos os modelos disponíveis do OpenRouter
6. Pronto! Agora você pode criar agentes com qualquer modelo disponível

### 3. Criar um agente

1. No Dashboard, clique em "Criar Novo Agente"
2. Preencha os campos:
   - **Nome**: Ex: "Assistente de Vendas"
   - **Descrição**: Breve descrição do propósito
   - **System Prompt**: Define o comportamento do agente
   - **Modelo**: Escolha entre **todos os modelos disponíveis** do OpenRouter
     - Use a busca para encontrar modelos específicos
     - Veja preços, contexto e recursos (vision, function calling)
   - **Temperatura**: 0 = Determinístico, 2 = Criativo
   - **Max Tokens**: Limite de tokens na resposta
3. Clique em "Criar Agente"

### 4. Conversar com o agente

1. Na lista de agentes, clique em "Chat"
2. Digite suas mensagens e converse!
3. **Novo**: Clique no ícone de clipe 📎 para anexar arquivos
   - Arraste e solte imagens, PDFs ou documentos
   - Modelos vision (como GPT-4V, Claude 3) podem ver as imagens
4. O histórico é salvo automaticamente

## ☁️ Deploy em Produção

### 🚀 Guias Completos de Deploy

Temos 2 guias para você escolher:

1. **[DEPLOY.md](DEPLOY.md)** - Guia Completo e Detalhado
   - Passo-a-passo com explicações
   - Troubleshooting completo
   - Configurações avançadas
   - ~30 minutos

2. **[DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)** - Deploy Expresso
   - Apenas comandos essenciais
   - Direto ao ponto
   - ~15 minutos

### ⚡ Resumo Ultra-Rápido

```bash
# 1. Supabase
- Criar projeto em supabase.com
- Executar schema do SCHEMA.md
- Copiar URL + API Key

# 2. Vercel  
- Import do GitHub em vercel.com
- Adicionar env vars (Supabase URL + Key)
- Deploy!

# 3. OpenRouter
- Criar conta em openrouter.ai
- Adicionar $10 de créditos
- Configurar key via SQL no app
```

Veja os guias completos acima para instruções detalhadas!

---

## 🗂️ Estrutura do Projeto

```
OpenAgentBr/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Landing page
│   ├── login/               # Página de login
│   ├── dashboard/           # Dashboard
│   ├── settings/            # ✨ NOVO: Configurações de API Key
│   ├── agents/              # Gerenciamento de agentes
│   │   ├── page.tsx         # Lista de agentes
│   │   ├── create/          # Criar agente
│   │   └── [id]/            # Chat com agente
│   └── api/                 # API Routes
│       ├── chat/            # Endpoint de chat
│       ├── usage/           # Endpoint de métricas
│       ├── upload/          # ✨ NOVO: Upload de arquivos
│       └── openrouter/      # ✨ NOVO: Validação e modelos
│           ├── validate/    # Validar API key
│           └── models/      # Listar modelos
├── components/              # Componentes reutilizáveis
│   ├── AgentCard.tsx
│   ├── AgentForm.tsx
│   ├── ChatInterface.tsx
│   ├── FileUpload.tsx       # ✨ NOVO: Upload com drag & drop
│   ├── FilePreview.tsx      # ✨ NOVO: Preview de arquivos
│   ├── ModelSelect.tsx      # ✨ NOVO: Seletor dinâmico de modelos
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── UsageMetrics.tsx
├── lib/                     # Bibliotecas e utilidades
│   ├── supabase/
│   │   ├── client.ts        # Cliente Supabase (browser)
│   │   └── server.ts        # Cliente Supabase (server)
│   ├── openrouter.ts        # Integração OpenRouter (expandido)
│   └── utils.ts             # Funções utilitárias
├── types/                   # TypeScript types
│   ├── agent.ts
│   └── usage.ts
├── supabase/
│   ├── schema.sql           # Schema completo do banco
│   └── migration.sql        # ✨ NOVO: Migration para bancos existentes
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

Armazena configurações do usuário, incluindo a API key do OpenRouter e créditos.

```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, unique)
- openrouter_api_key (text)
- credits_total (decimal) ✨ NOVO
- credits_used (decimal) ✨ NOVO
- last_sync (timestamp) ✨ NOVO
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

### Tabela: `available_models` ✨ NOVO

Armazena modelos disponíveis do OpenRouter para cada usuário.

```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- model_id (text)
- name (text)
- provider (text)
- pricing (jsonb)
- context_length (integer)
- supports_vision (boolean)
- supports_function_calling (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela: `file_uploads` ✨ NOVO

Armazena metadados de arquivos enviados.

```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- message_id (uuid, FK -> chat_messages, nullable)
- file_name (text)
- file_type (text)
- file_size (integer)
- storage_path (text)
- public_url (text)
- created_at (timestamp)
```

### Storage Bucket: `chat-files` ✨ NOVO

Armazena os arquivos enviados (imagens, PDFs, documentos).

## 🎨 Modelos Disponíveis

A lista de modelos é **carregada dinamicamente** do OpenRouter! Alguns exemplos incluem:

- **OpenAI**: GPT-4 Turbo, GPT-4 Vision, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Pro Vision
- **Meta**: Llama 3 70B, Llama 3 8B
- **Mistral**: Mistral Large, Mistral Medium, Mixtral
- **Cohere**: Command R+, Command R
- E muitos outros!

**Total**: Mais de 200 modelos disponíveis através do OpenRouter

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

- [x] Página de configurações para gerenciar API key ✅
- [x] Busca dinâmica de modelos do OpenRouter ✅
- [x] Upload de arquivos (imagens, PDFs, documentos) ✅
- [x] Suporte a modelos vision ✅
- [x] UI aprimorada com melhor contraste ✅
- [ ] Edição de agentes
- [ ] Export/Import de agentes
- [ ] Gráficos de uso com recharts
- [ ] Streaming de respostas
- [ ] Dark mode
- [ ] Compartilhamento de agentes
- [ ] Rate limiting
- [ ] Testes automatizados
- [ ] Suporte a function calling
- [ ] Templates de agentes pré-configurados

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🇧🇷 Feito no Brasil

Desenvolvido com ❤️ por desenvolvedores brasileiros para a comunidade brasileira de IA.

---

## 🆘 Suporte

Tem dúvidas ou problemas?

- 📧 Abra uma [issue](https://github.com/IslandeSilva/OpenAgentBr/issues)
- 💬 Entre em contato via GitHub
- 📖 Consulte a [Documentação da API](API_DOCUMENTATION.md)

## 📚 Documentação Adicional

- [API Documentation](API_DOCUMENTATION.md) - Documentação completa dos endpoints
- [Schema SQL Completo](supabase/schema.sql) - Schema do banco de dados
- [Migration SQL](supabase/migration.sql) - Atualização de bancos existentes
- [Setup Database](SETUP_DATABASE.md) - Guia de configuração do banco
- [Deploy Guide](DEPLOY.md) - Guia completo de deploy
- [Deploy Rápido](DEPLOY_RAPIDO.md) - Deploy em 15 minutos

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [OpenRouter](https://openrouter.ai)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Feito com ❤️ usando Next.js, Supabase e OpenRouter** 🚀🇧🇷
