function dropEmpty(query) {
  if (!query || typeof query !== 'object') return query;
  return Object.entries(query)
    .filter(([, v]) => v != null && v !== '')
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

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
    let pathname = config.pathname || config.path;
    let { query } = config;
    if (config.protocol === 'otpauth:') {
      const payload = config.payload || {};
      if (payload.type && payload.label) {
        pathname = `//${encodeURIComponent(payload.type)}/${encodeURIComponent(
          payload.label
        )}`;
      }
      query = dropEmpty(query);
    } else if (config.protocol === 'vmess:') {
      pathname = dumpVMess(config.payload).pathname;
    }
    parts.push(pathname);
    const search = buildData(query);
    const hash = buildData(config.hash);
    if (search) parts.push('?', search);
    if (hash) parts.push('#', hash);
    return parts.filter(Boolean).join('');
  }
  if (config._type === 'object' && config.data) {
    const { data } = config;
    if (Array.isArray(data))
      return data.map(buildData).map(encodeURIComponent).join(',');
    return Object.keys(config.data)
      .map((key) => {
        const value = config.data[key];
        if (value == null) return;
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          buildData(value)
        )}`;
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
    if (url.protocol === 'otpauth:') {
      const [, type, label] = url.pathname
        .match(/^\/\/([^/]*)\/(.*)|$/)
        .map((s) => s && decodeURIComponent(s));
      config.payload = {
        type: type || 'totp',
        label: label || '',
      };
      config.query = {
        secret: '',
        issuer: '',
        algorithm: '',
        digits: '',
        period: '',
        counter: '',
      };
    } else if (url.protocol === 'vmess:') {
      config.payload = loadVMess(url);
    } else {
      config.pathname = url.pathname;
    }
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

const vmessDefaults = {
  add: '',
  aid: 0,
  host: '',
  id: 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx',
  net: 'tcp',
  path: '/ws',
  port: 1080,
  ps: 'example',
  tls: '',
  type: 'none',
  v: '2',
};

function getRandomHex() {
  return '0123456789abcdef'[(Math.random() * 16) | 0];
}

export function loadVMess(url) {
  let data = { ...vmessDefaults };
  let valid = true;
  if (url.protocol === 'vmess:') {
    if (url.host) {
      try {
        const raw = atob(url.host);
        data = {
          ...data,
          ...JSON.parse(raw),
        };
      } catch {
        valid = false;
      }
    }
    if (/x/.test(data.id)) {
      data.id = data.id.replace(/x/g, getRandomHex);
    }
  }
  return { data, valid };
}

export function dumpVMess(data) {
  const encoded = btoa(JSON.stringify(dropEmpty(data))).replace(/=+$/, '');
  return new URL(`vmess://${encoded}`);
}
