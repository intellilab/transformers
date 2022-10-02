export default () => {
  if (process.env.NODE_ENV === 'production') {
    const script = document.createElement('script');
    script.src = 'https://u.gerald.win/u.js';
    script.async = true;
    script.defer = true;
    script.dataset.websiteId = '74d7c261-0e76-42b1-8092-1ec201c687e3';
    document.head.append(script);
  }
};
