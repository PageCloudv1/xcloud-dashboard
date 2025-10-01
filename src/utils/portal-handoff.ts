/**
 * 🔄 Portal Handoff Utilities
 * 
 * Utilities for handling navigation between xCloud Dashboard and xCloud Portal,
 * including state preservation and SSO token management.
 */

import { getPortalConfig } from '../config/portal-integration';

export interface HandoffState {
  returnUrl?: string;
  context?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Navigate to the portal with optional state preservation
 */
export const navigateToPortal = (
  route: keyof ReturnType<typeof getPortalConfig>['handoffRoutes']['toPortal'],
  state?: Omit<HandoffState, 'timestamp'>
): void => {
  const config = getPortalConfig();
  const targetUrl = `${config.portalUrl}${config.handoffRoutes.toPortal[route]}`;
  
  if (state) {
    const handoffState: HandoffState = {
      ...state,
      timestamp: Date.now(),
    };
    
    // Store state in sessionStorage for retrieval by portal
    sessionStorage.setItem(config.sharedStateKey, JSON.stringify(handoffState));
  }
  
  window.location.href = targetUrl;
};

/**
 * Retrieve handoff state from portal navigation
 */
export const getHandoffState = (): HandoffState | null => {
  const config = getPortalConfig();
  const stateJson = sessionStorage.getItem(config.sharedStateKey);
  
  if (!stateJson) return null;
  
  try {
    const state = JSON.parse(stateJson) as HandoffState;
    
    // Clear the state after retrieval
    sessionStorage.removeItem(config.sharedStateKey);
    
    // Check if state is still valid (within 5 minutes)
    const isValid = Date.now() - state.timestamp < 5 * 60 * 1000;
    
    return isValid ? state : null;
  } catch (error) {
    console.error('Failed to parse handoff state:', error);
    return null;
  }
};

/**
 * Create a URL to dashboard with handoff state
 */
export const createDashboardHandoffUrl = (
  route: keyof ReturnType<typeof getPortalConfig>['handoffRoutes']['toDashboard'],
  state?: Omit<HandoffState, 'timestamp'>
): string => {
  const config = getPortalConfig();
  const baseUrl = `${config.dashboardUrl}${config.handoffRoutes.toDashboard[route]}`;
  
  if (!state) return baseUrl;
  
  const handoffState: HandoffState = {
    ...state,
    timestamp: Date.now(),
  };
  
  // Encode state as query parameter for cross-app navigation
  const params = new URLSearchParams({
    handoff: btoa(JSON.stringify(handoffState)),
  });
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Parse handoff state from URL query parameters
 */
export const parseHandoffFromUrl = (): HandoffState | null => {
  const params = new URLSearchParams(window.location.search);
  const handoffParam = params.get('handoff');
  
  if (!handoffParam) return null;
  
  try {
    const state = JSON.parse(atob(handoffParam)) as HandoffState;
    
    // Check if state is still valid (within 5 minutes)
    const isValid = Date.now() - state.timestamp < 5 * 60 * 1000;
    
    // Clean up URL
    params.delete('handoff');
    const cleanUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', cleanUrl);
    
    return isValid ? state : null;
  } catch (error) {
    console.error('Failed to parse handoff from URL:', error);
    return null;
  }
};

/**
 * Check if user is authenticated via SSO
 */
export const checkSSOAuthentication = async (): Promise<boolean> => {
  const config = getPortalConfig();
  
  try {
    const response = await fetch(config.ssoEndpoint, {
      method: 'GET',
      credentials: 'include', // Include cookies for SSO
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('SSO authentication check failed:', error);
    return false;
  }
};
