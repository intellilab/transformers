const URL_LOG = 'https://monika.gerald.top/log';

function track(item: {
  message?: string;
  c1?: string;
  c2?: string;
  c3?: string;
}) {
  const { message, c1, c2, c3 } = item;
  const query = {
    pid: 'transformers',
    code: 'error',
    message: message || '',
    c1: c1 || '',
    c2: c2 || '',
    c3: c3 || '',
    url: window.location.href,
    time: Date.now(),
  };
  const qs = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  const img = new Image();
  img.src = `${URL_LOG}?${qs}`;
}

function reprError(err: unknown) {
  return (err instanceof Error ? `${err}` : JSON.stringify(err)) || 'no error';
}

function trackError(err: unknown, extra?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    setTimeout(track, 0, {
      ...extra,
      c1: reprError(err),
      c2: `${((err as Error)?.stack) || ''}`.slice(0, 512),
    });
  } else {
    console.error('Error:', err, extra);
  }
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.config.errorHandler = (err: unknown) => {
    trackError(err);
    console.error(err);
  };
});
