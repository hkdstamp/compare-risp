'use client';

import { useEffect } from 'react';

export default function IframeResizer() {
  useEffect(() => {
    const sendHeight = () => {
      if (typeof document === 'undefined') return;
      
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      // Send message to parent (Webflow)
      window.parent.postMessage({ type: 'resize', height: height }, '*');
    };

    // 1. Send on load & resize
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);
    
    // Also call immediately to ensure size is sent on initial client-side render
    sendHeight();

    // 2. Send on DOM changes (User clicks buttons, forms expand, etc.)
    const observer = new MutationObserver(sendHeight);
    if (document.body) {
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', sendHeight);
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
    };
  }, []);

  return null;
}
