# 🔄 xCloud Portal Integration Documentation

## Overview

This document describes the integration architecture between **xCloud Dashboard** and **xCloud Portal**, enabling seamless bidirectional navigation (handoff) and shared components.

## Architecture

### System Components

1. **xCloud Portal** (`xcloud-portal`)
   - Landing page
   - User authentication
   - User profile management

2. **xCloud Dashboard** (`xcloud-dashboard`)
   - Deployment management
   - Analytics dashboard
   - Team collaboration

### Integration Points

```
┌─────────────────┐         Handoff          ┌──────────────────┐
│  xCloud Portal  │ ◄────────────────────► │ xCloud Dashboard │
│                 │    Shared Components    │                  │
│  - Landing      │    SSO Authentication   │  - Deployments   │
│  - Auth         │    State Management     │  - Analytics     │
│  - Profile      │                         │  - Team          │
└─────────────────┘                         └──────────────────┘
```

## 🔌 Configuration

### Environment Setup

Configuration is managed through `src/config/portal-integration.ts`:

```typescript
// Development
portalUrl: 'http://localhost:3000'
dashboardUrl: 'http://localhost:5173'

// Production
portalUrl: 'https://portal.xcloud.io'
dashboardUrl: 'https://dashboard.xcloud.io'
```

### Environment Variables

Create a `.env` file:

```env
VITE_PORTAL_URL=http://localhost:3000
VITE_DASHBOARD_URL=http://localhost:5173
VITE_SSO_ENDPOINT=http://localhost:3000/api/auth/sso
```

## 🚀 Handoff Implementation

### 1. Navigation from Dashboard to Portal

```typescript
import { navigateToPortal } from '@/utils/portal-handoff';

// Simple navigation
navigateToPortal('landing');

// Navigation with state
navigateToPortal('profile', {
  returnUrl: '/deployments',
  context: { userId: '123', action: 'edit' }
});
```

### 2. Navigation from Portal to Dashboard

```typescript
import { createDashboardHandoffUrl } from '@/utils/portal-handoff';

// Create handoff URL
const url = createDashboardHandoffUrl('deployments', {
  returnUrl: '/portal/profile',
  context: { deploymentId: 'dep-123' }
});

// Navigate
window.location.href = url;
```

### 3. Receiving Handoff State

```typescript
import { usePortalHandoff } from '@/shared/hooks/usePortalHandoff';

function MyComponent() {
  const { handoffState, hasHandoff, isLoading } = usePortalHandoff();
  
  if (hasHandoff) {
    console.log('Received from:', handoffState.context?.from);
    console.log('Return URL:', handoffState.returnUrl);
  }
}
```

## 🧩 Shared Components

### Creating Shared Components

Shared components should be placed in `src/shared/components/` and follow these principles:

1. **Framework-agnostic design** - Minimal dependencies
2. **Type-safe** - Use TypeScript interfaces
3. **Documented** - Include JSDoc comments
4. **Styled independently** - Include CSS modules

### Example: Button Component

```typescript
import { Button } from '@/shared/components';

<Button 
  variant="primary" 
  size="medium"
  onClick={handleClick}
>
  Click Me
</Button>
```

### Available Shared Components

- `Button` - Reusable button with variants

**TODO**: Add more shared components as identified during the integration process.

## 🔐 SSO Integration

### Authentication Flow

1. User authenticates in Portal
2. Portal sets SSO cookies (httpOnly, secure)
3. Dashboard validates SSO cookie on protected routes
4. Seamless authentication across applications

### Implementation

```typescript
import { checkSSOAuthentication } from '@/utils/portal-handoff';

// Check if user is authenticated
const isAuthenticated = await checkSSOAuthentication();

if (!isAuthenticated) {
  navigateToPortal('auth', {
    returnUrl: window.location.pathname
  });
}
```

## 📋 Handoff State Schema

```typescript
interface HandoffState {
  returnUrl?: string;        // URL to return to after completing action
  context?: {                // Additional context data
    from: 'portal' | 'dashboard';
    userId?: string;
    resourceId?: string;
    action?: string;
    [key: string]: any;
  };
  timestamp: number;         // When handoff was created (for validation)
}
```

### State Persistence

- **URL Parameters**: For cross-app navigation (base64 encoded)
- **sessionStorage**: For same-app navigation
- **Timeout**: 5 minutes validity

## 🔄 Routing Configuration

### Dashboard Routes (for Handoff)

- `/` - Home (default landing)
- `/deployments` - Deployment management
- `/analytics` - Analytics dashboard
- `/team` - Team collaboration

### Portal Routes (for Handoff)

- `/` - Landing page
- `/auth` - Authentication
- `/profile` - User profile

## 🛠️ Development Workflow

### 1. Start Both Applications

```bash
# Terminal 1 - Portal
cd xcloud-portal
pnpm dev  # runs on localhost:3000

# Terminal 2 - Dashboard
cd xcloud-dashboard
pnpm dev  # runs on localhost:5173
```

### 2. Test Handoff

1. Open Dashboard at `http://localhost:5173`
2. Click "Go to Portal Landing" button
3. Verify navigation to Portal
4. Navigate back to Dashboard with handoff state

### 3. Verify State

- Check browser DevTools > Application > Session Storage
- Look for `xcloud_shared_state` key
- Verify URL parameters during cross-app navigation

## 📊 Monitoring & Debugging

### Debug Handoff State

```typescript
// Enable debug logging
console.log('Handoff State:', handoffState);
console.log('Portal Config:', getPortalConfig());
```

### Common Issues

1. **State not persisting**: Check sessionStorage/URL encoding
2. **SSO not working**: Verify cookie domain and path settings
3. **Navigation fails**: Check CORS configuration

## 🚦 Testing

### Manual Testing Checklist

- [ ] Navigate from Dashboard to Portal
- [ ] Navigate from Portal to Dashboard
- [ ] State preserved across navigation
- [ ] Return URL works correctly
- [ ] SSO authentication validates
- [ ] Handoff timeout works (after 5 minutes)

### Automated Testing

```bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e
```

## 📚 Additional Resources

- [xCloud Documentation](https://pagecloudv1.github.io/xcloud-docs/)
- [React Router Documentation](https://reactrouter.com/)
- [SSO Best Practices](https://auth0.com/docs/authenticate/single-sign-on)

## 🔮 Future Enhancements

1. **Shared Component Library**
   - Extract to separate npm package
   - Version and publish independently
   - Import in both applications

2. **Advanced SSO**
   - OAuth 2.0 / OpenID Connect
   - Multi-factor authentication
   - Session management

3. **Real-time Sync**
   - WebSocket communication
   - Shared state updates
   - Notifications across apps

4. **Micro-frontend Architecture**
   - Module Federation
   - Independent deployments
   - Runtime integration

---

**Last Updated**: January 2025  
**Version**: 0.1.0  
**Maintainer**: xCloud Team
