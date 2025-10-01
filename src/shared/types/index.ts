/**
 * 📋 Shared Type Definitions
 * 
 * Common types used across xCloud Dashboard and xCloud Portal for integration.
 */

/**
 * User information shared between applications
 */
export interface SharedUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  organizationId: string;
}

/**
 * Organization information
 */
export interface SharedOrganization {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  membersCount: number;
}

/**
 * SSO token for authentication
 */
export interface SSOToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

/**
 * Navigation context for handoff
 */
export interface NavigationContext {
  from: 'portal' | 'dashboard';
  intent?: 'view' | 'edit' | 'create' | 'delete';
  resourceId?: string;
  resourceType?: string;
}
