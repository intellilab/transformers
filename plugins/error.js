import Vue from 'vue';

const URL_LOG = 'https://monika.gerald.top/log';

function track(item) {
  const { message, c1, c2, c3 } = item;
  const query = {
    pid: 'transformers',
    code: 'error',
    message: message || '',
    c1: c1 || '',
    c2: c2 || '',
    c3: c3 || '',
    url: location.href,
    time: Date.now(),
  };
  const qs = Object.entries(query)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&');
  const img = new Image();
  img.src = `${URL_LOG}?${qs}`;
}

function reprError(err) {
  return (err instanceof Error ? `${err}` : JSON.stringify(err)) || 'no error';
}

Vue.config.errorHandler = (err, vm) => {
  setTimeout(track, 0, {
    c1: reprError(err),
    c2: `${(err && err.stack) || ''}`.slice(0, 512),
  });
  console.error(err);
};
