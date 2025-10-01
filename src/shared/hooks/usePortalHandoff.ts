/**
 * 🪝 usePortalHandoff Hook
 * 
 * A React hook for managing handoff state between xCloud Dashboard and xCloud Portal.
 */

import { useEffect, useState } from 'react';
import { getHandoffState, parseHandoffFromUrl, type HandoffState } from '../../utils/portal-handoff';

export const usePortalHandoff = () => {
  const [handoffState, setHandoffState] = useState<HandoffState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get handoff state from URL first (cross-app navigation)
    const urlState = parseHandoffFromUrl();
    if (urlState) {
      setHandoffState(urlState);
      setIsLoading(false);
      return;
    }

    // Fallback to sessionStorage (same-app navigation)
    const sessionState = getHandoffState();
    if (sessionState) {
      setHandoffState(sessionState);
    }

    setIsLoading(false);
  }, []);

  return {
    handoffState,
    isLoading,
    hasHandoff: handoffState !== null,
  };
};
