# 🚀 Setup Completo - OpenAgentBr com OpenRouter

Este guia cobre a configuração completa do OpenAgentBr com todas as novas funcionalidades.

## 📋 Pré-requisitos

- [ ] Node.js 18+ instalado
- [ ] Conta no [Supabase](https://supabase.com) (gratuito)
- [ ] Conta no [OpenRouter](https://openrouter.ai) com créditos
- [ ] Git instalado

## 🗄️ Parte 1: Configurar Supabase

### 1.1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Preencha:
   - **Name**: openagentbr (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha mais próxima (ex: South America)
4. Clique em "Create new project"
5. **Aguarde ~2 minutos** para o projeto ser criado

### 1.2. Executar Schema SQL

#### Opção A: Novo Banco (Recomendado)

1. No dashboard do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **New Query**
3. Copie TODO o conteúdo de [`supabase/schema.sql`](supabase/schema.sql)
4. Cole no editor
5. Clique em **Run** (ou pressione Cmd/Ctrl + Enter)
6. Aguarde "Success. No rows returned" aparecer

#### Opção B: Atualizar Banco Existente

Se você já tem o OpenAgentBr rodando:

1. No **SQL Editor**, abra nova query
2. Copie o conteúdo de [`supabase/migration.sql`](supabase/migration.sql)
3. Cole e execute
4. Isso adicionará as novas tabelas sem afetar dados existentes

### 1.3. Configurar Storage

1. No menu lateral, vá em **Storage**
2. Clique em **Create a new bucket**
3. Configurações:
   - **Name**: `chat-files`
   - **Public bucket**: ✅ **Marque esta opção**
   - **File size limit**: 10 MB
   - **Allowed MIME types**: deixe em branco (validamos no código)
4. Clique em **Create bucket**

### 1.4. Copiar Credenciais

1. No menu lateral, vá em **Project Settings** > **API**
2. Anote (ou copie):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (uma chave longa)

⚠️ **Importante**: Nunca compartilhe a `service_role key`!

## 💻 Parte 2: Configurar Aplicação Local

### 2.1. Clonar Repositório

```bash
git clone https://github.com/IslandeSilva/OpenAgentBr.git
cd OpenAgentBr
```

### 2.2. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2.3. Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_public_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Substitua pelos valores que copiou do Supabase.

### 2.4. Iniciar Aplicação

```bash
npm run dev
# ou
yarn dev
```

Acesse http://localhost:3000 🎉

## 🔑 Parte 3: Configurar OpenRouter

### 3.1. Criar Conta

1. Acesse [openrouter.ai](https://openrouter.ai)
2. Clique em "Sign In" > "Sign Up"
3. Crie sua conta

### 3.2. Adicionar Créditos

1. Vá em **Credits** no menu
2. Clique em **Add Credits**
3. Adicione pelo menos **$5** (recomendo $10-20 para testes)
4. Complete o pagamento

### 3.3. Criar API Key

1. Vá em **Keys** no menu
2. Clique em **Create Key**
3. Dê um nome: "OpenAgentBr"
4. Clique em **Create**
5. **COPIE A KEY** (formato: `sk-or-v1-...`)
6. ⚠️ Você só verá a key UMA VEZ!

## 🎯 Parte 4: Configurar no OpenAgentBr

### 4.1. Criar Conta

1. Acesse http://localhost:3000
2. Clique em "Começar Grátis"
3. Preencha email e senha
4. **Verifique seu email** (cheque spam!)
5. Clique no link de confirmação

### 4.2. Configurar API Key

1. Faça login na aplicação
2. Clique em **Configurações** (⚙️ no menu)
3. Cole sua API Key do OpenRouter
4. Clique em **Validar e Salvar API Key**
5. Aguarde a mensagem de sucesso
6. Você verá:
   - ✅ Seus créditos disponíveis
   - ✅ Número de modelos carregados (200+)

### 4.3. Criar Primeiro Agente

1. Vá em **Dashboard**
2. Clique em **Criar Novo Agente**
3. Preencha:
   - **Nome**: "Assistente Pessoal"
   - **Descrição**: "Meu primeiro agente de IA"
   - **System Prompt**: 
   ```
   Você é um assistente pessoal útil e amigável. 
   Responda sempre em português brasileiro de forma clara e objetiva.
   ```
   - **Modelo**: Use a busca para encontrar "gpt-3.5-turbo" (mais barato para testes)
   - **Temperatura**: 0.7
   - **Max Tokens**: 1000
4. Clique em **Criar Agente**

### 4.4. Testar Chat

1. Na lista de agentes, clique em **Chat**
2. Digite: "Olá! Como você pode me ajudar?"
3. Aguarde a resposta
4. ✅ Sucesso! Seu agente está funcionando!

### 4.5. Testar Upload (Opcional)

1. No chat, clique no ícone de clipe (📎)
2. Arraste uma imagem ou clique para selecionar
3. Aguarde o upload
4. Digite uma mensagem sobre a imagem
5. **Nota**: Funciona melhor com modelos vision como:
   - `gpt-4-vision-preview`
   - `claude-3-opus`
   - `gemini-pro-vision`

## ✅ Verificação Final

Marque cada item conforme completar:

- [ ] Supabase criado e schema executado
- [ ] Storage bucket `chat-files` criado
- [ ] Aplicação rodando localmente
- [ ] Conta criada e email verificado
- [ ] API Key do OpenRouter configurada
- [ ] Modelos carregados (200+)
- [ ] Primeiro agente criado
- [ ] Chat funcionando
- [ ] Upload testado (opcional)

## 🎨 Próximos Passos

Agora que tudo está funcionando:

1. **Explore modelos diferentes**:
   - GPT-4 para qualidade máxima
   - Claude 3 para textos longos
   - Gemini para tarefas gratuitas (sem custo!)

2. **Crie agentes especializados**:
   - Assistente de código
   - Tradutor
   - Revisor de textos
   - Analisador de imagens (com vision)

3. **Teste recursos avançados**:
   - Upload de múltiplos arquivos
   - PDFs e documentos
   - Histórico de conversas
   - Diferentes temperaturas

## 🆘 Problemas Comuns

### "API Key do OpenRouter não configurada"

**Solução**: Vá em Configurações e configure sua API key

### "Nenhum modelo disponível"

**Soluções**:
1. Certifique-se de validar a API key primeiro
2. Clique em "Atualizar Lista" nas Configurações
3. Verifique se tem créditos no OpenRouter

### "Erro ao fazer upload do arquivo"

**Soluções**:
1. Certifique-se de criar o bucket `chat-files` no Supabase
2. Marque o bucket como **público**
3. Verifique o tamanho do arquivo (máx 10MB)
4. Verifique o tipo de arquivo (apenas imagens, PDFs, textos)

### "Chat não responde"

**Soluções**:
1. Verifique se tem créditos no OpenRouter
2. Veja o console do navegador (F12) para erros
3. Verifique se a API key está correta
4. Tente outro modelo

### "Erro 500 ao criar agente"

**Solução**: Provavelmente o modelo não existe. Use a busca para encontrar modelos válidos.

## 📚 Recursos Adicionais

- [API Documentation](API_DOCUMENTATION.md) - Documentação completa da API
- [SECURITY.md](SECURITY.md) - Guia de segurança
- [README.md](README.md) - Visão geral do projeto

## 🚀 Deploy para Produção

Quando estiver pronto para produção, veja:
- [DEPLOY.md](DEPLOY.md) - Guia completo de deploy
- [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md) - Deploy rápido (15min)

---

**Precisa de ajuda?** Abra uma [issue no GitHub](https://github.com/IslandeSilva/OpenAgentBr/issues)

**Bons chats!** 🤖🇧🇷
