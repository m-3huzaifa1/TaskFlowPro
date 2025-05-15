export const registerSW = () => {
  console.log('111')
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    console.log('222')
    const handleLoad = () => {
      console.log('444')
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered (scope):', registration.scope);
          registration.update(); // Force update check
        })
        .catch(error => {
          console.error('SW registration failed:', error);
        });
    };

    // Check if page already loaded
    if (document.readyState === 'complete') {
      console.log('333')
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      console.log('555')
    }
  }
};