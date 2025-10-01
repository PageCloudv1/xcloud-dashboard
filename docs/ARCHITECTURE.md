# 🏗️ Integration Architecture

## System Overview

The xCloud ecosystem consists of two primary applications that work together to provide a complete cloud management experience:

```
┌─────────────────────────────────────────────────────────────┐
│                     xCloud Ecosystem                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐              ┌───────────────────┐  │
│  │  xCloud Portal   │◄────────────►│ xCloud Dashboard  │  │
│  │                  │   Handoff    │                   │  │
│  │  - Landing       │   SSO Auth   │  - Deployments    │  │
│  │  - Marketing     │   Shared     │  - Analytics      │  │
│  │  - Onboarding    │   Components │  - Team Mgmt      │  │
│  └──────────────────┘              └───────────────────┘  │
│         │                                    │             │
│         │            ┌──────────────┐       │             │
│         └───────────►│  Shared API  │◄──────┘             │
│                      │   Backend    │                     │
│                      └──────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Application Responsibilities

### xCloud Portal
**Purpose**: Public-facing application for user acquisition and authentication

**Features**:
- Marketing landing page
- User registration and login
- Profile management
- Onboarding flow
- Documentation portal

**Tech Stack**:
- React / Next.js
- Tailwind CSS
- NextAuth.js for authentication

### xCloud Dashboard
**Purpose**: Admin interface for managing cloud resources

**Features**:
- Deployment management
- Analytics and monitoring
- Team collaboration
- Resource configuration
- Billing and usage

**Tech Stack**:
- React + TypeScript
- Vite
- React Router
- Chart libraries for analytics

## Integration Layers

### 1. Routing Layer

**Handoff Routes** enable seamless navigation between applications:

```typescript
// Portal → Dashboard
/portal/auth → /dashboard?handoff={state}
/portal/profile → /dashboard/deployments?handoff={state}

// Dashboard → Portal
/dashboard → /portal?returnUrl=/dashboard/deployments
/dashboard/team → /portal/profile?handoff={state}
```

**Implementation**:
- URL parameters for state transfer
- Session storage for temporary state
- Query string cleaning after state extraction

### 2. Authentication Layer

**SSO (Single Sign-On)** provides unified authentication:

```
┌─────────┐                    ┌──────────┐                 ┌───────────┐
│  User   │                    │  Portal  │                 │ Dashboard │
└────┬────┘                    └────┬─────┘                 └─────┬─────┘
     │                              │                             │
     │  1. Login                    │                             │
     ├─────────────────────────────►│                             │
     │                              │                             │
     │  2. Set SSO Cookie           │                             │
     │◄─────────────────────────────┤                             │
     │                              │                             │
     │  3. Navigate to Dashboard    │                             │
     ├────────────────────────────────────────────────────────────►│
     │                              │                             │
     │  4. Validate SSO Cookie      │                             │
     │◄────────────────────────────────────────────────────────────┤
     │                              │                             │
     │  5. Authenticated Session    │                             │
     │◄────────────────────────────────────────────────────────────┤
```

**Requirements**:
- Shared cookie domain (*.xcloud.io)
- HttpOnly, Secure cookies
- Token validation endpoint
- Refresh token mechanism

### 3. State Management Layer

**Shared State** for consistent user experience:

```typescript
interface SharedState {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'viewer';
  };
  organization: {
    id: string;
    name: string;
    plan: 'free' | 'pro' | 'enterprise';
  };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
}
```

**Storage Options**:
- **sessionStorage**: For handoff state (temporary)
- **localStorage**: For user preferences (persistent)
- **Cookies**: For authentication tokens (httpOnly)

### 4. Component Layer

**Shared Components** for consistent UI:

```
src/shared/
├── components/
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   └── ...
├── hooks/
│   ├── usePortalHandoff.ts
│   ├── useAuth.ts
│   └── ...
└── types/
    ├── user.ts
    ├── organization.ts
    └── ...
```

**Benefits**:
- Consistent design language
- Reduced code duplication
- Easier maintenance
- Type safety across apps

## Data Flow

### User Journey Example: Deployment Creation

```
1. User lands on Portal (/)
   ↓
2. User logs in (/auth)
   ↓ [SSO Cookie Set]
3. Portal shows dashboard link
   ↓ [Click "Go to Dashboard"]
4. Handoff to Dashboard with state
   ↓ [URL: /dashboard?handoff=...]
5. Dashboard extracts handoff state
   ↓ [Validates SSO cookie]
6. Dashboard shows deployments page
   ↓
7. User creates deployment
   ↓
8. Success! Returns to Dashboard home
```

### Navigation Flow with State Preservation

```typescript
// 1. User initiates navigation from Dashboard
navigateToPortal('profile', {
  returnUrl: '/deployments',
  context: {
    from: 'dashboard',
    action: 'edit-profile',
  }
});

// 2. Portal receives handoff state
const { handoffState } = usePortalHandoff();
// handoffState.returnUrl = '/deployments'
// handoffState.context.from = 'dashboard'

// 3. After profile edit, return to Dashboard
const returnUrl = createDashboardHandoffUrl(
  handoffState.returnUrl,
  { completed: true }
);
window.location.href = returnUrl;
```

## Security Considerations

### 1. State Validation

- **Timestamp validation**: Reject state older than 5 minutes
- **Signature validation**: HMAC signature for state integrity
- **Origin validation**: Verify requests come from trusted domains

### 2. Authentication Security

- **HttpOnly cookies**: Prevent XSS attacks
- **Secure cookies**: HTTPS only
- **SameSite cookies**: Prevent CSRF attacks
- **Token rotation**: Regular token refresh

### 3. CORS Configuration

```typescript
// Backend CORS setup
{
  origin: [
    'https://portal.xcloud.io',
    'https://dashboard.xcloud.io',
    'http://localhost:3000',  // Development
    'http://localhost:5173',  // Development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
```

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load routes
const Deployments = lazy(() => import('./pages/Deployments'));
const Analytics = lazy(() => import('./pages/Analytics'));
```

### 2. State Caching

```typescript
// Cache shared state in memory
const stateCache = new Map<string, SharedState>();
```

### 3. Bundle Optimization

- Tree shaking for unused code
- Dynamic imports for routes
- Shared chunk for common dependencies

## Monitoring & Observability

### Metrics to Track

1. **Handoff Success Rate**: % of successful navigations
2. **SSO Validation Time**: Time to validate authentication
3. **State Transfer Errors**: Failed state transfers
4. **User Journey Completion**: End-to-end user flows

### Logging

```typescript
// Log handoff events
logger.info('Handoff initiated', {
  from: 'dashboard',
  to: 'portal',
  route: '/profile',
  userId: user.id,
  timestamp: Date.now(),
});
```

## Deployment Architecture

### Development

```
Portal:    http://localhost:3000
Dashboard: http://localhost:5173
API:       http://localhost:8080
```

### Staging

```
Portal:    https://staging-portal.xcloud.io
Dashboard: https://staging-dashboard.xcloud.io
API:       https://staging-api.xcloud.io
```

### Production

```
Portal:    https://portal.xcloud.io
Dashboard: https://dashboard.xcloud.io
API:       https://api.xcloud.io
```

### Infrastructure

```
                    ┌──────────────┐
                    │   CDN / WAF  │
                    └───────┬──────┘
                            │
                    ┌───────┴───────┐
                    │ Load Balancer │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────┴────┐         ┌────┴────┐       ┌─────┴─────┐
   │ Portal  │         │Dashboard│       │    API    │
   │ Servers │         │ Servers │       │  Servers  │
   └─────────┘         └─────────┘       └───────────┘
```

## Future Enhancements

### 1. Micro-frontends

Use Module Federation for runtime integration:

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'dashboard',
  remotes: {
    portal: 'portal@https://portal.xcloud.io/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### 2. Real-time Communication

WebSocket connection for live updates:

```typescript
// Shared WebSocket for both apps
const ws = new WebSocket('wss://api.xcloud.io/ws');
ws.onmessage = (event) => {
  // Handle real-time updates
};
```

### 3. Shared Package

Extract to separate npm package:

```bash
@xcloud/shared
├── components/
├── hooks/
├── utils/
└── types/
```

---

**Version**: 0.1.0  
**Last Updated**: January 2025  
**Author**: xCloud Team
