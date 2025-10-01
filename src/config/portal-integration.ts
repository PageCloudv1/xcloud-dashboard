/**
 * 🔗 xCloud Portal Integration Configuration
 * 
 * This file contains configuration for integrating xCloud Dashboard with xCloud Portal.
 * It defines the handoff URLs, SSO endpoints, and shared state management.
 */

export interface PortalIntegrationConfig {
  portalUrl: string;
  dashboardUrl: string;
  ssoEndpoint: string;
  sharedStateKey: string;
  handoffRoutes: {
    toPortal: {
      landing: string;
      auth: string;
      profile: string;
    };
    toDashboard: {
      home: string;
      deployments: string;
      analytics: string;
      team: string;
    };
  };
}

/**
 * Get the portal integration configuration based on the current environment
 */
export const getPortalConfig = (): PortalIntegrationConfig => {
  const env = import.meta.env.MODE || 'development';
  
  const configs: Record<string, PortalIntegrationConfig> = {
    development: {
      portalUrl: 'http://localhost:3000',
      dashboardUrl: 'http://localhost:5173',
      ssoEndpoint: 'http://localhost:3000/api/auth/sso',
      sharedStateKey: 'xcloud_shared_state',
      handoffRoutes: {
        toPortal: {
          landing: '/',
          auth: '/auth',
          profile: '/profile',
        },
        toDashboard: {
          home: '/',
          deployments: '/deployments',
          analytics: '/analytics',
          team: '/team',
        },
      },
    },
    production: {
      portalUrl: 'https://portal.xcloud.io',
      dashboardUrl: 'https://dashboard.xcloud.io',
      ssoEndpoint: 'https://portal.xcloud.io/api/auth/sso',
      sharedStateKey: 'xcloud_shared_state',
      handoffRoutes: {
        toPortal: {
          landing: '/',
          auth: '/auth',
          profile: '/profile',
        },
        toDashboard: {
          home: '/',
          deployments: '/deployments',
          analytics: '/analytics',
          team: '/team',
        },
      },
    },
  };

  return configs[env] || configs.development;
};

export default getPortalConfig();
