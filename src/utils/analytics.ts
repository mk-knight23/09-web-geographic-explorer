// Analytics utility for GTM/GA4 integration
// Tracks events only when GTM is configured via window.__GTM_ID or dataLayer exists

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __GTM_ID?: string;
  }
}

export const analytics = {
  track(event: string, params: Record<string, unknown> = {}) {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event, ...params });
    }
    if (localStorage.getItem('analytics_debug') === 'true') {
      console.log('[Analytics]', event, params);
    }
  },
};
