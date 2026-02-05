'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
  useEffect(() => {
    // Ensure document and body are available
    if (typeof document === 'undefined' || !document.body) return;
    const body = document.body;
    const docEl = document.documentElement;

    // Apply CSS to prevent scroll trapping if in an iframe
    // This prevents the app from creating its own internal scroll container
    if (typeof window !== 'undefined' && window.self !== window.top) {
      docEl.style.setProperty('overflow', 'hidden', 'important');
      docEl.style.setProperty('height', 'auto', 'important');
      body.style.setProperty('overflow', 'hidden', 'important');
      body.style.setProperty('height', 'auto', 'important');
    }

    // Determine and validate the expected parent origin
    const allowedParentOrigin: string | null = (() => {
      if (typeof document === 'undefined') return null;
      // If no referrer, we cannot validate origin.
      // For security, strict matching is better than defaulting to '*'.
      // If you need to support 'noreferrer' embeddings, you might need a different strategy 
      // (e.g. passing origin in query param), but referrer is standard for this.
      if (!document.referrer) return null;

      try {
        const url = new URL(document.referrer);
        const hostname = url.hostname;
        // Trusted domains: Webflow, Alphaus (own domain), and Localhost for dev
        const allowedRoots = ['webflow.com', 'webflow.io', 'alphaus.cloud', 'localhost', '127.0.0.1'];

        const isAllowedHost = allowedRoots.some((root) => {
          return hostname === root || hostname.endsWith(`.${root}`);
        });

        return isAllowedHost ? url.origin : null;
      } catch {
        return null;
      }
    })();

    const sendHeight = () => {
      // If we couldn't validate the parent origin, do not send the message.
      if (!allowedParentOrigin) return;

      const rawHeight = docEl.scrollHeight || body.scrollHeight;
      // Add a small buffer (4px) to handle sub-pixel rendering issues.
      // Case: Content is 800.5px. If browser creates 800px iframe, 0.5px overflow traps scroll.
      // Making it slightly larger ensures content fits perfectly, allowing wheel events to bubble to parent.
      const height = Math.ceil(rawHeight) + 4;
      
      // Prevent infinite loops: only send if height has actually changed significantly
      if (Math.abs(height - lastHeight) > 4) {
        console.log(`[IframeResizer] Sending resize: ${height}px (Raw: ${rawHeight}px, Prev: ${lastHeight}px) to ${allowedParentOrigin}`);
        lastHeight = height;
        window.parent.postMessage({ type: 'RESIZE', height: height }, allowedParentOrigin);
      }
    };

    // Keep track of last sent height to prevent loop
    let lastHeight = 0;

    // Debounce function to prevent excessive messages during rapid resizing or DOM changes
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedSendHeight = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(sendHeight, 60); // 60ms ~ 1 frame @ 60fps buffer
    };

    // 1. Send on load (immediate) & resize (debounced)
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', debouncedSendHeight);
    
    // Also call immediately
    sendHeight();

    // 2. ResizeObserver: The most robust way to detect size changes (animations, layout shifts)
    const resizeObserver = new ResizeObserver(debouncedSendHeight);
    resizeObserver.observe(body);

    // 3. MutationObserver: Backup for DOM structure changes that might not trigger resize immediately
    const mutationObserver = new MutationObserver(debouncedSendHeight);
    mutationObserver.observe(body, { 
      attributes: true, 
      childList: true, 
      subtree: true,
      attributeFilter: ['style', 'class'] 
    });

    // Cleanup
    return () => {
      window.removeEventListener('load', sendHeight);
      window.removeEventListener('resize', debouncedSendHeight);
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
