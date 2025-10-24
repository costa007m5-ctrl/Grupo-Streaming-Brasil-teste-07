# 🚀 Guia Completo de Deploy - Vercel e Netlify

## ✅ O que foi corrigido no PWA

1. **Título**: "Grupo Streaming Brasil" ✅
2. **Screenshots**: 5 capturas de tela com dimensões corretas (768x1408 mobile, 1408x768 desktop) ✅
3. **Extensões de escopo**: Configuradas para todos os domínios ✅
   - `*.vercel.app` (cobre TODOS os seus domínios Vercel)
   - `*.netlify.app` 
   - `*.grupostreamingbrasil.com.br`
4. **Modo com abas**: Habilitado ✅
5. **Ícones PWA**: Configurados ✅

## 📦 Pasta `dist/` Pronta

A pasta `dist/` contém todo o build de produção otimizado e está pronta para deploy!

---

## 🟢 DEPLOY NO VERCEL

### Método 1: Deploy via Vercel CLI (Recomendado)

```bash
# Se não tem o Vercel CLI instalado, instale:
npm install -g vercel

# Faça login (se necessário):
vercel login

# Faça deploy da pasta dist:
vercel --prod
```

Quando perguntado:
- Set up and deploy? → `Y`
- Which scope? → Escolha seu scope
- Link to existing project? → `Y` (se já existe) ou `N` (para novo)
- What's your project's name? → `grupo-streaming-brasil` (ou o nome atual)
- In which directory is your code located? → `./dist`

### Método 2: Deploy via Dashboard Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Se já existe o projeto:
   - Vá no projeto existente
   - Clique em "Settings"
   - Em "Build & Development Settings" configure:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Volte para "Deployments" e clique "Redeploy"

### Método 3: Upload Manual da pasta dist

1. Acesse: https://vercel.com/new
2. Clique em "Browse" e selecione a pasta `dist/`
3. Ou arraste a pasta `dist/` diretamente
4. Clique em "Deploy"

---

## 🟠 DEPLOY NO NETLIFY

### Método 1: Deploy Manual (Mais Fácil)

1. Acesse: https://app.netlify.com
2. Vá no site "grupostreaming" 
3. Clique em "Deploys"
4. **Arraste a pasta `dist/` completa** para a área de upload
5. Aguarde 1-2 minutos

### Método 2: Netlify CLI

```bash
# Instale o Netlify CLI (se necessário):
npm install -g netlify-cli

# Faça login:
netlify login

# Deploy:
netlify deploy --prod --dir=dist
```

---

## 🔍 VERIFICANDO O PWA APÓS DEPLOY

### Para qualquer domínio (Vercel ou Netlify):

1. **Acesse o site no navegador**
2. **Limpe o cache do navegador** (IMPORTANTE!):
   - Chrome/Edge: Ctrl + Shift + Delete
   - Selecione "Cached images and files"
   - Clique em "Clear data"
3. **Recarregue a página com cache limpo**: Ctrl + F5
4. **Procure o ícone de instalação** na barra de endereço:
   - Chrome: ícone ⊕ (mais) ou ⬇️ (download)
   - Edge: ícone ⊕ ou "Instalar aplicativo"
   - Safari (iOS): botão de compartilhar → "Adicionar à Tela de Início"

### Verificar o Manifesto (para debugar):

1. Abra as Ferramentas do Desenvolvedor: `F12`
2. Vá em `Application` → `Manifest`
3. Verifique:
   - ✅ Nome: "Grupo Streaming Brasil"
   - ✅ Screenshots: 5 imagens com dimensões corretas
   - ✅ Ícones: 192x192 e 512x512

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### ❌ Ícone de instalação não aparece

**Solução:**
1. Limpe completamente o cache do navegador
2. Teste em uma janela anônima/privada
3. Tente em outro navegador (Chrome, Edge, Firefox)
4. No Vercel, vá em Settings → Functions → "Clear Cache"
5. No Netlify, vá em Deploys → "Clear cache and deploy site"

### ❌ Erro de dimensões de screenshot

**Solução:** Isso significa que o deploy antigo ainda está em cache.
- Faça um novo deploy com a pasta `dist/` atualizada
- Limpe o cache do servidor (Vercel/Netlify)
- Limpe o cache do navegador

### ❌ HTTPS necessário

PWAs só funcionam em HTTPS. Certifique-se que:
- Vercel: Já fornece HTTPS automaticamente ✅
- Netlify: Já fornece HTTPS automaticamente ✅

---

## 🎯 SEUS DOMÍNIOS VERCEL

Todos esses domínios funcionarão depois do deploy (cobertos por `*.vercel.app`):

✅ https://ctrl-grupo-streaming-brasi-git-d6a124-costa007m5-2723s-projects.vercel.app/
✅ https://ctrl-grupo-streaming-brasil-teste-07-4qadmd88a.vercel.app/
✅ https://ctrl-grupo-streaming-brasil-teste-07-costa007m5-2723s-projects.vercel.app/
✅ https://ctrl-grupo-streaming-brasil-teste-0.vercel.app/

---

## 📱 TESTANDO EM MOBILE

1. Acesse qualquer domínio no celular
2. Chrome Android: Menu (⋮) → "Instalar app" ou "Adicionar à tela inicial"
3. Safari iOS: Compartilhar → "Adicionar à Tela de Início"

---

## ✨ PRÓXIMOS PASSOS

1. Faça o deploy no Vercel usando um dos métodos acima
2. Faça o deploy no Netlify (se quiser manter ambos)
3. Limpe o cache do navegador
4. Teste a instalação do PWA
5. Aproveite o seu aplicativo! 🎉

**IMPORTANTE:** A pasta `dist/` já está 100% pronta. Você só precisa fazer upload dela!
