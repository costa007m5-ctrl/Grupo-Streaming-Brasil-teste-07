# 🚀 Guia de Deploy para Netlify

## ✅ Mudanças Realizadas

Todas as configurações do PWA foram corrigidas:

1. **Título do App**: Atualizado para "Grupo Streaming Brasil"
2. **Capturas de Tela**: 5 screenshots profissionais adicionados com dimensões corretas
   - Mobile: 768x1408 pixels
   - Desktop: 1408x768 pixels
3. **Extensões de Escopo**: Configuradas incluindo *.netlify.app
4. **Modo com Abas**: Habilitado no manifesto

## 📦 Como Fazer Deploy no Netlify

### Opção 1: Deploy Manual (Arraste e Solte) - MAIS FÁCIL

1. A pasta `dist` já foi gerada e está pronta para deploy
2. Acesse o painel do Netlify: https://app.netlify.com
3. Vá no seu site "grupostreaming"
4. Clique em "Deploys" no menu superior
5. Arraste a pasta `dist` inteira para a área de upload (ou clique para selecionar)
6. Aguarde o deploy finalizar (1-2 minutos)

### Opção 2: Deploy via Git (Se estiver usando integração Git)

Se você tem o site conectado a um repositório Git:
- Faça commit e push das mudanças
- O Netlify detectará automaticamente e fará o deploy

## 🔄 Limpando o Cache no Netlify

Após o deploy, se o ícone de instalação ainda não aparecer:

1. Acesse as configurações do site no Netlify
2. Procure por "Clear cache and deploy site"
3. Clique para limpar o cache e fazer novo deploy

## ✨ Verificando o PWA

Após o deploy:

1. Acesse: https://grupostreaming.netlify.app
2. Limpe o cache do navegador (Ctrl + Shift + Delete)
3. Recarregue a página (Ctrl + F5)
4. O ícone de instalação (⬇️ ou +) deve aparecer na barra de endereço
5. Para verificar o manifesto:
   - Abra as Ferramentas do Desenvolvedor (F12)
   - Vá em "Application" > "Manifest"
   - Confirme que as dimensões estão corretas: 768x1408 (mobile) e 1408x768 (desktop)

## 📁 Pasta Dist

A pasta `dist` contém:
- ✅ Todos os arquivos otimizados para produção
- ✅ Manifest.json com configurações corretas
- ✅ 5 capturas de tela profissionais
- ✅ Ícones do PWA
- ✅ Todos os assets necessários

Basta fazer upload dessa pasta no Netlify!
