# ⚡ Deploy Rápido - 15 Minutos

Guia super rápido para colocar o OpenAgentBr no ar em 15 minutos!

---

## 🗄️ 1. SUPABASE (5 min)

### Criar Projeto
```
1. Acesse: https://supabase.com
2. Login com GitHub
3. "New Project"
4. Nome: openagentbr
5. Senha: [crie uma senha forte]
6. Região: South America
7. "Create"
```

### Executar Schema
```
1. SQL Editor
2. Copie: SCHEMA.md (todo o código)
3. Cole no editor
4. RUN
```

### Copiar Credenciais
```
Settings > API
  ➜ Project URL: [copie]
  ➜ anon key: [copie]
```

---

## 🌐 2. VERCEL (5 min)

### Conectar GitHub
```
1. Acesse: https://vercel.com
2. Login com GitHub
3. "Add New" > "Project"
4. Import: OpenAgentBr
```

### Configurar
```
Environment Variables:

NEXT_PUBLIC_SUPABASE_URL = [cole a URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [cole a key]
NEXT_PUBLIC_APP_URL = https://seu-app.vercel.app
```

### Deploy
```
Clique em "Deploy"
Aguarde 2-3 minutos
✅ Pronto!
```

---

## 🔑 3. OPENROUTER (5 min)

### API Key
```
1. https://openrouter.ai
2. Login/Signup
3. "Keys" > "Create Key"
4. Copie: sk-or-v1-...
```

### Créditos
```
1. "Credits"
2. Add $10
3. Confirmar
```

### Configurar no App
```sql
-- No Supabase SQL Editor:

-- 1. Pegue seu user_id (após criar conta no app)
SELECT id, email FROM auth.users;

-- 2. Adicione sua API key
INSERT INTO user_settings (user_id, openrouter_api_key)
VALUES ('SEU_USER_ID', 'sk-or-v1-SUA_KEY');
```

---

## ✅ Pronto!

Acesse: `https://seu-app.vercel.app`

1. ✅ Crie uma conta
2. ✅ Configure OpenRouter key (SQL acima)
3. ✅ Crie um agente
4. ✅ Comece a conversar!

---

## 🆘 Problemas?

Veja o [DEPLOY.md](DEPLOY.md) completo para troubleshooting detalhado.

---

## 📊 Resumo de Custos

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Free | R$ 0/mês |
| Supabase | Free | R$ 0/mês |
| OpenRouter | Pay-per-use | ~R$ 25 para ~5000 msgs |

**Total inicial**: ~R$ 50 (créditos OpenRouter)

---

**Tempo total**: ~15 minutos ⚡

Bom deploy! 🚀🇧🇷
