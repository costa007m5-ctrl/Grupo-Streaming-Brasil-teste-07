# Fintech Dashboard UI

Uma aplicação React/TypeScript para gerenciamento de grupos de assinatura de streaming.

## Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes de interface reutilizáveis
│   ├── layout/          # Componentes de layout (Header, BottomNav, etc.)
│   ├── screens/         # Telas da aplicação
│   ├── modals/          # Modais e prompts
│   └── forms/           # Componentes de formulário
├── contexts/            # Contextos React (Theme, Sound, etc.)
├── lib/                 # Bibliotecas e configurações externas
├── types/               # Definições de tipos TypeScript
├── utils/               # Funções utilitárias e constantes
├── hooks/               # Custom hooks React
├── assets/              # Recursos estáticos
└── styles/              # Estilos CSS/SCSS
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- Supabase
- Firebase
- Tailwind CSS