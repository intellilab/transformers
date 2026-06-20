export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;
  if (process.env.NODE_ENV === 'production') {
    const script = document.createElement('script');
    script.src = 'https://m.pore.run/script.js';
    script.defer = true;
    document.head.append(script);
  }
});
