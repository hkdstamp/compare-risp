'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
  useEffect(() => {
    // Apply CSS to prevent scroll trapping if in an iframe
    // This prevents the app from creating its own internal scroll container
    if (typeof window !== 'undefined' && window.self !== window.top) {
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('height', 'auto', 'important');
      if (document.body) {
        document.body.style.setProperty('overflow', 'hidden', 'important');
        document.body.style.setProperty('height', 'auto', 'important');
      }
    }

    const sendHeight = () => {
      if (typeof document === 'undefined') return;
      
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      // Send message to parent (Webflow)
      window.parent.postMessage({ type: 'resize', height: height }, '*');
    };

    // Debounce function to prevent excessive messages during rapid resizing or DOM changes
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedSendHeight = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(sendHeight, 60); // 60ms ~ 1 frame @ 60fps buffer
    };

    // 1. Send on load (immediate) & resize (debounced)
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', debouncedSendHeight);
    
    // Also call immediately to ensure size is sent on initial client-side render
    sendHeight();

    // 2. Send on DOM changes (User clicks buttons, forms expand, etc.)
    const observer = new MutationObserver(debouncedSendHeight);
    if (document.body) {
      // Optimization: Filter attributes to only relevant ones and use debounce
      observer.observe(document.body, { 
        attributes: true, 
        childList: true, 
        subtree: true,
        attributeFilter: ['style', 'class'] 
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', sendHeight);
      window.removeEventListener('resize', debouncedSendHeight);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return null;
}
