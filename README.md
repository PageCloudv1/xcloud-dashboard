# xcloud-dashboard

🎨 xCloud Dashboard - Web interface for managing deployments, analytics and team collaboration

## 🚀 Features

- ✅ Layout responsivo com sidebar
- ✅ Dashboard home com métricas básicas
- ✅ Sistema de navegação intuitiva
- 🔄 Sistema de autenticação (em desenvolvimento)

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Styling:** Tailwind CSS 4
- **Testes:** Jest + React Testing Library + Playwright
- **Linting:** ESLint + Prettier
- **Package Manager:** pnpm

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Rodar em produção
pnpm start
```

## 🧪 Testes

```bash
# Testes unitários
pnpm test:unit

# Testes E2E
pnpm test:e2e

# Verificação de tipos
pnpm type-check

# Linting
pnpm lint

# Formatação
pnpm format
```

## 📊 Métricas do Dashboard

O dashboard exibe:
- Usuários ativos
- Aplicações rodando
- Logs processados
- Uso médio de CPU
- Atividade recente do sistema
- Ações rápidas para operações comuns

## 📚 Documentação

Para mais informações sobre o ecossistema xCloud, visite:
https://pagecloudv1.github.io/xcloud-docs/

## 🏗️ Estrutura do Projeto

```
/
├── src/
│   ├── app/              # Páginas Next.js (App Router)
│   ├── components/       # Componentes React
│   │   ├── dashboard/    # Componentes do dashboard
│   │   └── layout/       # Componentes de layout
│   └── lib/              # Utilitários (futuro)
├── tests/                # Testes E2E (Playwright)
├── public/               # Assets estáticos
└── ...config files       # Configurações
```

## 🔐 Próximos Passos

- [ ] Implementar NextAuth.js para autenticação
- [ ] Integrar com APIs backend
- [ ] Adicionar WebSocket para updates em tempo real
- [ ] Implementar páginas de gerenciamento (usuários, apps, logs)
- [ ] Adicionar testes E2E completos

