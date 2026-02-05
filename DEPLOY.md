# 🚀 Guia Completo de Deploy - Supabase + Vercel

Este guia mostra **passo-a-passo** como fazer o deploy completo do OpenAgentBr na nuvem.

---

## 📋 Checklist Pré-Deploy

Antes de começar, certifique-se de ter:

- [ ] Conta no [GitHub](https://github.com) (gratuita)
- [ ] Conta no [Supabase](https://supabase.com) (gratuita)
- [ ] Conta no [Vercel](https://vercel.com) (gratuita)
- [ ] Conta no [OpenRouter](https://openrouter.ai) (precisa de créditos)
- [ ] Código do projeto no GitHub

---

## 🗄️ PARTE 1: Deploy do Banco de Dados (Supabase)

### Passo 1.1: Criar Projeto no Supabase

1. **Acesse**: [https://supabase.com](https://supabase.com)
2. **Login**: Faça login com GitHub
3. **Novo Projeto**:
   - Clique em **"New Project"**
   - **Organization**: Escolha sua organização (ou crie uma)
   - **Name**: `openagentbr` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha FORTE e ANOTE (você vai precisar!)
   - **Region**: Escolha **South America (São Paulo)** para melhor latência
   - **Pricing Plan**: **Free** (0$/mês - suficiente para começar)
4. **Criar**: Clique em **"Create new project"**
5. **Aguarde**: ~2 minutos para o projeto ser provisionado

> ⏳ Enquanto aguarda, prepare o schema SQL para executar!

### Passo 1.2: Executar o Schema SQL

1. **SQL Editor**: No menu lateral esquerdo, clique em **SQL Editor** (ícone </> )
2. **Nova Query**: Clique em **"New query"** ou **"+"**
3. **Copiar Schema**: 
   - Abra o arquivo [`SCHEMA.md`](SCHEMA.md) deste repositório
   - Copie **TODO** o código SQL
4. **Colar**: Cole no editor SQL do Supabase
5. **Executar**: Clique em **"RUN"** (ou `Ctrl+Enter`)
6. **Verificar**: Deve aparecer "Success. No rows returned"

### Passo 1.3: Verificar Tabelas Criadas

1. **Table Editor**: Clique em **Table Editor** no menu lateral
2. **Verificar**: Você deve ver 3 tabelas:
   - ✅ `agents`
   - ✅ `user_settings`
   - ✅ `chat_messages`

### Passo 1.4: Copiar Credenciais

1. **Settings**: Clique em **Settings** (⚙️) no menu lateral
2. **API**: Clique em **API**
3. **Copiar**:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
   ```
4. **ANOTE**: Guarde essas credenciais em um lugar seguro!

> ✅ **Supabase configurado!** Agora vamos para o Vercel.

---

## 🌐 PARTE 2: Deploy da Aplicação (Vercel)

### Passo 2.1: Preparar o Repositório no GitHub

1. **Push do Código**:
   ```bash
   git add .
   git commit -m "Preparando para deploy"
   git push origin main
   ```
   > 📝 Se estiver em outra branch, faça merge para `main` primeiro

2. **Verificar**: Acesse seu repositório no GitHub e confirme que todos os arquivos estão lá

### Passo 2.2: Conectar Vercel ao GitHub

1. **Acesse**: [https://vercel.com](https://vercel.com)
2. **Login**: Clique em **"Sign Up"** ou **"Login"**
3. **GitHub**: Escolha **"Continue with GitHub"**
4. **Autorizar**: Autorize a Vercel a acessar seus repositórios

### Passo 2.3: Importar Projeto

1. **Add New**: Clique em **"Add New..."** > **"Project"**
2. **Import**: Encontre o repositório **OpenAgentBr** e clique em **"Import"**
3. **Configure**:
   - **Project Name**: `openagentbr` (ou personalize)
   - **Framework Preset**: Next.js (deve detectar automaticamente)
   - **Root Directory**: `./` (deixe como está)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)

### Passo 2.4: Configurar Variáveis de Ambiente

⚠️ **IMPORTANTE**: Configure as variáveis ANTES de fazer o deploy!

1. **Environment Variables**: Role para baixo até **"Environment Variables"**
2. **Adicione** as seguintes variáveis:

   ```env
   NEXT_PUBLIC_SUPABASE_URL
   Valor: https://xxxxxxxxxxxxx.supabase.co
   (Cole a URL que você copiou do Supabase)
   
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   (Cole a anon key que você copiou do Supabase)
   
   NEXT_PUBLIC_APP_URL
   Valor: https://openagentbr.vercel.app
   (Ou o domínio que a Vercel vai gerar - você pode atualizar depois)
   ```

3. **Environments**: Selecione **Production**, **Preview** e **Development**

### Passo 2.5: Deploy!

1. **Deploy**: Clique em **"Deploy"**
2. **Aguarde**: ~2-3 minutos para build e deploy
3. **Build Logs**: Acompanhe os logs em tempo real
4. **Sucesso**: Aguarde a mensagem "🎉 Deployment Ready"

### Passo 2.6: Testar a Aplicação

1. **Visit**: Clique em **"Visit"** ou acesse a URL gerada
2. **URL**: Será algo como `https://openagentbr.vercel.app`
3. **Testar**:
   - ✅ Landing page carrega
   - ✅ Pode acessar `/login`
   - ✅ Pode criar conta
   - ✅ Dashboard funciona após login

---

## 🔑 PARTE 3: Configurar OpenRouter API

### Passo 3.1: Obter API Key do OpenRouter

1. **Acesse**: [https://openrouter.ai](https://openrouter.ai)
2. **Login**: Crie conta ou faça login
3. **Keys**: Vá em **"Keys"** no menu
4. **Create Key**: Clique em **"Create Key"**
5. **Nome**: `OpenAgentBr - Production`
6. **Copiar**: Copie a chave `sk-or-v1-...`

### Passo 3.2: Adicionar Créditos

1. **Credits**: Vá em **"Credits"**
2. **Add Credits**: Adicione ao menos **$5** (recomendado $10-20)
3. **Método**: Adicione cartão de crédito
4. **Confirmar**: Complete a compra

### Passo 3.3: Configurar no App

Como a API key é por usuário, cada usuário precisa configurar:

**OPÇÃO A - Via SQL (Temporário):**

1. Vá no **SQL Editor** do Supabase
2. Execute:
   ```sql
   -- Primeiro, pegue seu user_id (após criar conta no app)
   SELECT id, email FROM auth.users;
   
   -- Depois, insira sua API key
   INSERT INTO user_settings (user_id, openrouter_api_key)
   VALUES ('cole-seu-user-id-aqui', 'sk-or-v1-sua-chave-aqui')
   ON CONFLICT (user_id) 
   DO UPDATE SET openrouter_api_key = EXCLUDED.openrouter_api_key;
   ```

**OPÇÃO B - Via Interface (Futuro):**
> Em breve teremos uma página de configurações na aplicação!

---

## 🎯 PARTE 4: Domínio Personalizado (Opcional)

### Passo 4.1: Configurar Domínio Próprio

1. **Vercel Dashboard**: Vá no projeto
2. **Settings**: Clique em **Settings** > **Domains**
3. **Add Domain**: Digite seu domínio (ex: `meuapp.com.br`)
4. **DNS**: Configure os registros DNS conforme instruções da Vercel
5. **Aguarde**: Propagação DNS (~5-60 minutos)

### Passo 4.2: Atualizar Variável de Ambiente

1. **Settings**: **Settings** > **Environment Variables**
2. **Edit**: Edite `NEXT_PUBLIC_APP_URL`
3. **Valor**: `https://seu-dominio.com.br`
4. **Redeploy**: Faça redeploy para aplicar

---

## ✅ Checklist Pós-Deploy

- [ ] ✅ Aplicação acessível via URL
- [ ] ✅ Login/Signup funcionando
- [ ] ✅ Tabelas criadas no Supabase
- [ ] ✅ Pode criar agentes
- [ ] ✅ Chat funcionando (após configurar OpenRouter key)
- [ ] ✅ Dados salvando corretamente
- [ ] ✅ RLS funcionando (não vê dados de outros usuários)

---

## 🔧 Troubleshooting

### Erro: "fetch failed" ou CORS

**Problema**: Variáveis de ambiente não configuradas  
**Solução**: 
1. Vá em **Settings** > **Environment Variables** na Vercel
2. Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas
3. Faça **Redeploy**

### Erro: Build Failed

**Problema**: Erro durante build  
**Solução**:
1. Verifique os **Build Logs** na Vercel
2. Certifique-se que `package.json` está correto
3. Tente rodar `npm run build` localmente primeiro

### Erro: "Invalid API Key" no Supabase

**Problema**: Credenciais erradas  
**Solução**:
1. Vá em **Supabase** > **Settings** > **API**
2. Copie novamente as credenciais
3. Atualize na **Vercel** > **Environment Variables**
4. **Redeploy**

### Login não funciona

**Problema**: Email não confirmado ou RLS  
**Solução**:
1. Verifique email para confirmar conta
2. Ou desabilite confirmação de email:
   - **Supabase** > **Authentication** > **Providers** > **Email**
   - Desmarque **"Confirm email"**

### Chat não funciona

**Problema**: OpenRouter API key não configurada  
**Solução**:
1. Configure a API key via SQL (instruções na Parte 3)
2. Verifique se tem créditos no OpenRouter

---

## 📊 Monitoramento

### Vercel Analytics

1. **Analytics**: Vá em **Analytics** no projeto Vercel
2. **Métricas**: Veja visitantes, performance, etc
3. **Logs**: Veja erros em tempo real

### Supabase Dashboard

1. **Database**: Monitore uso do banco
2. **Auth**: Veja usuários cadastrados
3. **Logs**: Verifique queries e erros

---

## 💰 Custos

### Tier Gratuito (Suficiente para começar)

- **Vercel Free**: 
  - 100GB bandwidth/mês
  - Domínios ilimitados
  - ✅ Suficiente para ~100k requests/mês

- **Supabase Free**:
  - 500MB database
  - 2GB bandwidth
  - 50k autenticações/mês
  - ✅ Suficiente para começar

- **OpenRouter**:
  - Pay-per-use
  - ~$0.50 por 1000 mensagens (GPT-3.5)
  - ~$5.00 por 1000 mensagens (GPT-4)

### Quando Escalar

Quando ultrapassar os limites gratuitos, considere:
- **Vercel Pro**: $20/mês (mais recursos)
- **Supabase Pro**: $25/mês (mais storage)
- **OpenRouter**: Adicione mais créditos conforme necessário

---

## 🎉 Pronto!

Sua aplicação está no ar! 🚀

**URL da Aplicação**: `https://seu-projeto.vercel.app`

### Próximos Passos

1. ✅ Compartilhe com usuários
2. ✅ Configure domínio personalizado
3. ✅ Adicione mais features
4. ✅ Monitore uso e custos

---

## 📞 Precisa de Ajuda?

- 📧 [Abra uma issue](https://github.com/IslandeSilva/OpenAgentBr/issues)
- 📚 [Documentação Vercel](https://vercel.com/docs)
- 📚 [Documentação Supabase](https://supabase.com/docs)
- 💬 [Discord do Supabase](https://discord.supabase.com)

---

**Desenvolvido com ❤️ no Brasil 🇧🇷**
