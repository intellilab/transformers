export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return;
  if (process.env.NODE_ENV === 'production') {
    const loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://shy.gerald.win/ingress/a7a202a8-3266-4dbe-975e-373ee459c072/script.js';
      script.defer = true;
      script.onload = () => resolve(null);
      script.onerror = () => reject();
      document.head.append(script);
    });
    nuxtApp.hook('page:finish', async () => {
      await loading;
      (window as any).Shynet.newPageLoad();
    });
  }
});
