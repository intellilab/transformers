export function buildData(raw) {
  let config;
  if (raw?._type) {
    config = raw;
  } else if (!raw || typeof raw !== 'object') {
    config = {
      _type: 'primitive',
      data: raw,
    };
  } else {
    config = {
      _type: 'object',
      data: raw,
    };
  }
  if (config._type === 'url') {
    const parts = [config.protocol, config.host && '//', config.host];
    const pathname = config.pathname || config.path;
    const { query } = config;
    parts.push(pathname);
    const search = buildData(query);
    const hash = buildData(config.hash);
    if (search) parts.push('?', search);
    if (hash) parts.push('#', hash);
    return parts.filter(Boolean).join('');
  }
  if (config._type === 'object' && config.data) {
    const { data } = config;
    if (Array.isArray(data)) return data.map(buildData).map(encodeURIComponent).join(',');
    return Object.keys(config.data)
      .map((key) => {
        const value = config.data[key];
        if (value == null) return;
        return `${encodeURIComponent(key)}=${encodeURIComponent(buildData(value))}`;
      })
      .filter(Boolean)
      .join('&');
  }
  return config.data == null ? '' : config.data;
}

export function parseData(str) {
  let url;
  let hasProtocol = true;
  try {
    url = new URL(str);
  } catch {
    hasProtocol = false;
    if (str.includes('?')) {
      try {
        url = new URL(`rel:${str}`);
      } catch {
        // noop
      }
    }
  }
  if (url) {
    const config = {
      _type: 'url',
    };
    if (hasProtocol) {
      config.protocol = url.protocol;
    }
    if (url.host) {
      config.host = url.host;
    }
    config.pathname = url.pathname;
    if (url.search.length > 1) {
      config.query = {
        ...config.query,
        ...parseData(url.search.slice(1)),
      };
    }
    if (url.hash.length > 1) {
      config.hash = {
        ...config.hash,
        ...parseData(url.hash.slice(1)),
      };
    }
    return config;
  }
  // Exclude ending `=` since it may be base64
  if (/&|=[^=]/.test(str)) {
    return str.split('&').reduce((res, part) => {
      const [rkey, rval] = part.split('=');
      res[decodeURIComponent(rkey)] = parseData(decodeURIComponent(rval));
      return res;
    }, {});
  }
  // if (/,/.test(str)) {
  //   return str.split(',').map(decodeURIComponent).map(parseData);
  // }
  return decodeURIComponent(str);
}
