# xcloud-dashboard

🎨 xCloud Dashboard - Web interface for managing deployments, analytics and team collaboration

## 🚀 Features

- **Deployment Management**: Create, monitor, and manage cloud deployments
- **Analytics Dashboard**: Real-time metrics and performance insights
- **Team Collaboration**: User and role management
- **Portal Integration**: Seamless handoff with xCloud Portal
- **Shared Components**: Reusable UI components across ecosystem

## 🔗 Integration with xCloud Portal

This dashboard integrates bidirectionally with [xCloud Portal](https://github.com/PageCloudv1/xcloud-portal) to provide:

- **Unified Authentication**: Single Sign-On (SSO) across applications
- **Seamless Navigation**: Handoff between portal and dashboard with state preservation
- **Shared Components**: Common UI components for consistent experience
- **State Management**: Shared user state and preferences

See [Integration Documentation](./docs/INTEGRATION.md) for detailed implementation guide.

## 📋 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/PageCloudv1/xcloud-dashboard.git
cd xcloud-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview
```

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code with ESLint
- `pnpm type-check` - Check TypeScript types

### Project Structure

```
xcloud-dashboard/
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # Architecture overview
│   ├── INTEGRATION.md         # Integration guide
│   └── SHARED-COMPONENTS.md   # Component documentation
├── src/
│   ├── config/               # Configuration files
│   │   └── portal-integration.ts
│   ├── shared/               # Shared components and utilities
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   └── portal-handoff.ts
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
└── package.json
```

## 🧩 Shared Components

The dashboard includes shared components that can be used across the xCloud ecosystem:

- **Button**: Versatile button with variants (primary, secondary, outline)
- More components coming soon...

See [Shared Components Guide](./docs/SHARED-COMPONENTS.md) for usage details.

## 🔐 Authentication & SSO

The dashboard uses SSO integration with xCloud Portal for unified authentication:

1. User authenticates in Portal
2. SSO cookie is set across *.xcloud.io domain
3. Dashboard validates authentication automatically
4. Seamless experience across applications

## 🔄 Portal Handoff

Navigate between Portal and Dashboard with state preservation:

```typescript
import { navigateToPortal } from '@/utils/portal-handoff';

// Navigate to portal with return context
navigateToPortal('profile', {
  returnUrl: '/deployments',
  context: { action: 'edit' }
});
```

## 📚 Documentation

- [Integration Guide](./docs/INTEGRATION.md) - Complete integration documentation
- [Architecture](./docs/ARCHITECTURE.md) - System architecture overview
- [Shared Components](./docs/SHARED-COMPONENTS.md) - Component library guide
- [Full Documentation](https://pagecloudv1.github.io/xcloud-docs/) - Official xCloud docs

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and type checks (`pnpm lint && pnpm type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🔗 Related Projects

- [xCloud Portal](https://github.com/PageCloudv1/xcloud-portal) - Landing page and authentication
- [xCloud Docs](https://pagecloudv1.github.io/xcloud-docs/) - Documentation site

## 📄 License

[MIT License](LICENSE) - See LICENSE file for details

## 📞 Support

- 📚 [Documentation](https://pagecloudv1.github.io/xcloud-docs/)
- 🐛 [Issue Tracker](https://github.com/PageCloudv1/xcloud-dashboard/issues)
- 💬 [Discussions](https://github.com/PageCloudv1/xcloud-dashboard/discussions)

---

**Built with** ❤️ **by the xCloud Team**

